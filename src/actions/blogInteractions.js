"use server";
import { commentRules, searchRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Comment is required"),
  postId: z.string().min(1, "Post Id is required"),
});

export async function addCommentAction({ postId, content }) {
  try {
    // เช็คว่า content ต้องเป็น Array
    if (!Array.isArray(content)) {
      content = [content]; // แปลงเป็น Array ถ้าไม่ใช่
    }

    const res = await fetch("http://localhost:8080/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // แนบ token ถ้าต้องการ
        // "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        blog_id: postId,
        content,  // content เป็น Array
        // uid ควรจะดึงจาก token หรือ session ของผู้ใช้
        uid: "userIdFromToken", // สมมุติว่า uid ได้จากการยืนยันตัวตนของผู้ใช้
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data?.message || "Failed to add comment",
        status: res.status,
      };
    }

    return {
      success: true,
      message: "Comment added successfully",
      data,
    };
  } catch (err) {
    console.error("Error adding comment:", err);
    return {
      error: "Network error or server not responding",
    };
  }
}

export async function searchPostsAction(query) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return {
      error: "Unauth user",
      status: 401,
    };
  }

  try {
    const req = await request();
    const decision = await searchRules.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      console.log(decision, "decision", decision.isDenied());

      if (decision.reason.isRateLimit()) {
        return {
          error: "Rate limit excedeed! Please try after some time",
          status: 429,
        };
      }

      if (decision.reason.isBot()) {
        return {
          error: "Bot activity detected",
        };
      }
      return {
        error: "Request denied",
        status: 403,
      };
    }

    await connectToDatabase();
    const posts = await BlogPost.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .populate("author", "name")
      .lean()
      .exec();
    const serializedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      coverImage: post.coverImage,
      author: {
        _id: post.author._id.toString(),
        name: post.author.name,
      },
      category: post.category,
      createdAt: post.createdAt.toISOString(),
    }));
    return {
      success: true,
      posts: serializedPosts,
    };
  } catch (e) {
    console.log(e);

    return {
      error: "Some error occured while search! Please try after some time!",
    };
  }
}
