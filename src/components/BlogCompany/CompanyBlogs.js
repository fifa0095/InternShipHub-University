"use client";
import { BuildingIcon, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

export default function CompanyBlogsComponent({ posts }) {
  const [isGridView, setIsGridView] = useState(false);
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <BuildingIcon className="w-8 h-8 text-blue-500" /> Company Reviews
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blogs Section */}
        <div className="w-full lg:w-8/12">
          <div
            className={`${
              isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"
            }`}
          >
            {posts.length > 0 ? (
              posts.map((postItem) => (
                <article
                  onClick={() => router.push(`/blog/${postItem._id}`)}
                  key={postItem._id}
                  className={`cursor-pointer ${
                    isGridView ? "flex flex-col" : "flex gap-6"
                  } bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
                >
                  {/* Cover Image */}
                  <div
                    className={`${
                      isGridView ? "w-full h-48" : "w-1/3 h-full"
                    } relative`}
                  >
                    <img
                      src={postItem?.banner_link}
                      alt={postItem?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className={`flex-1 p-4 ${isGridView ? "" : "w-2/3"}`}>
                    {/* tags Badge */}
                    {postItem.tags && (
                      <div className="flex items-center space-x-2 mb-2">
                        <BuildingIcon className="h-5 w-5 text-blue-500" />
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          Company Review
                        </span>
                      </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {postItem?.author?.name[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[16px] font-medium text-gray-700">
                        {postItem?.author?.name}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                      {postItem?.title}
                    </h3>

                    {/* Date */}
                    <div>
                      <span>
                        {new Date(postItem?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <h2 className="font-bold text-2xl text-center text-gray-600">
                No Company Reviews Found!
              </h2>
            )}
          </div>
        </div>

        {/* Sidebar for Latest Company Reviews */}
        <div className="w-full lg:w-4/12">
          <div className="sticky top-32 space-y-8">
            <div className="rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">
                Latest Company Reviews
              </h3>
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.slice(0, 4).map((postItem) => (
                    <div
                      onClick={() => router.push(`/blog/${postItem._id}`)}
                      key={postItem._id}
                      className="flex items-start space-x-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {postItem?.author?.name[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium line-clamp-2 text-gray-800">
                          {postItem?.title}
                        </h4>
                        <div className="flex items-start space-x-2 text-xs text-gray-500">
                          <span className="text-[16px] font-bold">
                            {postItem?.author?.name}
                          </span>
                          <span className="text-[12px] font-medium text-black ml-1">
                            {new Date(postItem?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No recent reviews available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
