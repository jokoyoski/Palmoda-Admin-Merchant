import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { MdWarningAmber } from "react-icons/md";

const vendors = [
  {
    id: 1,
    name: "Lagos Luxe",
    businessType: "Limited company",
    kyc: "Complete",
    docs: 4,
    products: 142,
    sales: "₦4.2M",
    rating: 4.8,
    lastActivity: "Today",
    status: "Active",
    flag: false,
  },
  {
    id: 2,
    name: "Urban Threads",
    businessType: "Sole proprietor",
    kyc: "Complete",
    docs: 2,
    products: 87,
    sales: "₦1.8M",
    rating: 4.2,
    lastActivity: "Yesterday",
    status: "Active",
    flag: true,
  },
  {
    id: 3,
    name: "Accra Accessories",
    businessType: "Marketplace partner",
    kyc: "In review",
    docs: 5,
    products: 98,
    sales: "₦3.5M",
    rating: 4.7,
    lastActivity: "2 days ago",
    status: "Active",
    flag: false,
  },
  {
    id: 4,
    name: "Nairobi Footwear",
    businessType: "Limited company",
    kyc: "Missing",
    docs: 1,
    products: 52,
    sales: "₦1.1M",
    rating: 4.1,
    lastActivity: "4 days ago",
    status: "Active",
    flag: true,
  },
];

export default function VendorList() {
  return (
    <section className="bg-white text-gray-800   w-full mt-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-6 text-sm text-gray-500 font-medium">
        <p className="cursor-pointer hover:text-black">Active Vendors (248)</p>
        <p className="cursor-pointer hover:text-black">Pending Applications (14)</p>
        <p className="cursor-pointer hover:text-black">Rejected Applications (32)</p>
      </div>

      <div className="flex gap-6">
        {/* FILTERS */}
        <div className="w-[22%] flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
          <input
            type="text"
            placeholder="Search vendor, brand, product, email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20"
          />

          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Business Type</option>
            <option>Limited company</option>
            <option>Sole proprietor</option>
          </select>

          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Country</option>
            <option>Nigeria</option>
            <option>Ghana</option>
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
      <option>KYC Status</option>
      <option>Verified</option>
      <option>Pending</option>
      <option>Unverified</option>
    </select>

    {/* Document Missing */}
    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
      <option>Document Missing</option>
      <option>Yes</option>
      <option>No</option>
    </select>

    {/* Onboarding Age */}
    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
      <option>Onboarding Age</option>
      <option>0–3 months</option>
      <option>3–6 months</option>
      <option>6–12 months</option>
      <option>1+ years</option>
    </select>

    {/* Last Activity */}
    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
      <option>Last Activity</option>
      <option>Today</option>
      <option>This week</option>
      <option>This month</option>
      <option>1–3 months ago</option>
      <option>3+ months ago</option>
    </select>

    

    {/* Revenue Range */}
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-600">Revenue Range</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder="Max"
          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-black/20"
        />
      </div>
    </div>

          <button className="bg-black text-white text-sm py-2 rounded-md">
            Apply Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="w-[78%] bg-white rounded-lg 
         
        overflow-x-auto border border-gray-200 overflow-hidden">
          <table className="min-w-full table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left font-semibold w-[12%]">Vendor</th>
<th className="py-3 px-4 text-left font-semibold w-[12%]">Business Type</th>
<th className="py-3 px-4 text-left font-semibold w-[8%]">KYC</th>
<th className="py-3 px-4 text-left font-semibold w-[8%]">Docs</th>
<th className="py-3 px-4 text-left font-semibold w-[8%]">Products</th>
<th className="py-3 px-4 text-left font-semibold w-[10%]">Sales MTD</th>
<th className="py-3 px-4 text-left font-semibold w-[8%]">Rating</th>
<th className="py-3 px-4 text-left font-semibold w-[10%]">Last Activity</th>
<th className="py-3 px-4 text-left font-semibold w-[6%]">Flag</th>
<th className="py-3 px-4 text-left font-semibold w-[10%]">Status</th>
<th className="py-3 px-4 text-left font-semibold w-[10%]">Action</th>


              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{vendor.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{vendor.businessType}</td>

                  {/* KYC */}
                  <td className="py-3 px-4 whitespace-nowrap">
  <span className="inline-flex items-center gap-2">
    {vendor.kyc === "Complete" ? (
      <FaCheckCircle className="text-green-500" />
    ) : vendor.kyc === "Missing" ? (
      <FaTimesCircle className="text-red-500" />
    ) : (
      <FaTimesCircle className="text-yellow-500" />
    )}
    {vendor.kyc}
  </span>
</td>


                  {/* DOCS MAX 5 ICONS */}
                  <td className="py-3 px-4 whitespace-nowrap flex gap-1 items-center shrink-0 overflow-hidden">
                    {[...Array(Math.min(vendor.docs, 5))].map((_, i) => (
                      <span
  key={i}
  className="w-3 h-3 bg-gray-800 rounded-sm inline-block shrink-0"
></span>

                    ))}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">{vendor.products}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{vendor.sales}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{vendor.rating}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{vendor.lastActivity}</td>

                  {/* FLAG */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {vendor.flag && (
                      <MdWarningAmber className="text-yellow-500 text-lg" />
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                      {vendor.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                   <td className="py-3 px-4 flex gap-2">
                    <button className="px-3 py-1 border rounded text-blue-600 border-blue-600 text-xs hover:bg-blue-50">
                      View
                    </button>
                    <button className="px-3 py-1 border rounded text-green-600 border-green-600 text-xs hover:bg-green-50">
                      Accept
                    </button>
                    <button className="px-3 py-1 border rounded text-red-600 border-red-600 text-xs hover:bg-red-50">
                      Reject
                    </button>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
