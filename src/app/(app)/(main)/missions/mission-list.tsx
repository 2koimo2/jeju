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

export function MissionList({ missions }: { missions: MissionRow[] }) {
  return (
    <ul className="font-korean flex flex-col">
      {missions.map((mission, index) => {
        const pill = DIFFICULTY_PILL_STYLE[mission.difficulty];
        const drop = dropC(mission.difficulty);

        return (
          <li key={mission.id}>
            <Link
              href={`/missions/${mission.id}`}
              className="flex flex-col gap-[14px] py-3"
            >
              <span
                className="inline-flex w-fit items-center justify-center rounded-[555px] px-[10px] py-[4px] text-xs font-medium"
                style={{ backgroundColor: pill.bg, color: pill.text }}
              >
                {DIFFICULTY_LABEL[mission.difficulty]}
                {drop !== null ? ` | -${drop}°C` : ""}
              </span>

              <div className="flex flex-col gap-[6px] text-black">
                <p className="text-[18px] font-bold">{mission.title}</p>
                <p className="text-[13px] leading-[18px]">
                  {mission.description}
                </p>
              </div>

              <p className="text-[12px] text-[#a69589] underline">
                미션 인증하러가기 &gt;&gt;
              </p>

              {mission.status === "completed" && (
                <span className="text-xs font-medium text-emerald-600">
                  완료
                </span>
              )}
            </Link>
            {index < missions.length - 1 && (
              <div className="h-px w-full bg-[#e5ddcf]" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
