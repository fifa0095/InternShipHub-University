import { assets } from "@/Assets/assets"
import Sidebar from "@/Components/AdminComponent/Sidebar"
import Image from "next/image"

export default function Layout({children}){
    return(
        <>
            <div className="flex">
                <Sidebar/>
                <div className="flex flex-col w-full">
                    <div className="flex item-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
                        <h3 className="font-medium">Admin Panel</h3>
                        <div>
                        {/* <p className="font-medium">{data.author}</p>     */}
                        <Image src={assets.profile_icon} width={40} alt='' />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
            
        </>
    )
}