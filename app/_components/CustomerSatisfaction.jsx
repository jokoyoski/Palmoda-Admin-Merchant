"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", rating: 3.8 },
  { name: "Feb", rating: 4.0 },
  { name: "Mar", rating: 4.2 },
  { name: "Apr", rating: 4.5 },
  { name: "May", rating: 4.6 },
];

function CustomerSatisfaction() {
  return (
    <div className="col-span-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold text-gray-800">Customer Satisfaction</h2>
        <select className="border border-gray-300 text-[13px] rounded-md px-2 py-1">
          <option>This Quarter</option>
          <option>Last Quarter</option>
        </select>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomerSatisfaction;
