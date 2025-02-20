'use client';

import { blog_data, assets } from '@/Assets/assets'; // ตรวจสอบให้แน่ใจว่า assets มีค่าทั้งหมด
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/Components/Footer';
import Link from 'next/link';
import axios from 'axios';

const Page = ({ params }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogData = async (id) => {
    if (!id) return; // ป้องกันการเรียก API โดยไม่จำเป็น
    try {
      const response = await axios.get(`/api/blog?id=${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Unwrap params using React.use()
  const { id } = React.use(params); // Use React.use() to unwrap params

  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }
  }, [id]); // เรียกใหม่เมื่อ `id` เปลี่ยน

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-red-500">Blog not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-200 py-5 md:px-12 lg:px-28">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <Link href='/'>
            <Image
              src={assets.logo}
              width={180}
              alt="Logo"
              className="w-[130px] sm:w-auto"
            />
          </Link>
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
            Get started
            <Image src={assets.arrow} alt="Arrow" width={20} height={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          {data.author_img && (
            <Image
              className="mx-auto mt-6 border border-white rounded-full"
              src={data.author_img}
              width={60}
              height={60}
              alt="Author"
            />
          )}
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>

      {/* Main Image Section */}
      {data.image && (
        <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
          <Image
            src={data.image}
            width={1280}
            height={720}
            alt="Blog Content"
            className="rounded-md border-4 border-white"
          />
          <h1 className='my-8 text-[26px] font-semibold'>Introduction:</h1>
          <p>{data.description}</p>
          <h3 className='my-5 text-[18px] font-semibold '>Lorem ipsum dolor sit amet consectetur</h3>
          <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit...</p> 
          <h3 className='my-5 text-[18px] font-semibold '>Lorem ipsum dolor sit amet consectetur</h3>
          <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit...</p> 
          <h3 className='my-5 text-[18px] font-semibold '>Lorem ipsum dolor sit amet consectetur</h3>
          <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit...</p> 

          {/* Social Media Share */}
          <div className='my-24'>
            <p className="text-black font font-semibold my-4">Share this article on social media :</p>
            <div className='flex gap-4'>
              {assets.facebook_icon && <Image src={assets.facebook_icon} width={50} height={50} alt="Facebook" />}
              {assets.twitter_icon && <Image src={assets.twitter_icon} width={50} height={50} alt="Twitter" />}
              {assets.googleplus_icon && <Image src={assets.googleplus_icon} width={50} height={50} alt="Google+" />}
            </div>
          </div>         
        </div>
      )}
      <Footer />
    </>
  );
};

export default Page;
