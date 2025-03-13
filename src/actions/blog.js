import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { z } from "zod";

const blogPostSchema = z.object({
  title: z.string().min(1, "กรุณาระบุชื่อบทความ"),
  content: z.string().min(1, "กรุณาระบุเนื้อหาบทความ"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  coverImage: z.string().min(1, "กรุณาอัปโหลดรูปภาพหน้าปก"),
});

export async function createBlogPostAction(data) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return {
      error: "คุณไม่ได้รับอนุญาตให้สร้างบทความ กรุณาเข้าสู่ระบบ",
      status: 401,
    };
  }

  const validateFields = blogPostSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      error: validateFields.error.errors[0].message,
    };
  }

  const { title, coverImage, content, category } = validateFields.data;

  try {
    const req = await request();
    const headersList = await headers();
    const isSuspicious = headersList.get("x-arcjet-suspicious") === "true";

    const decision = await blogPostRules.protect(req, {
      shield: {
        params: { title, content, isSuspicious },
      },
      requested: 10,
    });

    if (decision.isErrored()) {
      return {
        error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล โปรดลองอีกครั้ง",
      };
    }

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return {
          error: "ไม่สามารถสร้างบทความได้ ตรวจพบเนื้อหาที่อาจเป็นอันตราย",
        };
      }

      if (decision.reason.isBot()) {
        return {
          error: "ไม่สามารถสร้างบทความได้ ระบบตรวจพบพฤติกรรมของบอท",
        };
      }

      return {
        error: "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ",
        status: 403,
      };
    }

    await connectToDatabase();
    const post = new BlogPost({
      title,
      content,
      author: user.userId,
      coverImage,
      category,
      comments: [],
      upvotes: [],
    });

    await post.save();
    revalidatePath("/");

    return {
      success: true,
      post,
    };
  } catch (e) {
    return {
      error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล โปรดลองอีกครั้ง",
    };
  }
}

export async function getBlogPostsAction() {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return {
      error: "คุณไม่ได้รับอนุญาตให้ดูบทความ กรุณาเข้าสู่ระบบ",
      status: 401,
    };
  }

  try {
    const req = await request();
    const decision = await blogPostRules.protect(req, { requested: 10 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          error: "มีการเรียกใช้งานบ่อยเกินไป กรุณาลองใหม่ภายหลัง",
          status: 429,
        };
      }

      if (decision.reason.isBot()) {
        return {
          error: "ไม่สามารถดึงข้อมูลบทความได้ ระบบตรวจพบพฤติกรรมของบอท",
        };
      }

      return {
        error: "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ",
        status: 403,
      };
    }

    await connectToDatabase();

    const posts = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .populate("author", "name");

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
    return {
      error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ โปรดลองอีกครั้ง",
    };
  }
}

export async function getBlogPostByIdAction(id) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return {
      error: "คุณไม่ได้รับอนุญาตให้ดูบทความ กรุณาเข้าสู่ระบบ",
      status: 401,
    };
  }

  try {
    const req = await request();
    const decision = await blogPostRules.protect(req, { requested: 5 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          error: "มีการเรียกใช้งานบ่อยเกินไป กรุณาลองใหม่ภายหลัง",
          status: 429,
        };
      }

      if (decision.reason.isBot()) {
        return {
          error: "ไม่สามารถดึงข้อมูลบทความได้ ระบบตรวจพบพฤติกรรมของบอท",
        };
      }

      return {
        error: "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ",
        status: 403,
      };
    }

    await connectToDatabase();
    const post = await BlogPost.findOne({ _id: id }).populate("author", "name");

    return {
      success: true,
      post: JSON.stringify(post),
    };
  } catch (e) {
    return {
      error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ โปรดลองอีกครั้ง",
    };
  }
}
