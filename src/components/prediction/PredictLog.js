"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PredictLog({ uid }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/getResume/${uid}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch history");
        setHistory(data);
      } catch (err) {
        console.error("❌ Predict history error:", err);
        toast.error("Failed to load prediction history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [uid]);

  const openModal = async (item) => {
    setSelectedPrediction(item);
    setIsModalOpen(true);
    setBlogsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PATH}/api/search/${encodeURIComponent(item.predicted_job)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch blogs");
      setRelatedBlogs(data);
    } catch (err) {
      console.error("❌ Related blogs error:", err);
      toast.error("Failed to load related blogs");
      setRelatedBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrediction(null);
    setRelatedBlogs([]);
  };

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Prediction History</h2>

      {loading ? (
        <p className="text-gray-500">Loading prediction history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">No predictions found.</p>
      ) : (
        <div className="mt-4 max-h-[300px] overflow-y-auto border border-gray-200 rounded-md">
          <ul className="divide-y divide-gray-200">
            {history.map((item, index) => (
              <li key={index} className="py-4 px-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <p className="text-gray-700">
                      <strong>Prediction:</strong> {item.predicted_job || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Skills: {item.skill || "-"}</p>
                    <p className="text-sm text-gray-500">Education: {item.educational || "-"}</p>
                    <p className="text-sm text-gray-500">Experience: {item.experience || "-"}</p>
                  </div>
                  <button
                    onClick={() => openModal(item)}
                    className="text-sm text-blue-600 underline mt-2 md:mt-0"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      )}

        {isModalOpen && selectedPrediction && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full relative max-h-[85vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            {/* Header (ไม่ scroll) */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-center text-gray-800">
                Prediction Result: {selectedPrediction.predicted_job || "N/A"}
              </h2>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Related Blogs:</h3>

              {blogsLoading ? (
                <p className="text-gray-500">Loading related blogs...</p>
              ) : relatedBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedBlogs.map((blog, idx) => (
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
        </div>
      )}

    </div>
  );
}
