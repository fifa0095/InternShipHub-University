"use client";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#ff69b4"];

export default function TagInteractiveCharts({ blogs }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categoryData, valueChartData } = useMemo(() => {
    const tagCategoryCounts = {};
    const selectedTagValues = {};

    blogs.forEach(blog => {
      if (blog.tags && typeof blog.tags === "object") {
        Object.entries(blog.tags).forEach(([category, values]) => {
          if (category !== "NODATA") {
            tagCategoryCounts[category] = (tagCategoryCounts[category] || 0) + 1;

            if (Array.isArray(values)) {
              values.forEach(value => {
                if (value !== "NODATA") {
                  if (!selectedCategory || selectedCategory === category) {
                    selectedTagValues[value] = (selectedTagValues[value] || 0) + 1;
                  }
                }
              });
            }
          }
        });
      }
    });

    const categoryData = Object.entries(tagCategoryCounts).map(([name, value]) => ({ name, value }));
    const valueChartData = Object.entries(selectedTagValues).map(([name, value]) => ({ name, value }));

    return { categoryData, valueChartData };
  }, [blogs, selectedCategory]);

  const handleClickCategory = (data) => {
    setSelectedCategory(prev => (prev === data.name ? null : data.name));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 mt-8">Tag Category Analysis</h2>
        <PieChart width={400} height={500}>
          <Pie
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={150}
            onClick={handleClickCategory}
          >
            {categoryData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-8">
          Tag Value Analysis {selectedCategory ? `of ${selectedCategory}` : "(All)"}
        </h2>
        <PieChart width={400} height={500}>
          <Pie
            data={valueChartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={150}
          >
            {valueChartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
