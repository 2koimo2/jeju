import type { PersonaKey } from "./persona";

export const SPECIES_KEYS = [
  "miyeok",
  "tot",
  "parae",
  "umutgasari",
  "gamtae",
  "mojaban",
] as const;

export type SpeciesKey = (typeof SPECIES_KEYS)[number];

/**
 * Only 4 of the 6 species are reachable today — 미역(miyeok)/감태(gamtae) are reserved
 * for future unlocks (e.g. tied to interestArea or growth milestones) rather than being
 * assigned as a survey starter gift.
 */
export const PERSONA_SPECIES: Record<PersonaKey, SpeciesKey> = {
  habit_builder: "umutgasari",
  quiet_minimalist: "parae",
  eco_striver: "tot",
  green_master: "mojaban",
};

export type SpeciesDef = {
  name: string;
  tagline: string;
  description: string;
  traits: { emoji: string; text: string }[];
  /** Large portrait shown on the survey-result gift screen. */
  image: string;
  /** Small icon shown in the Lv.0 preview card; falls back to `image` if unset. */
  cardImage?: string;
  /** Pastel banner background behind the portrait on the gift screen. */
  bannerColor: string;
};

export const SPECIES_DEFS: Partial<Record<SpeciesKey, SpeciesDef>> = {
  umutgasari: {
    name: "우뭇가사리",
    tagline: "마음만은 환경지킴이",
    description:
      "우뭇가사리는 눈에 잘 띄지 않지만 바다를 묵묵히 지키는 해조류예요. 당신도 환경을 아끼는 마음은 크지만 아직은 실천이 서툴 뿐, 작은 한 걸음이 큰 변화를 만들어낼 수 있어요.",
    traits: [
      { emoji: "💗", text: "환경을 아끼는 마음" },
      { emoji: "🌱", text: "작은 실천부터 시작" },
      { emoji: "🌊", text: "꾸준한 성장" },
      { emoji: "🪸", text: "묵묵한 바다지킴이" },
    ],
    image: "/login/agar-character.png",
    cardImage: "/loading/umut.png",
    bannerColor: "#ffcad8",
  },
  tot: {
    name: "톳",
    tagline: "포기하지 않는 도전형",
    description:
      "톳은 거센 파도를 이겨내며 바위에 단단히 뿌리내리는 해조류예요. 당신도 환경에 대한 관심은 크지만 바쁜 일상 속 발자국까지 줄이긴 아직 어려운 편, 꾸준히 실천을 더하면 그 마음이 단단한 결실로 이어질 거예요.",
    traits: [
      { emoji: "🔥", text: "뜨거운 환경 관심" },
      { emoji: "💪", text: "포기하지 않는 근성" },
      { emoji: "🌊", text: "파도를 이겨내는 힘" },
      { emoji: "🎯", text: "실천으로 완성되는 다짐" },
    ],
    image: "/loading/tot.png",
    bannerColor: "#fff1b8",
  },
  parae: {
    name: "파래",
    tagline: "티 안나는 친환경 고수",
    description:
      "파래는 화려하지 않아도 어디서나 씩씩하게 자라는 흔하고 소박한 해조류예요. 당신은 환경을 크게 의식하지 않아도 이미 검소한 생활로 발자국을 작게 남기고 있어요. 스스로 알아차리기만 하면 누구보다 훌륭한 친환경 실천가예요.",
    traits: [
      { emoji: "🌿", text: "은근한 친환경 습관" },
      { emoji: "😌", text: "부담 없는 미니멀 라이프" },
      { emoji: "🌊", text: "어디서나 씩씩하게" },
      { emoji: "🍃", text: "소박하지만 확실하게" },
    ],
    image: "/login/sea-moss-rock-character.png",
    bannerColor: "#d9f2d0",
  },
  mojaban: {
    name: "모자반",
    tagline: "완성형 바다지킴이",
    description:
      "모자반은 넓은 바다숲을 이루며 다른 생물들의 보금자리가 되어주는 해조류예요. 당신은 환경을 아끼는 마음도, 실제 발자국을 줄이는 습관도 이미 자리 잡은 편이에요. 이제는 더 큰 도전으로 바다숲을 넓혀갈 차례예요.",
    traits: [
      { emoji: "🌳", text: "넓게 퍼지는 바다숲" },
      { emoji: "🏡", text: "다른 생물의 보금자리" },
      { emoji: "🌊", text: "이미 자리잡은 좋은 습관" },
      { emoji: "🚀", text: "다음 도전을 향해" },
    ],
    // Placeholder — no dedicated 모자반 art exists yet; swap in real art when available.
    image: "/loading/green.png",
    bannerColor: "#cfeee6",
  },
};
