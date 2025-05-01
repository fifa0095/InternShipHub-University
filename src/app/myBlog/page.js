import EditAccount from "@/components/account/EditAccount";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function MyBlogsPage() {
  const token = (await cookies()).get("token")?.value;

  const authUser = await verifyAuth(token);
  const uid = authUser?.userId;

  let user = null;

  if (uid) {
    console.log("uid :",uid)
    const res = await fetch(`http://localhost:8080/api/getUser/${uid}`, {
      cache: "no-store", // ป้องกันการ cache ใน server component
    });

    if (res.ok) {
      user = await res.json();
    } else {
      console.error("❌ Failed to fetch user data from API");
    }
    console.log("user :",user)
  }

  return (
    <>
      <EditAccount user={user} />
      {/* <MyBlogs uid={uid} posts={posts} /> */}
    </>
  );
}
