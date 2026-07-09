"use client";

import { useActionState } from "react";
import { submitMissionProof, type ProofActionState } from "../actions";

const initialState: ProofActionState = { error: null, verdict: null };

export function ProofForm({ missionId }: { missionId: string }) {
  const boundAction = submitMissionProof.bind(null, missionId);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        인증 사진
        <input
          type="file"
          name="photo"
          accept="image/*"
          capture="environment"
          required
          className="text-sm"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      {state.verdict && (
        <div
          className={
            state.verdict.passed
              ? "rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }
        >
          <p className="font-medium">
            {state.verdict.passed ? "미션 성공!" : "다시 시도해보세요"}
          </p>
          <p className="mt-1 text-xs opacity-80">{state.verdict.reasoning}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900"
      >
        {pending ? "인증 중..." : "사진 제출하기"}
      </button>
    </form>
  );
}
