import { cookies } from "next/headers";
import Header from "./header";
import { verifyAuth } from "@/lib/auth";
import { AuthProvider } from "./context";
import ClientLayout from "./client-layout"; // 👈 component ที่จัดการ responsive/sidebar

export default async function CommonLayout({ children }) {
  const token = cookies().get("token")?.value;
  let user = null;

  if (token) {
    try {
      user = await verifyAuth(token);
    } catch (err) {
      console.error("Auth verify failed:", err);
    }
  }

  return (
    <AuthProvider initialUser={user} >
      <ClientLayout>{children}</ClientLayout>
    </AuthProvider>
  );
}
