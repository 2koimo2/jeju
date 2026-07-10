"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSurvey, type SurveyActionState } from "./actions";
import { LoadingScreen } from "@/components/loading-screen";
import type { SurveyAnswers } from "@/lib/persona";

const initialState: SurveyActionState = { error: null };

type Question = {
  name: keyof SurveyAnswers;
  label: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    name: "ageRange",
    label: "연령대를 선택해주세요",
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

export function SurveyForm({
  defaultAnswers,
}: {
  defaultAnswers: SurveyAnswers | null;
}) {
  const [state, action, pending] = useActionState(submitSurvey, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    defaultAnswersToState(defaultAnswers),
  );

  const currentQuestion = QUESTIONS[step];
  const isFirstStep = step === 0;
  const isLastStep = step === QUESTIONS.length - 1;
  const hasAnsweredCurrent = Boolean(answers[currentQuestion.name]);

  const setAnswer = (name: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [name]: value }));

  if (pending) {
    return <LoadingScreen />;
  }

  return (
    <form
      action={action}
      className="flex min-h-screen flex-col gap-6 px-4 py-6"
    >
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
          <span>
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-neutral-900 transition-all dark:bg-neutral-50"
            style={{
              width: `${((step + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {QUESTIONS.map((q, index) => (
        <fieldset
          key={q.name}
          hidden={index !== step}
          className="flex flex-1 flex-col gap-3"
        >
          <legend className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
            {q.label}
          </legend>

          <div className="mt-2 flex flex-col gap-2">
            {q.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-700 has-checked:border-neutral-900 has-checked:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:has-checked:border-neutral-50 dark:has-checked:bg-neutral-900"
              >
                <input
                  type="radio"
                  name={q.name}
                  value={opt.value}
                  required
                  checked={answers[q.name] === opt.value}
                  onChange={() => setAnswer(q.name, opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="mt-auto flex gap-2">
        {!isFirstStep && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            이전
          </button>
        )}

        {isLastStep ? (
          <button
            type="submit"
            disabled={pending || !hasAnsweredCurrent}
            className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900"
          >
            {pending ? "제출 중..." : "제출하고 시작하기"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!hasAnsweredCurrent}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900"
          >
            다음
          </button>
        )}
      </div>
    </form>
  );
}
