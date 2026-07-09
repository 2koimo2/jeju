import { describe, expect, it } from "vitest";
import { CONFIDENCE_THRESHOLD, resolveVerdictStatus } from "./verification";

describe("resolveVerdictStatus", () => {
  it("passes when confidence is at/above the threshold and the model said passed", () => {
    expect(resolveVerdictStatus(true, CONFIDENCE_THRESHOLD)).toBe("passed");
    expect(resolveVerdictStatus(true, 0.95)).toBe("passed");
  });

  it("fails when confidence is at/above the threshold and the model said not passed", () => {
    expect(resolveVerdictStatus(false, CONFIDENCE_THRESHOLD)).toBe("failed");
    expect(resolveVerdictStatus(false, 0.95)).toBe("failed");
  });

  it("routes to needs_review below the threshold regardless of passed/failed", () => {
    expect(resolveVerdictStatus(true, 0.59)).toBe("needs_review");
    expect(resolveVerdictStatus(false, 0.59)).toBe("needs_review");
    expect(resolveVerdictStatus(true, 0)).toBe("needs_review");
  });
});
