import ResumePrediction from "@/components/prediction/Prediction";

import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export default async function ResumePredictionPage() {
  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);

  console.log("token:", token);
  console.log("user:", user);

  return (
    <>
      <ResumePrediction user={user} />
    </>
  );
}
