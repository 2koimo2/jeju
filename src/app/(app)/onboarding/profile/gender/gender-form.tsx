"use client";

import { useActionState } from "react";
import { submitGender, type GenderActionState } from "./actions";

const initialState: GenderActionState = { error: null };

const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "unspecified", label: "밝히지 않음" },
];

export function GenderForm({
  defaultGender,
}: {
  defaultGender: string | null;
}) {
  const [state, action, pending] = useActionState(submitGender, initialState);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          성별을 알려주세요
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          미션을 함께할 정보를 입력해주세요
        </p>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-neutral-700 dark:text-neutral-300">
            성별
          </legend>
          <div className="flex gap-4">
            {GENDER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  required
                  defaultChecked={defaultGender === opt.value}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900"
        >
          {pending ? "저장 중..." : "다음"}
        </button>
      </form>
    </div>
  );
}
