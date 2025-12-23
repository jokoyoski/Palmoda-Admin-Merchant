"use client";
import React from "react";
import { BsGraphUp } from "react-icons/bs";
import { FaShirt, FaStar, FaUser } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { useAnalytics } from "../_lib/dashboard";

function DashboardGrid() {
  const {
    data,
    isLoading: genderLoading,
    isError: isGenderError,
    error: genderError,
  } = useAnalytics();

  const array = [
    {
      text: "ACTIVE VENDORS",
      keyword: "128",
      percentage: data?.active_vendors,
      icon: <FaPeopleGroup color="black" size={20} />,
      viewList: true,
    },
    {
      text: "PENDING APPLICATIONS",
      keyword: data?.pending_verification,
      percentage: "12%",
      icon: <FaUser color="black" size={20} />,
    },
    {
      text: "TOTAL REVENUE (MTD)",
      keyword: data?.total_revenue
        ? `₦${data.total_revenue.toLocaleString()}`
        : "₦0",
      percentage: "12%",
      icon: <BsGraphUp color="black" size={20} />,
    },
    {
      text: "TOTAL ORDERS RATING",
      keyword: data?.total_orders,
      percentage: "12%",
      icon: <FaStar color="black" size={20} />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      {array.map((item, index) => (
        <div key={index} className="bg-white py-2 px-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-xs">{item?.text}</p>
            {item?.icon}
          </div>
          <h3 className="text-lg font-semibold text-black">{item?.keyword}</h3>
          <p className="text-green-500 font-semibold text-xs">
            {item?.percentage}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DashboardGrid;
