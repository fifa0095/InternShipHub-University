import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title,description,image,category,id}) => {
  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
        <Link href={`/blogs/${id}`}>
        <Image src={image} alt='' width={400} height={400} className='border border-black'/>
        </Link>
        <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
        <div className='p-5'>
            <h5 className='mb-2 text-lg font-medium tracking-ting text-gray-900'>{title}</h5>
            <p className='mb-3 text-sm tracking-ting text-gray-700'>{description}</p>
            <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-medium text-center'>
                Read more <Image className="ml-2" width={12} src={assets.arrow} alt='' />
            </Link>
        </div>
    </div>
  )
}

export default BlogItem