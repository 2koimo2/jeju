import type { SpeciesKey } from "./species";

export type Product = {
  id: string;
  title: string;
  species: SpeciesKey;
  price: number;
  discountPct: number;
  /** "이 해초 N개를 모으면 할인가로 살 수 있어요" 안내 문구용 — 실제 보유량이 아니다. */
  requiredCount: number;
  /** 실제 상품 사진 경로. 아직 없으면 undefined -> 종 배너 컬러의 플레이스홀더 블록으로 대체. */
  image?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "umutgasari-pudding",
    title: "[우무푸딩] 뽀얀 컵에 제주를 담다",
    species: "umutgasari",
    price: 6000,
    discountPct: 15,
    requiredCount: 5,
    image: "/collection/products/umutgasari-pudding.png",
  },
  {
    id: "umutgasari-soap",
    title: "우뭇가사리 비누",
    species: "umutgasari",
    price: 8900,
    discountPct: 10,
    requiredCount: 3,
  },
  {
    id: "tot-jelly",
    title: "[톳젤리] 새벽바다를 담다",
    species: "tot",
    price: 6000,
    discountPct: 15,
    requiredCount: 3,
    image: "/collection/products/tot-jelly.png",
  },
  {
    id: "tot-powder",
    title: "톳 미숫가루",
    species: "tot",
    price: 12000,
    discountPct: 10,
    requiredCount: 4,
  },
  {
    id: "parae-snack",
    title: "[오늘 좋은] 우리 쌀로 만든 파래부각",
    species: "parae",
    price: 6000,
    discountPct: 15,
    requiredCount: 4,
    image: "/collection/products/parae-snack.png",
  },
  {
    id: "parae-gim",
    title: "파래 김",
    species: "parae",
    price: 5000,
    discountPct: 10,
    requiredCount: 2,
  },
  {
    id: "miyeok-dolmiyeok",
    title: "[제주 돌미역] 해녀가 직접 채취하다",
    species: "miyeok",
    price: 6000,
    discountPct: 15,
    requiredCount: 2,
    image: "/collection/products/miyeok-dolmiyeok.png",
  },
  {
    id: "miyeok-guk-kit",
    title: "미역국 밀키트",
    species: "miyeok",
    price: 9000,
    discountPct: 10,
    requiredCount: 3,
  },
  {
    id: "gamtae-gim",
    title: "감태 김",
    species: "gamtae",
    price: 7000,
    discountPct: 15,
    requiredCount: 3,
  },
  {
    id: "gamtae-soap",
    title: "감태 비누",
    species: "gamtae",
    price: 8500,
    discountPct: 10,
    requiredCount: 4,
  },
  {
    id: "mojaban-banchan",
    title: "모자반 무침",
    species: "mojaban",
    price: 7500,
    discountPct: 15,
    requiredCount: 3,
  },
  {
    id: "mojaban-oil",
    title: "모자반 오일",
    species: "mojaban",
    price: 13000,
    discountPct: 10,
    requiredCount: 5,
  },
];

/** Products with a real photo first, then by price ascending within each group. */
function sortForDisplay(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const hasImageDiff = Number(!!b.image) - Number(!!a.image);
    if (hasImageDiff !== 0) return hasImageDiff;
    return a.price - b.price;
  });
}

export function getProductsBySpecies(species?: SpeciesKey): Product[] {
  const filtered = species
    ? PRODUCTS.filter((product) => product.species === species)
    : PRODUCTS;
  return sortForDisplay(filtered);
}
