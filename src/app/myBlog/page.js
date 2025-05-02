import EditAccount from "@/components/account/EditAccount";
import MyBlogs from "@/components/blog/MyBlogs";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function MyBlogsPage() {
  const token = (await cookies()).get("token")?.value;

  const user = await verifyAuth(token);
  const uid = user?.userId;
  console.log("user :",user)
  console.log("user id :",uid)


  return (
    <>
      <EditAccount user={user} />
      <MyBlogs uid={uid}  />
    </>
  );
}
