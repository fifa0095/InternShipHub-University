"use client";

import ResumePrediction from "./Prediction";
import { useAuth } from "@/components/Layout/context";

export default function ResumePredictionWrapper() {
  const { user } = useAuth();

  return <ResumePrediction user={user} />;
}
