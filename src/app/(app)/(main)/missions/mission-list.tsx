import Link from "next/link";
import { MISSION_TEMP_DROP_C } from "@/lib/seaweed-growth";
import type { MissionRow } from "./types";

// Keyed on all three historical difficulty values (not just the current
// Difficulty type) so old 'medium' missions still display a label.
const DIFFICULTY_LABEL: Record<"easy" | "medium" | "hard", string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

const DIFFICULTY_PILL_STYLE: Record<
  "easy" | "medium" | "hard",
  { bg: string; text: string }
> = {
  easy: { bg: "#d3ffff", text: "#027776" },
  medium: { bg: "#ffdee2", text: "#e03360" },
  hard: { bg: "#ffdee2", text: "#e03360" },
};

function dropC(difficulty: MissionRow["difficulty"]): number | null {
  return difficulty === "easy" || difficulty === "hard"
    ? MISSION_TEMP_DROP_C[difficulty]
    : null;
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
      <path
        d="M4 8.5C4 7.67157 4.67157 7 5.5 7H7.5L8.5 5H15.5L16.5 7H18.5C19.3284 7 20 7.67157 20 8.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V8.5Z"
        stroke="#7f5b3b"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.25" stroke="#7f5b3b" strokeWidth="1.6" />
    </svg>
  );
}

export function MissionList({ missions }: { missions: MissionRow[] }) {
  return (
    <ul className="font-korean flex flex-col">
      {missions.map((mission, index) => {
        const pill = DIFFICULTY_PILL_STYLE[mission.difficulty];
        const drop = dropC(mission.difficulty);

        return (
          <li key={mission.id}>
            <div className="flex flex-col gap-[14px] py-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex w-fit items-center justify-center rounded-[555px] px-[10px] py-[4px] text-xs font-medium"
                  style={{ backgroundColor: pill.bg, color: pill.text }}
                >
                  {DIFFICULTY_LABEL[mission.difficulty]}
                  {drop !== null ? ` | -${drop}°C` : ""}
                </span>

                <Link
                  href={`/missions/${mission.id}`}
                  aria-label="미션 인증하러가기"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef]"
                >
                  <CameraIcon />
                </Link>
              </div>

              <div className="flex flex-col gap-[6px] text-black">
                <p className="text-[18px] font-bold">{mission.title}</p>
                <p className="text-[13px] leading-[18px]">
                  {mission.description}
                </p>
              </div>

              {mission.status === "completed" && (
                <span className="text-xs font-medium text-emerald-600">
                  완료
                </span>
              )}
            </div>
            {index < missions.length - 1 && (
              <div className="h-px w-full bg-[#e5ddcf]" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
