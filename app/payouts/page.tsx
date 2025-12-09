"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { TransactionType } from "../_lib/type";
import { CiUser } from "react-icons/ci";
import { usePayouts } from "../_lib/usePayouts";
import Link from "next/link";

const PAGE_SIZE = 5; // Number of rows per page

function PayoutsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // all, successful, pending, failed
  
  // Use React Query hook instead of manual fetch
  const { data, isLoading, error } = usePayouts();

  // Extract transactions from the query result
  const transactions = data?.data?.transactions || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "text-green-600";
      case "pending":
        return "text-orange-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Skeleton row
  const SkeletonRow = () => (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-300"></div>
          <div>
            <div className="w-24 h-3 rounded bg-gray-300 mb-2"></div>
            <div className="w-32 h-3 rounded bg-gray-200"></div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="w-24 h-3 rounded bg-gray-300"></div>
      </td>
      <td className="py-3 px-4">
        <div className="w-20 h-3 rounded bg-gray-300"></div>
      </td>
      <td className="py-3 px-4">
        <div className="w-32 h-3 rounded bg-gray-300"></div>
      </td>
      <td className="py-3 px-4">
        <div className="w-20 h-4 rounded bg-gray-300"></div>
      </td>
      <td className="py-3 px-4">
        <div className="w-16 h-6 rounded bg-gray-400"></div>
      </td>
    </tr>
  );

  // Filter transactions by status
  const filteredTransactions =
    statusFilter === "all"
      ? transactions
      : transactions.filter(
          (t: TransactionType) => t.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  return (
    <ProtectedRoute>
      <section className="bg-gray-200 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-black font-bold text-xl">Payout Approval</h1>
            <p className="text-gray-500 text-xs">
              Review and approve vendor payout requests
            </p>
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">All</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="w-full px-4 py-3 mt-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              Error loading transactions: {error.message}
            </div>
          )}

          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 text-gray-500 font-semibold sticky top-0 bg-white">
              <tr>
                <th className="py-3 px-4 text-left">Vendor</th>
                <th className="py-3 px-4 text-left">Reference ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Request Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    {statusFilter === "all" 
                      ? "No transactions found" 
                      : `No ${statusFilter} transactions found`}
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction: TransactionType) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-2">
                      {transaction?.vendor?.brand?.brand_banner ? (
                        <img
                          className="w-10 h-10 rounded object-cover"
                          src={transaction.vendor.brand.brand_banner}
                          alt="Brand Banner"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <CiUser size={25} className="text-gray-500" />
                        </div>
                      )}
                      <div className="text-gray-600">
                        <p className="text-sm font-medium">
                          {transaction?.vendor?.business_name || "N/A"}
                        </p>
                        <p className="text-xs">{transaction?.vendor?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {transaction?.transaction_reference || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      ₦{transaction?.amount?.toLocaleString() || "0"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {transaction?.created_at 
                        ? new Date(transaction.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          transaction?.status || "unknown"
                        )}`}
                      >
                        {transaction?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/payouts/${transaction?._id}`}
                        className="bg-gray-700 hover:bg-gray-800 transition text-white px-4 py-2 rounded text-xs inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
=======
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        {transaction?.vendor?.brand?.brand_banner ? (
                          <img
                            className="w-10 h-10 rounded object-cover"
                            src={transaction.vendor.brand.brand_banner}
                            alt="Brand Banner"
                          />
                        ) : (
                          <CiUser size={25} />
                        )}
                        <div className="text-gray-600">
                          <p className="text-sm font-medium">
                            {transaction?.vendor.business_name}
                          </p>
                          <p className="text-xs">{transaction?.vendor.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {transaction?.transaction_reference}
                      </td>
                      <td className="py-3 px-4">₦{transaction?.amount}</td>
                      <td className="py-3 px-4">
                        {transaction.created_at.split(" ")[0]}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/payouts/${transaction?._id}`}
                          className="bg-gray-700 hover:bg-gray-800 transition text-white px-4 py-2 rounded text-xs"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
>>>>>>> e9ac5b3a43eb7b2a872c6116034989750e1b4c2f
            </tbody>
          </table>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4 text-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>
<<<<<<< HEAD
              <span className="px-2 py-1 text-gray-600">
                Page {currentPage} of {totalPages}
=======
              <span className="px-2 py-1">
                {currentPage} / {totalPages}
>>>>>>> e9ac5b3a43eb7b2a872c6116034989750e1b4c2f
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Summary */}
          {!isLoading && transactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
              {statusFilter !== "all" && ` (${statusFilter})`}
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default PayoutsPage;