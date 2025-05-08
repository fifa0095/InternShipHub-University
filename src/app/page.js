import HomeComponent from "@/components/home";

export default async function Home() {
  console.log("NEXT_PUBLIC_API_PATH :",process.env.NEXT_PUBLIC_API_PATH)
  const response = await fetch(process.env.NEXT_PUBLIC_API_PATH +"/api/getAllBlog");
  const posts = await response.json();

  return <HomeComponent posts={posts} />;
}
