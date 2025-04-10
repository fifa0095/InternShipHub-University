"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "@/Assets/assets";
// import { useRouter } from 'next/router'; // ลบออก

export default function Page() {
  const [form, setForm] = useState({
    skill: "",
    educational: "",
    experience: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jsonData = {
      skill: form.skill,
      educational: form.educational,
      experience: form.experience,
    };

    const formData = new FormData();
    if (form.file) {
      formData.append("file", form.file);
    }

    try {
      const response = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (form.file) {
        const fileResponse = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!fileResponse.ok) throw new Error("File upload failed.");
      }

      const result = await response.json();
      setResult(result); // Show popup
      if (response.ok) {
        toast.success("✅ Prediction sent successfully!");
      } else {
        toast.error(`❌ Failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockData = (role) => {
    const mockData = {
      "Cloud Management": {
        skill: "Cloud Computing, AWS, Azure",
        educational: "Bachelor's in Computer Science",
        experience: "Managed cloud infrastructure for enterprise applications.",
      },
      "Data & AI": {
        skill: "Python, Machine Learning, TensorFlow",
        educational: "Master's in Data Science",
        experience: "Developed AI models to predict business trends.",
      },
      "Designer": {
        skill: "UI/UX Design, Figma, Adobe XD",
        educational: "Bachelor's in Graphic Design",
        experience: "Designed user interfaces for mobile applications.",
      },
      "Developer": {
        skill: "JavaScript, React, Node.js",
        educational: "Bachelor's in Software Engineering",
        experience: "Developed web applications using React and Node.js.",
      },
      "QA & Tester": {
        skill: "Test Automation, Selenium, JUnit",
        educational: "Bachelor's in Information Technology",
        experience: "Automated testing processes for web applications.",
      },
      "Security": {
        skill: "Network Security, Cryptography, Penetration Testing",
        educational: "Bachelor's in Cybersecurity",
        experience: "Secured enterprise networks from potential threats.",
      },
    };

    setForm({
      skill: mockData[role].skill,
      educational: mockData[role].educational,
      experience: mockData[role].experience,
      file: null,
    });
  };

  const closeModal = () => setResult(null);

  // Object for job info with assets and description
  const jobInfo = {
    "Cloud Management": {
      title: "Cloud Management",
      description:
        "Cloud Management is responsible for maintaining cloud infrastructure like AWS, Azure, or Google Cloud, focusing on security, scalability, and high availability.",
      skills: ["Cloud Computing", "AWS", "Azure", "DevOps"],
      image: assets.logo, // Can replace with specific image for Cloud Management
    },
    "Data & AI": {
      title: "Data & AI",
      description:
        "Data & AI focuses on data analysis and AI model creation to help businesses make accurate decisions using advanced algorithms and tools.",
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Visualization"],
      image: assets.man,
    },
    "Designer": {
      title: "Designer",
      description:
        "Designers are responsible for creating great user experiences by designing UI/UX and interfaces, ensuring apps are intuitive and visually appealing.",
      skills: ["UI/UX", "Figma", "Adobe XD", "Design Thinking"],
      image: assets.man,
    },
    "Developer": {
      title: "Developer",
      description:
        "Developers build web applications on both the frontend and backend using languages like JavaScript, Python, and frameworks like React and Node.js.",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      image: assets.man,
    },
    "QA & Tester": {
      title: "QA & Tester",
      description:
        "QA & Testers ensure the quality of software by performing manual and automated testing to identify and fix issues before release.",
      skills: ["Selenium", "JUnit", "Manual Testing", "Test Automation"],
      image: assets.man,
    },
    "Security": {
      title: "Security",
      description:
        "Security professionals safeguard systems and networks against cyber threats, ensuring sensitive data and applications are protected.",
      skills: ["Network Security", "Penetration Testing", "Cryptography", "SIEM"],
      image: assets.man,
    },
  };

  return (
    <div className="py-10 bg-gray-100 relative">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-lg font-medium">
            Loading...
          </div>
        </div>
      )}

      {/* Prediction Popup */}
      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Result : {jobInfo[result].title}</h2>
            <div className="flex gap-8 h-100 w-100">
              {/* Left Section */}
              <div className="flex-none">
                <img
                  src="https://i.pinimg.com/736x/43/0c/53/430c53ef3a97464b81b24b356ed39d32.jpg"
                  alt={jobInfo[result].title}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
                {/* <img src={assets.facebook_icon} alt="Facebook" /> */}
              </div>

              {/* Right Section: Image */}

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{jobInfo[result].title}</h3>
                <p className="text-gray-700 mb-4">{jobInfo[result].description}</p>
                <h3 className="font-semibold text-lg">Skills:</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {jobInfo[result].skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Link Button to Home */}
            <button
              onClick={() => window.location.href = '/'} // เปลี่ยนที่นี่ให้เป็นการเปลี่ยนหน้าโดยตรง
              className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-5xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">🔮</span> Resume Prediction
          </h2>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-left">Predict from Resume Info</h1>

        <label className="block mb-2 font-medium">Upload PDF (Optional)</label>
        <input
          type="file"
          name="file"
          accept=".pdf"
          onChange={onChangeHandler}
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="block mb-2 font-medium">Skill *</label>
        <input
          type="text"
          name="skill"
          value={form.skill}
          onChange={onChangeHandler}
          placeholder="e.g., JavaScript, Python, React"
          required
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="block mb-2 font-medium">Educational *</label>
        <input
          type="text"
          name="educational"
          value={form.educational}
          onChange={onChangeHandler}
          placeholder="e.g., Bachelor's in Computer Engineering"
          required
          className="mb-4 w-full border px-3 py-2"
        />

        <label className="block mb-2 font-medium">Experience *</label>
        <textarea
          name="experience"
          value={form.experience}
          onChange={onChangeHandler}
          placeholder="e.g., Built a web app using scraping and Express.js"
          required
          className="mb-4 w-full border px-3 py-2"
        />

        <div className="flex justify-between gap-3">
          {["Cloud Management", "Data & AI", "Designer", "Developer", "QA & Tester", "Security"].map((role) => (
            <button
              key={role}
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
              onClick={() => handleMockData(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
          >
            Submit Prediction
          </button>
        </div>
      </form>
    </div>
  );
}
