"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSurvey, type SurveyActionState } from "./actions";
import type { SurveyAnswers } from "@/lib/persona";

const initialState: SurveyActionState = { error: null };

type EnumFieldName = Exclude<keyof SurveyAnswers, "environmentalConcern">;

type Question =
  | { type: "likert"; name: "environmentalConcern"; label: string }
  | {
      type: "choice";
      name: EnumFieldName;
      label: string;
      options: { value: string; label: string }[];
    };

const QUESTIONS: Question[] = [
  {
    type: "likert",
    name: "environmentalConcern",
    label: "평소 환경 문제에 얼마나 관심이 있으신가요?",
  },
  {
    type: "choice",
    name: "deliveryFrequency",
    label: "배달음식을 얼마나 자주 시켜 드시나요?",
    options: [
      { value: "rarely", label: "거의 안 시킴" },
      { value: "monthly", label: "한 달에 몇 번" },
      { value: "weekly", label: "일주일에 몇 번" },
      { value: "frequent", label: "거의 매일" },
    ],
  },
  {
    type: "choice",
    name: "occupation",
    label: "현재 직업은 무엇인가요?",
    options: [
      { value: "student", label: "학생" },
      { value: "office", label: "사무직" },
      { value: "field", label: "현장직" },
      { value: "self_employed", label: "자영업" },
      { value: "homemaker", label: "전업주부" },
      { value: "other", label: "기타" },
    ],
  },
  {
    type: "choice",
    name: "hasCar",
    label: "자차를 얼마나 이용하시나요?",
    options: [
      { value: "none", label: "자차 없음" },
      { value: "occasional", label: "가끔 이용" },
      { value: "daily", label: "매일 이용" },
    ],
  },
  {
    type: "choice",
    name: "consumptionTendency",
    label: "평소 소비 성향은 어떤가요?",
    options: [
      { value: "minimal", label: "미니멀 (필요한 것만)" },
      { value: "practical", label: "실용적" },
      { value: "trendy", label: "유행을 따르는 편" },
      { value: "impulsive", label: "충동적인 편" },
    ],
  },
  {
    type: "choice",
    name: "disposableItemFrequency",
    label: "일회용품을 얼마나 자주 사용하시나요?",
    options: [
      { value: "rarely", label: "거의 안 씀" },
      { value: "sometimes", label: "가끔" },
      { value: "often", label: "자주" },
      { value: "always", label: "거의 항상" },
    ],
  },
  {
    type: "choice",
    name: "energyUsage",
    label: "가정에서 에너지(전기·가스) 사용량은 어느 정도인가요?",
    options: [
      { value: "low", label: "적은 편" },
      { value: "medium", label: "보통" },
      { value: "high", label: "많은 편" },
    ],
  },
  {
    type: "choice",
    name: "recyclingFrequency",
    label: "분리배출을 얼마나 철저히 하시나요?",
    options: [
      { value: "always", label: "항상" },
      { value: "usually", label: "대체로" },
      { value: "sometimes", label: "가끔" },
      { value: "rarely", label: "거의 안 함" },
    ],
  },
];

function defaultAnswersToState(
  defaultAnswers: SurveyAnswers | null,
): Record<string, string> {
  if (!defaultAnswers) return {};
  return {
    environmentalConcern: String(defaultAnswers.environmentalConcern),
    deliveryFrequency: defaultAnswers.deliveryFrequency,
    occupation: defaultAnswers.occupation,
    hasCar: defaultAnswers.hasCar,
    consumptionTendency: defaultAnswers.consumptionTendency,
    disposableItemFrequency: defaultAnswers.disposableItemFrequency,
    energyUsage: defaultAnswers.energyUsage,
    recyclingFrequency: defaultAnswers.recyclingFrequency,
  };
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

          {q.type === "likert" ? (
            <>
              <div className="mt-2 flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <label
                    key={v}
                    className="flex flex-1 flex-col items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    <input
                      type="radio"
                      name={q.name}
                      value={v}
                      required
                      checked={answers[q.name] === String(v)}
                      onChange={() => setAnswer(q.name, String(v))}
                    />
                    {v}
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>관심 없음</span>
                <span>매우 관심 많음</span>
              </div>
            </>
          ) : (
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
          )}
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
