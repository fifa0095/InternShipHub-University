// components/virtual/Tags.js

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Tags({ tagsData }) {
  const COLORS = ["#8884d8", "#82ca9d", "#ff7f50", "#ffbb28", "#00c49f", "#ff8042"];

  return (
    <div className="flex justify-center items-center bg-white shadow-md rounded-xl p-6">
      <ResponsiveContainer width="80%" height={400}>
        <PieChart>
          <Pie
            data={tagsData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {tagsData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
