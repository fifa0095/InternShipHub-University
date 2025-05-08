"use client";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend ,ResponsiveContainer} from "recharts";

export default function TagInteractiveCharts({ blogs }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const generateColorShades = (baseHue, count) => {
    return Array.from({ length: count }, (_, i) => {
      const lightness = 70 - i * (40 / count); // ต่างกันที่ความเข้ม
      return `hsl(${baseHue}, 70%, ${lightness}%)`;
    });
  };

  const { categoryData, valueChartData, baseHue } = useMemo(() => {
    const tagCategoryCounts = {};
    const selectedTagValues = {};
    let hue = Math.floor(Math.random() * 360); // ใช้ hue เดียวกันทั้งฝั่งขวา

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

    return { categoryData, valueChartData, baseHue: hue };
  }, [blogs, selectedCategory]);

  const handleClickCategory = (data) => {
    setSelectedCategory(prev => (prev === data.name ? null : data.name));
  };

  const leftColors = generateColorShades(220, categoryData.length); // โทนน้ำเงิน
  const rightColors = generateColorShades(baseHue, valueChartData.length);

  return (
    <div className="flex flex-col lg:flex-row justify-between space-x-4">
      {/* Chart ฝั่งซ้าย */}
      <div className="w-full lg:w-1/2 px-4 shadow-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 mt-8 text-center">Tag Category Analysis</h2>
        <PieChart width={600} height={500}>
          <Pie
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={160}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            onClick={handleClickCategory}
          >
            {categoryData.map((entry, index) => (
              <Cell key={entry.name} fill={leftColors[index % leftColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Chart ฝั่งขวา */}
      <div className="w-full lg:w-1/2 shadow-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 mt-8 text-center">
          Tag Value Analysis {selectedCategory ? `of ${selectedCategory}` : "(All)"}
        </h2>
        <PieChart width={600} height={500}>
          <Pie
            data={valueChartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={160}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {valueChartData.map((entry, index) => (
              <Cell key={entry.name} fill={rightColors[index % rightColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>

  );
}
