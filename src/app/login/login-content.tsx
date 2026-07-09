"use client";

import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "./google-signin-button";

export function LoginContent() {
  const searchParams = useSearchParams();
  const failed = searchParams.get("error") === "oauth_failed";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          🌿 해초키우기
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          탄소절감 미션으로 나만의 해초를 키워보세요
        </p>
      </div>

      {failed && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          로그인에 실패했어요. 다시 시도해주세요.
        </p>
      )}

      <GoogleSignInButton />
    </div>
  );
}
