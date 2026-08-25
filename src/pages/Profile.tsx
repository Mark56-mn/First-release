import React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function Profile() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <Card className="max-w-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={logout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
