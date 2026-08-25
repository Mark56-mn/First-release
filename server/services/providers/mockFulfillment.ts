import { IFulfillmentProvider, FulfillmentResponse } from "../interfaces";

export class MockFulfillmentProvider implements IFulfillmentProvider {
  name = "mock";
  
  async buyAirtime(network: string, phone: string, amount: number, reference: string): Promise<FulfillmentResponse> {
    console.log(`[MockFulfillment] Simulated Airtime Top-up: ${network} ${amount} for ${phone}`);
    return { status: "success", reference, providerResponse: { message: "Mock success" } };
  }

  async buyData(network: string, phone: string, planCode: string, reference: string): Promise<FulfillmentResponse> {
    console.log(`[MockFulfillment] Simulated Data Top-up: ${network} ${planCode} for ${phone}`);
    return { status: "success", reference, providerResponse: { message: "Mock success" } };
  }
}
