import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Wifi } from "lucide-react";

export function BuyData() {
  const { token } = useAuth();
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const networks = ["MTN", "AIRTEL", "GLO", "9MOBILE"];
  
  // Mock data plans
  const dataPlans = [
    { code: "1GB", name: "1GB / 1 Day", price: 300 },
    { code: "2GB", name: "2GB / 2 Days", price: 500 },
    { code: "1.5GB", name: "1.5GB / 30 Days", price: 1000 },
    { code: "5GB", name: "5GB / 30 Days", price: 2000 },
  ];

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedPlan = dataPlans.find(p => p.code === plan);
    if (!selectedPlan) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "data",
          network,
          phoneNumber: phone,
          amount: selectedPlan.price,
          productCode: plan
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize purchase");

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
          <Wifi className="w-6 h-6 mr-2 text-primary-dark" /> Buy Data
        </h1>
        <p className="text-gray-500 mt-1">Get online instantly</p>
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
              <label className="text-sm font-medium">Select Plan</label>
              <select 
                className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={plan}
                onChange={e => setPlan(e.target.value)}
                required
              >
                <option value="" disabled>Select a data plan</option>
                {dataPlans.map(p => (
                  <option key={p.code} value={p.code}>{p.name} - ₦{p.price}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-500">Total to pay:</span>
                <span className="font-bold text-gray-900 text-lg">
                  ₦{plan ? dataPlans.find(p => p.code === plan)?.price : 0}
                </span>
              </div>
              <Button type="submit" className="w-full" disabled={!network || !phone || !plan || loading}>
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
