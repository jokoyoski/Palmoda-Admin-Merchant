import React from "react";
import BarChart from "./BarChart";
import PieChartSection from "./PieChartSection" ;
import InventoryStatus from "./InventoryStatus";
import CustomerSatisfaction from "./CustomerSatisfaction";

function DashboardStatsGrid() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 w-full">
      {/* Row 1 */}
      <BarChart />
      <PieChartSection />

      {/* Row 2 */}
      <InventoryStatus />
      <CustomerSatisfaction />
    </section>
  );
}

export default DashboardStatsGrid;
