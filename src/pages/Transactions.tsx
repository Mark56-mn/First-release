import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "../components/ui/card";
import { PhoneCall, Wifi } from "lucide-react";

export function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      })
      .catch(console.error);
    }
  }, [token]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-500 mt-1">View all your past top-ups</p>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">You haven't made any transactions yet.</p>
          </div>
        ) : (
          transactions.map(tx => (
            <Card key={tx.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {tx.type === "airtime" ? <PhoneCall className="w-5 h-5 text-gray-500" /> : <Wifi className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{tx.network} {tx.type}</p>
                    <p className="text-sm text-gray-500">{tx.phoneNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₦{tx.total}</p>
                  <p className={`text-xs capitalize font-medium ${tx.status === 'successful' ? 'text-green-600' : tx.status === 'pending' ? 'text-orange-500' : 'text-red-600'}`}>
                    {tx.status.replace("_", " ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
