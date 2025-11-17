"use client";
import React, { useState } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type FilterType = "last30" | "last90";

interface DataItem {
  name: string;
  value: number;
}

const dataSets: Record<FilterType, DataItem[]> = {
  last30: [
    { name: "Vendor A", value: 4200 },
    { name: "Vendor B", value: 3800 },
    { name: "Vendor C", value: 3200 },
    { name: "Vendor D", value: 2600 },
  ],
  last90: [
    { name: "Vendor A", value: 6000 },
    { name: "Vendor B", value: 4500 },
    { name: "Vendor C", value: 3500 },
    { name: "Vendor D", value: 2500 },
  ],
};

function BarChart() {
  const [filter, setFilter] = useState<FilterType>("last30");
  const data = dataSets[filter];

  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">
          Monthly Revenue by Top Vendors
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="border border-gray-300 text-[13px] rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 hover:bg-gray-100 cursor-pointer"
        >
          <option value="last30">Last 30 days</option>
          <option value="last90">Last 90 days</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#111827", fontWeight: 600 }}
            />
            <Bar
              dataKey="value"
              fill="#000"
              // @ts-ignore - Recharts allows array radius values
              radius={[0, 8, 8, 0]}
              barSize={22}
              background={{ fill: "#f3f4f6"}}
            />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChart;
