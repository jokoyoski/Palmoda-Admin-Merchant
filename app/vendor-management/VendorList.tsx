"use client";
import Link from "next/link";
import { Vendor, VendorMessage } from "../_lib/type";
import React, { useState } from "react";
import { sendMessage } from "../_lib/message";
import { toast } from "react-toastify";
import { suspendVendor, revokeSuspension } from "../_lib/admin";
import Swal from "sweetalert2";

interface VendorListProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  businessType: string;
  setBusinessType: React.Dispatch<React.SetStateAction<string>>;
  kyc: string;
  updateVendorStatus: (vendorId: string, isSuspended: boolean) => void;
  setKyc: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onApplyFilters: () => void;
  currentPage: number;
  totalVendors: number;
  onPageChange: (page: number) => void;
}

export default function VendorList({
  vendors,
  setVendors,
  search,
  setSearch,
  businessType,
  setBusinessType,
  kyc,
  setKyc,
  onPageChange,
  loading,
  totalVendors,
  currentPage,
  onApplyFilters,
  updateVendorStatus,
}: VendorListProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [message_type, setMessageType] = useState("text");
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [suspending, setSuspending] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "rejected">("all");
  const [suspendingVendors, setSuspendingVendors] = useState<{ [key: string]: boolean }>({});

  const pageSize = 10;

  const handleMessage = async () => {
    if (!selectedVendorId) return toast.error("No vendor selected.");

    if (!content.trim()) {
      return toast.error("Message cannot be empty");
    }

    try {
      setSending(true);
      const res = await sendMessage(selectedVendorId, title, content, message_type);

      if (res?.success === false) {
        toast.error(res.message);
      } else {
        toast.success("Message sent successfully!");

        setMessages((prev: any) => [...prev, res.data]);
        setTitle("");
        setContent("");

        setShowPopup(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Add this to your state


// Suspend
const handleSuspendVendor = async (vendorId: string, vendorName: string) => {
  const result = await Swal.fire({
    title: "Suspend Vendor?",
    text: `Are you sure you want to suspend ${vendorName}? This action can be reversed later.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#000000",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, suspend",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      setSuspendingVendors((prev) => ({ ...prev, [vendorId]: true }));
      const res = await suspendVendor(vendorId);

      if (res?.success === false) {
        toast.error(res.message || "Failed to suspend vendor");
      } else {
        toast.success("Vendor suspended successfully!");
        setVendors((prev) =>
          prev.map((v) =>
            v._id === vendorId ? { ...v, is_suspended: true, is_active: false } : v
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to suspend vendor");
    } finally {
      setSuspendingVendors((prev) => ({ ...prev, [vendorId]: false }));
    }
  }
};

// Revoke suspension
const handleRevoke = async (vendorId: string, vendorName: string) => {
  const result = await Swal.fire({
    title: "Revoke Suspension?",
    text: `Are you sure you want to revoke the suspension of ${vendorName}? This action can be reversed later.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#000000",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Revoke",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      setSuspendingVendors((prev) => ({ ...prev, [vendorId]: true }));
      const res = await revokeSuspension(vendorId);

      if (res?.success === false) {
        toast.error(res.message || "Failed to revoke suspension");
      } else {
        toast.success("Vendor Suspension Revoked");
        setVendors((prev) =>
          prev.map((v) =>
            v._id === vendorId ? { ...v, is_suspended: false, is_active: true } : v
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke suspension");
    } finally {
      setSuspendingVendors((prev) => ({ ...prev, [vendorId]: false }));
    }
  }
};

  // Filter vendors based on active tab
  const getFilteredVendorsByTab = () => {
    switch (activeTab) {
      case "all":
        return vendors;
      case "active":
        return vendors.filter((v) => v.is_active);
      case "pending":
        // Assuming pending means KYC not fully verified
        return vendors.filter(
          (v) =>
            !v.is_business_verified ||
            !v.is_identity_verified ||
            !v.is_bank_information_verified
        );
      case "rejected":
        // Assuming rejected means inactive
        return vendors.filter((v) => !v.is_active);
      default:
        return vendors;
    }
  };

  const filteredByTab = getFilteredVendorsByTab();
  const skeletonRows = Array(6).fill(null);
  const totalPages = Math.ceil(totalVendors / pageSize);

  return (
    <section className="bg-white text-gray-800 w-full mt-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("all")}
          className={`cursor-pointer transition-colors ${
            activeTab === "all"
              ? "text-black border-b-2 border-black pb-1"
              : "text-gray-500 hover:text-black"
          }`}
        >
          All Vendors
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`cursor-pointer transition-colors ${
            activeTab === "active"
              ? "text-black border-b-2 border-black pb-1"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Active Vendors
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer transition-colors ${
            activeTab === "pending"
              ? "text-black border-b-2 border-black pb-1"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Pending Applications
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`cursor-pointer transition-colors ${
            activeTab === "rejected"
              ? "text-black border-b-2 border-black pb-1"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Rejected Applications
        </button>
      </div>

      <div className="flex gap-6">
        {/* FILTERS */}
        <div className="w-[22%] mb-4 flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vendor, brand, product, email"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
          />

          {/* <label className="text-xs font-medium text-gray-600">Country</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Any</option>
            <option>Nigeria</option>
            <option>Ghana</option>
          </select> */}

          <label className="text-xs font-medium text-gray-600">Kyc Status</label>
          <select
            value={kyc}
            onChange={(e) => setKyc(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="Any">Any</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Unverified">Unverified</option>
          </select>

          {/* <label className="text-xs font-medium text-gray-600">Document Missing</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Any</option>
            <option>Yes</option>
            <option>No</option>
          </select> */}

          {/* <label className="text-xs font-medium text-gray-600">Onboarding Age</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Any</option>
            <option>0–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
            <option>1+ years</option>
          </select> */}

          {/* <label className="text-xs font-medium text-gray-600">Last Activity</label>
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/20">
            <option>Any</option>
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
            <option>1–3 months ago</option>
            <option>3+ months ago</option>
          </select> */}

          {/* <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">Revenue Range</label>
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
          </div> */}

          {/* <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-medium text-gray-600">More Filters</label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-black" />
              Flagged Only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-black" />
              With Disputes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-black" />
              Inventory Low
            </label>
          </div> */}

          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={onApplyFilters}
              className="bg-black text-white w-[100px] text-sm py-2 px-4"
            >
              Apply
            </button>
            <button
              className="border border-gray-300 w-[100px] text-gray-700 text-sm py-2 px-4"
              onClick={() => {
                setSearch("");
                setBusinessType("Any");
                setKyc("Any");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-[78%] bg-white rounded-lg overflow-x-auto border border-gray-200 overflow-hidden">
          <table className="min-w-full table-fixed text-sm">
            <thead className="font-semibold text-gray-900 sticky top-0 bg-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold w-[12%]">Vendor</th>
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
              {loading
                ? skeletonRows.map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <td key={j} className="py-3 px-4">
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : filteredByTab.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-gray-500">
                        No vendors found for this category
                      </td>
                    </tr>
                  ) : (
                    filteredByTab
                      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                      .map((vendor) => (
                        <tr
                          key={vendor._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-3 px-4">{vendor.business_name}</td>
                          <td className="py-3 px-4">
                            {vendor.is_business_verified &&
                            vendor.is_identity_verified &&
                            vendor.is_bank_information_verified
                              ? "Verified"
                              : "Unverified"}
                          </td>
                          <td className="py-3 px-4">5</td>
                          <td className="py-3 px-4">0</td>
                          <td className="py-3 px-4">₦0</td>
                          <td className="py-3 px-4">0</td>
                          <td className="py-3 px-4 text-xs">{vendor.updated_at}</td>
                          <td className="py-3 px-4"></td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-md 
                                ${
                                  vendor.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                            >
                              {vendor.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/application-review/${vendor?._id}`}
                                className="px-3 py-1 border text-black bg-inherit text-xs hover:bg-gray-100"
                              >
                                View
                              </Link>
                             {!vendor.is_suspended && (
  <button
    onClick={() => handleSuspendVendor(vendor._id, vendor.business_name)
      .then(() => updateVendorStatus(vendor._id, true))}
    disabled={suspendingVendors[vendor._id]}
    className="px-3 py-1 border text-black bg-inherit text-xs hover:bg-gray-100 disabled:opacity-50"
  >
    {suspendingVendors[vendor._id] ? "Suspending..." : "Suspend"}
  </button>
)}

{vendor.is_suspended && (
  <button
    onClick={() => handleRevoke(vendor._id, vendor.business_name)
  .then(() => updateVendorStatus(vendor._id, false))}
    disabled={suspendingVendors[vendor._id]}
    className="px-3 py-1 border text-black bg-inherit text-xs hover:bg-gray-100 disabled:opacity-50"
  >
    {suspendingVendors[vendor._id] ? "Revoking..." : "Revoke"}
  </button>
)}

                              <button
                                onClick={() => {
                                  setSelectedVendorId(vendor._id);
                                  setShowPopup(true);
                                }}
                                className="px-3 py-1 border text-black bg-inherit text-xs hover:bg-gray-100"
                              >
                                Message
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-white">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={`px-4 py-2 text-sm border rounded
                ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Previous
            </button>

            <p className="text-sm">
              Page {currentPage} of {totalPages}
            </p>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={`px-4 py-2 text-sm border rounded
                ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Message Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-2xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4">
              Message: {vendors.find((v) => v._id === selectedVendorId)?.business_name}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-transparent"
            />

            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:border-transparent"
              rows={5}
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-3 flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleMessage}
                disabled={sending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}