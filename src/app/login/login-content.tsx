"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "./google-signin-button";

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

export function LoginContent() {
  const searchParams = useSearchParams();
  const failed = searchParams.get("error") === "oauth_failed";
  const scale = useFitScale();

  return (
    <div
      className="flex h-dvh w-full items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/login/background.jpg)" }}
    >
      <div
        className="relative h-[874px] w-[402px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <Image
          src="/login/background.jpg"
          alt=""
          width={492}
          height={874}
          priority
          className="absolute top-0 -left-[45.37px] h-[874px] w-[492px] max-w-none object-cover"
        />

        <div className="absolute top-0 left-1/2 h-[438px] w-[402px] -translate-x-1/2">
          <Image
            src="/login/title-logo.png"
            alt="키워봅서예 바다의 숲"
            width={373}
            height={373}
            priority
            className="absolute top-[65px] left-[20.63px] size-[373px]"
          />

          <p className="absolute top-[333px] left-[201.13px] w-[119px] -translate-x-1/2 text-center font-display text-[23px] leading-[41px] text-[#099b9b]">
            in Jeju
          </p>
        </div>

        <Image
          src="/login/seaweed-character.png"
          alt=""
          aria-hidden="true"
          width={104}
          height={205}
          className="absolute top-[401.25px] left-[156.63px] h-[205px] w-[104px]"
        />

        <Image
          src="/login/sea-moss-rock-character.png"
          alt=""
          aria-hidden="true"
          width={82}
          height={83}
          className="absolute top-[614.41px] left-[277.63px] h-[83px] w-[82px]"
        />

        <svg
          className="absolute top-[647.5px] left-[16.63px] h-[43.5px] w-[100.5px]"
          viewBox="0 0 100.5 43.5"
          fill="none"
          aria-hidden="true"
        >
          <path d="M50.5 0L0 14V36L68.5 43.5L100.5 24L50.5 0Z" fill="#FACD75" />
        </svg>

        <Image
          src="/login/agar-character.png"
          alt=""
          aria-hidden="true"
          width={117}
          height={180}
          className="absolute top-[565.91px] left-[45.63px] h-[180px] w-[117px]"
        />

        {failed && (
          <p className="absolute top-[700px] left-[201px] w-[308px] -translate-x-1/2 rounded-lg bg-white/90 px-3 py-2 text-center text-sm font-korean text-red-600 shadow">
            로그인에 실패했어요. 다시 시도해주세요.
          </p>
        )}

        <div className="absolute top-[87.6%] left-1/2 w-[77%] -translate-x-1/2">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
