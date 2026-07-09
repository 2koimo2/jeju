import Link from "next/link";
import type { MissionRow } from "./types";

const DIFFICULTY_LABEL: Record<MissionRow["difficulty"], string> = {
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
            className="flex flex-col gap-1 rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {mission.title}
              </span>
              <span className="shrink-0 text-xs text-neutral-400">
                {DIFFICULTY_LABEL[mission.difficulty]} · {mission.points}P
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {mission.description}
            </p>
            {mission.status === "completed" && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                완료
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
