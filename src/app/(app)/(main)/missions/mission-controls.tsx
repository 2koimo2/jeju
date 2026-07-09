"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateTodayMissions } from "./actions";

function GenerateStatusMessage() {
  const { pending } = useFormStatus();
  return (
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      {pending
        ? "오늘의 미션을 만들고 있어요..."
        : "오늘의 미션을 준비할게요."}
    </p>
  );
}

/** Auto-submits generateTodayMissions(force=false) once on mount when there's no
 * active batch. The action itself re-checks for an active batch before generating, so
 * this is safe even if the effect fires twice (e.g. React StrictMode). */
export function GenerateMissionsTrigger() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <form
      ref={formRef}
      action={generateTodayMissions}
      className="flex flex-col items-center gap-2 px-4 py-12 text-center"
    >
      <input type="hidden" name="force" value="false" />
      <GenerateStatusMessage />
    </form>
  );
}

function RefreshSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300"
    >
      {pending ? "생성 중..." : "새 미션 받기"}
    </button>
  );
}

export function RefreshMissionsButton() {
  return (
    <form action={generateTodayMissions}>
      <input type="hidden" name="force" value="true" />
      <RefreshSubmitButton />
    </form>
  );
}
