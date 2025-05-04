import HomeComponent from "@/components/home";

export default async function Home() {
  const response = await fetch(process.env.API_PATH + "/api/getAllBlog");
  const posts = await response.json();

  return <HomeComponent posts={posts} />;
}
