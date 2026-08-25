# Memo Architecture

Memo is a production-ready, mobile-first VTU (Virtual Top-Up) and bill payment platform, designed to be highly modular and extensible.

## Core Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (via Replit standard, Drizzle ORM)
- **Deployment**: Vercel/Render compatible (via self-contained server.cjs compiled by esbuild)

## Abstraction Layers
The architecture heavily employs the Dependency Injection and Factory patterns to prevent vendor lock-in.
- **Fulfillment**: `server/services/interfaces.ts:IFulfillmentProvider`. Allows hot-swapping between `flutterwave`, `clubkonnet`, or `mock` via `FULFILLMENT_PROVIDER` environment variable.
- **Payment**: `server/services/interfaces.ts:IPaymentProvider`. Currently implements `paystack`.
- **WhatsApp**: `server/services/whatsapp/interfaces.ts:IWhatsAppProvider`. Supports `termii`, `meta`, or `none`.

## State Machine
Transactions follow a strict state machine to prevent race conditions and duplicate top-ups.
1. `CREATED` (Payment Pending)
2. `PAYMENT_SUCCESSFUL` (Webhook verified by server)
3. `FULFILLMENT_PROCESSING` (API request out to VTU provider)
4. `SUCCESSFUL` or `FAILED` (Terminal states)

All database schema migrations are managed via Drizzle.
