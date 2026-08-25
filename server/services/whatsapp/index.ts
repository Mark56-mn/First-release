import { IWhatsAppProvider } from "./interfaces";
import { TermiiProvider } from "./termii";
import { MetaWhatsAppProvider } from "./meta";

export class MockWhatsAppProvider implements IWhatsAppProvider {
  name = "mock";
  async sendMessage(to: string, text: string): Promise<boolean> {
    console.log(`[MockWhatsApp] Sending to ${to}: ${text}`);
    return true;
  }
  verifyWebhook() { return true; }
  parseWebhook() { return null; }
}

const activeWhatsApp = process.env.WHATSAPP_PROVIDER || "none";

export const whatsappService: IWhatsAppProvider | null = 
  activeWhatsApp === "termii" ? new TermiiProvider() :
  activeWhatsApp === "meta" ? new MetaWhatsAppProvider() :
  activeWhatsApp === "mock" ? new MockWhatsAppProvider() : null;

if (whatsappService) {
  console.log(`[Services] Loaded WhatsApp Provider: ${whatsappService.name}`);
}
