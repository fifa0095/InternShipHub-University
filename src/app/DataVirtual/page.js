"use client";

import { useEffect, useState } from "react";
import CompanyBarChart from "@/components/dataVirtual/Company";
import TimelineGraph from "@/components/dataVirtual/Date";
import Tags from "@/components/dataVirtual/Tags"; // นำเข้า Tags Component

export default function DataVirtualization() {
  const [companyData, setCompanyData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getAllBlog");
        const blogs = await response.json();

        const companyWeightCounts = {};
        const datePostCounts = {};
        const tagCategoryCounts = {};

        blogs.forEach(blog => {
          const companyName = blog.company_name;
          const createdAt = new Date(blog.createdAt).toLocaleDateString();

          if (companyName) {
            companyWeightCounts[companyName] = (companyWeightCounts[companyName] || 0) + 1;
          }

          if (createdAt) {
            datePostCounts[createdAt] = (datePostCounts[createdAt] || 0) + 1;
          }

          if (blog.tags && typeof blog.tags === "object") {
            Object.keys(blog.tags).forEach(category => {
              if (category !== "NODATA") { // ฟิลเตอร์เอา "NODATA" ออก
                tagCategoryCounts[category] = (tagCategoryCounts[category] || 0) + 1;
              }
            });
          }
        });

        const companyData = Object.entries(companyWeightCounts).map(([company, weight]) => ({
          name: company,
          weight,
        }));

        const timelineData = Object.entries(datePostCounts).map(([date, postCount]) => ({
          date,
          postCount,
        }));

        const chartData = Object.entries(tagCategoryCounts).map(([category, count]) => ({
          name: category,
          value: count,
        }));

        setCompanyData(companyData);
        setTimelineData(timelineData);
        setTagsData(chartData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Data Virtualization</h1>

      {/* Tag Category Analysis and Timeline Graph in the same row */}
      <div className="flex justify-between space-x-4">
        {/* Tag Category Analysis */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4 mt-8">Tag Category Analysis</h2>
          <Tags tagsData={tagsData} />
        </div>

        {/* Timeline Graph */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4 mt-8">Posts Over Time</h2>
          <TimelineGraph timelineData={timelineData} />
        </div>
      </div>

      {/* Company Bar Chart */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Company Post Distribution</h2>
      <CompanyBarChart companyData={companyData} />
    </div>
  );
}
