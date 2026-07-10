"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DESIGN_WIDTH = 402;
const DESIGN_HEIGHT = 874;
const MAX_WIDTH = 448; // matches the old max-w-md cap on desktop

function useFitScale() {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const vw = Math.min(window.innerWidth, MAX_WIDTH);
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setScale(Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  return scale;
}

export function SurveyIntroContent() {
  const scale = useFitScale();

  return (
    <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#f7eedd]">
      <div
        className="relative h-[874px] w-[402px] shrink-0 overflow-hidden"
        style={{ transform: `scale(${scale})` }}
      >
        <Image
          src="/onboarding/survey-intro/background.jpg"
          alt=""
          aria-hidden="true"
          width={563}
          height={1001}
          priority
          className="absolute top-0 -left-[63.15px] h-[1000.72px] w-[562.91px] max-w-none object-cover"
        />

        <Image
          src="/onboarding/survey-intro/seaweed-wave.png"
          alt=""
          aria-hidden="true"
          width={185}
          height={436}
          priority
          className="absolute top-[265px] left-[calc(25%+8.7px)] h-[435.88px] w-[185.25px]"
        />

        <div className="font-korean absolute top-[110px] left-1/2 flex w-[402px] -translate-x-1/2 flex-col items-center gap-[10px] px-4 py-5 text-center">
          <h1 className="text-[28px] leading-[41px] font-bold text-[#262321]">
            몇 가지만 물어봐도 될까양?
          </h1>
          <p className="text-[20px] leading-[32px] font-medium text-[#776b63]">
            딱 맞는 탄소 절감 미션을 <br />
            준비해드릴게 마씸.
          </p>
        </div>

        <Link
          href="/missions"
          className="font-korean absolute top-[749.47px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[14px] font-medium whitespace-nowrap text-[#776b63] underline"
        >
          싫어, 바다보러갈래
        </Link>

        <Link
          href="/survey"
          className="font-korean absolute top-[776px] left-4 flex h-[64px] w-[370px] items-center justify-center rounded-[15px] bg-[#7d5200] text-center text-[20px] font-bold text-white"
        >
          좋아! 개인맞춤 설문하러가기
        </Link>
      </div>
    </div>
  );
}
