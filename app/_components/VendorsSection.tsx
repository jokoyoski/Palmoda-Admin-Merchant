import React from "react";
import TopVendors from "./TopVendors";
import RecentReviews from "./RecentReviews";

function VendorsSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      <TopVendors />
      <RecentReviews />
    </section>
  );
}

export default VendorsSection;
