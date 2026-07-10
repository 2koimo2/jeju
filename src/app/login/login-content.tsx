"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "./google-signin-button";

export function LoginContent() {
  const searchParams = useSearchParams();
  const failed = searchParams.get("error") === "oauth_failed";

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden">
      <Image
        src="/login/background.jpg"
        alt=""
        fill
        priority
        className="object-cover object-top"
      />

      <Image
        src="/login/title-logo.png"
        alt="키워봅서예 바다의 숲"
        width={373}
        height={373}
        priority
        className="absolute left-[5%] top-[7.4%] h-auto w-[93%]"
      />

      <Image
        src="/login/seaweed-character.png"
        alt=""
        aria-hidden="true"
        width={505}
        height={991}
        className="absolute left-[39%] top-[46%] h-auto w-[26%]"
      />

      <Image
        src="/login/sea-moss-rock-character.png"
        alt=""
        aria-hidden="true"
        width={368}
        height={374}
        className="absolute left-[69%] top-[70%] h-auto w-[20%]"
      />

      <svg
        className="absolute left-[4%] top-[74%] w-[25%]"
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
        width={494}
        height={761}
        className="absolute left-[11%] top-[65%] h-auto w-[29%]"
      />

      <p className="absolute top-[38%] left-1/2 w-full -translate-x-1/2 text-center font-display text-2xl text-[#099b9b]">
        in Jeju
      </p>

      {failed && (
        <p className="absolute top-[79%] left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-white/90 px-3 py-2 text-center text-sm font-korean text-red-600 shadow">
          로그인에 실패했어요. 다시 시도해주세요.
        </p>
      )}

      <div className="absolute top-[87.6%] left-1/2 w-[77%] -translate-x-1/2">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
