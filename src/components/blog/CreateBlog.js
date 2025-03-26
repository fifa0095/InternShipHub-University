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
import Select from "react-select"; // เปลี่ยนเป็น react-select
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import "./quill-custom.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES, COMPANY_LIST } from "@/lib/config";

// Schema สำหรับ Form Validation
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company_name: z.string().optional(), // เพิ่ม field สำหรับ company_name
  content: z.array(z.string()).min(1, "Content is required"), // เปลี่ยนเป็น array
  tags: z.array(z.string()).min(1, "At least one tag is required"), // อนุญาตให้เป็น array
  src_from: z.string().optional(),
  banner_link: z.string().optional(),
});

function CreateBlogForm({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // ใช้จัดการค่าของ tags
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
    },
  });

  const title = watch("title");
  const content = watch("content");

  // ฟังก์ชันเมื่อผู้ใช้เลือก Tags
  const handleTagChange = (selectedOptions) => {
    console.log("Selected Tags:", selectedOptions); // Log selected tags
    const tagValues = selectedOptions.map((option) => option.value);
    setSelectedTags(tagValues);
    setValue("tags", tagValues);
  };

  // ใช้ useEffect เพื่อเลื่อนการตั้งค่า selectedTags หลังจากที่การเรนเดอร์เสร็จสิ้น
  useEffect(() => {
    console.log("Tags watch:", watch("tags")); // Log the watched tags
    setSelectedTags(watch("tags"));
  }, [watch("tags")]);


  const onBlogSubmit = async (data) => {
    console.log("Form Data Before Submit:", data); // Debugging
  
    setIsLoading(true);
    try {
      const result = await fetch("/api/create-blog-post", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          content: Array.isArray(data.content) ? data.content : [data.content], // ตรวจสอบให้แน่ใจว่าเป็น array
        }),
      }).then((res) => res.json());
  
      console.log("Submit Result:", result);
  
      if (result.success) {
        toast({
          title: "Success",
          description: result.success,
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error occurred:", e);
      toast({
        title: "Error",
        description: "Some error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.userName}</p>
          </div>
        </div>
        <Button disabled={!title || !content || selectedTags.length === 0 || isLoading} onClick={handleSubmit(onBlogSubmit)}>
          Publish
        </Button>
      </header>

      <main>
        <form>
          {/* Input สำหรับ Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Title" className="text-4xl font-bold border-none outline-none mb-4 p-0 focus-visible:ring-0" />
            )}
          />
          {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title.message}</p>}
 
          {/* เพิ่ม Input สำหรับ Company Name */}
          <Controller
  name="company_name"
  control={control}
  render={({ field }) => {
    const selectedCompany = COMPANY_LIST.find((company) => company.key === field.value);
    return (
      <div>
        <Select
          options={COMPANY_LIST.map((company) => ({
            value: company.key,
            label: company.value,
          }))}
          className="mb-4"
          value={selectedCompany ? { value: selectedCompany.key, label: selectedCompany.value } : null}
          onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : "")}
          placeholder="Select a Company..."
          isClearable
        />
        {/* {selectedCompany && (
          <p className="text-sm text-gray-700 mt-2">Selected: {selectedCompany.value}</p>
        )} */}
      </div>
    );
  }}
/>
{errors.company_name && <p className="text-sm text-red-600 mt-2">{errors.company_name.message}</p>}

          {/* ใช้ react-select เพื่อเลือกหลาย tags */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div>
                {/* react-select */}
                <Select
                  isMulti
                  options={BLOG_CATEGORIES.map((tagsItem) => ({
                    value: tagsItem.key,
                    label: tagsItem.value,
                  }))}
                  className="mb-4"
                  value={BLOG_CATEGORIES.filter((tagsItem) =>
                    field.value.includes(tagsItem.key)
                  ).map((item) => ({
                    value: item.key,
                    label: item.value,
                  }))}
                  onChange={(selectedOptions) => {
                    console.log("Tag Selected:", selectedOptions); // Log the selected tags from react-select
                    field.onChange(selectedOptions.map((option) => option.value));
                  }}
                />
              </div>
            )}
          />
          {errors.tags && <p className="text-sm text-red-600 mt-2">{errors.tags.message}</p>}

          {/* Input สำหรับแหล่งที่มา */}
          <Controller
            name="src_from"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Source (Optional)" className="text-xl font-normal border-none outline-none mb-4 p-0 focus-visible:ring-0" />
            )}
          />

          {/* Input สำหรับเพิ่มรูปภาพ */}
          <div className="flex items-center mb-6">
            <UploadButton
              content={{
                button: (
                  <div className="flex gap-3">
                    <PlusCircle className="h-4 w-4 text-white" />
                    <span className="text-[12px]">Add Cover Image</span>
                  </div>
                ),
              }}
              className="mt-4 ut-button:bg-black ut-button:ut-readying:bg-black"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Image Upload Result:", res); // Log the upload result
                if (res && res[0]) {
                  setValue("banner_link", res[0].url);
                  toast({
                    title: "Success",
                    description: "Image uploaded successfully",
                  });
                }
              }}
              onUploadError={(error) => {
                console.error("Image Upload Error:", error); // Log any upload errors
                toast({
                  title: "Error",
                  description: `Upload Failed: ${error.message}`,
                  variant: "destructive",
                });
              }}
            />
          </div>

          {/* Editor สำหรับเนื้อหาบล็อก */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={field.value.join("\n")} // รวม array กลับเป็น string เพื่อแสดงผล
                onChange={(newValue) => {
                  const contentLines = newValue.split("\n").filter(line => line.trim() !== ""); // แยกเนื้อหาเป็น array
                  field.onChange(contentLines); // อัปเดตค่าใน form
                }}
                placeholder="Write your story..."
                className="quill-editor"
              />
            )}
          />


        </form>
      </main>
    </div>
  );
}

export default CreateBlogForm;
