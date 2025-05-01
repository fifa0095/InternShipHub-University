"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CompanyBarChart({ companyData }) {
  return (
    <div className="flex justify-center items-center bg-white shadow-md rounded-xl p-6">
      <ResponsiveContainer width="80%" height={400}>
        <BarChart data={companyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="weight" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
