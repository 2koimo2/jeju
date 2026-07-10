import type { SpeciesKey } from "./species";

// Native pixel size of each species' 4 growth-stage photos, straight from
// Figma (stage 0 is always the same 337x308 glowing-orb photo — every
// species has its own pre-composited version, not a generic overlay).
export const SPECIES_STAGE_NATIVE_SIZE: Record<
  SpeciesKey,
  readonly [
    { width: number; height: number },
    { width: number; height: number },
    { width: number; height: number },
    { width: number; height: number },
  ]
> = {
  umutgasari: [
    { width: 174, height: 159 },
    { width: 148, height: 187 },
    { width: 160, height: 227 },
    { width: 214, height: 329 },
  ],
  tot: [
    { width: 337, height: 308 },
    { width: 151, height: 231 },
    { width: 175, height: 453 },
    { width: 213, height: 664 },
  ],
  miyeok: [
    { width: 337, height: 308 },
    { width: 173, height: 239 },
    { width: 200, height: 391 },
    { width: 264, height: 620 },
  ],
  parae: [
    { width: 337, height: 308 },
    { width: 181, height: 184 },
    { width: 239, height: 217 },
    { width: 309, height: 276 },
  ],
  gamtae: [
    { width: 337, height: 308 },
    { width: 202, height: 246 },
    { width: 222, height: 400 },
    { width: 307, height: 543 },
  ],
  mojaban: [
    { width: 337, height: 308 },
    { width: 209, height: 375 },
    { width: 274, height: 544 },
    { width: 380, height: 686 },
  ],
};

// Growing display height per stage — the character should only grow taller
// as it levels up, never wider, so height is the sole thing that climbs
// stage over stage.
export const STAGE_TARGET_HEIGHT = [120, 190, 280, 380] as const;
export const STAGE_MAX_HEIGHT = STAGE_TARGET_HEIGHT[STAGE_TARGET_HEIGHT.length - 1];

/** Width is fixed to the Lv.1 ("stage 0") sprout's own aspect ratio at the
 * stage-0 target height, and reused for every later stage — the character
 * keeps the same footprint as it grows instead of widening stage over stage. */
export function stageWidth(species: SpeciesKey): number {
  const native0 = SPECIES_STAGE_NATIVE_SIZE[species][0];
  return Math.round(STAGE_TARGET_HEIGHT[0] * (native0.width / native0.height));
}

export function stageDisplaySize(species: SpeciesKey, stageIndex: number) {
  return { width: stageWidth(species), height: STAGE_TARGET_HEIGHT[stageIndex] };
}

export function stageImageSrc(species: SpeciesKey, stageIndex: number): string {
  return `/home/${species}-stage${stageIndex}.png`;
}

// Figma's 적정(optimal)/중간(medium)/고온(high) backdrop trio — 21-30°C is
// medium, 31-40°C is high, anything cooler is the default optimal scene.
export function backgroundImageSrc(temperatureC: number): string {
  if (temperatureC >= 31) return "/home/background-high.png";
  if (temperatureC >= 21) return "/home/background-medium.png";
  return "/home/background-optimal.png";
}
