"use client";
import React from "react";
import { FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

interface Vendor {
  id: number;
  name: string;
  products: number;
  sales: string;
  rating: number;
}

const vendors: Vendor[] = [
  { id: 1, name: "Luxe Atelier", products: 247, sales: "$842,156", rating: 5 },
  { id: 2, name: "ModeCraft", products: 190, sales: "$654,800", rating: 4 },
  { id: 3, name: "UrbanThreads", products: 162, sales: "$498,300", rating: 4 },
  { id: 4, name: "VividWear", products: 140, sales: "$387,920", rating: 3 },
];

function TopVendors() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[15px] font-semibold text-gray-800">
          Top Performing Vendors
        </h2>
        <button className="text-sm text-gray-500 hover:text-black">View All</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left border-b border-gray-200">
              <th className="pb-2">Vendor</th>
              <th className="pb-2">Products</th>
              <th className="pb-2">Sales</th>
              <th className="pb-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
              >
                {/* Vendor Info */}
                <td className="py-2 flex items-center gap-2 font-medium text-gray-800">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="text-gray-600 text-sm" />
                  </div>
                  {vendor.name}
                </td>

                {/* Products */}
                <td className="py-2 text-gray-600">{vendor.products}</td>

                {/* Sales */}
                <td className="py-2 text-gray-800 font-semibold">{vendor.sales}</td>

                {/* Rating */}
                <td className="py-2 flex items-center gap-1 text-yellow-500">
                  <FaStar />
                  <span className="text-gray-700 ml-1">{vendor.rating}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopVendors;
