import React, { useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import axios from 'axios';

const BlogList = () => {
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            if (response.data && Array.isArray(response.data.blogs)) {
                setBlogs(response.data.blogs);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            console.error("Error fetching blogs:", err);
            setError("Failed to load blogs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div>
            <div className="flex justify-center gap-6 my-10">
                {["All", "Developer", "Designer", "Cybersecurity", "Data Analyst"].map((category) => (
                    <button
                        key={category}
                        onClick={() => setMenu(category)}
                        className={menu === category ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading && <p className="text-center">Loading blogs...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
                {blogs
                    .filter((item) => menu === "All" || item.category === menu)
                    .map((item) => (
                        <BlogItem
                            key={item._id} // ใช้ _id แทน id
                            id={item._id}  // MongoDB ใช้ _id
                            image={item.image}
                            description={item.description}
                            title={item.title}
                            category={item.category}
                        />
                    ))}
            </div>
        </div>
    );
};

export default BlogList;
