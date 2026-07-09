"""Pushes infer.py's JSON output(s) into the Supabase seaweed_surveys table.

Usage:
    python push_to_supabase.py out1.json out2.json ...
"""

import argparse
import json
import re
from pathlib import Path

import psycopg2

ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"


def load_postgres_url():
    text = ENV_PATH.read_text(encoding="utf-8")
    m = re.search(r'^POSTGRES_URL="?(.*?)"?$', text, re.MULTILINE)
    if not m:
        raise RuntimeError(f"POSTGRES_URL not found in {ENV_PATH}")
    # psycopg2's DSN parser rejects Supabase's non-standard "supa" pooler hint.
    return re.sub(r"[&?]supa=[^&]*", "", m.group(1))


def insert_survey(cur, result):
    cur.execute(
        """
        insert into seaweed_surveys
            (location, survey_date, class_gbn, coverage_by_category,
             total_seaweed_pct, source_file)
        values (%s, %s, %s, %s, %s, %s)
        """,
        (
            result["location"],
            result["survey_date"],
            result["class_gbn"],
            json.dumps(result["coverage_by_category"], ensure_ascii=False),
            result["total_seaweed_pct"],
            result.get("source_file"),
        ),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+", help="infer.py output JSON file(s)")
    args = parser.parse_args()

    conn = psycopg2.connect(load_postgres_url())
    conn.autocommit = True
    with conn.cursor() as cur:
        for path in args.inputs:
            with open(path, encoding="utf-8") as f:
                result = json.load(f)
            insert_survey(cur, result)
            print(f"Inserted {result['source_file']} "
                  f"(seaweed {result['total_seaweed_pct']}%)")
    conn.close()


if __name__ == "__main__":
    main()
