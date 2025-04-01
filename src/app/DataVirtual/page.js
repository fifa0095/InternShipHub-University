"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DataVirtualization() {
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getBlog");
        const blogs = await response.json();

        // รวมแท็กทั้งหมดและคำนวณ Weight ของแต่ละแท็ก
        const tagCounts = {};
        blogs.forEach(blog => {
          if (blog.tag && typeof blog.tag === "object") {
            // รวมแท็กและคำนวณ weight
            Object.values(blog.tag).forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        // แปลงข้อมูลให้เหมาะสมกับ Recharts
        const chartData = Object.entries(tagCounts).map(([tag, count]) => ({
          name: tag,
          value: count
        }));

        setTagsData(chartData);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // สีสำหรับ Pie Chart
  const COLORS = ["#8884d8", "#82ca9d", "#ff7f50", "#ffbb28", "#00c49f", "#ff8042"];

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Tag Popularity Analysis</h1>
      
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
