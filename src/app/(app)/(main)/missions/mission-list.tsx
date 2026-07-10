import Link from "next/link";
import type { MissionRow } from "./types";

// Keyed on all three historical difficulty values (not just the current
// Difficulty type) so old 'medium' missions still display a label.
const DIFFICULTY_LABEL: Record<"easy" | "medium" | "hard", string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export function MissionList({ missions }: { missions: MissionRow[] }) {
  return (
    <ul className="flex flex-col gap-3 px-4 py-4">
      {missions.map((mission) => (
        <li key={mission.id}>
          <Link
            href={`/missions/${mission.id}`}
            className="font-korean flex flex-col gap-1 rounded-[15px] bg-white px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-black">
                {mission.title}
              </span>
              <span className="shrink-0 text-xs text-[#978f88]">
                {DIFFICULTY_LABEL[mission.difficulty]} · {mission.points}P
              </span>
            </div>
            <p className="text-xs text-[#978f88]">{mission.description}</p>
            {mission.status === "completed" && (
              <span className="text-xs font-medium text-emerald-600">
                완료
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
