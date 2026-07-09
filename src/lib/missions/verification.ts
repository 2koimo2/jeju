export const CONFIDENCE_THRESHOLD = 0.6;

export type VerdictStatus = "passed" | "failed" | "needs_review";

/**
 * Below the confidence threshold, route to manual review regardless of whether the
 * model leaned pass or fail — a low-confidence auto-fail would unfairly punish a
 * legitimate borderline photo just as much as a low-confidence auto-pass would let a
 * fake one through.
 */
export function resolveVerdictStatus(
  passed: boolean,
  confidence: number,
): VerdictStatus {
  if (confidence < CONFIDENCE_THRESHOLD) return "needs_review";
  return passed ? "passed" : "failed";
}
