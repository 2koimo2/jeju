import Image from "next/image";
import Link from "next/link";

// Background art is drawn at the iPhone 17 viewport (402x874). Capping the
// card at max-w-md (matches the rest of the app's desktop cap) keeps that
// framing on phones — which are all narrower than the cap — while stopping
// the photo from stretching edge-to-edge across a wide desktop viewport.

export function SurveyIntroContent() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#f7eedd]">
      <div className="relative flex min-h-dvh w-full max-w-md flex-col overflow-hidden">
        <Image
          src="/onboarding/survey-intro/background.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(min-width: 448px) 448px, 100vw"
          className="object-cover"
        />

        <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pt-16 pb-8 text-center">
          <h1 className="font-korean text-[28px] leading-[41px] font-bold text-[#262321]">
            몇 가지만 물어봐도 될까양?
          </h1>
          <p className="font-korean mt-[10px] text-[20px] leading-[32px] font-medium text-[#776b63]">
            딱 맞는 탄소 절감 미션을 <br />
            준비해드릴게 마씸.
          </p>

          <div className="relative mt-8 w-[46%] max-w-[220px] flex-1">
            <Image
              src="/onboarding/survey-intro/seaweed-wave.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="220px"
              className="object-contain"
            />
          </div>

          <Link
            href="/survey"
            className="font-korean mt-auto flex w-full items-center justify-center rounded-[15px] bg-[#7d5200] py-4 text-center text-[20px] font-bold text-white"
          >
            좋아! 개인맞춤 설문하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
