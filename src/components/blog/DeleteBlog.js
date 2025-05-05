"use client";
import { Button } from "../ui/button";

const DeleteBlog = ({ blogId, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/deleteBlog/${blogId}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
          alert("Blog deleted successfully!");
          onDelete(); // Notify parent
          // router.push(`/myBlog`);
        } else {
          alert(result?.error || "Failed to delete blog!");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Something went wrong while deleting the blog.");
      }
    }
  };

  return (
    <Button onClick={handleDelete} className="text-red-500 hover:text-red-700">
      Delete Blog
    </Button>
  );
};

export default DeleteBlog;
