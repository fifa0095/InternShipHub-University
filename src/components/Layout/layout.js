import { cookies } from "next/headers";
import Header from "./header";
import { verifyAuth } from "@/lib/auth";


export default async function CommonLayout({ children }) {
  const token = (await cookies()).get("token")?.value;
  console.log("🔥 Token from cookies:", token);

  const user = await verifyAuth(token);
  console.log("👤 User after verifyAuth:", user);

  return (
    <div className="min-h-screen bg-white">
      
      { <Header user={user} />}
      {children}
    </div>
  );
}
