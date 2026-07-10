"use client";

import { startTransition, useActionState, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { submitGender, type GenderActionState } from "./actions";

const initialState: GenderActionState = { error: null };

type Gender = "male" | "female";
type OptionVisualState = "neutral" | "selected" | "dimmed";

function GenderOption({
  label,
  neutralSrc,
  selectedSrc,
  state,
  onClick,
  disabled,
}: {
  label: string;
  neutralSrc: string;
  selectedSrc: string;
  state: OptionVisualState;
  onClick: () => void;
  disabled: boolean;
}) {
  const size = state === "selected" ? 170 : state === "dimmed" ? 130 : 150;
  const isDimmed = state === "dimmed";
  const isSelected = state === "selected";
  const imgSrc = isSelected ? selectedSrc : neutralSrc;
  const imgHeight = size;
  const imgWidth = size;
  const labelClass =
    state === "selected"
      ? "text-[32px] font-bold"
      : state === "dimmed"
        ? "text-[20px] font-medium"
        : "text-[24px] font-medium";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-[150px] flex-col items-center gap-3 disabled:pointer-events-none"
    >
      <div
        className="relative overflow-hidden rounded-full transition-[width,height,background-color] duration-200"
        style={{
          width: size,
          height: size,
          backgroundColor: isSelected ? "transparent" : "#ffffff",
        }}
      >
        <Image
          src={imgSrc}
          alt=""
          width={imgWidth}
          height={imgHeight}
          unoptimized
          className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-200 ${
            isDimmed ? "opacity-40" : ""
          }`}
        />
      </div>
      <p
        className={`font-korean text-black transition-all duration-200 ${labelClass}`}
      >
        {label}
      </p>
    </button>
  );
}

export function GenderForm({
  defaultGender,
}: {
  defaultGender: string | null;
}) {
  const [state, submitAction, pending] = useActionState(
    submitGender,
    initialState,
  );
  const [selected, setSelected] = useState<Gender | null>(
    defaultGender === "male" || defaultGender === "female"
      ? defaultGender
      : null,
  );
  const router = useRouter();

  const handleSelect = (gender: Gender) => {
    setSelected((prev) => (prev === gender ? null : gender));
  };

  const handleNext = () => {
    if (!selected) return;
    startTransition(() => {
      submitAction(selected);
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f7eedd]">
      <div className="grid grid-cols-[24px_1fr_24px] items-center px-4 py-[15px]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex size-6 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6 -rotate-90">
            <path
              d="M12.75 20C12.75 20.1989 12.671 20.3897 12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303C11.329 20.3897 11.25 20.1989 11.25 20V10.75H6C5.85176 10.7499 5.70688 10.7058 5.58367 10.6234C5.46045 10.541 5.36442 10.4239 5.30771 10.2869C5.251 10.15 5.23615 9.99926 5.26503 9.85386C5.29392 9.70846 5.36524 9.57489 5.47 9.47L11.47 3.47C11.6106 3.32955 11.8012 3.25066 12 3.25066C12.1988 3.25066 12.3894 3.32955 12.53 3.47L18.53 9.47C18.6348 9.57489 18.7061 9.70846 18.735 9.85386C18.7638 9.99926 18.749 10.15 18.6923 10.2869C18.6356 10.4239 18.5395 10.541 18.4163 10.6234C18.2931 10.7058 18.1482 10.7499 18 10.75H12.75V20Z"
              fill="#978F88"
            />
          </svg>
        </button>
        <p className="font-korean text-center text-[14px] font-semibold text-[#544e49]">
          프로필 설정
        </p>
      </div>

      <h1 className="font-korean mt-12 px-4 text-center text-[28px] leading-[41px] font-bold text-[#262321]">
        남자우꽈? 여자우꽈?
      </h1>

      <div className="mt-16 flex items-center justify-center gap-5">
        <GenderOption
          label="여자"
          neutralSrc="/onboarding/gender/woman-neutral.png"
          selectedSrc="/onboarding/gender/woman-selected.png"
          state={
            selected === "female"
              ? "selected"
              : selected === "male"
                ? "dimmed"
                : "neutral"
          }
          onClick={() => handleSelect("female")}
          disabled={pending}
        />
        <GenderOption
          label="남자"
          neutralSrc="/onboarding/gender/man-neutral.png"
          selectedSrc="/onboarding/gender/man-selected.png"
          state={
            selected === "male"
              ? "selected"
              : selected === "female"
                ? "dimmed"
                : "neutral"
          }
          onClick={() => handleSelect("male")}
          disabled={pending}
        />
      </div>

      {state.error && (
        <p className="font-korean mt-4 text-center text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="mt-auto w-full px-6 pb-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selected || pending}
          className={`font-korean w-full rounded-[15px] py-4 text-center text-[20px] font-bold text-white transition-colors disabled:opacity-50 ${
            selected ? "bg-[#7f5b3b]" : "bg-[#dad4c8]"
          }`}
        >
          {pending ? "저장 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
