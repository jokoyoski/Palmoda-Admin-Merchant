import React from "react";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

function InventoryStatus() {
  return (
    <div className="col-span-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">Inventory Status</h2>
        <select className="border border-gray-300 text-[13px] rounded-md px-2 py-1">
          <option>All Categories</option>
        </select>
      </div>

      <div className="space-y-3 text-sm">
        <p className="flex justify-between">
          <span className="flex items-center gap-1 text-red-500">
            <FiArrowDownCircle /> Low Stock Items
          </span>
          <span className="font-semibold text-gray-800">87</span>
        </p>

        <p className="flex justify-between">
          <span className="flex items-center gap-1 text-orange-500">
            <FiArrowDownCircle /> Out of Stock Items
          </span>
          <span className="font-semibold text-gray-800">43</span>
        </p>

        <p className="flex justify-between">
          <span className="flex items-center gap-1 text-green-600">
            <FiArrowUpCircle /> Well-Stocked Items
          </span>
          <span className="font-semibold text-gray-800">1,245</span>
        </p>
      </div>
    </div>
  );
}

export default InventoryStatus;
