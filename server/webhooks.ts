import express from "express";
import crypto from "crypto";
import { db } from "../src/db";
import { webhookEvents, transactions, payments, users } from "../src/db/schema";
import { eq } from "drizzle-orm";

export const webhooksRouter = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

// Paystack webhook
webhooksRouter.post("/paystack", async (req, res) => {
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.body;
  const eventId = crypto.randomUUID();

  // Log webhook
  await db.insert(webhookEvents).values({
    id: eventId,
    provider: "paystack",
    eventType: event.event,
    eventReference: event.data?.reference,
    payload: JSON.stringify(event),
  });

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    // Handle payment success (Idempotency should be checked here)
    // Find payment record, update to successful
    // Then queue fulfillment
  }

  res.sendStatus(200);
});

// Gupshup webhook (WhatsApp)
import { GoogleGenAI } from "@google/genai";
webhooksRouter.post("/gupshup", async (req, res) => {
  const event = req.body;
  
  if (event.type === "message") {
    const sender = event.payload?.sender?.phone;
    const text = event.payload?.payload?.text;
    
    // Logic to route the message using Gemini, or match simple keywords
    if (sender && text) {
        // Link to user if phone exists
        const userResult = await db.select().from(users).where(eq(users.phone, sender)).limit(1);
        const user = userResult.length > 0 ? userResult[0] : null;

        // Implement a basic router
        // In a real app we'd respond to Gupshup's API
    }
  }

  res.sendStatus(200);
});
