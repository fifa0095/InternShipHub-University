"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PredictLog from "./PredictLog";
import PredictList from "./PredictList";
import { jobInfo } from "@/Assets/assets";
import JobInfoCard from "./JobInfo";
import { FaSpinner } from "react-icons/fa";

export default function ResumePrediction({ user }) {
  const [form, setForm] = useState({
    skill: "",
    educational: "",
    experience: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

      setPdfText(data.text || "");
      toast.success("✅ Extracted info from PDF!");
    } catch (error) {
      console.error("❌ PDF Read Error:", error);
      toast.error("Failed to read PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jsonData = {
      uid: user?.userId,
      skill: form.skill,
      educational: form.educational,
      experience: form.experience,
    };

    try {
      const response = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const predictionResult = await response.json();

      if (!response.ok) throw new Error(predictionResult.error || "Prediction failed");

      setResult(predictionResult);
      toast.success("✅ Prediction sent successfully!");
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setResult(null);
  };

  const mapPredictionToKey = (prediction) => {
    if (!prediction) return null;

    const mapping = {
      "QA & Tester": "Tester",
      "Cloud Management": "Cloud",
      "Data & AI": "Data",
      "Designer": "Designer",
      "Developer": "Developer",
      "Security": "Security",
    };

    return mapping[prediction] || prediction;
  };

  const covertResult = mapPredictionToKey(result?.prediction || result);

  return (
    <div className="py-10 bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
            <div className="text-lg font-medium text-gray-700">กำลังวิเคราะห์ข้อมูล...</div>
          </div>
        </div>
      )}

      {result && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full relative overflow-hidden max-h-[90vh]">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✖
              </button>

              <div className="flex flex-col md:flex-row gap-8 h-[75vh] overflow-hidden">
                {/* Left: Job Info Sticky */}
                <div className="flex-1 flex flex-col items-center text-center sticky top-0 self-start">
                  {covertResult && jobInfo[covertResult] ? (
                    <JobInfoCard job={jobInfo[covertResult]} />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-800">
                      Prediction: {typeof result === "string" ? result : result?.prediction || "N/A"}
                    </h2>
                  )}
                </div>

                {/* Right: Predict List Scrollable */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <PredictList keyword={result?.prediction || result} />
                </div>
              </div>
            </div>
          </div>

      )}

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h2 className="text-5xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🔮</span> Find Career
        </h2>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-6 mt-6 bg-white shadow-md rounded-lg"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 pr-0 md:pr-6 md:border-r border-gray-300 mb-6 md:mb-0 flex flex-col items-center justify-center">
            <label className="block mb-2 font-medium flex items-center gap-1">
              Upload PDF (Optional)
              <span className="relative group cursor-pointer text-blue-500">
                📄
                <div className="absolute bottom-full mb-1 w-[220px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  อัปโหลดไฟล์ PDF ที่มีข้อมูลเกี่ยวกับทักษะหรือการศึกษา เช่น Resume,CV เพื่อให้กรอกข้อมูลเบื้องต้นอัตโนมัติ
                </div>
              </span>
            </label>
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
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 mt-2"
            >
              Read PDF Text
            </button>
          </div>

          <div className="md:w-1/2 pl-0 md:pl-6">
            <h2 className="text-2xl font-bold mt-8">Fill in Your Information for Find Career</h2>
            <p className="text-l font-medium mb-4 text-gray-600">
            กรุณากรอกรายละเอียดของคุณ ตามหัวข้อที่กำหนดเพื่อให้ระบบสามารถแนะนำอาชีพที่เหมาะสมที่สุดสำหรับคุณได้ (ภาษาอังกฤษเท่านั้น)
            </p>

            <label className="block mb-2 font-medium flex items-center gap-1">
              Skill *
              <span className="relative group cursor-pointer text-blue-500">
                ℹ️
                <div className="absolute right-full mb-1 w-[220px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  ระบุทักษะที่คุณมี เช่น JavaScript, Python, Excel ฯลฯ
                </div>
              </span>
            </label>
            <input
              type="text"
              name="skill"
              value={form.skill}
              onChange={onChangeHandler}
              required
              className="mb-4 w-full border px-3 py-2"
              placeholder="e.g., JavaScript, Python"
            />

            <label className="block mb-2 font-medium flex items-center gap-1">
              Certificate *
              <span className="relative group cursor-pointer text-blue-500">
                ℹ️
                <div className="absolute bottom-full mb-1 w-[220px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  ใส่ระดับการศึกษา หรือใบรับรอง เช่น ปริญญาตรี สาขา IT หรือ Google Certificate
                </div>
              </span>
            </label>
            <input
              type="text"
              name="educational"
              value={form.educational}
              onChange={onChangeHandler}
              required
              className="mb-4 w-full border px-3 py-2"
              placeholder="e.g., Bachelor's in Computer Science"
            />

            <label className="block mb-2 font-medium flex items-center gap-1">
              Experience *
              <span className="relative group cursor-pointer text-blue-500">
                ℹ️
                <div className="absolute bottom-full mb-1 w-[220px] bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  เขียนประสบการณ์การทำงาน หรือโปรเจกต์ที่เคยทำ เช่น สร้างเว็บ React
                </div>
              </span>
            </label>
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

      <PredictLog uid={user?.userId} />
    </div>
  );
}
