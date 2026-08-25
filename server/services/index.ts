import { IFulfillmentProvider, IPaymentProvider } from "./interfaces";
import { ClubkonnetProvider } from "./providers/clubkonnet";
import { MockFulfillmentProvider } from "./providers/mockFulfillment";
import { PaystackProvider } from "./providers/paystack";
import { FlutterwaveProvider } from "./providers/flutterwave";

// Dependency Injection / Factory Pattern
// This ensures that our business logic isn't tightly coupled to specific providers.
// If you want to switch from Paystack to Flutterwave, or Clubkonnet to Reloadly, 
// you just change the exported provider here.

const activeFulfillment = process.env.FULFILLMENT_PROVIDER || "mock"; // 'flutterwave', 'clubkonnet', 'mock'
const activePayment = process.env.PAYMENT_PROVIDER || "paystack";

export const fulfillmentService: IFulfillmentProvider = 
  activeFulfillment === "clubkonnet" ? new ClubkonnetProvider() : 
  activeFulfillment === "flutterwave" ? new FlutterwaveProvider() :
  new MockFulfillmentProvider();

export const paymentService: IPaymentProvider = 
  activePayment === "paystack" ? new PaystackProvider() : new PaystackProvider(); // Add more branches as you add providers

console.log(`[Services] Loaded Fulfillment Provider: ${fulfillmentService.name}`);
console.log(`[Services] Loaded Payment Provider: ${paymentService.name}`);
