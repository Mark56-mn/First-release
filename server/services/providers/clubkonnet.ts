import { IFulfillmentProvider, FulfillmentResponse } from "../interfaces";

export class ClubkonnetProvider implements IFulfillmentProvider {
  name = "clubkonnet";
  private userId: string;
  private apiKey: string;
  private baseUrl = "https://www.clubkonnect.com/api";

  constructor() {
    this.userId = process.env.CLUBKONNET_USER_ID || "";
    this.apiKey = process.env.CLUBKONNET_API_KEY || "";
  }

  async buyAirtime(network: string, phone: string, amount: number, reference: string): Promise<FulfillmentResponse> {
    const networkCode = this.getNetworkCode(network);
    const url = `${this.baseUrl}/airtime?UserID=${this.userId}&APIKey=${this.apiKey}&MobileNetwork=${networkCode}&Amount=${amount}&MobileNumber=${phone}&RequestID=${reference}`;
    
    console.log(`[Clubkonnet] Initiating Airtime: ${url}`);
    // Await fetch(url)...
    
    return { status: "pending", reference };
  }

  async buyData(network: string, phone: string, planCode: string, reference: string): Promise<FulfillmentResponse> {
    const networkCode = this.getNetworkCode(network);
    const url = `${this.baseUrl}/data?UserID=${this.userId}&APIKey=${this.apiKey}&MobileNetwork=${networkCode}&DataPlan=${planCode}&MobileNumber=${phone}&RequestID=${reference}`;
    
    console.log(`[Clubkonnet] Initiating Data: ${url}`);
    // Await fetch(url)...
    
    return { status: "pending", reference };
  }

  private getNetworkCode(network: string) {
    const codes: Record<string, string> = {
      MTN: "01",
      GLO: "02",
      "9MOBILE": "03",
      AIRTEL: "04"
    };
    return codes[network.toUpperCase()] || "01";
  }
}
