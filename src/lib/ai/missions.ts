import { generateText, Output } from "ai";
import {
  PERSONA_DEFS,
  type PersonaKey,
  type SurveyAnswers,
} from "@/lib/persona";
import { TEXT_MODEL } from "./model";
import { missionBatchSchema, type GeneratedMission } from "./schemas";

const OCCUPATION_LABELS: Record<SurveyAnswers["occupation"], string> = {
  student: "학생",
  office: "사무직",
  field: "현장직",
  self_employed: "자영업",
  homemaker: "전업주부",
  other: "기타",
};

const HAS_CAR_LABELS: Record<SurveyAnswers["hasCar"], string> = {
  none: "자차 없음",
  occasional: "가끔 이용",
  daily: "매일 이용",
};

function buildFeasibilityNotes(
  occupation: SurveyAnswers["occupation"],
  hasCar: SurveyAnswers["hasCar"],
): string[] {
  const notes: string[] = [];
  if (hasCar === "none") {
    notes.push(
      "자차가 없으므로 자차 이용을 전제로 한 미션은 제안하지 말 것 (대중교통/도보/자전거 위주로 제안).",
    );
  }
  if (occupation === "student") {
    notes.push(
      "학생이므로 직장 통근 대신 등하교/학교생활 맥락에 맞는 미션을 제안할 것.",
    );
  } else if (occupation === "homemaker") {
    notes.push("전업주부이므로 가정 내 에너지·소비 관련 미션을 우선 고려할 것.");
  }
  return notes;
}

export async function generateMissionBatch(input: {
  personaKey: PersonaKey;
  ecoActionScore: number;
  footprintScore: number;
  occupation: SurveyAnswers["occupation"];
  hasCar: SurveyAnswers["hasCar"];
  recentMissionTitles: string[];
}): Promise<GeneratedMission[]> {
  const persona = PERSONA_DEFS[input.personaKey];
  const feasibilityNotes = buildFeasibilityNotes(
    input.occupation,
    input.hasCar,
  );

  const system = `당신은 탄소절감 습관 형성 앱 "해초키우기"의 미션 생성기입니다.
사용자가 사진 한 장으로 인증할 수 있는, 하루 안에 실천 가능한 구체적인 탄소절감 미션을 한국어로 제안하세요.
각 미션에는 그 사진만 보고 판정할 수 있는 명확한 인증 기준(verificationInstructions)을 함께 작성하세요 — 이 텍스트는 나중에 별도의 검증 AI에게 그대로 전달되어, 사용자가 제출한 사진이 이 미션을 달성했다는 증거로 타당한지 판정하는 유일한 근거가 됩니다. 사진만으로 확인 가능한 기준만 쓰세요.`;

  const prompt = `사용자 페르소나: ${persona.label} — ${persona.description}
환경 실천 점수(ecoActionScore, 0~100): ${input.ecoActionScore}
소비/에너지 발자국 점수(footprintScore, 0~100): ${input.footprintScore}
직업: ${OCCUPATION_LABELS[input.occupation]}
자차 이용: ${HAS_CAR_LABELS[input.hasCar]}
${feasibilityNotes.length > 0 ? `제약 조건:\n${feasibilityNotes.map((n) => `- ${n}`).join("\n")}\n` : ""}${
    input.recentMissionTitles.length > 0
      ? `최근 제공된 미션(중복 피할 것): ${input.recentMissionTitles.join(", ")}\n`
      : ""
  }
이 사용자에게 맞는 서로 다른 난이도의 미션 2~4개를 제안하세요. suggestedPoints/suggestedCo2SavedG는 difficulty에 맞는 대략적인 값이면 됩니다(서버에서 안전 범위로 재조정됩니다).`;

  const result = await generateText({
    model: TEXT_MODEL,
    system,
    prompt,
    output: Output.object({ schema: missionBatchSchema }),
  });

  return result.output.missions;
}
