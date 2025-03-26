import HomeComponent from "@/components/home";

export default async function Home() {
  const response = await fetch("http://localhost:8080/api/getBlog");
  const posts = await response.json();

  return <HomeComponent posts={posts} />;
}
