"use client";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { BLOG_CATEGORIES } from "@/lib/config";
import { useRouter } from "next/navigation";
import { assets } from "@/Assets/assets";
import { Input } from "../ui/input";

export default function HomeComponent({ posts: initialPosts, currentPage = 1 }) {
  const [isGridView, setIsGridView] = useState(false);
  const [currentSelectedTag, setCurrentSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [posts, setPosts] = useState(initialPosts || []);
  const [page, setPage] = useState(currentPage);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setPosts(initialPosts);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/search/${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchPage = async (newPage) => {
    setIsLoadingPage(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/getBlog/${newPage}`);
      if (!response.ok) throw new Error("Page fetch failed");
      const data = await response.json();
      setPosts(data);
      setPage(newPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPage(false);
    }
  };

  const filteredPosts = posts
    .filter((post) =>
      currentSelectedTag === "" ||
      (post.tags && post.tags.hasOwnProperty(currentSelectedTag))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800">All Blogs</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">View:</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsGridView(false)}
            className={!isGridView ? "bg-gray-100" : ""}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsGridView(true)}
            className={isGridView ? "bg-gray-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 focus:outline-none"
          />
          <Button type="submit" variant="ghost" className="p-2" disabled={isSearching}>
            {isSearching ? (
              <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>

      {/* Blog list */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog items */}
        <div className="w-full lg:w-8/12">
          <div className={`${isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}`}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((postItem, index) => (
                <article
                  onClick={() => router.push(`/blog/${postItem._id}`)}
                  key={`${postItem._id}-${index}`}
                  className={`cursor-pointer ${
                    isGridView ? "flex flex-col" : "flex gap-6"
                  } bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
                >
                  <div className={`flex-1 p-4 ${isGridView ? "" : "w-2/3"}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        
                      <AvatarImage
                            src={
                              postItem?.type === "auto_news"
                              
                                ?  "https://i.pinimg.com/736x/f1/7d/db/f17ddb244e3f2f6a720e61cd3f8161fb.jpg"
                                : "https://ui-avatars.com/api/?name=" + encodeURIComponent(postItem?.author || "user")
                            }
                            alt={postItem?.author || user?.userName || "Author"}
                          />

                        <AvatarFallback>{postItem?.author?.[0] || "A"}</AvatarFallback>
                      </Avatar>
                      <span className="text-[16px] font-medium text-gray-700">
                        {postItem?.author || "Unknown Author"}
                      </span>
                    </div>

                    {postItem.title && (
                      <h3 className="text-xl font-bold text-blue-700 mb-1 line-clamp-1">
                        {postItem.title}
                      </h3>
                    )}

                    <h4 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                      {postItem?.company_name}
                    </h4>

                    <div>
                      <span>{new Date(postItem?.createdAt).toLocaleDateString()}</span>
                    </div>

                    {postItem.tags && Object.keys(postItem.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.keys(postItem.tags).map((category, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {postItem.banner_link && (
                    <div
                      className={`${
                        isGridView ? "w-full h-48" : "w-1/3 h-48"
                      } relative flex-shrink-0`}
                    >
                      <img
                        src={
                          postItem.company_name && assets[postItem.company_name]
                            ? assets[postItem.company_name].src
                            : postItem.banner_link
                        }
                        alt={postItem?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="text-center py-8">
                <h2 className="font-bold text-2xl mb-2">No Blogs Found!</h2>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* ✅ Pagination */}
          <div className="mt-8 flex justify-center gap-4">
            <Button disabled={page === 1 || isLoadingPage} onClick={() => fetchPage(page - 1)}>
              Previous
            </Button>
            <span className="text-gray-700 font-medium">Page {page}</span>
            <Button disabled={posts.length < 15 || isLoadingPage} onClick={() => fetchPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>

        {/* Sidebar with categories */}
        <div className="w-full lg:w-4/12">
          <div className="sticky top-32 space-y-8">
            <div className="shadow-md p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">
                Recommended Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {BLOG_CATEGORIES.map((tagItem) => (
                  <Button
                    key={tagItem.key}
                    className={`${
                      currentSelectedTag === tagItem.key
                        ? "bg-black text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } rounded-full text-sm font-medium border-none transition-colors duration-200`}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentSelectedTag(
                        currentSelectedTag === tagItem.key ? "" : tagItem.key
                      )
                    }
                  >
                    {tagItem.value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating create blog button */}
      <div className="fixed bottom-6 right-20 z-50 flex items-center gap-2 group">
        <div className="bg-black text-white text-base md:text-lg rounded px-3 py-1 transition-opacity duration-200 group-hover:opacity-0">
          Write new blog
        </div>
        <button
          onClick={() => router.push("/blog/create")}
          className="bg-black text-white border border-black hover:bg-white hover:text-black transition duration-300 rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 text-3xl flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>
    </main>
  );
}
