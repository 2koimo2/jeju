"use client";

import { useLayoutEffect, useState } from "react";

const MAX_WIDTH = 448; // matches the old max-w-md cap on desktop

/**
 * Scales a fixed-size Figma-pixel layout to always fill the viewport width, so
 * absolutely positioned art (background bleed, rotated decorative images, etc.) keeps
 * its exact proportions instead of being redone as a fluid/percentage layout.
 *
 * Width-only (not width+height "contain") on purpose: scaling to fit both dimensions
 * letterboxes with side margins on any device whose aspect ratio is wider than the
 * design's, since the shorter axis caps the scale. Filling the width and letting the
 * page scroll vertically for any leftover height is the correct trade-off for a page
 * that's allowed to scroll; only use this for screens where that's true.
 */
export function useFitScale(designWidth: number) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const vw = Math.min(window.innerWidth, MAX_WIDTH);
      setScale(vw / designWidth);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [designWidth]);

  return scale;
}
