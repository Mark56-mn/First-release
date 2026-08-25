import express from "express";
import { authenticate } from "./auth";
import { db } from "../src/db";
import { products, transactions, users } from "../src/db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod";

import { paymentService } from "./services";

export const apiRouter = express.Router();

// Products
apiRouter.get("/products", async (req, res) => {
  try {
    const allProducts = await db.select().from(products).where(eq(products.active, true));
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

// Transactions
apiRouter.get("/transactions", authenticate, async (req: any, res) => {
  try {
    const userTransactions = await db.select()
      .from(transactions)
      .where(eq(transactions.userId, req.user.userId))
      .orderBy(desc(transactions.createdAt));
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to load transactions" });
  }
});

const purchaseSchema = z.object({
  network: z.string(),
  phoneNumber: z.string(),
  amount: z.number().min(10),
  type: z.enum(["airtime", "data"]),
  productCode: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

apiRouter.post("/transactions", authenticate, async (req: any, res) => {
  try {
    const data = purchaseSchema.parse(req.body);
    
    // Check idempotency
    if (data.idempotencyKey) {
      const existing = await db.select().from(transactions).where(eq(transactions.idempotencyKey, data.idempotencyKey));
      if (existing.length > 0) {
        return res.json({ id: existing[0].id, total: existing[0].total, paymentUrl: null, status: existing[0].status, message: "Duplicate transaction prevented" });
      }
    }

    const transactionId = crypto.randomUUID();
    
    // In a real app, calculate fees
    const fee = 0;
    const total = data.amount + fee;

    await db.insert(transactions).values({
      id: transactionId,
      userId: req.user.userId,
      type: data.type,
      network: data.network,
      phoneNumber: data.phoneNumber,
      product: data.productCode,
      amount: data.amount,
      fee,
      total,
      status: "payment_pending",
      paymentStatus: "pending",
      fulfillmentStatus: "pending",
      idempotencyKey: data.idempotencyKey || null,
    });

    // Use Abstracted Payment Service
    // Fetch user email for payment provider
    const userResult = await db.select({ email: users.email }).from(users).where(eq(users.id, req.user.userId)).limit(1);
    const userEmail = userResult.length > 0 ? userResult[0].email : "user@example.com"; 

    const paymentInit = await paymentService.initializePayment(total, userEmail, transactionId);

    res.json({ id: transactionId, total, paymentUrl: paymentInit.paymentUrl, status: "payment_pending" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
