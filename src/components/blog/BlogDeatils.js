"use client";
// src/components/blog/BlogDetails.js
import { MessageCircleIcon, TagIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

function BlogDetails({ post }) {
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post?.title}</h1>

        {/* Category */}
        {post?.tag && post.tag.length > 0 && (
          <div className="flex items-center space-x-2 mb-4 flex-wrap">
            <TagIcon className="h-5 w-5 text-blue-500" />
            <div className="flex flex-wrap gap-2">
              {post.tag.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://i.pinimg.com/736x/42/b5/76/42b57666dbe879a032955b85c5dcdcd5.jpg" />
            <AvatarFallback>{post?.author?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-medium">{post?.author}</p>
            {post?.company_name && (
              <p className="text-gray-500 text-sm">{post.company_name}</p>
            )}
          </div>
          <div className="flex items-center my-8">
            <Button variant="ghost" size="sm">
              <MessageCircleIcon className="h-6 w-6" />
              <span className="ml-2">{post?.comments?.length || 0}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post?.banner_link && (
        <img
          src={post?.banner_link}
          className="w-full max-w-[800px] max-h-[400px] object-cover rounded-lg mb-8 mx-auto"
          alt="Cover Image"
        />
      )}

      {/* Blog Content */}
      <article className="prose lg:prose-xl whitespace-pre-line mb-8">
        {post?.type === "auto_news" ? (
          post?.content && Array.isArray(post.content) ? (
            post.content.map((section, index) => (
              <p key={index} className="mb-4">
                {Array.isArray(section) ? section.join("\n") : section}
              </p>
            ))
          ) : (
            "No content available"
          )
        ) : post?.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          "No content available"
        )}
      </article>

      {/* Source Link */}
      {post?.src_from && (
        <div className="text-center my-4">
          <a
            href={post.src_from}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read the original post here
          </a>
        </div>
      )}
    </div>
  );
}

export default BlogDetails;
