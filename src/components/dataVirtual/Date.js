"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function TimelineGraph({ timelineData }) {
  return (
    <div className="flex justify-center items-center bg-white shadow-md rounded-xl p-6">
      <ResponsiveContainer width="80%" height={400}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="postCount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
