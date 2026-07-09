"""POC trainer: pixel-wise seaweed/benthic classifier from the AI Hub sample.

Only ~140 labeled tiles are available in Sample/ (a per-category preview, not
the full AI Hub corpus), so this is explicitly a pipeline-correctness check,
not an accuracy benchmark. A RandomForestClassifier on raw band pixel vectors
is used because it trains in seconds on this little data with no GPU. Once
the full dataset is downloaded, point dataset.py's DATA_ROOT at it and swap
in a CNN/segmentation model reusing the same iter_samples() pairs.

Land ("지상", 10-band 512x512) and underwater ("수중UHI", 14-band 1024x1024)
tiles come from different hyperspectral sensors with different band counts,
so a separate model is trained per class_gbn domain.
"""

import json
import re

import numpy as np
from joblib import dump
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

import dataset

ARTIFACT_DIR = dataset.Path(__file__).resolve().parent / "artifacts"
PIXELS_PER_IMAGE = 2000
RANDOM_STATE = 0


def _safe_name(class_gbn):
    return re.sub(r"[^0-9A-Za-z가-힣]+", "_", class_gbn)


def build_pixel_datasets():
    """Groups sampled pixel vectors by class_gbn (sensor domain)."""
    rng = np.random.default_rng(RANDOM_STATE)
    by_domain = {}
    for cube, mask, info in dataset.iter_samples():
        labeled = np.argwhere(mask >= 0)
        if len(labeled) == 0:
            continue
        take = min(PIXELS_PER_IMAGE, len(labeled))
        idx = rng.choice(len(labeled), size=take, replace=False)
        X, y = by_domain.setdefault(info["class_gbn"], ([], []))
        for r, c in labeled[idx]:
            X.append(cube[r, c])
            y.append(mask[r, c])
    return {
        domain: (np.array(X, dtype=np.float32), np.array(y, dtype=np.int64))
        for domain, (X, y) in by_domain.items()
    }


def train_one(domain, X, y, categories):
    print(f"\n=== domain: {domain} ({len(X)} pixel samples, "
          f"{X.shape[1]} bands, {len(set(y))} classes) ===")

    classes_present = np.unique(y)
    can_stratify = all((y == c).sum() >= 2 for c in classes_present)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=RANDOM_STATE,
        stratify=y if can_stratify else None,
    )

    clf = RandomForestClassifier(
        n_estimators=100, max_depth=12, min_samples_leaf=5,
        class_weight="balanced", random_state=RANDOM_STATE, n_jobs=-1,
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    labels = sorted(set(y_test) | set(y_pred))
    print("POC classification report (low support for most classes is")
    print("expected — this run only validates that the pipeline works,")
    print("not that the model is accurate):\n")
    print(classification_report(
        y_test, y_pred, labels=labels,
        target_names=[categories.get(l, str(l)) for l in labels],
        zero_division=0,
    ))

    ARTIFACT_DIR.mkdir(exist_ok=True)
    model_path = ARTIFACT_DIR / f"model_{_safe_name(domain)}.joblib"
    dump(clf, model_path)
    print(f"Saved {model_path}")


def main():
    print("Loading sample tiles and sampling labeled pixels...")
    by_domain = build_pixel_datasets()
    categories = dataset.load_categories()

    for domain, (X, y) in by_domain.items():
        train_one(domain, X, y, categories)

    ARTIFACT_DIR.mkdir(exist_ok=True)
    with open(ARTIFACT_DIR / "categories.json", "w", encoding="utf-8") as f:
        json.dump(categories, f, ensure_ascii=False, indent=2)
    print(f"\nSaved categories to {ARTIFACT_DIR / 'categories.json'}")


if __name__ == "__main__":
    main()
