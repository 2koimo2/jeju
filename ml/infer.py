"""Runs the trained POC model over a single hyperspectral tile and reports
per-category pixel coverage (종류별 비율) plus a seaweed-coverage proxy for
확장 정도 (해조류 7종 비율 합).

Usage:
    python infer.py --input <path/to/*.tif> --output out.json
"""

import argparse
import json
import re
from pathlib import Path

import numpy as np
import tifffile
from joblib import load

import dataset
from train import _safe_name

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"

# category ids 0-6, in 01.원천데이터 folder order, are the 7 seaweed species.
SEAWEED_CATEGORY_IDS = {0, 1, 2, 3, 4, 5, 6}

FILENAME_RE = re.compile(
    r"^(?P<location>\d{2})(?P<marker>[LU])_"
    r"(?P<area>[^_]+)_(?P<num>[^_]+)_"
    r"(?P<date>\d{8})_(?P<time>\d+)_(?P<weather>W\d+)_(?P<tile>RA\d+)"
)

DOMAIN_BY_MARKER = {"L": "지상", "U": "수중UHI"}


def parse_filename(path):
    m = FILENAME_RE.match(Path(path).stem)
    if not m:
        raise ValueError(f"Unrecognized filename pattern: {path}")
    d = m.groupdict()
    return {
        "location": d["location"],
        "survey_date": f"{d['date'][0:4]}-{d['date'][4:6]}-{d['date'][6:8]}",
        "class_gbn": DOMAIN_BY_MARKER[d["marker"]],
        "source_file": Path(path).name,
    }


def load_model(domain):
    model_path = ARTIFACT_DIR / f"model_{_safe_name(domain)}.joblib"
    if not model_path.exists():
        raise FileNotFoundError(
            f"No trained model for domain '{domain}' at {model_path}. "
            "Run train.py first."
        )
    return load(model_path)


def run_inference(tif_path):
    info = parse_filename(tif_path)
    categories = dataset.load_categories()
    clf = load_model(info["class_gbn"])

    cube = tifffile.imread(tif_path)
    h, w, bands = cube.shape
    if bands != clf.n_features_in_:
        raise ValueError(
            f"{tif_path} has {bands} bands but the '{info['class_gbn']}' "
            f"model expects {clf.n_features_in_}"
        )

    flat = cube.reshape(-1, bands).astype(np.float32)
    preds = clf.predict(flat)

    ids, counts = np.unique(preds, return_counts=True)
    total_px = preds.size
    coverage_by_category = {
        categories.get(int(i), str(int(i))): round(float(100 * c / total_px), 2)
        for i, c in zip(ids, counts)
    }
    total_seaweed_pct = round(
        float(
            sum(
                100 * c / total_px
                for i, c in zip(ids, counts)
                if int(i) in SEAWEED_CATEGORY_IDS
            )
        ),
        2,
    )

    return {
        **info,
        "coverage_by_category": coverage_by_category,
        "total_seaweed_pct": total_seaweed_pct,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to a *.tif tile")
    parser.add_argument("--output", required=True, help="Path to write result JSON")
    args = parser.parse_args()

    result = run_inference(args.input)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\nWrote {args.output}")


if __name__ == "__main__":
    main()
