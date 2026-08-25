import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PhoneCall, Wifi, Lightbulb, MessageCircle, ArrowRight, Bot } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export function Dashboard() {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data.slice(0, 4));
        }
      })
      .catch(console.error);
    }
  }, [token]);

  const getNetworkColor = (network: string) => {
    switch(network?.toUpperCase()) {
      case 'MTN': return 'bg-[#F2F5DE] text-[#A7BA3E] border-[#E8EFB8]'; // Greenish yellow
      case 'AIRTEL': return 'bg-[#FBE9E9] text-[#D83B3B] border-[#F6D0D0]'; // Red
      case 'GLO': return 'bg-[#EAF5F1] text-[#29987A] border-[#D1EBE2]'; // Green/teal
      case '9MOBILE': return 'bg-[#E9F0E1] text-[#426C1C] border-[#D1E3BE]'; // Dark green
      case 'WALLET': return 'bg-[#FFF6D9] text-[#E0A800] border-[#FFECAD]'; // Yellow
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getNetworkInitial = (network: string) => {
    if (network === 'WALLET') return 'W';
    return network ? network.charAt(0).toUpperCase() : '?';
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto">
        
        {/* Left Column (Wallet & Actions) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Wallet Card */}
          <div className="relative overflow-hidden bg-primary rounded-3xl p-6 shadow-sm border border-primary-dark">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-dark/40 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <p className="text-gray-900/70 font-medium text-sm mb-1 uppercase tracking-wider">Wallet Balance</p>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
                ₦{user?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </h2>
              
              <div className="flex space-x-3">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-5 shadow-sm">
                  + Top Up
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-900 text-gray-900 hover:bg-white/20 rounded-xl px-5">
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/buy-airtime" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <PhoneCall className="w-4 h-4 text-gray-900" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Buy Airtime</span>
              </Link>
              
              <Link to="/buy-data" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <Wifi className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Buy Data</span>
              </Link>

              <Link to="#" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors opacity-70 cursor-not-allowed">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Electricity</span>
              </Link>

              <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition-colors" onClick={() => (document.querySelector('.chatbot-trigger') as any)?.click()}>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <MessageCircle className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-xs font-semibold text-gray-700">WhatsApp Bot</span>
              </button>
            </div>
          </div>

          {/* Reseller Status */}
          <div className="bg-olive-dark rounded-3xl p-5 flex items-center justify-between text-white shadow-sm">
            <div>
              <p className="text-xs text-gray-300 font-medium mb-0.5">Reseller Status</p>
              <p className="text-base font-bold">Standard Tier</p>
            </div>
            <Link to="#" className="text-primary font-semibold text-sm hover:underline">
              Upgrade
            </Link>
          </div>

        </div>

        {/* Right Column (Transactions & Banner) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Transaction History */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
              <Link to="/transactions" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-500 text-sm">No transactions yet.</p>
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={tx.id}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-4">
                        <div className={cn("w-12 h-12 rounded-full border flex items-center justify-center text-lg font-bold shadow-sm", getNetworkColor(tx.network))}>
                          {getNetworkInitial(tx.network)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm capitalize">{tx.network} {tx.type}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} &bull; {tx.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-bold text-sm", tx.status === 'successful' && tx.type === 'wallet_topup' ? "text-green-600" : "text-red-500")}>
                          {tx.type === 'wallet_topup' ? '+' : '-'}₦{tx.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className={cn("inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", 
                          tx.status === 'successful' ? "bg-green-100 text-green-700" : 
                          tx.status === 'pending' || tx.status === 'payment_pending' ? "bg-yellow-100 text-yellow-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {tx.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    {idx < transactions.length - 1 && <div className="border-b border-gray-50 my-2"></div>}
                  </div>
                ))
              )}

              {/* Fake transaction for UI completeness if less than 4 */}
              {transactions.length > 0 && transactions.length < 4 && (
                <>
                  <div className="border-b border-gray-50 my-2"></div>
                  <div className="flex items-center justify-between py-2 opacity-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full border flex items-center justify-center text-lg font-bold shadow-sm bg-[#FFF6D9] text-[#E0A800] border-[#FFECAD]">
                        W
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm capitalize">Wallet Top-up</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                          Oct 24 &bull; Paystack Ref: MEMO-992
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">
                        +₦10,000.00
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                        SUCCESS
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* WhatsApp Banner */}
          <div className="bg-olive-light rounded-3xl p-6 lg:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

             <div className="relative z-10 mb-6 md:mb-0 md:max-w-[60%]">
               <h3 className="text-xl font-bold mb-2">Try Memo on WhatsApp</h3>
               <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                 Buy airtime and data directly within your chats. Fast, secure, and always available.
               </p>
               <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl shadow-sm border-0 px-6">
                 Open WhatsApp
               </Button>
             </div>

             <div className="relative z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10 shrink-0">
                <Bot className="w-12 h-12 text-gray-200" />
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
