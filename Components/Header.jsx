import { assets } from "@/Assets/assets"
import Image from "next/image"
import React from "react"

const Header = () => {
    return(
        <div className="py-5 px-5 md:px-12 lg:px-28">
            <div className="flex justify-between items-center">
                <Image src={assets.logo} width={180} alt='' className="w-[130px] sm:w-auto"/>
                <button className="flex items-center gap-2 font-medium py-1 px-3 sm:px-6 sm:py-3 border border-solid border-black shadow-[-7px_7px_0px_#000000]">Get start <Image src={assets.arrow} alt='' ></Image></button>
                           
            </div>
            <div className="flex justify-between item-center border-black border-solid">
                <div className=" my-8 ">
                    <h1 className="text-3xl sm:text-5xl font-medium">Last Blogs</h1>
                    <p className="mt-1 mb-5 max-w-[740px] m-auto text-xs sm:text-base">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel natus ullam perferendis ut ratione eum asperiores sunt quibusdam nisi quam?</p>
                    <button className="flex items-center gap-2 font-medium py-1 px-3 sm:px-6 sm:py-3 border border-solid border-black ">Get start <Image src={assets.arrow} alt=''></Image></button>
                </div>
                <Image src={assets.test} width={700} alt='' className="border w-[160px] sm:h-auto sm:w-auto"/>
            </div>
            <div className="flex justify-between item-center border-black border-solid">
             <form action="" className="flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]">
                <input type="email" placeholder="Enter your Email" className="pl-4 outline-none"/>
                <button type="submit" className="border-l border-end border-black py-4 px-4 sm8:px-8 active:bg-gray-600 active:text-white">Subscribe</button>
             </form>
            </div>
        </div>
    )
}
export default Header