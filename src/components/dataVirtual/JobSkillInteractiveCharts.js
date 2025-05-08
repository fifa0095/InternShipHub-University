"use client";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function JobSkillInteractiveCharts({ jobSkillCounts }) {
  const [selectedJob, setSelectedJob] = useState(null);

  const generateColorShades = (baseHue, count) => {
    return Array.from({ length: count }, (_, i) => {
      const lightness = 70 - i * (40 / count);
      return `hsl(${baseHue}, 70%, ${lightness}%)`;
    });
  };

  const jobNames = useMemo(() => Object.keys(jobSkillCounts), [jobSkillCounts]);

  const { jobData, skillData, baseHue } = useMemo(() => {
    const jobs = Object.entries(jobSkillCounts);
    const jobData = jobs.map(([name, obj]) => ({
      name,
      value: obj.count || 0,
    }));

    const selectedSkills = selectedJob ? jobSkillCounts[selectedJob]?.skills || {} : {};
    const filteredSkills = Object.entries(selectedSkills)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]) // sort by count descending
      .slice(0, 10) // top 10
      .map(([name, value]) => ({ name, value }));

    const baseHue = Math.floor(Math.random() * 360);

    return { jobData, skillData: filteredSkills, baseHue };
  }, [jobSkillCounts, selectedJob]);

  const leftColors = generateColorShades(200, jobData.length); // โทนฟ้า
  const barColor = `hsl(${baseHue}, 70%, 50%)`;

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6">
      {/* ฝั่งซ้าย: Job Category */}
      <div className="w-full lg:w-1/2 px-4 shadow-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 mt-8 text-center">Career count on Website</h2>
        <PieChart width={500} height={400}>
          <Pie
            data={jobData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={150}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            onClick={(data) => setSelectedJob(data.name)}
          >
            {jobData.map((entry, index) => (
              <Cell key={entry.name} fill={leftColors[index % leftColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* ฝั่งขวา: Skill ตาม Job แบบ Bar Chart */}
      <div className="w-full lg:w-1/2 px-4 shadow-md flex flex-col items-center justify-start">
        <h2 className="text-2xl font-bold mt-8 mb-2 text-center">Top 10 Skills & Tools for Developer</h2>

        <div className="mb-4">
          <label className="mr-2 font-medium">เลือก Job:</label>
          <select
            className="border px-3 py-1 rounded-md"
            value={selectedJob || ""}
            onChange={(e) => setSelectedJob(e.target.value || null)}
          >
            <option value="">-- กรุณาเลือกสายงาน --</option>
            {jobNames.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
        </div>

        {selectedJob && skillData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={skillData} layout="vertical" margin={{ top: 10, right: 30, left: 50, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 mt-4">กรุณาเลือกสายงานเพื่อดูสกิล</p>
        )}
      </div>
    </div>
  );
}
