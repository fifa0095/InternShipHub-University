"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommentList from "./CommentList";
import Link from "next/link";

export default function CommentSection({ user, postId }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Validation",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_PATH + "/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_id: postId,
          uid: user.userId,
          content: [content],
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

      setContent("");
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
    <div className="mt-6">
      {/* ฟอร์มหรือแจ้งเตือนขึ้นกับสถานะ login */}
      {user ? (
        <form onSubmit={handleSubmit}>
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
        </form>
      ) : (
        <div className="text-gray-600 text-center p-4 border rounded-md bg-gray-50">
          <p>
            กรุณา{" "}
            <Link href="/login" className="text-blue-600 underline">
              เข้าสู่ระบบ
            </Link>{" "}
            เพื่อแสดงความคิดเห็น
          </p>
        </div>
      )}

      {/* แสดง CommentList เสมอ */}
      <CommentList postId={postId} userId={user?.userId} />
    </div>
  );
}
