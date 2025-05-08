'use client';
import { useAuth } from "@/components/Layout/context";
import CommentSection from "@/components/blog/CommentSection";

export default function ClientCommentSection({ postId }) {
  const { user } = useAuth();

  return <CommentSection user={user} postId={postId} />;
}
