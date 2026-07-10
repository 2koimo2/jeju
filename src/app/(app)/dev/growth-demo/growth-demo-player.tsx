"use client";

import { useEffect, useRef, useState } from "react";
import { stageIndexForLevel, MAX_LEVEL } from "@/lib/seaweed-growth";
import { HomeContent } from "../../(main)/character/home-content";
import { BottomTabBar } from "../../(main)/bottom-tab-bar";

const DURATION_MS = 10_000;
const MIN_LEVEL = 1;

/** Renders the real home screen (HomeContent, unmodified) but drives its
 * level/stageIndex from a 10-second timer instead of the actual persisted
 * growth state — compresses the days-long real growth into a filmable clip,
 * on this screen only. The bottom tab bar is included for visual context only
 * (its nav links are real, but nothing here depends on them working). */
export function GrowthDemoPlayer({ seaName }: { seaName: string }) {
  const [level, setLevel] = useState(MIN_LEVEL);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const fraction = Math.min(1, elapsed / DURATION_MS);
      setLevel(
        Math.min(
          MAX_LEVEL,
          Math.round(MIN_LEVEL + fraction * (MAX_LEVEL - MIN_LEVEL)),
        ),
      );
      if (elapsed < DURATION_MS) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <HomeContent
        seaName={seaName}
        species="umutgasari"
        level={level}
        stageIndex={stageIndexForLevel(level)}
        temperatureC={20}
      />
      <BottomTabBar />
    </>
  );
}
