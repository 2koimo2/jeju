"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { LoadingScreen } from "@/components/loading-screen";
import { generateTodayMissions } from "./actions";

function GenerateStatusMessage() {
  const { pending } = useFormStatus();
  if (pending) return <LoadingScreen overlay />;
  return (
    <p className="font-korean text-sm font-medium text-white">
      오늘의 미션을 준비할게요.
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
      className="font-korean rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#5b3717] disabled:opacity-50"
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
