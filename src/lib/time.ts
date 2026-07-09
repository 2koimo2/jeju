const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** End of the Asia/Seoul calendar day containing `now` (23:59:59.999 KST), as a UTC Date. */
export function endOfKstDay(now: Date): Date {
  const shifted = new Date(now.getTime() + KST_OFFSET_MS);
  const nextMidnightShifted = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );
  return new Date(nextMidnightShifted - 1 - KST_OFFSET_MS);
}
