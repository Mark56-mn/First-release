import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="bg-[#0A0A0A]/80 backdrop-blur-md mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-3xl border border-white/10 p-4 flex items-center justify-between z-10 relative shadow-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(255,209,102,0.5)]">
            M
          </div>
          <Link to="/dashboard" className="text-xl font-bold text-white hidden sm:block tracking-tight">Memo</Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
            <div className="w-2 h-2 bg-[#00FF66] rounded-full animate-pulse shadow-[0_0_8px_#00FF66]"></div>
            <span className="text-[11px] font-bold tracking-wider text-[#00FF66] uppercase">Network Live</span>
          </div>
          
          <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
            <Link to="/profile" className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <User className="w-4 h-4 text-gray-300" />
            </Link>
            <button onClick={logout} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-full transition-colors" title="Log out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
