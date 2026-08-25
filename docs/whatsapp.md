# WhatsApp Integration

Memo is built with an optional, highly modular WhatsApp interface. It allows users to query and purchase VTU products via a WhatsApp chat without opening the web interface.

## Provider Architecture
The application does not depend on a specific WhatsApp API provider. Supported providers:
- **Termii** (Set `WHATSAPP_PROVIDER=termii` and the associated API keys)
- **Meta Cloud API** (Set `WHATSAPP_PROVIDER=meta` and the associated API keys)

If `WHATSAPP_PROVIDER` is set to `none`, the core application continues to run without interruption.

## Business Logic Re-use
The WhatsApp webhooks route incoming conversational messages to the exact same core transactional engines used by the Web frontend (`server/api.ts`). This ensures:
- A single source of truth for pricing, fees, and wallets.
- Identical state machine processing.
- Centralized audit logging.
