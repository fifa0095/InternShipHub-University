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
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES, COMPANY_LIST } from "@/lib/config";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import "./quill-custom.css";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company_name: z.string().min(1, "Company name is required"),
  content: z.array(z.string()).min(1, "Content is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  src_from: z.string().optional(),
  banner_link: z.string().optional(),
  type: z.string().optional(),
});

function CreateBlogForm({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtherCompany, setIsOtherCompany] = useState(false);
  const [otherCompanyName, setOtherCompanyName] = useState("");
  const quillRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();
  // console.log( user )

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      company_name: "",
      content: [],
      tags: [],
      src_from: "",
      banner_link: "",
      type: user?.type === "admin" ? "" : "user_blogs",
    },
  });

  const bannerLink = watch("banner_link");
  const typeValue = watch("type");

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "company_name") {
        setIsOtherCompany(value.company_name === "other");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onBlogSubmit = async (data) => {
    setIsLoading(true);
    console.log("data :", data);

    const companyNameToUse =
      data.company_name === "other" ? otherCompanyName : data.company_name;

    let tagsObject = {};
    if (data.type === "company_reviews") {
      tagsObject = { NODATA: "" };
    } else {
      (data.tags || []).forEach((tag) => {
        tagsObject[tag] = [];
      });
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_PATH +"/api/createBlog", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          company_name: companyNameToUse,
          content: Array.isArray(data.content) ? data.content : [data.content],
          tags: tagsObject,
          type: user?.type === "admin" ? data.type || "user_blogs" : "user_blogs",
          author: user?.userId,
        }),
      });

      const result = await response.json();
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Your blog has been successfully published! You can view it now.",
          variant: "success",
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error occurred during submission:", e);
      toast({ title: "Error", description: "Submission failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={"https://ui-avatars.com/api/?name=" + user?.userName} alt={user?.userName}/>  
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{user?.userName}</p>
        </div>
        <Button
          disabled={
            !watch("title") ||
            !watch("content").length ||
            (typeValue !== "company_reviews" && !watch("tags")?.length) ||
            (watch("company_name") === "other" && !otherCompanyName) ||
            isLoading
          }
          onClick={handleSubmit(onBlogSubmit)}
        >
          Publish
        </Button>
      </header>

      <main>
        <form>
          {user?.type === "admin" && (
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { value: "user_blogs", label: "Blog" },
                    { value: "company_reviews", label: "Company Reviews" },
                  ]}
                  value={field.value ? { value: field.value, label: field.value } : null}
                  onChange={(option) => field.onChange(option?.value)}
                  placeholder="Select Type"
                  className="mb-4"
                />
              )}
            />
          )}

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Title"
                className="text-4xl font-bold mb-4 border-none outline-none focus:ring-0"
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}

          <Controller
            name="company_name"
            control={control}
            render={({ field }) => {
              const selected = COMPANY_LIST.find((c) => c.key === field.value) || (field.value === "other" ? { key: "other", value: "Other" } : null);
              return (
                <Select
                  options={[
                    ...COMPANY_LIST.map((c) => ({ value: c.key, label: c.value })),
                    { value: "other", label: "Other" },
                  ]}
                  value={selected ? { value: selected.key, label: selected.value } : null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  placeholder="Select a Company..."
                  isClearable
                  className="mb-2"
                />
              );
            }}
          />
          {isOtherCompany && (
            <Input
              value={otherCompanyName}
              onChange={(e) => setOtherCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="mb-4"
            />
          )}
          {errors.company_name && <p className="text-red-600 text-sm">{errors.company_name.message}</p>}

          {typeValue !== "company_reviews" && (
            <>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={BLOG_CATEGORIES.map((t) => ({ value: t.key, label: t.value }))}
                    value={field.value.map((val) => ({
                      value: val,
                      label: BLOG_CATEGORIES.find((cat) => cat.key === val)?.value || val,
                    }))}
                    onChange={(options) => field.onChange(options.map((opt) => opt.value))}
                    className="mb-4"
                  />
                )}
              />
              {errors.tags && <p className="text-red-600 text-sm">{errors.tags.message}</p>}
            </>
          )}

          <Controller
            name="src_from"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Source (Optional)"
                className="mb-4 border-none outline-none focus:ring-0"
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />

          <div className="flex flex-col items-start mb-6">
            <UploadButton
              endpoint="imageUploader"
              content={{
                button: (
                  <div className="flex gap-2">
                    <PlusCircle className="h-4 w-4 text-white" />
                    <span className="text-xs">Add Cover Image</span>
                  </div>
                ),
              }}
              className="mt-4 ut-button:bg-black ut-button:ut-readying:bg-black"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setValue("banner_link", res[0].url);
                  toast({ title: "Success", description: "Image uploaded" });
                }
              }}
              onUploadError={(error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
              }}
            />
            {bannerLink && (
              <div className="mt-4 w-full">
                <img
                  src={bannerLink}
                  alt="Uploaded Banner"
                  className="w-full max-h-[300px] object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={field.value.join("\n")}
                onChange={(val) => {
                  const lines = val.split("\n").filter((line) => line.trim() !== "");
                  field.onChange(lines);
                }}
                placeholder="Write your story..."
                className="quill-editor"
              />
            )}
          />
          {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
        </form>
      </main>
    </div>
  );
}

export default CreateBlogForm;
