"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  SPECIES_RATIO_DEFS,
  type SpeciesRatioKey,
} from "@/lib/species-ratio";

const SIZE = 220;
const CENTER = SIZE / 2;
const OUTER_R = 100;
const INNER_R = 68;
const RING_R = (OUTER_R + INNER_R) / 2;
const STROKE_WIDTH = OUTER_R - INNER_R;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

type Datum = { key: SpeciesRatioKey; pct: number };

export function SpeciesRatioDonut({ data }: { data: Datum[] }) {
  const [selected, setSelected] = useState<SpeciesRatioKey | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const total = data.reduce((sum, d) => sum + d.pct, 0) || 1;

  const wedges = data.reduce<
    { key: SpeciesRatioKey; pct: number; fraction: number; start: number }[]
  >((acc, d) => {
    const fraction = d.pct / total;
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].fraction : 0;
    acc.push({ ...d, fraction, start });
    return acc;
  }, []);

  const resolveWedgeAt = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * SIZE - CENTER;
    const y = ((clientY - rect.top) / rect.height) * SIZE - CENTER;
    const distance = Math.hypot(x, y);
    if (distance < INNER_R - 6 || distance > OUTER_R + 6) return;

    // atan2 gives 0 at 3 o'clock, counter-clockwise; convert to a
    // clockwise-from-12-o'clock fraction in [0, 1) to match the wedges.
    const angleFromTop = (Math.atan2(y, x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const fraction = angleFromTop / (Math.PI * 2);

    const hit = wedges.find(
      (w) => fraction >= w.start && fraction < w.start + w.fraction,
    );
    if (hit) setSelected(hit.key);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    resolveWedgeAt(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.buttons === 0 && e.pointerType !== "touch") return;
    resolveWedgeAt(e.clientX, e.clientY);
  };
  const clearSelection = () => setSelected(null);

  const selectedDef = selected ? SPECIES_RATIO_DEFS[selected] : null;
  const selectedPct = selected
    ? (wedges.find((w) => w.key === selected)?.pct ?? 0)
    : total;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label="해초 종류별 비율"
          className="touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={clearSelection}
          onPointerLeave={clearSelection}
          onPointerCancel={clearSelection}
        >
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {wedges.map((w) => {
              const dimmed = selected !== null && selected !== w.key;
              return (
                <circle
                  key={w.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RING_R}
                  fill="none"
                  stroke={SPECIES_RATIO_DEFS[w.key].color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${w.fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-w.start * CIRCUMFERENCE}
                  opacity={dimmed ? 0.25 : 1}
                  style={{ transition: "opacity 150ms" }}
                />
              );
            })}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
          {selectedDef && (
            <Image
              src={selectedDef.characterImage}
              alt=""
              aria-hidden="true"
              width={72}
              height={72}
              className="object-contain"
            />
          )}
          <div className="font-korean flex items-center justify-center rounded-2xl border-[3px] border-[#7f5b3b] bg-[#f4f1eb] px-[10px] py-2">
            <p className="text-2xl font-bold text-black">
              {selectedDef
                ? `${selectedPct.toFixed(0)}%`
                : `${total.toFixed(0)}%`}
            </p>
          </div>
          {!selectedDef && (
            <p
              className="mt-1 text-center whitespace-pre"
              style={{ fontFamily: "var(--font-jeju-doldam)" }}
            >
              <span className="block text-[20px] leading-[26px] text-[#644c0f]">
                눌러봅서예,
              </span>
              <span className="block text-[13px] leading-[18px] text-[#644c0f]">
                해초 분포
              </span>
              <span className="block text-[13px] leading-[18px] text-[#644c0f]">
                확인해봅서.
              </span>
            </p>
          )}
        </div>
      </div>

      {selectedDef && (
        <p className="font-korean text-lg font-bold text-[#5b3717]">
          {selectedDef.name}
        </p>
      )}
    </div>
  );
}
