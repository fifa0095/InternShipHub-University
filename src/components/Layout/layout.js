import { cookies } from "next/headers";
import Header from "./header";
import { verifyAuth } from "@/lib/auth";
import { AuthProvider } from "./context";

export default async function CommonLayout({ children }) {
  const token = cookies().get("token")?.value;
  let user = null;

  if (token) {
    try {
      user = await verifyAuth(token); // 👤 ตรวจสอบ token แล้วได้ user object
    } catch (err) {
      console.error("Auth verify failed:", err);
    }
  }

  return (
    <AuthProvider initialUser={user}>
      <div className="min-h-screen bg-white">
        <Header />
        {children}
      </div>
    </AuthProvider>
  );
}
