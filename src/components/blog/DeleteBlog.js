// components/blog/DeleteBlog.js
import { Button } from "../ui/button";

const DeleteBlog = ({ blogId, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await fetch("http://localhost:8080/api/deleteBlog", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: blogId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Blog deleted successfully!");
          onDelete(); // Call the onDelete prop to trigger parent delete logic
        } else {
          alert("Failed to delete blog!");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Something went wrong while deleting the blog.");
      }
    }
  };

  return (
    <Button onClick={handleDelete} className="text-red-500">
      Delete Blog
    </Button>
  );
};

export default DeleteBlog;
