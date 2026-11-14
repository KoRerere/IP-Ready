from pathlib import Path

import cv2
import numpy as np
from PIL import Image


SOURCE_DIR = Path("/Users/gao/Downloads/ipready-covers")
OUTPUT_DIR = Path("/Users/gao/Desktop/IP-Ready/ipready-covers-logo-updated")
LOGO_PATH = Path("/Users/gao/Desktop/Projuct-logo@4x.png")

# The original cover lockup occupies roughly x=58..276, y=977..1017.
# The replacement is deliberately a little larger, and shifted up/right.
PLACEMENT = (70, 946)
PLACED_WIDTH = 318


def make_white_wordmark() -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    pixels = np.array(logo)

    # The icon is entirely to the left of x=112. Recolor only the wordmark,
    # retaining the source alpha so its original antialiasing stays intact.
    wordmark = pixels[:, 112:, :]
    visible = wordmark[:, :, 3] > 0
    wordmark[visible, 0] = 255
    wordmark[visible, 1] = 255
    wordmark[visible, 2] = 255
    pixels[:, 112:, :] = wordmark

    result = Image.fromarray(pixels, "RGBA")
    height = round(PLACED_WIDTH * result.height / result.width)
    return result.resize((PLACED_WIDTH, height), Image.Resampling.LANCZOS)


def remove_old_lockup(image_bgr: np.ndarray) -> np.ndarray:
    mask = np.zeros(image_bgr.shape[:2], dtype=np.uint8)

    # The colorful old icon needs full removal because the new mark is shifted.
    mask[968:1025, 54:116] = 255

    # The old white text is on a nearly black area. Mask the complete wordmark
    # box so no old letter edge can show through the new, wider typography.
    mask[968:1025, 116:282] = 255

    # A small feathered expansion keeps WebP antialiasing halos from surviving.
    mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)
    return cv2.inpaint(image_bgr, mask, 5, cv2.INPAINT_TELEA)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    logo = make_white_wordmark()
    logo.save(OUTPUT_DIR / "IP-Ready-logo-white.png")

    for source in sorted(SOURCE_DIR.glob("*.webp")):
        original_bgr = cv2.imread(str(source), cv2.IMREAD_COLOR)
        if original_bgr is None:
            raise RuntimeError(f"Could not read {source}")

        cleaned_bgr = remove_old_lockup(original_bgr)
        cleaned_rgb = cv2.cvtColor(cleaned_bgr, cv2.COLOR_BGR2RGB)
        cover = Image.fromarray(cleaned_rgb, "RGB").convert("RGBA")
        cover.alpha_composite(logo, dest=PLACEMENT)

        destination = OUTPUT_DIR / source.name
        cover.convert("RGB").save(destination, "WEBP", lossless=True, method=6)
        print(destination)


if __name__ == "__main__":
    main()
