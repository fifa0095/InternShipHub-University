import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModels";
import { NextResponse } from "next/server"; // แก้ไขการนำเข้า
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function GET(request) {
  return NextResponse.json({ msg: "API Working" }, { status: 200 });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    // Validate image existence
    const image = formData.get("image");
    if (!image) {
      return NextResponse.json(
        { error: "No image file found in the request" },
        { status: 400 }
      );
    }

    // Validate other required form data fields
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImg = formData.get("authorImg");

    if (!title || !description || !category || !author) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Handle the image file
    const imageName = image.name || `image_${timestamp}`;
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    const publicDir = path.join(process.cwd(), "public/uploads");
    const filePath = `${publicDir}/${timestamp}_${imageName}`;

    // Ensure directory exists
    await mkdir(publicDir, { recursive: true });

    await writeFile(filePath, buffer);

    const imgUrl = `/uploads/${timestamp}_${imageName}`;

    // Handle authorImg if it's a file
    let authorImgUrl = "";
    if (authorImg && authorImg.size > 0) {
      const authorImgName = `authorImg_${timestamp}_${authorImg.name}`;
      const authorImgByteData = await authorImg.arrayBuffer();
      const authorImgBuffer = Buffer.from(authorImgByteData);

      const authorImgPath = path.join(publicDir, authorImgName);
      await writeFile(authorImgPath, authorImgBuffer);

      authorImgUrl = `/uploads/${authorImgName}`;
    }

    // Prepare blog data
    const blogData = {
      title: title,
      description: description,
      category: category,
      author: author,
      image: imgUrl,
      authorImg: authorImgUrl, // Use URL for authorImg
    };

    // Save blog to the database
    await BlogModel.create(blogData);
    console.log("Blog Saved");

    return NextResponse.json(
      { success: true, msg: "Blog added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST API:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
