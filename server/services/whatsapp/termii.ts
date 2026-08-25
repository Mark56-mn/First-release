import { IWhatsAppProvider, WhatsAppMessage } from "./interfaces";

export class TermiiProvider implements IWhatsAppProvider {
  name = "termii";

  async sendMessage(to: string, text: string): Promise<boolean> {
    console.log(`[Termii] Sending message to ${to}: ${text}`);
    return true;
  }

  verifyWebhook(signature: string, payload: any): boolean {
    return true; // Implement actual crypto verification here
  }

  parseWebhook(payload: any): WhatsAppMessage | null {
    // Implement Termii specific parsing
    if (payload && payload.message && payload.from) {
      return {
        from: payload.from,
        text: payload.message,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
}
