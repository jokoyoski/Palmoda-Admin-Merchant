"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { TransactionType } from "../_lib/type";
import { getAllTransactions } from "../_lib/payouts";
import { CiUser } from "react-icons/ci";
import Link from "next/link";

function page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    const fetchTransacs = async () => {
      try {
        setLoading(true);
        const res = await getAllTransactions();
        if (res?.data) {
          setTransactions(res.data.transactions);
        } else {
          setError("No transaction found");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransacs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return "text-green-600 ";
      case "pending":
        return "text-orange-600";
      case "failed":
        return "text-red-600 ";
      default:
        return "text-gray-600 ";
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
        </div>

        <div className="w-full px-4 py-3 mt-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
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
              {/* Show skeleton while loading */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Vendor */}
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

                    {/* Reference */}
                    <td className="py-3 px-4">{transaction?.transaction_reference}</td>

                    {/* Amount */}
                    <td className="py-3 px-4">₦{transaction?.amount}</td>

                    {/* Date */}
                    <td className="py-3 px-4">{transaction.created_at.split(" ")[0]}</td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    {/* Action */}
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
            </tbody>
          </table>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default page;
