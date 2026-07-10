"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SpeciesKey } from "@/lib/species";
import { MissionsOverlay } from "./missions-overlay";

// Native pixel size of each species' 4 growth-stage photos, straight from
// Figma (stage 0 is always the same 337x308 glowing-orb photo — every
// species has its own pre-composited version, not a generic overlay).
const SPECIES_STAGE_NATIVE_SIZE: Record<
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

// Growing display height per stage — each species' width is derived from
// its own native aspect ratio so nothing gets stretched, but the overall
// scale still climbs stage over stage regardless of species.
const STAGE_TARGET_HEIGHT = [120, 190, 280, 380] as const;

function stageDisplaySize(species: SpeciesKey, stageIndex: number) {
  const native = SPECIES_STAGE_NATIVE_SIZE[species][stageIndex];
  const height = STAGE_TARGET_HEIGHT[stageIndex];
  const width = Math.round(height * (native.width / native.height));
  return { width, height };
}

function stageImageSrc(species: SpeciesKey, stageIndex: number): string {
  return `/home/${species}-stage${stageIndex}.png`;
}

// Figma's 적정(optimal)/중간(medium)/고온(high) backdrop trio — 21-30°C is
// medium, 31-40°C is high, anything cooler is the default optimal scene.
function backgroundImageSrc(temperatureC: number): string {
  if (temperatureC >= 31) return "/home/background-high.png";
  if (temperatureC >= 21) return "/home/background-medium.png";
  return "/home/background-optimal.png";
}

const HOT_MESSAGES = ["아 더워...", "너무 뜨거워요...", "시원해지고 싶어요..."];
const WARM_MESSAGES = ["오늘도 무럭무럭!", "조금만 더 식으면 좋겠어요"];
const COOL_MESSAGES = ["기분 좋아요!", "시원해서 좋아요~", "쑥쑥 자라는 중이에요!"];

function pickMessage(temperatureC: number): string {
  const pool =
    temperatureC >= 30 ? HOT_MESSAGES : temperatureC >= 20 ? WARM_MESSAGES : COOL_MESSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function HomeContent({
  seaName,
  species,
  level,
  stageIndex,
  temperatureC,
  openMissions,
}: {
  seaName: string;
  species: SpeciesKey;
  level: number;
  stageIndex: number;
  temperatureC: number;
  openMissions?: boolean;
}) {
  const [bubble, setBubble] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const size = stageDisplaySize(species, stageIndex);

  useEffect(() => {
    if (!bubble) return;
    const timer = setTimeout(() => setBubble(null), 3000);
    return () => clearTimeout(timer);
  }, [bubble]);

  const handleClick = () => {
    setBubble(pickMessage(temperatureC));
    setBump(true);
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#37c9d6]">
      <div className="fixed inset-0 z-0 flex justify-center overflow-hidden">
        <div className="relative h-full w-full max-w-sm">
          <Image
            src={backgroundImageSrc(temperatureC)}
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pt-[26px]">
        <p className="font-korean font-bold text-black">
          <span className="text-[28px]">{seaName}</span>
          <span className="text-[20px]">바다</span>
        </p>
        <MissionsOverlay temperatureC={temperatureC} openInitially={openMissions} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="relative flex flex-col items-center gap-3">
          {bubble && (
            <div className="absolute bottom-full left-1/2 mb-2 h-[173px] w-[242px] -translate-x-1/2">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- exact
                    Figma crop of a much taller source canvas; next/image's
                    width/height would distort the aspect ratio instead. */}
                <img
                  src="/home/speech-bubble.png"
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: "252.73%",
                    height: "767.51%",
                    left: "-57.45%",
                    top: "-326.4%",
                    maxWidth: "none",
                  }}
                />
              </div>
              <p className="font-jeju absolute inset-x-3 top-[30%] text-center text-[22px] leading-tight text-[#7f5b3b]">
                {bubble}
              </p>
            </div>
          )}

          <p className="font-jeju text-[24px] text-[#7f5b3b]">Lv.{level}</p>

          <div className="seaweed-float" style={{ width: size.width, height: size.height }}>
            <button
              type="button"
              onClick={handleClick}
              onAnimationEnd={() => setBump(false)}
              aria-label="해초 캐릭터"
              className={`block size-full ${bump ? "seaweed-bump" : ""}`}
            >
              <Image
                src={stageImageSrc(species, stageIndex)}
                alt=""
                width={size.width}
                height={size.height}
                priority
                className="size-full object-contain"
              />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .seaweed-float {
          animation: seaweed-bob 3s ease-in-out infinite;
        }
        .seaweed-bump {
          animation: seaweed-squish 400ms ease-out;
        }
        @keyframes seaweed-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes seaweed-squish {
          0% { transform: scale(1, 1); }
          30% { transform: scale(0.85, 1.15); }
          60% { transform: scale(1.12, 0.9); }
          100% { transform: scale(1, 1); }
        }
      `}</style>
    </div>
  );
}
