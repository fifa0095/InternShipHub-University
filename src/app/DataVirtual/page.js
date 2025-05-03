"use client";

import { useEffect, useState } from "react";
import CompanyBarChart from "@/components/dataVirtual/Company";
import TimelineGraph from "@/components/dataVirtual/Date";
import Tags from "@/components/dataVirtual/Tags"; // pie chart: tag category
import TagValueChart from "@/components/dataVirtual/TagValueChart"; // ✅ pie chart: tag values

export default function DataVirtualization() {
  const [companyData, setCompanyData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [tagsData, setTagsData] = useState([]); // category-level
  const [tagValueData, setTagValueData] = useState([]); // ✅ value-level

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getAllBlog");
        const blogs = await response.json();

        const companyWeightCounts = {};
        const datePostCounts = {};
        const tagCategoryCounts = {};
        const tagValueCounts = {}; // ✅ นับค่าภายในแท็ก

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
            Object.entries(blog.tags).forEach(([category, values]) => {
              if (category !== "NODATA") {
                tagCategoryCounts[category] = (tagCategoryCounts[category] || 0) + 1;

                if (Array.isArray(values)) {
                  values.forEach(value => {
                    if (value !== "NODATA") {
                      tagValueCounts[value] = (tagValueCounts[value] || 0) + 1;
                    }
                  });
                }
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

        const categoryChartData = Object.entries(tagCategoryCounts).map(([name, value]) => ({
          name,
          value,
        }));

        const valueChartData = Object.entries(tagValueCounts).map(([name, value]) => ({
          name,
          value,
        }));

        setCompanyData(companyData);
        setTimelineData(timelineData);
        setTagsData(categoryChartData);
        setTagValueData(valueChartData); // ✅ ตั้งค่าข้อมูลสำหรับ tag values

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Data Virtualization</h1>

      {/* Tag Category Analysis and Tag Value Analysis side-by-side */}
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4 mt-8">Tag Category Analysis</h2>
          <Tags tagsData={tagsData} />
        </div>

        <div className="w-1/2">
          <h2 className="text-2xl font-bold mb-4 mt-8">Tag Value Analysis</h2>
          <TagValueChart tagValueData={tagValueData} /> {/* ✅ Pie chart แสดงค่าภายในแท็ก */}
        </div>
      </div>

      {/* Timeline Graph */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Posts Over Time</h2>
        <TimelineGraph timelineData={timelineData} />
      </div>

      {/* Company Bar Chart */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Company Post Distribution</h2>
      <CompanyBarChart companyData={companyData} />
    </div>
  );
}
