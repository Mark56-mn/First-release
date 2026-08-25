export interface FulfillmentResponse {
  status: "success" | "pending" | "failed";
  reference: string;
  providerResponse?: any;
}

export interface IFulfillmentProvider {
  name: string;
  buyAirtime(network: string, phone: string, amount: number, reference: string): Promise<FulfillmentResponse>;
  buyData(network: string, phone: string, planCode: string, reference: string): Promise<FulfillmentResponse>;
}

export interface PaymentInitResponse {
  paymentUrl?: string;
  reference: string;
}

export interface PaymentVerifyResponse {
  status: "success" | "failed" | "pending";
  amount: number;
  reference: string;
  providerResponse?: any;
}

export interface IPaymentProvider {
  name: string;
  initializePayment(amount: number, email: string, reference: string): Promise<PaymentInitResponse>;
  verifyPayment(reference: string): Promise<PaymentVerifyResponse>;
}
