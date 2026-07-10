"use client";

import { useLayoutEffect, useState } from "react";

const MAX_WIDTH = 448; // matches the old max-w-md cap on desktop

/**
 * Scales a fixed-size Figma-pixel layout down to fit the viewport, so absolutely
 * positioned art (background bleed, rotated decorative images, etc.) keeps its exact
 * proportions instead of being redone as a fluid/percentage layout per breakpoint.
 */
export function useFitScale(designWidth: number, designHeight: number) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const vw = Math.min(window.innerWidth, MAX_WIDTH);
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setScale(Math.min(vw / designWidth, vh / designHeight));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, [designWidth, designHeight]);

  return scale;
}
