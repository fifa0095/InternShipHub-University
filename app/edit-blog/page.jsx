"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const EditBlogPage = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: "Agoda Summer Internship! ☀️",
    description:
      "Agoda Summer Internship is back for the 2023 season! ☀️\n\nJoin us for the 10-week internship program at Agoda Bangkok...",
    category: ["Developer", "Security"],
    company: "AGODA",
    sourceLink: "https://lnkd.in/gT_2zC-X",
    jobDetails: ["Allowance", "Onsite"],
  });

  const jobDetailOptions = ["Allowance", "Onsite", "Remote", "Hybrid"];
  const careerOptions = ["Developer", "Security", "Web Designer", "Data & AI", "QA & Tester"];
  const companies = ["AGODA", "Google", "Microsoft", "Amazon", "Other"];

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image) URL.revokeObjectURL(image.preview);
      file.preview = URL.createObjectURL(file);
      setImage(file);
    }
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const toggleSelection = (type, value) => {
    setData((prev) => {
      const updatedSelection = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updatedSelection };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blog Updated", data);
  };

  const handleDelete = () => {
    console.log("Blog Deleted");
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="font-bold">Blog Title <span className="text-red-500">*</span></label>
          <input
            name="title"
            value={data.title}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <p className="font-bold">Career</p>
            <div className="flex flex-wrap gap-2">
              {careerOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-3 py-1 rounded ${data.category.includes(option) ? "bg-black text-white" : "bg-gray-300"}`}
                  onClick={() => toggleSelection("category", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold">Job Details</p>
            <div className="flex flex-wrap gap-2">
              {jobDetailOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-3 py-1 rounded ${data.jobDetails.includes(option) ? "bg-black text-white" : "bg-gray-300"}`}
                  onClick={() => toggleSelection("jobDetails", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold">Upload Image</p>
          <label htmlFor="image" className="block w-40 h-20 bg-gray-400 flex items-center justify-center cursor-pointer">
            <span className="text-white">📷</span>
          </label>
          <input onChange={onImageChange} type="file" id="image" hidden />
        </div>

        <div>
          <label className="font-bold">Related Company <span className="text-red-500">*</span></label>
          <select
            name="company"
            value={data.company}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
            required
          >
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold">Source Link</label>
          <input
            name="sourceLink"
            value={data.sourceLink}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="font-bold">Details <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded">DELETE</button>
          <button type="submit" className="bg-black text-white px-6 py-2 rounded">SUBMIT</button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;