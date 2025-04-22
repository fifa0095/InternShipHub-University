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
      type: user?.isPremium ? "" : "Blog",
    },
  });

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

    const companyNameToUse =
      data.company_name === "other" ? otherCompanyName : data.company_name;

    const tagsObject = {};
    data.tags.forEach((tag) => {
      tagsObject[tag] = [];
    });

    try {
      const response = await fetch("http://localhost:8080/api/createBlog", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          company_name: companyNameToUse,
          content: Array.isArray(data.content) ? data.content : [data.content],
          tags: tagsObject,
          type: user?.isPremium ? data.type || "Blog" : "Blog",
          author: user?.userName ?? "anonymous",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: "Success", description: result.success });
        router.push("/");
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (e) {
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
            <AvatarImage src="https://i.pinimg.com/736x/43/0c/53/430c53ef3a97464b81b24b356ed39d32.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{user?.userName}</p>
        </div>
        <Button
          disabled={
            !watch("title") ||
            !watch("content").length ||
            (!watch("tags")?.length) ||
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
          {/* Type */}
          {user?.isPremium && (
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { value: "Blog", label: "Blog" },
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

          {/* Title */}
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

          {/* Company */}
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

          {/* Tags */}
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

          {/* Source */}
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

          {/* Banner Upload */}
          <div className="flex items-center mb-6">
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
          </div>

          {/* Content */}
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
