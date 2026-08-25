# Memo - African Airtime & Data Platform

Memo is a production-ready, mobile-first African airtime and data top-up platform with a web application and WhatsApp interface. It is designed to be extremely fast, secure, and resilient to poor network conditions.

## Features
- **Mobile-First Design**: Optimized for low-bandwidth networks and mobile devices.
- **Airtime & Data**: Buy instant top-ups across multiple networks (MTN, Airtel, GLO, 9Mobile).
- **Secure Authentication**: Email & password authentication with JWTs, bcrypt hashing, and role-based access.
- **Paystack Payments**: Idempotent payment processing with webhook signature verification.
- **WhatsApp Integration**: Modular architecture supporting Termii, Meta Cloud API, or a mock provider.
- **Fulfillment Engine**: Modular fulfillment abstraction layer (Flutterwave, Clubkonnet, or Mock).
- **Admin Dashboard**: Oversee transactions, monitor users, and inspect API events.

## Architecture
- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Lucide Icons.
- **Backend**: Express (Node.js), TypeScript.
- **Database**: SQLite (via `better-sqlite3` / `@libsql/client`) with Drizzle ORM. Designed to be easily migratable to PostgreSQL (e.g. Supabase, Render, Neon).
- **Extensibility**: Uses Dependency Injection and Factory patterns to route payments, fulfillment, and WhatsApp logic via environment variables.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Environment Variables:
   Copy `.env.example` to `.env` and fill in your keys (Paystack, Flutterwave, Termii/Meta, etc).

3. Push Database Schema:
   ```bash
   npm run db:push
   ```

4. Start Dev Server:
   ```bash
   npm run dev
   ```

## Providers Configuration
You can configure providers directly in `.env`:
- `FULFILLMENT_PROVIDER` = `mock` | `flutterwave` | `clubkonnet`
- `PAYMENT_PROVIDER` = `mock` | `paystack`
- `WHATSAPP_PROVIDER` = `none` | `termii` | `meta`

For specific environment keys needed per provider, check `.env.example`.

## Vercel Deployment

To deploy to Vercel:
1. Ensure your framework preset is set to **Vite**.
2. Run `npm run build`. The Express server builds directly to a self-contained `dist/server.cjs` file using esbuild.
3. Configure `vercel.json` rewrites to point API requests to the compiled Express server, or use Vercel Serverless Functions.

## Render Deployment

This application is ready for Render's "Web Service":
1. Connect your GitHub repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Set the Environment Variables in the Render Dashboard.

## Testing
Core business logic (such as idempotency, payment webhook validation, transaction state transitions) is tested using Vitest (`npm test`).

## Security
- No secrets are committed to version control.
- Webhook payloads are verified via HMAC SHA512 signatures (Paystack).
- Robust Idempotency Keys prevent duplicate fulfillment.
- Transaction states follow strict transition paths (`payment_pending` -> `payment_successful` -> `processing`).
- Payments flow verifies final states server-side (no relying on client callbacks).
