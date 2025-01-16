'use client';

import { blog_data, assets } from '@/Assets/assets'; // Ensure assets includes 'logo', 'arrow', and other required properties
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Ensure the correct import for Image
import Footer from '@/Components/Footer';
import Link from 'next/link';

const Page = ({ params: paramsPromise }) => {
  const [params, setParams] = useState(null); // Store unwrapped params
  const [data, setData] = useState(null);

  // Unwrap the params Promise
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await paramsPromise;
        setParams(resolvedParams);
      } catch (error) {
        console.error('Error unwrapping params:', error);
      }
    };

    fetchParams();
  }, [paramsPromise]);

  // Fetch blog data when params are available
  useEffect(() => {
    if (params) {
      const blog = blog_data.find((blog) => Number(params.id) === blog.id);
      if (blog) {
        setData(blog);
        console.log('Blog data:', blog);
      }
    }
  }, [params]);

  return (
    data ? (
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
            <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id a est perspiciatis repudiandae optio tempora aliquid consectetur laudantium exercitationem necessitatibus rem atque doloremque quibusdam, nisi vel odio. Dolorum, fugit animi!</p> 
            <h3 className='my-5 text-[18px] font-semibold '>Lorem ipsum dolor sit amet consectetur</h3>
            <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id a est perspiciatis repudiandae optio tempora aliquid consectetur laudantium exercitationem necessitatibus rem atque doloremque quibusdam, nisi vel odio. Dolorum, fugit animi!</p> 
            <h3 className='my-5 text-[18px] font-semibold '>Lorem ipsum dolor sit amet consectetur</h3>
            <p className="my-3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id a est perspiciatis repudiandae optio tempora aliquid consectetur laudantium exercitationem necessitatibus rem atque doloremque quibusdam, nisi vel odio. Dolorum, fugit animi!</p> 

            <div className='my-24'>
              <p className="text-black font font-semibold my-4">Share this article on social media :</p>
              <div className='flex'>
              <Image src={assets.facebook_icon} className='' width={50} alt=''/>
              <Image src={assets.twitter_icon} className='' width={50} alt=''/>
              <Image src={assets.googleplus_icon} className='' width={50} alt=''/>
              </div>
              </div>         
          </div>
        
        )}
        <Footer/>
      </>
    ) : (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    )
  );
};

export default Page;
