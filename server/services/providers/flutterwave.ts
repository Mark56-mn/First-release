import { IFulfillmentProvider, FulfillmentResponse } from "../interfaces";

export class FlutterwaveProvider implements IFulfillmentProvider {
  name = "flutterwave";
  private secretKey: string;
  private baseUrl = "https://api.flutterwave.com/v3";

  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || "";
  }

  async buyAirtime(network: string, phone: string, amount: number, reference: string): Promise<FulfillmentResponse> {
    console.log(`[Flutterwave] Initiating Airtime: ${network} ${amount} for ${phone}`);
    // A real implementation would await fetch(`${this.baseUrl}/bills`, { ... })
    // and correctly handle errors, timeouts, etc.
    return { status: "pending", reference };
  }

  async buyData(network: string, phone: string, planCode: string, reference: string): Promise<FulfillmentResponse> {
    console.log(`[Flutterwave] Initiating Data: ${network} plan ${planCode} for ${phone}`);
    // A real implementation would await fetch(`${this.baseUrl}/bills`, { ... })
    return { status: "pending", reference };
  }
}
