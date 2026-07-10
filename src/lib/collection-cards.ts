import type { SpeciesKey } from "./species";

export type StageIcon = {
  src: string;
  top: number;
  left: number;
  width: number;
  height: number;
  /** Lv.1 icons only: soft white glow + circular crop, matching the Figma "seed" art. */
  glow?: boolean;
};

export type BackdropEchoLayer = {
  /** Tailwind position/size classes for the centering wrapper, copied verbatim from Figma. */
  wrapperClassName: string;
  /** Tailwind rotate/flip classes for the inner rotated box. */
  innerClassName: string;
  imgWidth: number;
  imgHeight: number;
  opacity?: number;
};

export type CollectionCardDef = {
  bannerColor: string;
  /** 도감 card description — distinct from SpeciesDef.description, which is written for the survey-result gift screen. */
  description: string;
  backdrop: { faded: BackdropEchoLayer; visible: BackdropEchoLayer };
  /** Lv.1 / Lv.4 / Lv.12 / Lv.20, in that order. */
  stageIcons: [StageIcon, StageIcon, StageIcon, StageIcon];
};

const p = (file: string) => `/collection/species/${file}`;

export const COLLECTION_CARD_DEFS: Record<SpeciesKey, CollectionCardDef> = {
  umutgasari: {
    bannerColor: "#ffcad8",
    description:
      "제주 바다를 대표하는 해조류로, 한천의 원료가 되는 소중한 바다 식물이에요. 바다 생태계를 건강하게 지키고 탄소를 흡수하는 역할도 한답니다.",
    backdrop: {
      faded: {
        wrapperClassName: "left-[-240.26px] size-[557.454px] top-[-124.14px]",
        innerClassName: "-rotate-135 -scale-y-100",
        imgWidth: 310.318,
        imgHeight: 478.041,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "left-[180.07px] top-[-97.4px] h-[299.262px] w-[252.872px]",
        innerClassName: "-scale-y-100 rotate-[156.55deg]",
        imgWidth: 165.229,
        imgHeight: 254.533,
      },
    },
    stageIcons: [
      {
        src: p("umutgasari-lv1.png"),
        top: 305.13,
        left: 26.86,
        width: 42.698,
        height: 39.023,
        glow: true,
      },
      {
        src: p("umutgasari-lv4.png"),
        top: 287.2,
        left: 91.85,
        width: 50.476,
        height: 63.682,
      },
      {
        src: p("umutgasari-lv12.png"),
        top: 273.81,
        left: 164.86,
        width: 54.45,
        height: 77.408,
      },
      {
        src: p("umutgasari-lv20.png"),
        top: 238.88,
        left: 241.86,
        width: 72.702,
        height: 111.996,
      },
    ],
  },
  gamtae: {
    bannerColor: "#def4c6",
    description:
      "제주 청정 바다에서 자라는 감태예요. 풍부한 영양을 품고 바다 생태계를 건강하게 지키는 소중한 해조류랍니다.",
    backdrop: {
      faded: {
        wrapperClassName:
          "-translate-x-1/2 left-[calc(50%-140.7px)] size-[478.062px] top-[-102.9px]",
        innerClassName: "rotate-45",
        imgWidth: 244.504,
        imgHeight: 431.577,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "-translate-x-1/2 left-[calc(50%+76.68px)] h-[339.866px] top-[-130.32px] w-[267.237px]",
        innerClassName: "rotate-[-21.62deg]",
        imgWidth: 169.14,
        imgHeight: 298.552,
      },
    },
    stageIcons: [
      {
        src: p("gamtae-lv1.png"),
        top: 308.06,
        left: 23.24,
        width: 43.044,
        height: 39.34,
        glow: true,
      },
      {
        src: p("gamtae-lv4.png"),
        top: 294.25,
        left: 93.44,
        width: 46.877,
        height: 56.967,
      },
      {
        src: p("gamtae-lv12.png"),
        top: 254.06,
        left: 167.47,
        width: 53.803,
        height: 96.819,
      },
      {
        src: p("gamtae-lv20.png"),
        top: 225.26,
        left: 241.82,
        width: 71.078,
        height: 125.46,
      },
    ],
  },
  parae: {
    bannerColor: "#e3e3e3",
    description:
      "제주 연안에서 쉽게 만날 수 있는 초록빛 해조류예요. 바다 생물과 함께 살아가며 제주 바다를 더욱 풍요롭게 만들어 줍니다.",
    backdrop: {
      faded: {
        wrapperClassName:
          "left-[-286.67px] h-[582.015px] top-[-264.48px] w-[578.976px]",
        innerClassName: "rotate-[47.66deg]",
        imgWidth: 434.032,
        imgHeight: 387.8,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "left-[170.16px] h-[245.661px] top-[-29.74px] w-[252.762px]",
        innerClassName: "rotate-[-30.79deg]",
        imgWidth: 192.008,
        imgHeight: 171.555,
      },
    },
    stageIcons: [
      {
        src: p("parae-lv1.png"),
        top: 314.58,
        left: 23.69,
        width: 39.712,
        height: 36.295,
        glow: true,
      },
      {
        src: p("parae-lv4.png"),
        top: 305.18,
        left: 94.77,
        width: 44.96,
        height: 45.693,
      },
      {
        src: p("parae-lv12.png"),
        top: 291.11,
        left: 157.15,
        width: 65.989,
        height: 59.769,
      },
      {
        src: p("parae-lv20.png"),
        top: 270.23,
        left: 226.98,
        width: 90.258,
        height: 80.644,
      },
    ],
  },
  tot: {
    bannerColor: "#f3edb7",
    description:
      "제주 연안에서 자라는 대표 갈조류예요. 작은 바다 생물들의 보금자리가 되어 제주 바다를 더욱 풍요롭게 만들어 줍니다.",
    backdrop: {
      faded: {
        wrapperClassName:
          "left-[-237.87px] h-[697.064px] top-[-131.59px] w-[592.066px]",
        innerClassName: "rotate-[36.01deg]",
        imgWidth: 223.811,
        imgHeight: 699.072,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "left-[183.77px] h-[439.827px] top-[-167.68px] w-[238.228px]",
        innerClassName: "-rotate-15",
        imgWidth: 134.262,
        imgHeight: 419.367,
      },
    },
    stageIcons: [
      {
        src: p("tot-lv1.png"),
        top: 312,
        left: 20.61,
        width: 42.178,
        height: 38.549,
        glow: true,
      },
      {
        src: p("tot-lv4.png"),
        top: 295,
        left: 98.86,
        width: 36.291,
        height: 55.556,
      },
      {
        src: p("tot-lv12.png"),
        top: 251.9,
        left: 174.06,
        width: 38.089,
        height: 98.649,
      },
      {
        src: p("tot-lv20.png"),
        top: 201.85,
        left: 251.06,
        width: 47.819,
        height: 149.363,
      },
    ],
  },
  miyeok: {
    bannerColor: "#ccffde",
    description:
      "제주 바다의 영양을 가득 머금고 자라는 미역이에요. 다양한 영양소를 품은 대표 해조류로 오래전부터 사랑받아 왔습니다.",
    backdrop: {
      faded: {
        wrapperClassName: "left-[-274.07px] size-[760.059px] top-[-226.68px]",
        innerClassName: "rotate-45",
        imgWidth: 320.58,
        imgHeight: 754.305,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "left-[142.34px] h-[419.229px] top-[-171.6px] w-[267.558px]",
        innerClassName: "rotate-[-16.31deg]",
        imgWidth: 165.111,
        imgHeight: 388.496,
      },
    },
    stageIcons: [
      {
        src: p("miyeok-lv1.png"),
        top: 312.25,
        left: 20.88,
        width: 42.263,
        height: 38.626,
        glow: true,
      },
      {
        src: p("miyeok-lv4.png"),
        top: 295.48,
        left: 94.77,
        width: 40.036,
        height: 55.393,
      },
      {
        src: p("miyeok-lv12.png"),
        top: 256,
        left: 174.62,
        width: 48.52,
        height: 95.215,
      },
      {
        src: p("miyeok-lv20.png"),
        top: 219.85,
        left: 248.61,
        width: 55.83,
        height: 131.365,
      },
    ],
  },
  mojaban: {
    bannerColor: "#f3ffd1",
    description:
      "제주 바다를 대표하는 갈조류예요. 작은 생물들의 보금자리가 되어주고, 바닷속 생태계를 건강하게 지키는 중요한 해조류입니다.",
    backdrop: {
      faded: {
        wrapperClassName:
          "left-[-404.2px] h-[711.72px] top-[-227.58px] w-[830.573px]",
        innerClassName: "rotate-60",
        imgWidth: 402.162,
        imgHeight: 726.875,
        opacity: 0.2,
      },
      visible: {
        wrapperClassName:
          "left-[125.88px] h-[401.414px] top-[-153.9px] w-[343.972px]",
        innerClassName: "-rotate-30",
        imgWidth: 194.364,
        imgHeight: 351.297,
      },
    },
    stageIcons: [
      {
        src: p("mojaban-lv1.png"),
        top: 313,
        left: 25.56,
        width: 36.432,
        height: 33.296,
        glow: true,
      },
      {
        src: p("mojaban-lv4.png"),
        top: 279.92,
        left: 98.86,
        width: 37.048,
        height: 66.379,
      },
      {
        src: p("mojaban-lv12.png"),
        top: 245.34,
        left: 168.01,
        width: 50.913,
        height: 100.954,
      },
      {
        src: p("mojaban-lv20.png"),
        top: 220.43,
        left: 244.27,
        width: 70.395,
        height: 127.233,
      },
    ],
  },
};

/** The Lv.20 stage icon doubles as the backdrop echo source for each species. */
export function backdropSrc(speciesKey: SpeciesKey): string {
  return COLLECTION_CARD_DEFS[speciesKey].stageIcons[3].src;
}

/** The Lv.1 ("seed") stage icon. */
export function lv1IconSrc(speciesKey: SpeciesKey): string {
  return COLLECTION_CARD_DEFS[speciesKey].stageIcons[0].src;
}

/** The Lv.4 ("2단계") stage icon. */
export function lv4IconSrc(speciesKey: SpeciesKey): string {
  return COLLECTION_CARD_DEFS[speciesKey].stageIcons[1].src;
}
