import ResumePrediction from "@/components/prediction/Prediction";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function ResumePredictionPage() {
  const token = (await cookies()).get("token")?.value;
  // console.log("🔥 Token from cookies:", token);

  const user = await verifyAuth(token);
  // console.log("👤 User after verifyAuth:", user);
  console.log("token:", token); // ← อยากดูค่า token
// console.log("user:", user);   // ← อยากดูค่า user

  return <ResumePrediction user={user} />;
}
