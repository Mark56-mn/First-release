import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      {/* Top Header */}
      <header className="bg-white mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-gray-900">
            M
          </div>
          <Link to="/dashboard" className="text-xl font-bold text-gray-900 hidden sm:block">Memo</Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">NG Network</span>
          </div>
          
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
            <Link to="/profile" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </Link>
            <button onClick={logout} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title="Log out">
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
