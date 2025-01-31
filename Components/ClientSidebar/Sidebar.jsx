"use client"; // ระบุว่าไฟล์นี้เป็น client-side component

import { useState } from 'react'; // ใช้ useState สำหรับจัดการสถานะ
import { assets } from '@/Assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false); // ใช้ useState เพื่อควบคุมการแสดงผลของ Sidebar
  const [activeMenu, setActiveMenu] = useState(""); // เก็บเมนูที่ถูกเลือก

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden); // ฟังก์ชันสลับสถานะการแสดง Sidebar
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName); // ตั้งค่า active menu เมื่อคลิก
  };

  return (
    <div className="relative">
      {/* ปุ่ม toggle สำหรับการซ่อน/แสดง Sidebar */}
      <div className=  {`absolute top-3 left-3 z-[-100] ${isSidebarHidden ? 'w-28 sm:w-80' : 'w-28 sm:w-80'}`}>
        <Image 
          src={assets.menu_icon} 
          width={30}
          height={20}  
          alt='Toggle Sidebar' 
          className="cursor-pointer" 
          onClick={toggleSidebar} 
        />
      </div>

      {/* Sidebar */}
      <div className={`flex flex-col bg-slate-100 min-h-screen ${isSidebarHidden ? 'w-0' : 'w-28 sm:w-80'} transition-all duration-300`}>
        <div className={`flex px-2 sm:pl-14 py-3 border bg-white border-black justify-between ${isSidebarHidden ? 'hidden' : ''} transition-all duration-300`}>
            <Image src={assets.logo} className=' ' width={110} alt='' />
            <Image 
              src={assets.menu_icon} 
              width={30}
              height={20}  
              alt='Toggle Sidebar' 
              className="cursor-pointer {`absolute top-3 left-3 z-10 ${isSidebarHidden ? 'hidden' : ''}`}" 
              onClick={toggleSidebar} 
            />
       
        </div>

        {/* เนื้อหาภายใน Sidebar */}
        <div className={`h-full py-12 overflow-y-auto transition-all duration-300 ${isSidebarHidden ? 'hidden' : ''}`}>
          <div className="w-[50%] sm:w-[80%] absolute right-0">
            <Link 
              href={`/`} 
              className={`flex items-center border border-black gap-3 font-medium px-3 py-2 ${activeMenu === 'home' ? 'bg-black text-white shadow-[-5px_5px_0px_#EC8714]' : 'bg-white text-black shadow-[-5px_5px_0px_#000000]'} `} 
              onClick={() => handleMenuClick('home')}
            >
              <Image src={assets.home_icon} alt='' width={28}/><p>Home Page</p>
            </Link>
            <Link 
              href={`/addProduct`} 
              className={`mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 ${activeMenu === 'addProduct' ?'bg-black text-white shadow-[-5px_5px_0px_#EC8714]' : 'bg-white text-black shadow-[-5px_5px_0px_#000000]'} `}
              onClick={() => handleMenuClick('addProduct')}
            >
              <Image src={assets.add_icon} alt='' width={28}/><p>Add blogs</p>
            </Link>
            <Link 
              href={`/blogList`} 
              className={`mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 ${activeMenu === 'blogList' ?'bg-black text-white shadow-[-5px_5px_0px_#EC8714]' : 'bg-white text-black shadow-[-5px_5px_0px_#000000]'} `}
              onClick={() => handleMenuClick('blogList')}
            >
              <Image src={assets.blog_icon} alt='' width={28}/><p>Blog lists</p>
            </Link>
            <Link 
              href={`/subscription`} 
              className={`mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 ${activeMenu === 'subscription' ?'bg-black text-white shadow-[-5px_5px_0px_#EC8714]' : 'bg-white text-black shadow-[-5px_5px_0px_#000000]'} `}
              onClick={() => handleMenuClick('subscription')}
            >
              <Image src={assets.email_icon} alt='' width={28}/><p>Subscription</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
