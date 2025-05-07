"use client";

import { useEffect, useState } from "react";
import CompanyBarChart from "@/components/dataVirtual/Company";
import TimelineGraph from "@/components/dataVirtual/Date";
import TagInteractiveCharts from "@/components/dataVirtual/TagInteractiveCharts"; // ✅ import ใหม่

export default function DataVirtualization() {
  const [companyData, setCompanyData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/getAllBlog");
        const blogs = await response.json();
        setBlogs(blogs); // ✅ เก็บ raw data เอาไว้ใช้ใน chart component

        const companyWeightCounts = {};
        const datePostCounts = {};

        blogs.forEach(blog => {
          const companyName = blog.company_name;
          const createdAt = new Date(blog.createdAt).toLocaleDateString();

          if (companyName) {
            companyWeightCounts[companyName] = (companyWeightCounts[companyName] || 0) + 1;
          }

          if (createdAt) {
            datePostCounts[createdAt] = (datePostCounts[createdAt] || 0) + 1;
          }
        });

        const companyData = Object.entries(companyWeightCounts).map(([name, weight]) => ({ name, weight }));

        const timelineData = Object.entries(datePostCounts)
          .map(([date, postCount]) => ({ date, postCount }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setCompanyData(companyData);
        setTimelineData(timelineData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Data Visualize</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-500 mt-20">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          {/* ✅ Interactive Tags Charts */}
          <TagInteractiveCharts blogs={blogs} />

          {/* Timeline Graph */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Posts Over Time</h2>
            <TimelineGraph timelineData={timelineData} />
          </div>

          {/* Company Bar Chart */}
          <h2 className="text-2xl font-bold mb-4 mt-8">Company Post Distribution</h2>
          <CompanyBarChart companyData={companyData} />
        </>
      )}
    </div>
  );
}
