"use client";

import { useActionState } from "react";
import { submitNickname, type NicknameActionState } from "./actions";

const initialState: NicknameActionState = { error: null };

export function NicknameForm({
  defaultSeaName,
}: {
  defaultSeaName: string;
}) {
  const [state, action, pending] = useActionState(
    submitNickname,
    initialState,
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          나의 바다 이름을 지어주세요
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          앞으로 키워나갈 나만의 바다에 붙일 이름이에요
        </p>
      </div>

      <form action={action} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1 text-sm text-neutral-700 dark:text-neutral-300">
          바다 이름
          <input
            type="text"
            name="seaName"
            required
            minLength={1}
            maxLength={20}
            defaultValue={defaultSeaName}
            placeholder="예: 초록빛 바다"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

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
          {pending ? "저장 중..." : "시작하기"}
        </button>
      </form>
    </div>
  );
}
