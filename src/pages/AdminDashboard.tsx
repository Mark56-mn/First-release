import React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage users, transactions, and system settings.</p>
      </div>

      <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center">
        <p className="text-gray-500">Admin panel features will be displayed here.</p>
      </div>
    </Layout>
  );
}
