// components/blog/EditBlog.js
import { useState } from "react";
import { Button } from "../ui/button";

const EditBlog = ({ blog, onUpdate }) => {
  const [updatedTitle, setUpdatedTitle] = useState(blog.title);
  const [updatedContent, setUpdatedContent] = useState(blog.content);

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/updateBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: blog.id,
          title: updatedTitle,
          content: updatedContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Blog updated successfully!");
        onUpdate(); // Call the onUpdate prop to trigger any parent update logic
      } else {
        alert("Failed to update blog!");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Something went wrong while updating the blog.");
    }
  };

  return (
    <div className="edit-blog">
      <input
        type="text"
        value={updatedTitle}
        onChange={(e) => setUpdatedTitle(e.target.value)}
        placeholder="Update title"
      />
      <textarea
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
        placeholder="Update content"
      />
      <Button onClick={handleUpdate}>Update Blog</Button>
    </div>
  );
};

export default EditBlog;
