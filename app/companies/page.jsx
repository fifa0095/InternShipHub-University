"use client";

import React, { useEffect, useState, useCallback } from "react";
import BlogItem from "@/Components/BlogItem";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import AddCompany from "@/Components/AddCompany";
import axios from "axios";

const CompaniesPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/blog");
      const fetchedBlogs = response?.data?.blogs || [];

      const companyBlogs = fetchedBlogs.filter(
        (blog) => blog.category === "Company" 
      );

      setBlogs(companyBlogs);
    } catch (err) {
      console.error("Error fetching company blogs:", err);
      setError("Failed to load company blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyBlogs();
  }, [fetchCompanyBlogs]);

  return (
    <>
 

      <div className="relative">
        <AddCompany onSuccess={fetchCompanyBlogs} />
      </div>

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Company Blogs</h1>

        {loading && <p className="text-center">Loading company blogs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-wrap justify-center gap-6">
          {blogs.map((blog) => (
            <BlogItem
              key={blog._id}
              id={blog._id}
              image={blog.image}
              description={blog.description}
              title={blog.title}
              category={blog.category}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompaniesPage;
