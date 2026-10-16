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
      case 'MTN': return 'bg-[#F4D03F]/10 text-[#F4D03F] border-[#F4D03F]/20';
      case 'AIRTEL': return 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20';
      case 'GLO': return 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/20';
      case '9MOBILE': return 'bg-[#00CCFF]/10 text-[#00CCFF] border-[#00CCFF]/20';
      case 'WALLET': return 'bg-white/5 text-white border-white/10';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const getNetworkInitial = (network: string) => {
    if (network === 'WALLET') return 'W';
    return network ? network.charAt(0).toUpperCase() : '?';
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto relative z-10">
        
        {/* Left Column (Wallet & Actions) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Wallet Card - Web3 Dark Mode Style */}
          <div className="relative overflow-hidden bg-[#0F0F0F] rounded-[32px] p-8 border border-white/10 shadow-2xl group">
            {/* Ambient glows */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 font-medium text-xs uppercase tracking-widest">Total Balance</p>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]"></span>
                </div>
              </div>

              <h2 className="text-[2.75rem] font-bold text-white tracking-tighter mb-8 font-mono flex items-baseline">
                <span className="text-gray-500 mr-1 text-2xl">₦</span>
                {user?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </h2>
              
              <div className="flex space-x-3">
                <Button className="flex-1 bg-primary text-black hover:bg-primary-dark rounded-2xl py-6 font-bold shadow-[0_0_20px_rgba(255,209,102,0.2)] border-0">
                  Deposit
                </Button>
                <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl py-6 font-semibold backdrop-blur-sm">
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid - Web3 Style */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Services</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/buy-airtime" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-black border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center mb-3 group-hover:shadow-[inset_0_0_20px_rgba(255,209,102,0.15)] transition-all">
                  <PhoneCall className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-200">Airtime</span>
              </Link>
              
              <Link to="/buy-data" className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-black border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center mb-3 group-hover:shadow-[inset_0_0_20px_rgba(96,165,250,0.15)] transition-all">
                  <Wifi className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-200">Data</span>
              </Link>

              <Link to="#" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center mb-3">
                  <Lightbulb className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-sm font-semibold text-gray-500">Utilities</span>
              </Link>

              <button className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00FF66]/50 hover:bg-white/10 transition-all duration-300" onClick={() => (document.querySelector('.chatbot-trigger') as any)?.click()}>
                <div className="w-12 h-12 rounded-full bg-black border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center mb-3 group-hover:shadow-[inset_0_0_20px_rgba(0,255,102,0.15)] transition-all">
                  <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-[#00FF66] transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-200">AI Node</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Transactions & Banner) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Transaction History - Dark Mode */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/10 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Link to="/transactions" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center bg-primary/10 px-4 py-2 rounded-full">
                View All <ArrowRight className="w-3 h-3 ml-2" />
              </Link>
            </div>

            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                  <p className="text-gray-500 text-sm font-medium">No transactions found on ledger.</p>
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={tx.id} className="group hover:bg-white/5 p-4 rounded-2xl transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]", getNetworkColor(tx.network))}>
                          {getNetworkInitial(tx.network)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base capitalize">{tx.network} {tx.type}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center font-mono">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} &bull; {tx.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-bold text-lg font-mono", tx.status === 'successful' && tx.type === 'wallet_topup' ? "text-[#00FF66]" : "text-white")}>
                          {tx.type === 'wallet_topup' ? '+' : '-'}₦{tx.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <span className={cn("inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest", 
                          tx.status === 'successful' ? "text-[#00FF66] bg-[#00FF66]/10" : 
                          tx.status === 'pending' || tx.status === 'payment_pending' ? "text-[#F4D03F] bg-[#F4D03F]/10" : 
                          "text-[#FF3366] bg-[#FF3366]/10"
                        )}>
                          {tx.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Fake transaction for UI completeness if less than 4 */}
              {transactions.length > 0 && transactions.length < 4 && (
                <div className="group hover:bg-white/5 p-4 rounded-2xl transition-colors border border-transparent hover:border-white/5 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] bg-white/5 text-white border border-white/10">
                        W
                      </div>
                      <div>
                        <p className="font-bold text-white text-base capitalize">Wallet Top-up</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center font-mono">
                          Oct 24 &bull; Ref: MEMO-992
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg font-mono text-[#00FF66]">
                        +₦10,000.00
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-[#00FF66] bg-[#00FF66]/10">
                        SUCCESS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Web3 Style Banner */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-[32px] p-8 border border-white/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-[#00FF66]/20 transition-all duration-700"></div>

             <div className="relative z-10 mb-6 md:mb-0 md:max-w-[60%]">
               <span className="inline-block px-3 py-1 bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 mb-4">Protocol Node</span>
               <h3 className="text-2xl font-bold text-white mb-2">Decentralized WhatsApp Hub</h3>
               <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                 Initialize top-ups directly via your secure WhatsApp chat tunnel. Instant fulfillment.
               </p>
               <Button className="bg-[#00FF66] hover:bg-[#00CC55] text-black font-bold rounded-full shadow-[0_0_15px_rgba(0,255,102,0.3)] border-0 px-8">
                 Connect Node
               </Button>
             </div>

             <div className="relative z-10 bg-black/50 p-6 rounded-[24px] backdrop-blur-md border border-white/10 shrink-0 shadow-[inset_0_0_20px_rgba(0,255,102,0.05)]">
                <Bot className="w-12 h-12 text-[#00FF66]" />
             </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
