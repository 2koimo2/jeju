"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { SpeciesKey } from "@/lib/species";
import {
  backgroundImageSrc,
  stageDisplaySize,
  stageImageSrc,
} from "@/lib/home-stage-art";
import { MissionsOverlay } from "./missions-overlay";

function CheckIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-16" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#00c8c9" />
      <path
        d="M19 33.5L27.5 42L45 22"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompletionOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="닫기"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="flex size-[220px] flex-col items-center justify-center gap-3 rounded-[24px] bg-white shadow-xl">
        <CheckIcon />
        <p className="font-korean text-lg font-bold text-black">
          완료되었습니다!
        </p>
      </div>
    </button>
  );
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
  justCompleted,
}: {
  seaName: string;
  species: SpeciesKey;
  level: number;
  stageIndex: number;
  temperatureC: number;
  openMissions?: boolean;
  justCompleted?: boolean;
}) {
  const router = useRouter();
  const [bubble, setBubble] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const [showCompletion, setShowCompletion] = useState(justCompleted ?? false);
  const size = stageDisplaySize(species, stageIndex);

  useEffect(() => {
    if (!justCompleted) return;
    // Strip the ?completed=1 param so a refresh/back-nav doesn't replay the
    // overlay; showCompletion already captured the initial value above, so
    // this re-navigation doesn't affect whether it's currently showing.
    router.replace("/character", { scroll: false });
    const timer = setTimeout(() => setShowCompletion(false), 2500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <>
      {showCompletion && (
        <CompletionOverlay onDismiss={() => setShowCompletion(false)} />
      )}
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#37c9d6]">
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
          {/* Fixed-height slot for the level label so the group's centering
              math doesn't shift when the speech bubble swaps in — the bubble
              is anchored to this same slot (bottom-aligned, so it rises up
              and covers the level from above) instead of floating further up
              the screen where it used to get clipped by the top edge. */}
          <div className="relative flex h-[33px] items-center justify-center">
            <p
              className={`font-jeju text-[24px] text-[#7f5b3b] transition-opacity ${bubble ? "opacity-0" : "opacity-100"}`}
            >
              Lv.{level}
            </p>

            {bubble && (
              <div className="absolute bottom-0 left-1/2 z-20 h-[173px] w-[242px] -translate-x-1/2">
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
          </div>

          {/* Sized to the current stage's actual footprint (not a fixed
              max-height reservation) so justify-center above centers the
              character that's actually on screen, instead of centering a
              much taller invisible box and leaving small early-stage
              characters looking stuck near the bottom of the viewport. */}
          <div
            className="seaweed-float"
            style={{ width: size.width, height: size.height }}
          >
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
    </>
  );
}
