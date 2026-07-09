"""Loads the AI Hub hyperspectral seaweed/benthic dataset (Sample/ folder).

Label JSONs live under Sample/02.라벨링데이터/<category>/.../002.TIF/*.json in a
COCO-like FeatureCollection format. Each JSON's info.source_file names the
matching 10-band TIFF cube under Sample/01.원천데이터/<same category>/.../002.TIF/.
That file is not always present in the preview bundle (e.g. 05.모자반류) -
such labels are skipped with a warning rather than assumed to match by folder
position.

categories_id in the labels is 0-indexed and corresponds, in order, to the 31
category folder names under 01.원천데이터 (0=갈파래류 ... 30=기타).

Polygon coordinates use a bottom-left-origin convention: x in [0, width],
y in [-height, 0]. Pixel-space y is therefore -y (equivalently height + y),
not y directly.
"""

import json
from pathlib import Path

import numpy as np
import tifffile
from PIL import Image, ImageDraw

DATA_ROOT = Path(__file__).resolve().parent.parent / "Sample"
SOURCE_DIR = DATA_ROOT / "01.원천데이터"
LABEL_DIR = DATA_ROOT / "02.라벨링데이터"


def load_categories():
    """Returns {id: 카테고리명} built from the 01.원천데이터 folder order."""
    folders = sorted(p.name for p in SOURCE_DIR.iterdir() if p.is_dir())
    return {i: name.split(".", 1)[1] for i, name in enumerate(folders)}


def _find_source_tif(source_file):
    matches = list(SOURCE_DIR.glob(f"**/{source_file}"))
    return matches[0] if matches else None


def _ring_area(ring):
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    return 0.5 * abs(
        sum(xs[i] * ys[i - 1] - xs[i - 1] * ys[i] for i in range(len(ring)))
    )


def _rasterize(features, width, height):
    # Annotations nest a whole-frame background polygon (e.g. category 30
    # "기타") under smaller, more specific species/organism polygons. Draw
    # largest-area first so detail regions paint on top instead of being
    # overwritten by the background.
    ordered = sorted(
        features,
        key=lambda feat: _ring_area(feat["geometry"]["coordinates"][0]),
        reverse=True,
    )

    mask = Image.new("I", (width, height), color=-1)
    draw = ImageDraw.Draw(mask)
    for feat in ordered:
        category_id = feat["properties"]["categories_id"]
        for ring in feat["geometry"]["coordinates"]:
            points = [
                (min(max(x, 0), width - 1), min(max(-y, 0), height - 1))
                for x, y in ring
            ]
            if len(points) >= 3:
                draw.polygon(points, fill=category_id)
    return np.array(mask)


def iter_samples():
    """Yields (band_cube[H,W,10], mask[H,W] int, info dict) for every label
    JSON whose source TIFF is present in the sample bundle."""
    for label_json in sorted(LABEL_DIR.glob("**/002.TIF/*.json")):
        with open(label_json, encoding="utf-8") as f:
            doc = json.load(f)

        source_file = doc["info"]["source_file"]
        tif_path = _find_source_tif(source_file)
        if tif_path is None:
            print(f"[skip] source TIF not found for {label_json.name} "
                  f"(expected {source_file})")
            continue

        band_cube = tifffile.imread(tif_path)
        image_meta = doc["image"][0]
        mask = _rasterize(doc["features"], image_meta["width"], image_meta["height"])

        yield band_cube, mask, doc["info"]


if __name__ == "__main__":
    cats = load_categories()
    print(f"{len(cats)} categories loaded")
    n = 0
    for cube, mask, info in iter_samples():
        n += 1
        labeled = (mask >= 0).sum()
        print(f"{info['source_file']}: cube={cube.shape} labeled_px={labeled}")
    print(f"{n} usable samples")
