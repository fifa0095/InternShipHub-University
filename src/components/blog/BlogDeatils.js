"use client";

import { MessageCircleIcon, Loader2, TagIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCommentAction } from "@/actions/blogInteractions";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  content: z.string().min(1, "Comment is required"),
});

function BlogDetails({ post }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();

  async function onCommentSubmit(data) {
    setIsLoading(true);
    try {
      const result = await addCommentAction({ ...data, postId: post._id });
      if (result.success) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post?.title}</h1>

        {/* Category */}
        {post?.tags && (
  <div className="flex items-center space-x-2 mb-4 flex-wrap">
    <TagIcon className="h-5 w-5 text-blue-500" />
    <div className="flex flex-wrap gap-2">
      {Array.isArray(post.tags)
        ? post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))
        : post.tags.split(",").map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag.trim()}
            </span>
          ))}
    </div>
  </div>
)}


        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{post?.author?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-medium">{post?.author?.name}</p>
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
          className="w-full h-full object-cover rounded-lg mb-8"
          alt="Cover Image"
        />
      )}

      {/* Blog Content */}
      <article className="prose lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
      </article>

      {/* Comment Form */}
      <form onSubmit={handleSubmit(onCommentSubmit)} className="mt-10">
        <Textarea
          placeholder="Add a comment..."
          className="w-full mb-4"
          rows={4}
          {...register("content")}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Comment"
          )}
        </Button>
      </form>

      {/* Comment List */}
      <div className="my-8">
        <h3 className="text-xl font-bold mb-4">
          Comments ({post?.comments?.length || 0})
        </h3>

        {post?.comments?.length > 0 ? (
          post?.comments?.map((comment, index) => (
            <div key={index} className="border-b py-4">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar>
                  <AvatarFallback>
                    {comment?.authorName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{comment.authorName || "Anonymous"}</p>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
