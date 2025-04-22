"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DataVirtualization() {
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getAllBlog");
        const blogs = await response.json();

        const tagCategoryCounts = {};

        blogs.forEach(blog => {
          if (blog.tags && typeof blog.tags === "object") {
            Object.keys(blog.tags).forEach(category => {
              tagCategoryCounts[category] = (tagCategoryCounts[category] || 0) + 1;
            });
          }
        });

        const chartData = Object.entries(tagCategoryCounts).map(([category, count]) => ({
          name: category,
          value: count
        }));

        setTagsData(chartData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ff7f50", "#ffbb28", "#00c49f", "#ff8042"];

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Tag Category Analysis</h1>

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
    </div>
  );
}
