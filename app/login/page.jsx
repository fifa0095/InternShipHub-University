"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const router = useRouter(); // Next.js router for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Add authentication logic here (API call)
  };

  const handleSignupRedirect = () => {
    router.push("/signup"); // Redirect to signup page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button onClick={handleSignupRedirect} className="text-blue-500">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
