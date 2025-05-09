import HomeComponent from "@/components/home";

export default async function Home() {
  const page = 1; // หน้าเริ่มต้น
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/getBlog/${page}`);
  const posts = await response.json();

  return <HomeComponent posts={posts} currentPage={page} />;
}
