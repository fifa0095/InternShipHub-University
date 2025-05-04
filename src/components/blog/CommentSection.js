"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommentList from "./CommentList";

export default function CommentSection({ user, postId }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return <p className="text-gray-500 mt-4">You must be logged in to comment.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({ title: "Validation", description: "Comment cannot be empty", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(process.env.API_PATH + "/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: postId,
          uid: user.userId, // ส่ง userId
          content: [content], // content เป็น array
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to submit comment");
      }

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setContent(""); // รีเซ็ตข้อความ
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={4}
        className="mb-4"
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

      {/* ส่งข้อมูล user ไปให้ CommentList */}
      
      <CommentList postId={postId} userId={user.userId} />
    </form>
  );
}
