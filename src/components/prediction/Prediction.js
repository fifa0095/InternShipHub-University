"use client"; 
import PredictList from "./PredictList";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ResumePrediction({ user }) {
  const [form, setForm] = useState({
    skill: "",
    educational: "",
    experience: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [pdfText, setPdfText] = useState("");

  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReadPdf = async () => {
    if (!form.file) {
      toast.warning("Please upload a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", form.file);

    try {
      const response = await fetch("http://localhost:8080/api/pdfReader", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to read PDF");

      setForm((prev) => ({
        ...prev,
        skill: data.skill || "",
        educational: data.educational || "",
      }));

      setPdfText(data.text || "");  // แสดงข้อความจาก PDF
      toast.success("✅ Extracted info from PDF!");
    } catch (error) {
      console.error("❌ PDF Read Error:", error);
      toast.error("Failed to read PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // สร้างข้อมูล JSON สำหรับส่ง โดยเพิ่ม uid หากมี user._id
    const jsonData = {
      uid: user?.userId,  // เพิ่ม uid ที่นี่
      skill: form.skill,
      educational: form.educational,
      experience: form.experience,
    };

    // Log ข้อมูล user และ jsonData ที่จะส่งไป
    console.log("User:", user);
    console.log("Data sent to predict:", jsonData);

    try {
      const response = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData), // ส่ง jsonData ที่มี uid
      });

      const predictionResult = await response.json();

      if (!response.ok) throw new Error(predictionResult.error || "Prediction failed");

      setResult(predictionResult);
      toast.success("✅ Prediction sent successfully!");

      const predictionText =
        predictionResult.prediction || predictionResult.result || predictionResult;

      const blogRes = await fetch(
        `http://localhost:8080/api/search/${encodeURIComponent(predictionText)}`
      );
      const blogData = await blogRes.json();
      setBlogs(blogData || []);
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setResult(null);
    setBlogs([]);
  };

  return (
    <div className="py-10 bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-lg font-medium">
            Loading...
          </div>
        </div>
      )}

      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full relative overflow-y-auto max-h-[80vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Prediction Result:{" "}
              {typeof result === "string" ? result : result.prediction || "N/A"}
            </h2>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">Related Blogs:</h3>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition"
                  >
                    <h4 className="text-lg font-bold text-blue-600 mb-2">
                      {blog.title}
                    </h4>
                    <p className="text-gray-600 line-clamp-3">{blog.description}</p>
                    <a
                      href={`/blog/${blog._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 underline mt-2 inline-block"
                    >
                      Read more →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No related blogs found.</p>
            )}
          </div>
        </div>
      )}

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h2 className="text-5xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🔮</span> Resume Prediction
        </h2>
        {/* <p className="text-gray-600 mt-2">👤 Logged in as: {user?.userId || "Unknown"}</p> */}
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-6 mt-6 bg-white shadow-md rounded-lg"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 pr-0 md:pr-6 md:border-r border-gray-300 mb-6 md:mb-0 flex flex-col items-center">
            <label className="block mb-2 font-medium">Upload PDF (Optional)</label>
            <input
              type="file"
              name="file"
              accept=".pdf"
              onChange={onChangeHandler}
              className="mb-4 w-[80%] border px-3 py-2"
            />
            <button
              type="button"
              onClick={handleReadPdf}
              className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 mt-2"
            >
              Read PDF Text
            </button>
          </div>

          <div className="md:w-1/2 pl-0 md:pl-6">
            <label className="block mb-2 font-medium">Skill *</label>
            <input
              type="text"
              name="skill"
              value={form.skill}
              onChange={onChangeHandler}
              required
              className="mb-4 w-full border px-3 py-2"
              placeholder="e.g., JavaScript, Python"
            />

            <label className="block mb-2 font-medium">Certificate *</label>
            <input
              type="text"
              name="educational"
              value={form.educational}
              onChange={onChangeHandler}
              required
              className="mb-4 w-full border px-3 py-2"
              placeholder="e.g., Bachelor's in Computer Science"
            />

            <label className="block mb-2 font-medium">Experience *</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={onChangeHandler}
              required
              className="mb-4 w-full border px-3 py-2"
              placeholder="e.g., Built web app using React"
            />
          </div>
        </div>

        {pdfText && (
          <div className="mt-6 bg-gray-50 p-4 border border-gray-300 rounded-md">
            <h4 className="font-semibold text-gray-700 mb-2">📄 Extracted PDF Text:</h4>
            <p className="whitespace-pre-wrap text-gray-800 text-sm">{pdfText}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Predict
          </button>
        </div>
      </form>
      <PredictList uid={user?.userId} />
    </div>
  );
}
