import { generateText, Output } from "ai";
import { VISION_MODEL } from "./model";
import {
  verificationVerdictSchema,
  type VerificationVerdict,
} from "./schemas";

const SYSTEM_PROMPT = `당신은 탄소절감 미션 인증 사진을 판정하는 검증기입니다.
주어진 인증 기준(사용자 메시지의 텍스트)과 첨부된 사진만 보고 판정하세요. 사진에 명확히 보이지 않는 것은 절대 추측하지 마세요.
판단이 애매하면 낮은 confidence 값을 반환하세요 — 그 결과는 사람 검토로 넘어가므로, 억지로 통과/실패를 확정할 필요가 없습니다.`;

/**
 * General free-form verification: works for any mission type because the rubric
 * (`verificationInstructions`) is written by the mission-generation AI per mission,
 * not hardcoded here. This is the single verifier for every mission category.
 */
export async function verifyMissionProof(input: {
  verificationInstructions: string;
  photoUrl: string;
}): Promise<VerificationVerdict> {
  const result = await generateText({
    model: VISION_MODEL,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: input.verificationInstructions },
          { type: "file", mediaType: "image", data: input.photoUrl },
        ],
      },
    ],
    output: Output.object({ schema: verificationVerdictSchema }),
  });

  return result.output;
}
