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
  // `submitInputRef` is the field that actually gets uploaded — it has no
  // `capture`, so it never forces the camera open on its own; it's only ever
  // populated programmatically (via DataTransfer) from whichever of the two
  // choice-sheet inputs below the user picks. That's what lets "사진 촬영"
  // (forces the camera) and "앨범에서 선택" (opens the photo library) be two
  // real, distinct choices instead of leaving it up to the browser's default
  // camera-vs-library heuristic for a single `capture` input.
  const submitInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const applyFile = (file: File | undefined) => {
    if (!file) return;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    // Inputs can't have their `.files` set from a File directly — DataTransfer
    // is the standard workaround to hand a programmatically-obtained file to
    // a real <input type="file"> so it still submits with the form normally.
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (submitInputRef.current) {
      submitInputRef.current.files = transfer.files;
    }
    setShowChoices(false);
  };

  return (
    <div>
      <input
        ref={submitInputRef}
        type="file"
        name={name}
        accept="image/*"
        required
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => applyFile(e.target.files?.[0])}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => applyFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => setShowChoices(true)}
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

      {showChoices && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowChoices(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-[20px] bg-white p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-center text-sm text-[#a69382]">
              인증 사진 가져오기
            </p>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="mb-2 w-full rounded-[15px] bg-[#7f5b3b] py-4 text-center text-[18px] font-bold text-white"
            >
              사진 촬영
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="w-full rounded-[15px] border border-[#c4b8a3] py-4 text-center text-[18px] font-bold text-[#7f5b3b]"
            >
              앨범에서 선택
            </button>
          </div>
        </div>
      )}
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
