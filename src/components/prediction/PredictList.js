"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PredictList({ uid }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/getResume/${uid}`);
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

  if (!uid) {
    return <p className="text-gray-500">User not found</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading prediction history...</p>;
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Prediction History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No predictions found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {history.map((item, index) => (
            <li key={index} className="py-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <p className="text-gray-700">
                    <strong>Prediction:</strong> {item.predicted_job || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Skills: {item.skill || "-"}|
                  </p>
                  <p className="text-sm text-gray-500">
                    Education: {item.educational || "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Experience:{" "}
                    {item.experience || "-"}
                  </p>
                  
                </div>
                <p className="text-sm text-gray-400 mt-2 md:mt-0">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
