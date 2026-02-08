"use client";

import React from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useSubscriptions } from "../_lib/useSubscriptions";

export default function SubscriptionsPage() {
  const { data, isLoading, error } = useSubscriptions();
  const subscriptions = Array.isArray(data?.data) ? data.data : [];

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-black font-bold text-xl">Subscriptions</h1>
            <p className="text-gray-500 text-xs">
              Manage subscription plans and billing status
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
          {error && (
            <div className="bg-red-50 border-b border-red-200 text-red-600 px-4 py-3">
              Error loading subscriptions: {(error as Error).message}
            </div>
          )}

          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 text-gray-500 font-semibold sticky top-0 bg-white">
              <tr>
                <th className="py-3 px-4 text-left">Vendor</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Reference</th>
                <th className="py-3 px-4 text-left">Active</th>
                <th className="py-3 px-4 text-left">Start</th>
                <th className="py-3 px-4 text-left">End</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="py-3 px-4">
                      <div className="w-28 h-3 rounded bg-gray-200" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-3 rounded bg-gray-200" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-3 rounded bg-gray-200" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-3 rounded bg-gray-200" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-3 rounded bg-gray-200" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-3 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub: any) => (
                  <tr
                    key={sub?._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {sub?.vendor?.business_name || sub?.vendor?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{sub?.vendor?.email || "N/A"}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {sub?.transaction_reference || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {typeof sub?.is_active === "boolean"
                        ? sub.is_active
                          ? "Yes"
                          : "No"
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {sub?.start_date
                        ? new Date(sub.start_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {sub?.end_date
                        ? new Date(sub.end_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ProtectedRoute>
  );
}
