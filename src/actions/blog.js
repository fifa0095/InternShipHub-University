import { blogPostRules } from "@/lib/arcjet";
import { verifyAuth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Blog from "@/models/BlogPost"; // ใช้ Schema ใหม่
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { z } from "zod";

// Validation Schema (Updated)
const blogSchema = z.object({
  title: z.string().min(1, "กรุณาระบุชื่อบทความ"),
  content: z.array(z.string()).min(1, "กรุณาระบุเนื้อหาบทความ"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  company_name: z.string().optional(),
  src_from: z.string().optional(),
  banner_link: z.string().optional(),
});

// ✅ Create Blog Post
export async function createBlogPostAction(data) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return {
      error: "คุณไม่ได้รับอนุญาตให้สร้างบทความ กรุณาเข้าสู่ระบบ",
      status: 401,
    };
  }

  const validateFields = blogSchema.safeParse(data);
  if (!validateFields.success) {
    return { error: validateFields.error.errors[0].message };
  }

  const { title, content, tags, coverImage, company_name, src_from, banner_link } = validateFields.data;

  try {
    const req = await request();
    const headersList = await headers();
    const isSuspicious = headersList.get("x-arcjet-suspicious") === "true";

    const decision = await blogPostRules.protect(req, {
      shield: { params: { title, content, isSuspicious } },
      requested: 10,
    });

    if (decision.isDenied()) {
      return {
        error: decision.reason.isShield()
          ? "ไม่สามารถสร้างบทความได้ ตรวจพบเนื้อหาที่อาจเป็นอันตราย"
          : "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ",
        status: 403,
      };
    }

    await connectToDatabase();
    const post = new Blog({
      title,
      content,
      author: user.userId,
      tags,
      coverImage,
      company_name,
      src_from,
      banner_link,
      comments: [],
      upvotes: [],
    });

    await post.save();
    revalidatePath("/");

    return { success: true, post };
  } catch (e) {
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล โปรดลองอีกครั้ง" };
  }
}

// ✅ Get All Blog Posts
export async function getBlogPostsAction() {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return { error: "คุณไม่ได้รับอนุญาตให้ดูบทความ กรุณาเข้าสู่ระบบ", status: 401 };
  }

  try {
    const req = await request();
    const decision = await blogPostRules.protect(req, { requested: 10 });

    if (decision.isDenied()) {
      return { error: "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ", status: 403 };
    }

    await connectToDatabase();
    const posts = await Blog.find({}).sort({ createdAt: -1 }).populate("author", "name");

    const serializedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      coverImage: post.coverImage,
      author: { _id: post.author._id.toString(), name: post.author.name },
      tags: post.tags,
      company_name: post.company_name,
      createdAt: post.createdAt.toISOString(),
    }));

    return { success: true, posts: serializedPosts };
  } catch (e) {
    return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ โปรดลองอีกครั้ง" };
  }
}

// ✅ Get Blog Post by ID
export async function getBlogPostByIdAction(id) {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  if (!user) {
    return { error: "คุณไม่ได้รับอนุญาตให้ดูบทความ กรุณาเข้าสู่ระบบ", status: 401 };
  }

  try {
    const req = await request();
    const decision = await blogPostRules.protect(req, { requested: 5 });

    if (decision.isDenied()) {
      return { error: "ไม่สามารถดำเนินการได้ คำขอถูกปฏิเสธ", status: 403 };
    }

    await connectToDatabase();
    const post = await Blog.findOne({ _id: id }).populate("author", "name");

    return { success: true, post: JSON.stringify(post) };
  } catch (e) {
    return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ โปรดลองอีกครั้ง" };
  }
}
