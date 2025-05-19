"use client";
import { useState, useEffect } from "react";
import { BuildingIcon, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

export default function CompanyBlogsComponent() {
  const [posts, setPosts] = useState([]);
  const [isGridView, setIsGridView] = useState(false); // 👈 default list view
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + "/api/getReview");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => post.type === "company_reviews");

  return (
    <main className="w-full min-h-screen px-4 sm:px-10 lg:px-16 xl:px-24 pt-20 pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <BuildingIcon className="w-8 h-8 text-blue-500" /> Explore Company
        </h2>
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

      {/* Blog Items */}
      <div
        className={`${
          isGridView
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
        }`}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((postItem) => (
            <article
              onClick={() => router.push(`/blog/${postItem._id}`)}
              key={postItem._id}
              className={`cursor-pointer ${
                isGridView ? "flex flex-col" : "flex gap-6"
              } bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
            >
              {/* Image */}
              <div className={`${isGridView ? "w-full h-48" : "w-1/3 h-full"} relative`}>
                <img
                  src={postItem?.banner_link}
                  alt={postItem?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className={`flex-1 p-4 ${isGridView ? "" : "w-2/3"}`}>
                {/* Tag */}
                {postItem.tags && (
                  <div className="flex items-center space-x-2 mb-2">
                    <BuildingIcon className="h-5 w-5 text-blue-500" />
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      Explore Company
                    </span>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={
                        postItem?.author_avatar ||
                        "https://ui-avatars.com/api/?name=" + postItem?.author
                      }
                      alt={postItem?.author}
                    />
                    <AvatarFallback>
                      {postItem?.author?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">
                    {postItem?.author}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
                  {postItem?.title}
                </h3>
              </div>
            </article>
          ))
        ) : (
          <h2 className="font-bold text-2xl text-center text-gray-600">
            No Company Reviews Found!
          </h2>
        )}
      </div>
    </main>
  );
}
