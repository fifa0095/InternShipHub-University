import { connectToDatabase } from "@/lib/db";
import User from "@/models/User"; // Use User model for database interactions
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Load database connection
const LoadDB = async () => {
  await connectToDatabase();
};

// API for fetching resume data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to DB and fetch user
    await LoadDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.resume); // Return resume data
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// API for uploading resume data
export async function POST(request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    // Ensure the resume file is present
    const resumeFile = formData.get("resume");
    if (!resumeFile) {
      return NextResponse.json({ error: "No resume file found in the request" }, { status: 400 });
    }

    // Ensure required fields are present
    const educational = formData.get("educational");
    const skill = formData.get("skill");
    const experience = formData.get("experience");
    const userId = formData.get("userId");

    if (!educational || !skill || !experience || !userId) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Handle the resume file (save it)
    const resumeFileName = resumeFile.name || `resume_${timestamp}`;
    const resumeFileByteData = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(resumeFileByteData);

    const publicDir = path.join(process.cwd(), "public/uploads");
    const filePath = `${publicDir}/${timestamp}_${resumeFileName}`;

    // Ensure the upload directory exists
    await mkdir(publicDir, { recursive: true });

    await writeFile(filePath, buffer);

    const resumeFileUrl = `/uploads/${timestamp}_${resumeFileName}`;

    // Prepare the resume data
    const resumeData = {
      educational,
      skill,
      experience,
      file: resumeFileUrl,
    };

    // Connect to DB and find the user
    await LoadDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add resume to user data and save
    user.resume.push(resumeData);
    await user.save();

    return NextResponse.json(
      { success: true, msg: "Resume uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST API:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
