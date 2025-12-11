"use client";
import React, { useEffect, useState } from "react";
import VendorList from "./VendorList";
import { Vendor } from "../_lib/type";
import ProtectedRoute from "../_components/ProtectedRoute";
import {
  useVendors,
  useSuspendVendor,
  useRevokeSuspension,
} from "../_lib/useVendors";

export default function Page() {
  // Filters + Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("Any");
  const [kyc, setKyc] = useState("Any");

  // React Query Data
  const { data, isLoading, isError } = useVendors(currentPage);
  // const vendors = data?.vendors || [];
  const totalPages = data?.totalPages || 1;

  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  // Filtered Vendors

  useEffect(() => {
    if (data?.vendors) {
      setFilteredVendors(data.vendors);
    }
  }, [data]);

  // FILTER LOGIC
  const handleApplyFilters = (overrides?: {
    search?: string;
    businessType?: string;
    kyc?: string;
    resetPage?: boolean;
  }) => {
    let dataToFilter = [...data?.vendors];

    const s = overrides?.search ?? search;
    const bt = overrides?.businessType ?? businessType;
    const k = overrides?.kyc ?? kyc;

    // Search Filter
    if (s.trim()) {
      const lower = s.toLowerCase();
      dataToFilter = dataToFilter.filter(
        (v) =>
          v.business_name.toLowerCase().includes(lower) ||
          v.contact_person_name.toLowerCase().includes(lower) ||
          v.email.toLowerCase().includes(lower)
      );
    }

    // Business Type Filter
    if (bt !== "Any") {
      dataToFilter = dataToFilter.filter(
        (v) => v.kyc_compliance.business_type === bt
      );
    }

    // KYC Filter
    if (k !== "Any") {
      dataToFilter = dataToFilter.filter((v) => {
        const verified =
          v.is_business_verified &&
          v.is_identity_verified &&
          v.is_bank_information_verified;

        const suspended = v.is_suspended;

        const deleted = v.is_deleted;

        if (k === "Verified") return verified;
        if (k === "Unverified") return !verified;
        if (k === "Pending") {
          return (
            !v.is_business_verified ||
            !v.is_identity_verified ||
            !v.is_bank_information_verified
          );
        }
        if (k === "Suspended") return suspended;
        if (k === "Deleted") return deleted;
      });
    }

    setFilteredVendors(dataToFilter);
    if (overrides?.resetPage) {
    setCurrentPage(1);
  }
  };

  // Mutations
  const suspendMutation = useSuspendVendor();
  const revokeMutation = useRevokeSuspension();

  const handleSuspend = (vendorId: string) => {
    suspendMutation.mutate(vendorId);
  };

  const handleRevoke = (vendorId: string) => {
    revokeMutation.mutate(vendorId);
  };

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-black font-bold text-xl">Vendor List</h1>
        </div>

        <VendorList
          vendors={filteredVendors}
          setFilteredVendors={setFilteredVendors}
          search={search}
          setSearch={setSearch}
          businessType={businessType}
          setBusinessType={setBusinessType}
          kyc={kyc}
          setKyc={setKyc}
          loading={isLoading}
          onApplyFilters={handleApplyFilters}
          currentPage={currentPage}
          totalVendors={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          onSuspend={handleSuspend}
          onRevoke={handleRevoke}
        />
      </section>
    </ProtectedRoute>
  );
}
