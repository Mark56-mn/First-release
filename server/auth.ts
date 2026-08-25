import express from "express";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import crypto from "crypto";

export const authRouter = express.Router();

const JWT_SECRET = process.env.SESSION_SECRET || "fallback_secret_for_dev";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: "consumer",
    });

    const token = jwt.sign({ userId, role: "consumer" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: userId, name: data.name, email: data.email, role: "consumer", walletBalance: 0 } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    
    if (userResult.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult[0];
    const valid = await bcrypt.compare(data.password, user.passwordHash || "");
    
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

authRouter.get("/me", authenticate, async (req: any, res) => {
  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.userId)).limit(1);
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status, walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
