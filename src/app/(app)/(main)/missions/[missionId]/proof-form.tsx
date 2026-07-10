"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitMissionProof, type ProofActionState } from "../actions";

const initialState: ProofActionState = { error: null, verdict: null };

function PlusIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-8" aria-hidden="true">
      <path
        d="M16 6V26M6 16H26"
        stroke="#a69382"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhotoPicker({ name }: { name: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        capture="environment"
        required
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="인증 사진 선택"
        className="relative flex h-[162px] w-full items-center justify-center overflow-hidden rounded-[17px] bg-[#e8ddc8]"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, next/image can't optimize object URLs
          <img
            src={previewUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <PlusIcon />
        )}
      </button>
    </div>
  );
}

export function ProofForm({ missionId }: { missionId: string }) {
  const boundAction = submitMissionProof.bind(null, missionId);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-1 flex-col gap-4">
      <PhotoPicker name="photo" />

      <button
        type="submit"
        disabled={pending}
        className="mt-auto w-full rounded-[15px] bg-[#7f5b3b] py-4 text-center text-[20px] font-bold text-white disabled:opacity-50"
      >
        {pending ? "인증 중..." : "사진 제출하기"}
      </button>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
