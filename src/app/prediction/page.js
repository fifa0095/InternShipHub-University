"use client"

import ResumePrediction from "@/components/prediction/Prediction";
import { useAuth } from "@/components/Layout/context";


export default async function ResumePredictionPage() {
const { user } = useAuth()


  console.log("user:", user);

  return (
    <>
      <ResumePrediction user={user} />
    </>
  );
}
