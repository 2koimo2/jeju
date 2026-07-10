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

/** Start of the Asia/Seoul calendar day containing `now` (00:00:00.000 KST), as a UTC Date. */
export function startOfKstDay(now: Date): Date {
  const shifted = new Date(now.getTime() + KST_OFFSET_MS);
  const midnightShifted = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    0,
    0,
    0,
    0,
  );
  return new Date(midnightShifted - KST_OFFSET_MS);
}

/** The Asia/Seoul calendar date of `date`, formatted as "YYYY-MM-DD". */
export function kstDateKey(date: Date): string {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** [start, end) UTC bounds for the Asia/Seoul calendar month (1-indexed). */
export function kstMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0) - KST_OFFSET_MS);
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0) - KST_OFFSET_MS);
  return { start, end };
}

/** [start, end) UTC bounds for the Asia/Seoul calendar year. */
export function kstYearRange(year: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) - KST_OFFSET_MS);
  const end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0) - KST_OFFSET_MS);
  return { start, end };
}
