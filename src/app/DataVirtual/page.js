"use client";

import { useEffect, useState } from "react";

import JobSkillInteractiveCharts from "@/components/dataVirtual/JobSkillInteractiveCharts";
import TagInteractiveCharts from "@/components/dataVirtual/TagInteractiveCharts";
import QuarterBarChart from "@/components/dataVirtual/QuarterBarChart";

export default function DataVirtualization() {
  const [quarterData, setQuarterData] = useState([]);
  const [jobSkillCounts, setJobSkillCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisualizeData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://intern-huf-api.vercel.app/api/getVisaulizeData");
        const data = await res.json();
        setQuarterData(data.quarterCounts || []);
        setJobSkillCounts(data.jobSkillCounts || {});
      } catch (error) {
        console.error("Error fetching visualize data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizeData();
  }, []);

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">📊 Data Visualize</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-500 mt-20">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          {/* ✅ กราฟวิเคราะห์สกิลตามสายงาน */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Job Skill Analysis</h2>
            <JobSkillInteractiveCharts jobSkillCounts={jobSkillCounts} />
          </div>

          {/* ✅ กราฟโพสต์รายไตรมาส */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Posts by Quarter</h2>
            <QuarterBarChart quarterData={quarterData} />

          </div>
        </>
      )}
    </div>
  );
}
