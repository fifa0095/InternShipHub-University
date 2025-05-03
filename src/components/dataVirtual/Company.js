"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function CompanyBarChart({ companyData }) {
  return (
    <div className="flex justify-center items-center bg-white shadow-md rounded-xl p-6">
      <ResponsiveContainer width="100%" height={Math.max(400, companyData.length * 30)}>
        <BarChart
          layout="vertical" // ✅ เปลี่ยนเป็นแนวนอน
          data={companyData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12 }}
            width={150} // ✅ ปรับความกว้างให้ชื่อไม่ถูกตัด
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="weight" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
