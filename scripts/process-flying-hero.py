from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Administrator\Desktop\📷 截图图片\图层 5.png")
OUTPUT = ROOT / "public" / "assets" / "hero-flying.png"


def make_background_mask(rgb: np.ndarray) -> np.ndarray:
    arr = rgb.astype(np.int16)
    maxc = arr.max(axis=2)
    minc = arr.min(axis=2)
    chroma = maxc - minc
    gray = arr.mean(axis=2)

    # The source has a baked transparent checkerboard made from two gray tones.
    # Keep this conservative so pale clothing is not cut into holes.
    near_light_square = np.abs(gray - 244) < 22
    near_dark_square = np.abs(gray - 220) < 22
    return (chroma < 22) & (maxc > 198) & (near_light_square | near_dark_square)


def connected_to_border(mask: np.ndarray) -> np.ndarray:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    queue = deque()

    for x in range(width):
        if mask[0, x]:
            queue.append((0, x))
        if mask[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if mask[y, 0]:
            queue.append((y, 0))
        if mask[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if seen[y, x] or not mask[y, x]:
            continue
        seen[y, x] = True
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width and not seen[ny, nx] and mask[ny, nx]:
                queue.append((ny, nx))

    return seen


def main():
    source_image = Image.open(SOURCE)
    if "A" in source_image.getbands():
        rgba = source_image.convert("RGBA")
        alpha_arr = np.array(rgba)[:, :, 3]
        ys, xs = np.where(alpha_arr > 8)
        if len(xs) and len(ys):
            pad = 18
            left = max(0, xs.min() - pad)
            top = max(0, ys.min() - pad)
            right = min(rgba.width, xs.max() + pad)
            bottom = min(rgba.height, ys.max() + pad)
            rgba = rgba.crop((left, top, right, bottom))

        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        rgba.save(OUTPUT)
        print(OUTPUT)
        return

    image = source_image.convert("RGB")
    rgb = np.array(image)
    background_candidate = make_background_mask(rgb)
    background = connected_to_border(background_candidate)

    alpha = np.where(background, 0, 255).astype(np.uint8)
    alpha_image = Image.fromarray(alpha, "L")
    # Shrink the foreground slightly before softening. Expanding it keeps the
    # baked checkerboard anti-aliasing and creates a pale fringe on orange.
    alpha_image = alpha_image.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.5))
    alpha_arr = np.array(alpha_image)
    alpha_arr = np.where(alpha_arr < 118, 0, alpha_arr)
    alpha_arr = np.where(alpha_arr > 238, 255, alpha_arr).astype(np.uint8)
    alpha_image = Image.fromarray(alpha_arr, "L")

    protect = Image.new("L", image.size, 0)
    protect_draw = ImageDraw.Draw(protect)
    # Preserve the resume sheet: it is intentionally white/gray and otherwise
    # looks like the checkerboard background to simple color-based masking.
    protect_draw.polygon([(145, 408), (254, 365), (378, 654), (302, 706)], fill=255)
    protect_draw.polygon([(236, 366), (486, 424), (506, 594), (308, 704), (184, 484)], fill=255)
    alpha_image = Image.composite(Image.new("L", image.size, 255), alpha_image, protect)
    alpha = np.array(alpha_image)

    rgb_clean = rgb.astype(np.float32)
    known = alpha > 230
    # Fill transparent/semi-transparent edge pixels with nearby foreground
    # colors, so soft alpha edges do not reveal the source checkerboard colors.
    for _ in range(36):
        unknown = ~known
        if not unknown.any():
            break
        total = np.zeros_like(rgb_clean)
        count = np.zeros(alpha.shape, dtype=np.float32)
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            shifted_known = np.roll(known, (dy, dx), axis=(0, 1))
            shifted_rgb = np.roll(rgb_clean, (dy, dx), axis=(0, 1))
            if dy == -1:
                shifted_known[-1, :] = False
            elif dy == 1:
                shifted_known[0, :] = False
            if dx == -1:
                shifted_known[:, -1] = False
            elif dx == 1:
                shifted_known[:, 0] = False
            total += shifted_rgb * shifted_known[..., None]
            count += shifted_known
        fill = unknown & (count > 0)
        rgb_clean[fill] = total[fill] / count[fill, None]
        known[fill] = True

    rgba = Image.fromarray(np.clip(rgb_clean, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    rgba.putalpha(alpha_image)

    alpha_arr = np.array(alpha_image)
    ys, xs = np.where(alpha_arr > 8)
    if len(xs) and len(ys):
        pad = 18
        left = max(0, xs.min() - pad)
        top = max(0, ys.min() - pad)
        right = min(rgba.width, xs.max() + pad)
        bottom = min(rgba.height, ys.max() + pad)
        rgba = rgba.crop((left, top, right, bottom))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    main()
