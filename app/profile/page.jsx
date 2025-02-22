"use client";
import { useState } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import UserBlogList from "./user_blog_list";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "John_Doe@mail.com",
    password: "************",
  });

  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleBlur = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <div className="p-5 sm:p-10">
      {/* Profile Section */}
      <div className="max-w-[900px] mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <Image 
              src={assets.profile_icon} 
              width={80} 
              height={80} 
              alt="Profile" 
              className="rounded-full border border-black"
            />
            <button className="absolute bottom-0 right-0 bg-white border border-black p-1 rounded-full">
              <Image src={assets.camera_icon} width={20} height={20} alt="Edit" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <div className="flex items-center bg-gray-300 p-2 rounded-lg">
                {isEditing.fullName ? (
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    autoFocus
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                ) : (
                  <p className="flex-1">{profile.fullName}</p>
                )}
                <button className="ml-2" onClick={() => handleEdit("fullName")}>
                  <Image src={assets.edit_icon} width={20} height={20} alt="Edit" />
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <div className="flex items-center bg-gray-300 p-2 rounded-lg">
                {isEditing.email ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    autoFocus
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                ) : (
                  <p className="flex-1">{profile.email}</p>
                )}
                <button className="ml-2" onClick={() => handleEdit("email")}>
                  <Image src={assets.edit_icon} width={20} height={20} alt="Edit" />
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <div className="flex items-center bg-gray-300 p-2 rounded-lg">
                {isEditing.password ? (
                  <input
                    type="password"
                    value={profile.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    autoFocus
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                ) : (
                  <p className="flex-1">{profile.password}</p>
                )}
                <button className="ml-2" onClick={() => handleEdit("password")}>
                  <Image src={assets.edit_icon} width={20} height={20} alt="Edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-10 max-w-[900px] mx-auto">
        <h2 className="text-2xl font-bold mb-5">Your Blog</h2>
        {/* Blogs are stacked vertically */}
        <div className="flex flex-col gap-6">
          <UserBlogList />
        </div>
      </div>
    </div>
  );
};

export default Profile;
