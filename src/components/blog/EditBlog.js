"use client";

import { Controller, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { UploadButton } from "@uploadthing/react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES, COMPANY_LIST } from "@/lib/config";
import DeleteBlog from "./DeleteBlog";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import "./quill-custom.css";

const blogSchema = z.object({
  title: z.string().min(1),
  company_name: z.string().min(1),
  content: z.string().min(1), // ใช้เป็น string (HTML)
  tags: z.array(z.string()).min(1),
  src_from: z.string().optional(),
  banner_link: z.string().optional(),
  type: z.string().optional(),
});

export default function EditBlogForm({ blog, user }) {
  const [isOtherCompany, setIsOtherCompany] = useState(false);
  const [otherCompanyName, setOtherCompanyName] = useState("");
  const router = useRouter();
  const quillRef = useRef(null);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog.title || "",
      company_name: COMPANY_LIST.find(c => c.key === blog.company_name)
        ? blog.company_name
        : "other",
      content: Array.isArray(blog.content) ? blog.content.join("\n") : blog.content || "",
      tags: blog.tags ? Object.keys(blog.tags) : [],
      src_from: blog.src_from || "",
      banner_link: blog.banner_link || "",
      type: blog.type || "user_blogs",
    },
  });

  const bannerLink = watch("banner_link");

  // Watch for company_name changes
  useEffect(() => {
    const company = watch("company_name");
    setIsOtherCompany(company === "other");

    if (
      company === "other" &&
      blog.company_name !== "other" &&
      !COMPANY_LIST.find(c => c.key === blog.company_name)
    ) {
      setOtherCompanyName(blog.company_name);
    }
  }, [watch("company_name")]);

  const onSubmit = async (data) => {
    const company = data.company_name === "other" ? otherCompanyName : data.company_name;
    const tagsObj = {};
    data.tags.forEach((tag) => (tagsObj[tag] = []));

    const updatedData = {
      ...data,
      _id: blog._id,
      author: blog.author,
      uid: user?.uid,
      createdAt: blog.createdAt,
      updatedAt: new Date().toISOString(),
      __v: blog.__v,
      company_name: company,
      tags: tagsObj,
    };

    console.log("✏️ Updating blog with:", updatedData);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_PATH +"/api/updateBlog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.status === 200) {
        toast({ title: "Updated", description: "Blog updated successfully", variant: "success" });
        router.push(`/blog/${blog._id}`);
      } else {
        toast({ title: "Failed", description: result.error || "Error", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update blog", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      <header className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={"https://ui-avatars.com/api/?name=" + user?.userName} alt={user?.userName}/>  
            <AvatarFallback>{user?.userName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{user?.userName}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <DeleteBlog
            blogId={blog._id}
            onDelete={() => {
              toast({ title: "Deleted", description: "Blog deleted", variant: "success" });
              router.push("/myBlog");
            }}
          />
        </div>
      </header>

      <form>
        {user?.isPremium && (
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                options={[
                  { value: "user_blogs", label: "Blog" },
                  { value: "company_reviews", label: "Company Reviews" },
                ]}
                value={{
                  value: field.value,
                  label:
                    field.value === "company_reviews" ? "Company Reviews" : "Blog",
                }}
                onChange={(opt) => field.onChange(opt?.value)}
                className="mb-4"
              />
            )}
          />
        )}

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Title" className="text-4xl font-bold mb-4" />
          )}
        />

        <Controller
          name="company_name"
          control={control}
          render={({ field }) => (
            <Select
              options={[
                ...COMPANY_LIST.map(c => ({ value: c.key, label: c.value })),
                { value: "other", label: "Other" },
              ]}
              value={{
                value: field.value,
                label:
                  COMPANY_LIST.find(c => c.key === field.value)?.value || "Other",
              }}
              onChange={(opt) => field.onChange(opt?.value)}
              className="mb-2"
            />
          )}
        />

        {isOtherCompany && (
          <Input
            value={otherCompanyName}
            onChange={(e) => setOtherCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="mb-4"
          />
        )}

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Select
              isMulti
              options={BLOG_CATEGORIES.map(cat => ({ value: cat.key, label: cat.value }))}
              value={field.value.map(val => ({
                value: val,
                label: BLOG_CATEGORIES.find(cat => cat.key === val)?.value || val,
              }))}
              onChange={(opts) => field.onChange(opts.map(o => o.value))}
              className="mb-4"
            />
          )}
        />

        <Controller
          name="src_from"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Source (optional)" className="mb-4" />
          )}
        />

        <div className="mb-6">
          <UploadButton
            endpoint="imageUploader"
            content={{
              button: (
                <div className="flex gap-2">
                  <PlusCircle className="h-4 w-4 text-white" />
                  <span className="text-xs">Change Cover Image</span>
                </div>
              ),
            }}
            className="ut-button:bg-black"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setValue("banner_link", res[0].url);
                toast({ title: "Image Uploaded" });
              }
            }}
            onUploadError={(err) =>
              toast({ title: "Upload Failed", description: err.message })
            }
          />
          {bannerLink && (
            <img
              src={bannerLink}
              alt="Banner"
              className="mt-4 w-full max-h-[300px] object-cover rounded-lg"
            />
          )}
        </div>

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <ReactQuill
              ref={quillRef}
              value={field.value}
              onChange={(val) => field.onChange(val)}
              placeholder="Write something..."
              className="quill-editor"
            />
          )}
        />
      </form>
    </div>
  );
}
