import { z } from "zod";

export const generatedMissionSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().min(5).max(300),
  difficulty: z.enum(["easy", "medium", "hard"]),
  suggestedPoints: z.number().int().min(1).max(1000),
  suggestedCo2SavedG: z.number().int().min(0).max(50000),
  verificationInstructions: z.string().min(10).max(500),
});

export type GeneratedMission = z.infer<typeof generatedMissionSchema>;

export const missionBatchSchema = z.object({
  missions: z.array(generatedMissionSchema).min(2).max(4),
});

// A single schema shared by every mission type — general free-form verification,
// no per-category branching.
export const verificationVerdictSchema = z.object({
  passed: z.boolean(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().min(5).max(500),
  detectedElements: z.array(z.string()).max(10),
});

export type VerificationVerdict = z.infer<typeof verificationVerdictSchema>;
