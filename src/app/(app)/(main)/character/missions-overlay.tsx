"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { TemperatureGauge } from "@/components/temperature-gauge";
import { MissionList } from "../missions/mission-list";
import { generateTodayMissions, getActiveMissions } from "../missions/actions";
import type { MissionRow } from "../missions/types";

const MAX_VISIBLE_MISSIONS = 3;

function MailIcon() {
  return <Image src="/home/mail-icon.svg" alt="" width={42} height={41} />;
}

// The Figma trigger swaps to a "streamline-plump-color:arrow-up-4-flat" X while the
// sheet is open, doubling as the close affordance. Reproduced as two plump rounded
// bars crossed at Figma's exact angles, rather than the thin chevron this replaces.
function CloseChevronIcon() {
  return (
    <svg viewBox="0 0 27 27" fill="none" className="size-[27px]" aria-hidden="true">
      <rect
        x="1.5"
        y="10.65"
        width="24"
        height="5.7"
        rx="2.85"
        fill="#ffa444"
        transform="rotate(-47.24 13.5 13.5)"
      />
      <rect
        x="1.5"
        y="10.65"
        width="24"
        height="5.7"
        rx="2.85"
        fill="#ffa444"
        transform="rotate(-134.18 13.5 13.5)"
      />
    </svg>
  );
}

function RefreshButton({
  pending,
  onClick,
}: {
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      aria-label="새 미션 받기"
      className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] disabled:opacity-50"
    >
      <Image
        src="/missions/redo-icon.svg"
        alt=""
        width={34}
        height={34}
        className={pending ? "animate-spin" : ""}
      />
    </button>
  );
}

export function MissionsOverlay({
  temperatureC,
  openInitially = false,
}: {
  temperatureC: number;
  openInitially?: boolean;
}) {
  const [open, setOpen] = useState(openInitially);
  const [visible, setVisible] = useState(false);
  const [missions, setMissions] = useState<MissionRow[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const refresh = async () => {
    setMissions(await getActiveMissions());
  };

  const handleOpen = () => {
    setOpen(true);
    // Mount off-screen first, then flip to the resting position on the next
    // frame so the transform transition actually animates instead of
    // snapping (there's no animation library in this repo).
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    startTransition(async () => {
      await refresh();
    });
  };

  // Deep-link from the report's "더 보기" — arrive on the home screen with
  // the sheet already open instead of requiring an extra tap.
  useEffect(() => {
    if (openInitially) handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleGenerate = async (force: boolean) => {
    setGenerating(true);
    const formData = new FormData();
    formData.set("force", String(force));
    await generateTodayMissions(formData);
    await refresh();
    setGenerating(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={open ? handleClose : handleOpen}
        aria-label={open ? "닫기" : "오늘의 미션 보기"}
        className="flex size-16 items-center justify-center rounded-full bg-white shadow-[-2px_3px_4.1px_0px_rgba(0,127,133,0.15)]"
      >
        {open ? <CloseChevronIcon /> : <MailIcon />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="닫기"
            className="absolute inset-0"
            onClick={handleClose}
          />
          <div
            className={`relative flex max-h-[80vh] flex-col overflow-hidden rounded-t-[30px] bg-[#f7eedd] transition-transform duration-300 ${
              visible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="font-korean relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-8">
              <div className="flex flex-col gap-[22px]">
                {isPending && missions === null ? (
                  <p className="py-12 text-center text-sm text-white">
                    불러오는 중...
                  </p>
                ) : missions && missions.length > 0 ? (
                  <>
                    <TemperatureGauge temperatureC={temperatureC} />

                    <div className="rounded-[30px] bg-white px-4 py-5">
                      <div className="flex justify-end">
                        <RefreshButton
                          pending={generating}
                          onClick={() => handleGenerate(true)}
                        />
                      </div>
                      <MissionList
                        missions={missions.slice(0, MAX_VISIBLE_MISSIONS)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-[30px] bg-white px-4 py-12 text-center">
                    <p className="text-sm text-[#736559]">
                      {generating
                        ? "오늘의 미션을 만들고 있어요..."
                        : "오늘의 미션을 준비할게요."}
                    </p>
                    {!generating && (
                      <button
                        type="button"
                        onClick={() => handleGenerate(false)}
                        className="rounded-full bg-[#7f5b3b] px-4 py-2 text-sm font-bold text-white"
                      >
                        미션 받기
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
