import { IPaymentProvider, PaymentInitResponse, PaymentVerifyResponse } from "../interfaces";
import crypto from "crypto";

export class PaystackProvider implements IPaymentProvider {
  name = "paystack";
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || "";
  }

  async initializePayment(amount: number, email: string, reference: string): Promise<PaymentInitResponse> {
    console.log(`[Paystack] Initializing payment for ${email} of amount ${amount}`);
    // Await fetch to Paystack API /transaction/initialize...
    return {
      reference,
      paymentUrl: `https://checkout.paystack.com/${reference}` // Mock URL for now
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    console.log(`[Paystack] Verifying payment ref: ${reference}`);
    // Await fetch to Paystack API /transaction/verify/${reference}...
    return {
      status: "success",
      amount: 0, // Should be actual verified amount
      reference,
    };
  }
}
