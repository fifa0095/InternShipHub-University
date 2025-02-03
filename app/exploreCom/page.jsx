// app/blogs/[id]/page.jsx
"use client"
import React, { useEffect, useState } from 'react'
import BlogItem from '@/Components/BlogItem';
import axios from 'axios'

const Page = () => {
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            if (response.data && Array.isArray(response.data.blogs)) {
                setBlogs(response.data.blogs);
            } else {
                console.error("Unexpected response structure:", response.data);
                setBlogs([]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error.response?.data || error.message);
            setError("Failed to fetch blogs. Please try again later.");
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
                {blogs.filter((item) => menu === "All" ? true : item.category === menu)
                    .map((item) => (
                        <BlogItem key={item._id} id={item._id} image={item.image} description={item.description} title={item.title} category={item.category} />
                    ))}
            </div>
        </div>
    );
};

export default Page;
