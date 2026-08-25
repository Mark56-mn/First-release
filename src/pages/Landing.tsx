import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Smartphone, Zap, Shield, MessageCircle } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Memo</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          The fast, simple way to buy <span className="text-primary-dark">airtime & data</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Memo lets you top up instantly. Whether on the web or through WhatsApp, stay connected without the hassle.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-24">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">Start Topping Up</Button>
          </Link>
          <a href="#whatsapp" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              <MessageCircle className="mr-2 w-5 h-5" /> Try on WhatsApp
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Zap className="w-10 h-10 text-primary-dark mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-600">Your airtime and data are delivered in seconds, right when you need them.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Shield className="w-10 h-10 text-primary-dark mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Powered by Paystack, your payments are secure and verified instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Smartphone className="w-10 h-10 text-primary-dark mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
            <p className="text-gray-600">Built to work flawlessly on any mobile device or network connection.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
