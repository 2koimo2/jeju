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
  office: "직장인",
  homemaker: "주부",
  self_employed: "자영업",
  other: "기타",
};

const TRANSPORT_MODE_LABELS: Record<SurveyAnswers["transportMode"], string> =
  {
    walk: "도보",
    bike: "자전거",
    public_transit: "대중교통",
    car: "자가용",
    motorcycle: "오토바이",
  };

const AGE_RANGE_LABELS: Record<SurveyAnswers["ageRange"], string> = {
  teens_or_under: "10대 이하",
  twenties: "20대",
  thirties: "30대",
  forties: "40대",
  fifties_plus: "50대 이상",
};

const INTEREST_AREA_LABELS: Record<SurveyAnswers["interestArea"], string> = {
  ocean_trash: "바다쓰레기 줄이기",
  sea_forest: "바다숲 복원",
  marine_life: "해양생물 보호",
  carbon: "탄소 줄이기",
};

function buildFeasibilityNotes(
  occupation: SurveyAnswers["occupation"],
  transportMode: SurveyAnswers["transportMode"],
): string[] {
  const notes: string[] = [];
  if (transportMode !== "car" && transportMode !== "motorcycle") {
    notes.push(
      "자차/오토바이를 이용하지 않으므로 자차 이용을 전제로 한 미션은 제안하지 말 것 (도보/자전거/대중교통 위주로 제안).",
    );
  }
  if (occupation === "student") {
    notes.push(
      "학생이므로 직장 통근 대신 등하교/학교생활 맥락에 맞는 미션을 제안할 것.",
    );
  } else if (occupation === "homemaker") {
    notes.push("주부이므로 가정 내 에너지·소비 관련 미션을 우선 고려할 것.");
  }
  return notes;
}

export async function generateMissionBatch(input: {
  personaKey: PersonaKey;
  ecoActionScore: number;
  footprintScore: number;
  occupation: SurveyAnswers["occupation"];
  transportMode: SurveyAnswers["transportMode"];
  ageRange: SurveyAnswers["ageRange"] | null;
  interestArea: SurveyAnswers["interestArea"] | null;
  recentMissionTitles: string[];
}): Promise<GeneratedMission[]> {
  const persona = PERSONA_DEFS[input.personaKey];
  const feasibilityNotes = buildFeasibilityNotes(
    input.occupation,
    input.transportMode,
  );

  const system = `당신은 탄소절감 습관 형성 앱 "해초키우기"의 미션 생성기입니다.
사용자가 사진 한 장으로 인증할 수 있는, 하루 안에 실천 가능한 구체적인 탄소절감 미션을 한국어로 제안하세요.
각 미션에는 그 사진만 보고 판정할 수 있는 명확한 인증 기준(verificationInstructions)을 함께 작성하세요 — 이 텍스트는 나중에 별도의 검증 AI에게 그대로 전달되어, 사용자가 제출한 사진이 이 미션을 달성했다는 증거로 타당한지 판정하는 유일한 근거가 됩니다. 사진만으로 확인 가능한 기준만 쓰세요.

난이도 배정 규칙 (반드시 지킬 것):
- 플로깅/줍깅, 산책하며 쓰레기 줍기 등 집 밖으로 나가서 이동하거나 몸을 움직여야 하는 미션은 무조건 difficulty를 "hard"로 지정하세요. 이런 유형은 "easy"나 "medium"으로 배정하지 마세요.
- "easy" 미션은 텀블러/다회용 컵 챙기기, 안 쓰는 플러그 뽑기, 재사용 용기 사용, 불필요한 조명·전자기기 끄기처럼 집이나 사무실 안에서 몇 초~몇 분이면 바로 끝나는 아주 간단한 행동으로만 제안하세요.
- "easy" 미션의 verificationInstructions는 인증 기준을 최대한 관대하게 작성하세요 — 정확한 상황(카페 계산대, 사용하는 순간 등)까지 요구하지 말고, 해당 사물(텀블러, 뽑힌 플러그 등)이 사진에 분명히 보이기만 하면 통과로 판정하도록 작성하세요.
- 전체적으로 "easy" 비중을 가장 높게, "hard"는 꼭 필요한 외부활동 미션에만 배정해 전반적인 난이도를 낮추세요.`;

  const prompt = `사용자 페르소나: ${persona.label} — ${persona.description}
환경 실천 점수(ecoActionScore, 0~100): ${input.ecoActionScore}
소비/에너지 발자국 점수(footprintScore, 0~100): ${input.footprintScore}
${input.ageRange ? `연령대: ${AGE_RANGE_LABELS[input.ageRange]}\n` : ""}직업: ${OCCUPATION_LABELS[input.occupation]}
주 이동수단: ${TRANSPORT_MODE_LABELS[input.transportMode]}
${input.interestArea ? `가장 관심있는 환경 활동: ${INTEREST_AREA_LABELS[input.interestArea]} (가능하면 이 활동과 연관된 미션을 하나 이상 포함할 것)\n` : ""}${feasibilityNotes.length > 0 ? `제약 조건:\n${feasibilityNotes.map((n) => `- ${n}`).join("\n")}\n` : ""}${
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
