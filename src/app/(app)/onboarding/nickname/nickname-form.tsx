"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [hasValue, setHasValue] = useState(defaultSeaName.length > 0);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7eedd]">
      <div className="grid grid-cols-[24px_1fr_24px] items-center px-4 py-[15px]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex size-6 items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6 -rotate-90">
            <path
              d="M12.75 20C12.75 20.1989 12.671 20.3897 12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303C11.329 20.3897 11.25 20.1989 11.25 20V10.75H6C5.85176 10.7499 5.70688 10.7058 5.58367 10.6234C5.46045 10.541 5.36442 10.4239 5.30771 10.2869C5.251 10.15 5.23615 9.99926 5.26503 9.85386C5.29392 9.70846 5.36524 9.57489 5.47 9.47L11.47 3.47C11.6106 3.32955 11.8012 3.25066 12 3.25066C12.1988 3.25066 12.3894 3.32955 12.53 3.47L18.53 9.47C18.6348 9.57489 18.7061 9.70846 18.735 9.85386C18.7638 9.99926 18.749 10.15 18.6923 10.2869C18.6356 10.4239 18.5395 10.541 18.4163 10.6234C18.2931 10.7058 18.1482 10.7499 18 10.75H12.75V20Z"
              fill="#978F88"
            />
          </svg>
        </button>
        <p className="font-korean text-center text-[14px] font-semibold text-[#544e49]">
          프로필 설정
        </p>
      </div>

      <h1 className="font-korean mt-12 px-4 text-center text-[28px] leading-[41px] font-bold text-[#262321]">
        우리 바당에 이름을 선물해줍서
      </h1>
      <p className="font-korean mt-2 px-4 text-center text-[14px] text-[#978f88]">
        2~4글자만 사용할 수 있수다
      </p>

      <form
        action={action}
        className="flex flex-1 flex-col items-center px-6 pt-16"
      >
        <input
          type="text"
          name="seaName"
          required
          minLength={2}
          maxLength={4}
          defaultValue={defaultSeaName}
          placeholder="예) 해녀"
          autoFocus
          onChange={(e) => {
            const len = e.target.value.trim().length;
            setHasValue(len >= 2 && len <= 4);
          }}
          className="font-korean w-full max-w-[220px] border-none bg-transparent text-center text-[40px] font-bold text-[#262321] outline-none placeholder:font-medium placeholder:text-[#d4c9bf] caret-[#00b4ba]"
        />

        {state.error && (
          <p className="font-korean mt-4 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="mt-auto w-full pb-8">
          <button
            type="submit"
            disabled={pending}
            className={`font-korean w-full rounded-[15px] py-4 text-center text-[20px] font-bold text-white transition-colors disabled:opacity-50 ${
              hasValue ? "bg-[#7f5b3b]" : "bg-[#dad4c8]"
            }`}
          >
            {pending ? "저장 중..." : "다음"}
          </button>
        </div>
      </form>
    </div>
  );
}
