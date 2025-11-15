"use client";
import React from "react";
import { CiUser } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";

function RecentReviews() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[15px] font-semibold text-gray-800">
          Recent Reviews
        </h2>
        <button className="text-sm text-gray-500 hover:text-black">View All</button>
      </div>

      <div className="flex flex-col gap-3 text-gray-700 text-sm">
        <div className="">
          <div className="flex items-center gap-2 mb-1">
            <CiUser className="text-black text-sm"/>
            <p>Emma Anderson</p>
          </div>
          <div className="flex gap-1 items-center mb-2 text-yellow-500">
             <FaStar />
             <FaStar />
             <FaStar />
             <FaStar />
             <FaStar />
          </div>
          <p className="text-xs">
           The quality of Luxe Atelier's evening gown exceeded my expectations. Impeccable craftsmanship and attention to detail. Shipping was fast and packaging was luxurious.
          </p>
        </div>
        <div className="">
          <div className="flex items-center gap-2 mb-1">
            <CiUser className="text-black text-sm"/>
            <p>Emma Anderson</p>
          </div>
          <div className="flex gap-1 items-center mb-2 text-yellow-500">
             <FaStar />
             <FaStar />
             <FaStar />
             <FaStar />
             <FaStar />
          </div>
          <p className="text-xs">
           The quality of Luxe Atelier's evening gown exceeded my expectations. Impeccable craftsmanship and attention to detail. Shipping was fast and packaging was luxurious.
          </p>
          </div>
      </div>
    </div>
  );
}

export default RecentReviews;
