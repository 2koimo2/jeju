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

/** One rotated copy of the hero portrait used as banner backdrop texture in Figma. */
export type BackdropLayer = {
  top: number;
  left: number;
  width: number;
  height: number;
  rotate: number;
  flipY?: boolean;
  opacity?: number;
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
  /** Closing line of the gift message, e.g. "소중히 키워 제주의 바다를 지켜주세요." */
  giftClosing: string;
  /** The two rotated/bled copies of `image` behind the banner text, from the Figma "present" frames. */
  heroBackdrop: { faded: BackdropLayer; visible: BackdropLayer };
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
    giftClosing: "소중히 키워 제주의 바다를 지켜주세요.",
    heroBackdrop: {
      faded: {
        top: -56.94,
        left: -101.18,
        width: 346.961,
        height: 534.489,
        rotate: -135,
        flipY: true,
        opacity: 0.2,
      },
      visible: {
        top: 33.47,
        left: 261.26,
        width: 165.229,
        height: 254.533,
        rotate: 151.58,
        flipY: true,
      },
    },
  },
  tot: {
    name: "톳",
    tagline: "노력하여 바꾸어 나가는",
    description:
      "톳은 거친 바다에서도 단단하게 자라며 건강한 바다숲을 만드는 해조류예요. 당신은 완벽하지 않아도 꾸준한 노력으로 더 나은 환경을 만들어가는 성장형 실천가예요.",
    traits: [
      { emoji: "💪", text: "꾸준한 실천" },
      { emoji: "🌿", text: "작은 변화도 놓치지 않기" },
      { emoji: "📈", text: "어제보다 오늘 더 성장" },
      { emoji: "🌊", text: "환경을 위한 습관을 만들기" },
    ],
    image: "/species/tot-hero.png",
    cardImage: "/loading/tot.png",
    bannerColor: "#f3edb7",
    giftClosing: "한 걸음씩 키워 제주의 바다숲을 함께 만들어 주세요.",
    heroBackdrop: {
      faded: {
        top: -167.32,
        left: -166.64,
        width: 310.982,
        height: 971.349,
        rotate: 36.01,
        opacity: 0.2,
      },
      visible: {
        top: -32.94,
        left: 280.9,
        width: 134.262,
        height: 419.367,
        rotate: -24.17,
      },
    },
  },
  parae: {
    name: "파래",
    tagline: "조용한 미니멀리스트",
    description:
      "파래는 바위에 조용히 붙어 자라며 바다를 깨끗하게 만드는 해조류예요. 당신도 꼭 필요한 순간에만 행동하지만, 작은 실천 하나하나가 환경을 지키는 큰 힘이 되고 있어요.",
    traits: [
      { emoji: "🤍", text: "꼭 필요한 만큼만 소비" },
      { emoji: "🌱", text: "조용히 꾸준히 실천" },
      { emoji: "🌊", text: "자연스럽게 환경을 생각" },
      { emoji: "🍃", text: "소박하지만 오래가는 습관" },
    ],
    image: "/species/parae-hero.png",
    cardImage: "/login/sea-moss-rock-character.png",
    bannerColor: "#e3e3e3",
    giftClosing: "차근차근 키워 제주의 바다를 푸르게 물들여 주세요.",
    heroBackdrop: {
      faded: {
        top: 12.7,
        left: -227.87,
        width: 434.032,
        height: 387.8,
        rotate: 23.79,
        opacity: 0.2,
      },
      visible: {
        top: 90.96,
        left: 252.88,
        width: 192.008,
        height: 171.555,
        rotate: -30.79,
      },
    },
  },
  mojaban: {
    name: "모자반",
    tagline: "환경 보호의 왕 그린마스터",
    description:
      "모자반은 울창한 숲을 이루어 수많은 바다 생물들의 보금자리가 되는 해조류예요. 당신은 환경을 먼저 생각하고, 실천으로 주변에도 긍정적인 영향을 전하는 든든한 바다 지킴이예요.",
    traits: [
      { emoji: "👑", text: "환경 보호를 앞장서 실천" },
      { emoji: "🐟", text: "주변에도 좋은 영향을 전도" },
      { emoji: "🌿", text: "꾸준한 친환경 습관" },
      { emoji: "💚", text: "모두가 함께하는 변화" },
    ],
    image: "/species/mojaban-hero.png",
    cardImage: "/species/mojaban-card.png",
    bannerColor: "#f3ffd1",
    giftClosing: "든든하게 키워 제주의 바다숲을 함께 지켜주세요.",
    heroBackdrop: {
      faded: {
        top: -89.41,
        left: -171.37,
        width: 402.162,
        height: 726.875,
        rotate: 34.77,
        opacity: 0.2,
      },
      visible: {
        top: 1.18,
        left: 250.5,
        width: 189.958,
        height: 343.334,
        rotate: -30,
      },
    },
  },
};

/**
 * Display name for every species, including miyeok/gamtae which have no SPECIES_DEFS
 * entry yet. Use this (not SPECIES_DEFS[key].name) wherever a name must always be
 * present, e.g. the 도감 icon strip and shop category pills.
 */
export const SPECIES_NAMES: Record<SpeciesKey, string> = {
  miyeok: "미역",
  tot: "톳",
  parae: "파래",
  umutgasari: "우뭇가사리",
  gamtae: "감태",
  mojaban: "모자반",
};
