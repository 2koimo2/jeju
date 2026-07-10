"use client";

import { useId, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { submitSurvey, type SurveyActionState } from "./actions";
import { LoadingScreen } from "@/components/loading-screen";
import type { SurveyAnswers } from "@/lib/persona";

const initialState: SurveyActionState = { error: null };

type Question = {
  name: keyof SurveyAnswers;
  label: string;
  subtitle: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    name: "ageRange",
    label: "연령대를 선택해 주세요.",
    subtitle: "연령대에 맞는 난이도와 활동을 추천해 드려요.",
    options: [
      { value: "teens_or_under", label: "10대 이하" },
      { value: "twenties", label: "20대" },
      { value: "thirties", label: "30대" },
      { value: "forties", label: "40대" },
      { value: "fifties_plus", label: "50대 이상" },
    ],
  },
  {
    name: "environmentalConcern",
    label: "환경보호에 관심이 있나요?",
    subtitle: "관심 정도에 맞는 미션 난이도를 조절해 드려요.",
    options: [
      { value: "very_high", label: "매우 관심이 많아요" },
      { value: "high_but_hard", label: "관심은 있지만 실천이 어려워요" },
      { value: "sometimes", label: "가끔 생각해요" },
      { value: "low", label: "거의 관심이 없어요" },
      { value: "unsure", label: "모르겠어요" },
    ],
  },
  {
    name: "occupation",
    label: "현재 어떤 생활 중인가요?",
    subtitle: "생활 패턴에 맞는 실천 가능한 미션을 추천해 드려요.",
    options: [
      { value: "student", label: "학생" },
      { value: "office", label: "직장인" },
      { value: "homemaker", label: "주부" },
      { value: "self_employed", label: "자영업" },
      { value: "other", label: "기타" },
    ],
  },
  {
    name: "transportMode",
    label: "자주 이용하는 이동수단은 무엇인가요?",
    subtitle: "이동수단에 맞는 맞춤 미션을 제안해 드려요.",
    options: [
      { value: "walk", label: "걸어다녀요" },
      { value: "bike", label: "자전거" },
      { value: "public_transit", label: "대중교통" },
      { value: "car", label: "자가용" },
      { value: "motorcycle", label: "오토바이" },
    ],
  },
  {
    name: "deliveryFrequency",
    label: "배달음식은 얼마나 자주 이용하시나요?",
    subtitle: "배달 습관을 고려한 미션을 함께 찾아볼게요.",
    options: [
      { value: "rarely", label: "거의 이용하지 않아요" },
      { value: "weekly_1_2", label: "주 1-2회" },
      { value: "weekly_3_4", label: "주 3-4회" },
      { value: "weekly_5_plus", label: "주 5회 이상" },
    ],
  },
  {
    name: "consumptionTendency",
    label: "평소 소비 습관은 어떤가요?",
    subtitle: "소비 습관에 맞는 실천 방법을 안내해 드려요.",
    options: [
      { value: "minimal", label: "꼭 필요한 것만 구매해요" },
      { value: "planned", label: "계획하고 구매해요" },
      { value: "discount_driven", label: "할인하면 자주 구매해요" },
      { value: "impulsive", label: "충동구매가 많은 편이에요" },
    ],
  },
  {
    name: "disposableItemFrequency",
    label: "일회용품을 얼마나 사용하시나요?",
    subtitle: "일회용품 사용 습관을 파악해 맞춤 미션을 드려요.",
    options: [
      { value: "rarely", label: "거의 사용하지 않아요" },
      { value: "sometimes", label: "가끔 사용해요" },
      { value: "often", label: "자주 사용해요" },
      { value: "always", label: "거의 매일 사용해요" },
    ],
  },
  {
    name: "energyUsage",
    label: "평소 전기 사용습관은 어떤가요?",
    subtitle: "전기 사용 습관에 맞는 절약 미션을 추천해 드려요.",
    options: [
      { value: "low", label: "항상 절약해요" },
      { value: "medium", label: "필요한 만큼 사용해요" },
      { value: "high", label: "많이 사용하는 편이에요" },
      { value: "unsure", label: "잘 모르겠어요" },
    ],
  },
  {
    name: "recyclingFrequency",
    label: "분리배출은 얼마나 실천하시나요?",
    subtitle: "분리배출 습관을 반영한 미션을 제안해 드려요.",
    options: [
      { value: "always", label: "항상해요" },
      { value: "usually", label: "대부분해요" },
      { value: "sometimes", label: "가끔해요" },
      { value: "rarely", label: "거의 하지 않아요" },
    ],
  },
  {
    name: "interestArea",
    label: "가장 관심있는 환경 활동은?",
    subtitle: "관심 분야에 맞는 미션을 우선적으로 보여드려요.",
    options: [
      { value: "ocean_trash", label: "바다쓰레기 줄이기" },
      { value: "sea_forest", label: "바다숲복원" },
      { value: "marine_life", label: "해양생물 보호" },
      { value: "carbon", label: "탄소 줄이기" },
    ],
  },
];

function defaultAnswersToState(
  defaultAnswers: SurveyAnswers | null,
): Record<string, string> {
  if (!defaultAnswers) return {};
  return Object.fromEntries(
    QUESTIONS.map((q) => [q.name, defaultAnswers[q.name]]),
  );
}

/**
 * Figma's selected-option outline is a hand-drawn brush stroke, not a plain CSS
 * border — there's no clean vector/border-radius equivalent, so we fake the
 * texture with an SVG turbulence filter that jitters a rounded-rect stroke.
 */
function BrushBorder({ color }: { color: string }) {
  const filterId = useId();
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      aria-hidden="true"
    >
      <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          seed={7}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={3}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <rect
        x="3.5"
        y="3.5"
        width="calc(100% - 7px)"
        height="calc(100% - 7px)"
        rx="14"
        ry="14"
        fill="none"
        stroke={color}
        strokeWidth="7"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.75 20C12.75 20.1989 12.671 20.3897 12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303C11.329 20.3897 11.25 20.1989 11.25 20V10.75H6C5.85176 10.7499 5.70688 10.7058 5.58367 10.6234C5.46045 10.541 5.36442 10.4239 5.30771 10.2869C5.251 10.15 5.23615 9.99926 5.26503 9.85386C5.29392 9.70846 5.36524 9.57489 5.47 9.47L11.47 3.47C11.6106 3.32955 11.8012 3.25066 12 3.25066C12.1988 3.25066 12.3894 3.32955 12.53 3.47L18.53 9.47C18.6348 9.57489 18.7061 9.70846 18.735 9.85386C18.7638 9.99926 18.749 10.15 18.6923 10.2869C18.6356 10.4239 18.5395 10.541 18.4163 10.6234C18.2931 10.7058 18.1482 10.7499 18 10.75H12.75V20Z"
        fill="#978F88"
      />
    </svg>
  );
}

export function SurveyForm({
  defaultAnswers,
}: {
  defaultAnswers: SurveyAnswers | null;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(submitSurvey, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    defaultAnswersToState(defaultAnswers),
  );

  const currentQuestion = QUESTIONS[step];
  const isFirstStep = step === 0;
  const isLastStep = step === QUESTIONS.length - 1;
  const hasAnsweredCurrent = Boolean(answers[currentQuestion.name]);
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const setAnswer = (name: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [name]: value }));

  const handleBack = () => {
    if (isFirstStep) router.back();
    else setStep((s) => s - 1);
  };

  if (pending) {
    return <LoadingScreen />;
  }

  return (
    <form
      action={action}
      className="flex min-h-screen flex-col bg-[#f7eedd] px-4 pt-[35px] pb-[104px]"
    >
      <div className="flex items-end gap-[10px] pr-[34px] pb-[10px]">
        <button
          type="button"
          onClick={handleBack}
          aria-label="이전으로"
          className="flex size-6 shrink-0 -rotate-90 items-center justify-center"
        >
          <BackArrowIcon />
        </button>
        <p className="flex-1 text-center text-sm font-semibold text-[#544e49]">
          개인맞춤 설문
        </p>
      </div>

      <div className="relative mt-[26px] h-9 w-full">
        <div className="absolute inset-0 rounded-full bg-[#ffdb8f] p-[9px]">
          <div
            className="h-full rounded-full bg-[#03c346] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Image
          src="/loading/green.png"
          alt=""
          aria-hidden="true"
          width={38}
          height={53}
          className="absolute -top-[16px] h-[53px] w-[38px] object-contain transition-all"
          style={{ left: `calc(${progress}% - 19px)` }}
        />
      </div>

      <div className="flex flex-col gap-[10px] p-4 text-center">
        <h1 className="text-[28px] leading-[1.15] font-bold text-[#262321]">
          {currentQuestion.label}
        </h1>
        <p className="text-base font-medium text-[#776b63]">
          {currentQuestion.subtitle}
        </p>
      </div>

      {QUESTIONS.map((q, index) => (
        <fieldset
          key={q.name}
          hidden={index !== step}
          className="flex flex-1 flex-col gap-[22px]"
        >
          <legend className="sr-only">{q.label}</legend>

          {q.options.map((opt) => {
            const selected = answers[q.name] === opt.value;
            return (
              <label
                key={opt.value}
                className={`relative flex w-full items-center justify-center rounded-[15px] border-[7px] border-transparent bg-white px-[15px] py-[13px] text-xl font-bold ${
                  selected ? "text-[#7f5b3b]" : "text-black"
                }`}
              >
                <input
                  type="radio"
                  name={q.name}
                  value={opt.value}
                  required
                  checked={selected}
                  onChange={() => setAnswer(q.name, opt.value)}
                  className="sr-only"
                />
                {selected && <BrushBorder color="#7f5b3b" />}
                {opt.label}
              </label>
            );
          })}
        </fieldset>
      ))}

      {state.error && (
        <p className="mt-4 text-center text-sm text-red-600">{state.error}</p>
      )}

      <div className="fixed inset-x-0 bottom-0 bg-[#f7eedd] px-4 pt-3 pb-6 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        {isLastStep ? (
          <button
            type="submit"
            disabled={pending || !hasAnsweredCurrent}
            className={`flex h-16 w-full items-center justify-center rounded-[15px] text-xl font-bold text-white transition-colors ${
              hasAnsweredCurrent ? "bg-[#7f5b3b]" : "bg-[#dad4c8]"
            }`}
          >
            제출하고 시작하기
          </button>
        ) : (
          <button
            type="button"
            disabled={!hasAnsweredCurrent}
            onClick={() => setStep((s) => s + 1)}
            className={`flex h-16 w-full items-center justify-center rounded-[15px] text-xl font-bold text-white transition-colors ${
              hasAnsweredCurrent ? "bg-[#7f5b3b]" : "bg-[#dad4c8]"
            }`}
          >
            다음
          </button>
        )}
      </div>
    </form>
  );
}
