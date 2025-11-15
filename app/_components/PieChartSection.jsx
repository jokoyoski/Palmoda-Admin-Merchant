"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Clothing", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Shoes", value: 20 },
  { name: "Bags", value: 10 },
];

const COLORS = ["#000000", "#555555", "#999999", "#cccccc"];

function PieChartSection() {
  return (
    <div className="col-span-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-[15px] font-semibold text-gray-800 mb-4">
        Product Categories
      </h2>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartSection;
