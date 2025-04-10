"use client";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { BLOG_CATEGORIES } from "@/lib/config";
import { useRouter } from "next/navigation";
import { assets } from "@/Assets/assets";

export default function HomeComponent({ posts }) {
  const [isGridView, setIsGridView] = useState(false);
  const [currentSelectedTag, setCurrentSelectedTag] = useState("");
  const router = useRouter();

  const filteredPosts =
    posts && posts.length > 0
      ? currentSelectedTag === ""
        ? posts
        : posts.filter(
            (postItem) =>
              postItem.tags && postItem.tags.hasOwnProperty(currentSelectedTag)
          )
      : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
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
            onClick={() => setIsGridView(true)}
            size="icon"
            className={isGridView ? "bg-gray-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-8/12">
          <div className={`${isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}`}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((postItem) => (
                <article
                  onClick={() => router.push(`/blog/${postItem._id}`)}
                  key={postItem._id}
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
                              ? "https://i.pinimg.com/736x/f1/7d/db/f17ddb244e3f2f6a720e61cd3f8161fb.jpg"
                              : "https://i.pinimg.com/736x/50/f2/91/50f2915c4f23c9643efb1c8f05020f2b.jpg"
                          }
                          alt={postItem?.author || "Author"}
                        />
                        <AvatarFallback>
                          {postItem?.author ? postItem.author[0] : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[16px] font-medium text-gray-700">
                        {postItem?.author || "Unknown Author"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                      {postItem?.title}
                    </h3>
                    <div>
                      <span>{new Date(postItem?.createdAt).toLocaleDateString()}</span>
                    </div>
                    {postItem.tags && Object.keys(postItem.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.keys(postItem.tags).map((category, index) => (
                          <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {postItem.banner_link && (
                    <div className={`${isGridView ? "w-full h-48" : "w-1/3 h-full"} relative`}>
                      <img
                        src={postItem.banner_link}
                        alt={postItem?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </article>
              ))
            ) : (
              <h2 className="font-bold text-4xl">No Blogs Found!</h2>
            )}
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          <div className="sticky top-32 space-y-8">
            <div className="shadow-md p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">Recommended Category</h3>
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
                      setCurrentSelectedTag(currentSelectedTag === tagItem.key ? "" : tagItem.key)
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
    </main>
  );
}
