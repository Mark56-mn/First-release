import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PhoneCall } from "lucide-react";

export function BuyAirtime() {
  const { token } = useAuth();
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const networks = ["MTN", "AIRTEL", "GLO", "9MOBILE"];

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "airtime",
          network,
          phoneNumber: phone,
          amount: Number(amount)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize purchase");

      // Here you would redirect to Paystack
      alert(`Transaction initialized! ID: ${data.id}. In a real app, Paystack checkout opens here.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <PhoneCall className="w-6 h-6 mr-2 text-primary-dark" /> Buy Airtime
        </h1>
        <p className="text-gray-500 mt-1">Instant top-up to any network</p>
      </div>

      <Card className="max-w-md">
        <CardContent className="p-6">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <form onSubmit={handlePurchase} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Network</label>
              <div className="grid grid-cols-4 gap-2">
                {networks.map(net => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setNetwork(net)}
                    className={`py-3 text-xs font-bold rounded-xl border ${network === net ? 'bg-primary border-primary-dark text-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="080..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (₦)</label>
              <Input type="number" min="50" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-500">Total to pay:</span>
                <span className="font-bold text-gray-900 text-lg">₦{amount || 0}</span>
              </div>
              <Button type="submit" className="w-full" disabled={!network || !phone || !amount || loading}>
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
