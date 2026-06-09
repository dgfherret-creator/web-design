from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
PDF = Path(r"C:\Users\Administrator\Desktop\📁 作品集与文档\_个人简历(2)(3).pdf")

CREAM = (255, 242, 227)
ORANGE = (255, 90, 0)
HOT = (255, 42, 0)
RED = (170, 8, 4)
INK = (5, 1, 0)
CYAN = (19, 214, 210)


def font(size: int, bold: bool = False):
    names = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def gradient(size, stops):
    width, height = size
    x = np.linspace(0, 1, width, dtype=np.float32)
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    t = x[None, :] * 0.64 + y * 0.36
    pixels = np.zeros((height, width, 3), dtype=np.float32)
    for start, end in zip(stops, stops[1:]):
        p0, c0 = start
        p1, c1 = end
        local = np.clip((t - p0) / max(0.001, p1 - p0), 0, 1)
        c0 = np.array(c0, dtype=np.float32)
        c1 = np.array(c1, dtype=np.float32)
        segment = c0 * (1 - local[..., None]) + c1 * local[..., None]
        mask = (t >= p0) & (t <= p1)
        pixels = np.where(mask[..., None], segment, pixels)
    pixels = np.where((t < stops[0][0])[..., None], np.array(stops[0][1]), pixels)
    pixels = np.where((t > stops[-1][0])[..., None], np.array(stops[-1][1]), pixels)
    return Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8), "RGB")


def draw_grid(draw, width, height, spacing=74, color=(255, 242, 227, 28)):
    for x in range(0, width + spacing, spacing):
        draw.line((x, 0, x, height), fill=color, width=1)
    for y in range(0, height + spacing, spacing):
        draw.line((0, y, width, y), fill=color, width=1)


def rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def label(draw, xy, text, fill=CREAM, size=32, bold=False, anchor=None):
    draw.text(xy, text, fill=fill, font=font(size, bold=bold), anchor=anchor)


def extract_profile():
    reader = PdfReader(str(PDF))
    image = reader.pages[0].images[0].image.convert("RGB")
    image.save(ASSETS / "profile.png", quality=95)
    return image


def save_hero_person(profile):
    source = profile.crop((26, 0, 536, 720)).resize((680, 960), Image.Resampling.LANCZOS)
    rgba = source.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3]
    white = (rgb[:, :, 0] > 224) & (rgb[:, :, 1] > 224) & (rgb[:, :, 2] > 224)
    alpha = np.where(white, 0, 255).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.4))

    gray = ImageOps.grayscale(source)
    main = ImageOps.colorize(gray, black=(0, 5, 8), white=(42, 156, 164)).convert("RGBA")
    main.putalpha(alpha_img)

    canvas = Image.new("RGBA", (920, 1080), (0, 0, 0, 0))
    red = Image.new("RGBA", main.size, (255, 28, 0, 0))
    red.putalpha(alpha_img.point(lambda value: int(value * 0.46)))
    cyan = Image.new("RGBA", main.size, (0, 180, 190, 0))
    cyan.putalpha(alpha_img.point(lambda value: int(value * 0.36)))
    canvas.alpha_composite(red, (92, 96))
    canvas.alpha_composite(cyan, (154, 54))
    canvas.alpha_composite(main, (126, 72))

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.ellipse((210, 870, 770, 1038), fill=(0, 0, 0, 112))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    final = Image.alpha_composite(shadow, canvas)
    final.save(ASSETS / "hero-person.png")


def hero_backdrop(name, size=(1920, 1080)):
    width, height = size
    img = gradient(
        size,
        [
            (0.0, (255, 118, 0)),
            (0.34, (255, 70, 0)),
            (0.68, (225, 18, 10)),
            (1.0, (80, 2, 2)),
        ],
    )
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw_grid(draw, width, height, 86, (255, 242, 227, 24))
    random.seed(13)
    for _ in range(96):
        x = random.randint(-200, width)
        y = random.randint(0, height)
        length = random.randint(90, 310)
        color = random.choice([(255, 242, 227, 36), (255, 190, 90, 44), (40, 0, 0, 42)])
        draw.line((x, y, x + length, y - length * 0.22), fill=color, width=random.randint(1, 3))
    label(draw, (112, height - 190), name, fill=(255, 242, 227, 48), size=72, bold=True)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def project_base(right=(110, 8, 4)):
    width, height = 1400, 1000
    img = gradient(
        (width, height),
        [(0, (255, 96, 0)), (0.46, (235, 38, 4)), (1, right)],
    )
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw_grid(draw, width, height, 82, (255, 242, 227, 24))
    return img, overlay, draw


def project_system():
    img, overlay, draw = project_base((18, 4, 3))
    for i in range(7):
        x = 760 + i * 68
        h = [170, 250, 120, 330, 220, 285, 155][i]
        rounded_rect(draw, (x, 670 - h, x + 38, 670), 7, (5, 1, 0, 160))
    rounded_rect(draw, (116, 190, 580, 520), 18, (255, 242, 227, 32), (255, 242, 227, 70), 2)
    rounded_rect(draw, (650, 170, 1220, 748), 18, (5, 1, 0, 120), (255, 242, 227, 68), 2)
    draw.arc((835, 310, 1138, 613), 205, 520, fill=(255, 242, 227, 200), width=18)
    for i in range(5):
        rounded_rect(draw, (158, 250 + i * 54, 516, 278 + i * 54), 5, (5, 1, 0, 96))
    label(draw, (112, 108), "DATA SYSTEM UI", size=58, bold=True)
    label(draw, (116, 184), "12 MODULES / 23 DATA COMPONENTS", fill=(255, 242, 227, 172), size=26)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def project_ip():
    img, overlay, draw = project_base((78, 4, 4))
    label(draw, (116, 108), "BRAND IP KIT", size=58, bold=True)
    label(draw, (120, 184), "VIS / STICKERS / STORE MATERIALS", fill=(255, 242, 227, 172), size=26)
    for cx, cy, color, name in [
        (480, 500, (255, 242, 227, 220), "M"),
        (850, 500, (5, 1, 0, 220), "S"),
    ]:
        draw.ellipse((cx - 120, cy - 120, cx + 120, cy + 120), fill=color)
        draw.ellipse((cx - 56, cy - 184, cx + 4, cy - 78), fill=color)
        draw.ellipse((cx + 12, cy - 184, cx + 72, cy - 78), fill=color)
        eye = (5, 1, 0, 220) if color[0] > 100 else (255, 242, 227, 230)
        draw.ellipse((cx - 50, cy - 12, cx - 16, cy + 22), fill=eye)
        draw.ellipse((cx + 26, cy - 12, cx + 60, cy + 22), fill=eye)
        label(draw, (cx, cy + 156), name, fill=eye, size=38, bold=True, anchor="mm")
    for i in range(16):
        x = 142 + (i % 8) * 142
        y = 760 + (i // 8) * 78
        rounded_rect(draw, (x, y, x + 84, y + 42), 12, (255, 242, 227, 34), (255, 242, 227, 56), 1)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def project_meili():
    img, overlay, draw = project_base((8, 10, 12))
    rounded_rect(draw, (120, 178, 492, 850), 34, (5, 1, 0, 190), (255, 242, 227, 80), 3)
    rounded_rect(draw, (190, 246, 422, 306), 10, (255, 242, 227, 180))
    for i in range(4):
        rounded_rect(draw, (190, 370 + i * 94, 422, 428 + i * 94), 10, (255, 242, 227, 44))
    rounded_rect(draw, (680, 210, 1248, 400), 18, (255, 242, 227, 52), (255, 242, 227, 74), 2)
    rounded_rect(draw, (680, 458, 970, 742), 18, (5, 1, 0, 120), (255, 242, 227, 72), 2)
    rounded_rect(draw, (1010, 458, 1248, 742), 18, (255, 242, 227, 44), (255, 242, 227, 68), 2)
    label(draw, (680, 112), "MEILI VIS UPGRADE", size=58, bold=True)
    label(draw, (684, 798), "26 VIS STANDARDS / 38 UI PAGES", fill=(255, 242, 227, 172), size=26)
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def project_commerce():
    img, overlay, draw = project_base((54, 8, 3))
    label(draw, (116, 108), "ECOMMERCE CAMPAIGN", size=58, bold=True)
    label(draw, (120, 184), "120+ ASSETS / 22% CTR LIFT", fill=(255, 242, 227, 172), size=26)
    for i in range(5):
        x = 118 + i * 244
        y = 274 + (i % 2) * 58
        rounded_rect(draw, (x, y, x + 190, y + 408), 14, (5, 1, 0, 116), (255, 242, 227, 58), 2)
        rounded_rect(draw, (x + 24, y + 28, x + 166, y + 164), 10, (255, 242, 227, 76 + i * 16))
        rounded_rect(draw, (x + 24, y + 208, x + 166, y + 236), 4, (5, 1, 0, 96))
        rounded_rect(draw, (x + 24, y + 258, x + 132, y + 286), 4, (255, 242, 227, 92))
    draw.line((140, 786, 1280, 704), fill=(255, 242, 227, 168), width=4)
    for i in range(9):
        x = 170 + i * 132
        y = 785 - i * 9 + math.sin(i) * 28
        draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(255, 242, 227, 230))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    profile = extract_profile()
    save_hero_person(profile)
    outputs = {
        "project-system.png": project_system(),
        "project-ip.png": project_ip(),
        "project-meili.png": project_meili(),
        "project-commerce.png": project_commerce(),
        "hero-poster.png": hero_backdrop("CREATIVE BRANDING STUDIO"),
        "contact-backdrop.png": hero_backdrop("SHUYUAN CREATIVE DESIGN"),
    }
    for name, image in outputs.items():
        image.save(ASSETS / name, quality=94)


if __name__ == "__main__":
    main()
