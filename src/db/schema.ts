import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  role: text("role").default("consumer").notNull(),
  status: text("status").default("active").notNull(),
  walletBalance: real("wallet_balance").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  network: text("network").notNull(), // e.g. MTN, AIRTEL, GLO, 9MOBILE
  type: text("type").notNull(), // 'airtime' | 'data'
  name: text("name").notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  providerProductCode: text("provider_product_code"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'airtime' | 'data'
  network: text("network").notNull(),
  phoneNumber: text("phone_number").notNull(),
  product: text("product"),
  amount: real("amount").notNull(),
  fee: real("fee").default(0).notNull(),
  total: real("total").notNull(),
  status: text("status").default("pending").notNull(), // pending, payment_pending, payment_successful, processing, successful, failed, cancelled, refunded
  providerReference: text("provider_reference"),
  paymentReference: text("payment_reference"),
  paymentStatus: text("payment_status").default("pending").notNull(),
  fulfillmentStatus: text("fulfillment_status").default("pending").notNull(),
  idempotencyKey: text("idempotency_key").unique(),
  metadata: text("metadata"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const fulfillmentAttempts = sqliteTable("fulfillment_attempts", {
  id: text("id").primaryKey(),
  transactionId: text("transaction_id").notNull().references(() => transactions.id),
  provider: text("provider").notNull(),
  providerReference: text("provider_reference"),
  requestData: text("request_data"),
  responseData: text("response_data"),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  attemptNumber: integer("attempt_number").default(1).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  transactionId: text("transaction_id").notNull().references(() => transactions.id),
  provider: text("provider").default("paystack").notNull(),
  reference: text("reference").notNull().unique(),
  amount: real("amount").notNull(),
  currency: text("currency").default("NGN").notNull(),
  status: text("status").default("pending").notNull(),
  providerResponse: text("provider_response"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const webhookEvents = sqliteTable("webhook_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  eventReference: text("event_reference"),
  payload: text("payload").notNull(), // JSON string
  processed: integer("processed", { mode: "boolean" }).default(false).notNull(),
  processingError: text("processing_error"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  metadata: text("metadata"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});
