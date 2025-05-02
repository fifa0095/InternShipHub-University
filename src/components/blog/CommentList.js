"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CommentList({ postId, userId }) {
  console.log("user Id: ",userId )
  console.log("Post Id: ",postId )
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const res = await fetch(`http://localhost:8080/api/comments/blog/${postId}`);
      const data = await res.json();
      setComments(data || []);
    } catch (e) {
      console.error("Failed to fetch comments", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId) {
    try {
      const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Deleted", description: "Comment deleted successfully." });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (e) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading comments...</p>;
  }

  return (
    <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="border-b py-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar>
                  <AvatarFallback>
                    {comment?.username.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{comment?.username || "Anonymous"}</p> {/* ใช้ name จาก populate */}
              </div>

              {/* แสดงปุ่มลบเฉพาะเจ้าของคอมเมนต์ */}
              {comment?.uid?._id === userId && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(comment._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            <p className="text-gray-800 whitespace-pre-line">
              {Array.isArray(comment.content)
                ? comment.content.join("\n")
                : comment.content}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}
