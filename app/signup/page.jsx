"use client";
import React, { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup Data:", formData);
    // Add sign-up API logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
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
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Enter your email"
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

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            placeholder="Confirm your password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
