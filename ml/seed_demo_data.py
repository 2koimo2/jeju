"""Seeds a handful of dummy weekly surveys for one demo site so the dashboard
can show a "이번 주가 지난 주보다 바다숲이 확장됐다" story. This is placeholder
data for the UI, not a real survey — swap it out once real weekly surveys
exist (same seaweed_surveys table, no dashboard changes needed).
"""

import json

from push_to_supabase import insert_survey, load_postgres_url
import psycopg2

LOCATION = "서귀포 조성지"
CLASS_GBN = "지상"

# Weekly totals trending up, with a bigger jump this week (headline delta).
WEEKS = [
    {"date": "2026-06-11", "total": 12.4},
    {"date": "2026-06-18", "total": 14.8},
    {"date": "2026-06-25", "total": 17.2},
    {"date": "2026-07-02", "total": 19.6},
    {"date": "2026-07-09", "total": 27.3},
]

# Species mix for the latest week only (drives the 종류별 비율 chart).
LATEST_COVERAGE = {
    "감태류": 11.5,
    "모자반류": 9.8,
    "대마디말류": 4.1,
    "나래미역류": 1.9,
    "암반류": 30.2,
    "모래류": 22.1,
    "기타": 20.4,
}


def build_coverage(week):
    if week["date"] == WEEKS[-1]["date"]:
        return LATEST_COVERAGE
    # Earlier weeks: same species mix, scaled down to that week's total.
    scale = week["total"] / WEEKS[-1]["total"]
    seaweed_names = {"감태류", "모자반류", "대마디말류", "나래미역류"}
    coverage = {}
    for name, pct in LATEST_COVERAGE.items():
        coverage[name] = round(pct * scale, 2) if name in seaweed_names else pct
    return coverage


def main():
    conn = psycopg2.connect(load_postgres_url())
    conn.autocommit = True
    with conn.cursor() as cur:
        cur.execute(
            "delete from seaweed_surveys where location = %s", (LOCATION,)
        )
        for week in WEEKS:
            result = {
                "location": LOCATION,
                "survey_date": week["date"],
                "class_gbn": CLASS_GBN,
                "coverage_by_category": build_coverage(week),
                "total_seaweed_pct": week["total"],
                "source_file": "demo-dummy-data",
            }
            insert_survey(cur, result)
            print(f"Seeded {LOCATION} {week['date']}: {week['total']}%")
    conn.close()


if __name__ == "__main__":
    main()
