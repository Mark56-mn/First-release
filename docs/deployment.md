# Deployment

Memo is designed for serverless or containerized deployment, making it compatible with Replit, Vercel, and Render.

## Pre-requisites
1. Set up a PostgreSQL or SQLite database. (SQLite is used in the current Replit configuration).
2. Set the appropriate environment variables based on `.env.example`.

## Vercel Deployment
To deploy on Vercel:
1. Ensure your `package.json` contains `npm run build`.
2. Map your API endpoints through the `vercel.json` rewrites or use Vercel Serverless Functions. (Alternatively, run the built `dist/server.cjs` via a custom Vercel Node.js runtime config).
3. Push to GitHub and connect to Vercel.

## Render Deployment
Render natively supports Node.js web services.
1. Build Command: `npm run build`
2. Start Command: `npm start` (which maps to `node dist/server.cjs`)
3. Render will automatically expose the app on the web service port.

## Environment configuration
Production environments MUST set `FULFILLMENT_PROVIDER` and `PAYMENT_PROVIDER` to real providers (e.g. `flutterwave`, `paystack`) rather than `mock`, unless deployed for a test environment.
