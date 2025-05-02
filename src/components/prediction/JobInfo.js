import React from "react";

export default function JobInfoCard({ job }) {
  if (!job) return null;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg">
      <img src={job.image?.src} alt={job.title} className=" object-contain mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
      <p className="text-gray-600 text-sm mb-3">{job.description}</p>
      <div className="text-blue-500 text-sm font-medium">
        {job.skills.join(", ")}
      </div>
    </div>
  );
}
