import type { SeaweedStage } from "@/lib/character";

const STAGE_FROND_COUNT: Record<SeaweedStage, number> = {
  sprout: 2,
  juvenile: 4,
  mature: 6,
  forest: 9,
};

const STAGE_MAX_HEIGHT: Record<SeaweedStage, number> = {
  sprout: 60,
  juvenile: 100,
  mature: 140,
  forest: 180,
};

const WIDTH = 240;
const BASE_Y = 200;

export function SeaweedVisual({ stage }: { stage: SeaweedStage }) {
  const frondCount = STAGE_FROND_COUNT[stage];
  const maxHeight = STAGE_MAX_HEIGHT[stage];

  const fronds = Array.from({ length: frondCount }, (_, i) => {
    const t = frondCount === 1 ? 0.5 : i / (frondCount - 1);
    const x = WIDTH / 2 + (t - 0.5) * (WIDTH * 0.7);
    const height = maxHeight * (0.6 + 0.4 * Math.sin(t * Math.PI));
    const sway = 18 + (i % 3) * 6;
    const path = `M ${x} ${BASE_Y} C ${x - sway} ${BASE_Y - height * 0.5}, ${x + sway} ${BASE_Y - height * 0.75}, ${x} ${BASE_Y - height}`;
    return { path, key: i };
  });

  return (
    <div className="viz-root flex justify-center">
      <svg
        viewBox={`0 0 ${WIDTH} ${BASE_Y + 20}`}
        width="220"
        role="img"
        aria-label={`${stage} 단계의 해초 캐릭터`}
      >
        <ellipse
          cx={WIDTH / 2}
          cy={BASE_Y + 10}
          rx={70}
          ry={10}
          className="seaweed-base"
        />
        {fronds.map((f) => (
          <path
            key={f.key}
            d={f.path}
            fill="none"
            strokeWidth={6}
            strokeLinecap="round"
            className="seaweed-frond"
          />
        ))}
      </svg>
      <SeaweedStyle />
    </div>
  );
}

function SeaweedStyle() {
  return (
    <style>{`
      .viz-root {
        --seaweed-frond: #1baf7a;
        --seaweed-base: #c9c3a8;
      }
      @media (prefers-color-scheme: dark) {
        .viz-root {
          --seaweed-frond: #199e70;
          --seaweed-base: #4a4536;
        }
      }
      .seaweed-frond { stroke: var(--seaweed-frond); }
      .seaweed-base { fill: var(--seaweed-base); }
    `}</style>
  );
}
