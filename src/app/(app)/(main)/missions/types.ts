import type { Difficulty } from "@/lib/missions/scoring";
import type { PersonaKey } from "@/lib/persona";

export type MissionRow = {
  id: string;
  user_id: string;
  batch_id: string;
  persona_key: PersonaKey;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  co2_saved_g: number;
  verification_instructions: string;
  status: "active" | "completed";
  expires_at: string;
  created_at: string;
};

export type MissionProofRow = {
  id: string;
  mission_id: string;
  user_id: string;
  photo_path: string;
  verdict: "pending" | "passed" | "failed" | "needs_review";
  confidence: number | null;
  reasoning: string | null;
  detected_elements: string[] | null;
  model_id: string | null;
  submitted_at: string;
  verified_at: string | null;
};
