export interface WhatsAppMessage {
  from: string;
  text: string;
  timestamp: string;
}

export interface IWhatsAppProvider {
  name: string;
  sendMessage(to: string, text: string): Promise<boolean>;
  verifyWebhook(signature: string, payload: any): boolean;
  parseWebhook(payload: any): WhatsAppMessage | null;
}
