"use client";

import { useActionState } from "react";
import { resetOnboarding, type ResetOnboardingState } from "./actions";

const initialState: ResetOnboardingState = { error: null };

export function ResetForm({
  profile,
}: {
  profile: { full_name: string; gender: string | null; sea_name: string | null } | null;
}) {
  const [state, action, pending] = useActionState(
    resetOnboarding,
    initialState,
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          온보딩 리셋 (개발용)
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          같은 계정으로 로그인한 채로 이름 → 성별 → 바다 이름 입력 화면을
          처음부터 다시 시도해볼 수 있어요. 계정을 새로 만들 필요 없습니다.
        </p>
      </div>

      <dl className="rounded-lg border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-800">
        <div className="flex justify-between py-1">
          <dt className="text-neutral-500">이름</dt>
          <dd className="text-neutral-900 dark:text-neutral-50">
            {profile?.full_name || "(없음)"}
          </dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-neutral-500">성별</dt>
          <dd className="text-neutral-900 dark:text-neutral-50">
            {profile?.gender ?? "(없음)"}
          </dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-neutral-500">바다 이름</dt>
          <dd className="text-neutral-900 dark:text-neutral-50">
            {profile?.sea_name ?? "(없음)"}
          </dd>
        </div>
      </dl>

      <form action={action}>
        {state.error && (
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "리셋 중..." : "온보딩 다시 시작하기"}
        </button>
      </form>
    </div>
  );
}
