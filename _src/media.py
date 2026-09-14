#!/usr/bin/env python3
"""Фото для нового vetnas: мягкая «медицинская» обработка и WebP в двух размерах.

Обработка сдержанная: чуть ниже насыщенность, чистые светлые тона, без тонировки
кожи. Зерно накладывает CSS. Фото из статей (live/assets/img) просто ужимаем.
"""
import json, pathlib, re
from PIL import Image, ImageEnhance

ROOT = pathlib.Path(__file__).resolve().parent.parent
Y = ROOT / "yphotos"
L = ROOT / "live/public_html/assets/img"
OUT = ROOT / "dist/assets/img"

# имя на сайте -> исходник
PHOTOS = {
    "vrach-dzhek-rassel": Y / "y2.jpg",
    "vrach-koshka-na-pleche": Y / "y9.jpg",
    "vrach-shchenok-povyazka": Y / "y15.jpg",
    "vrachi-labrador": Y / "y14.jpg",
    "vrachi-konsultatsiya": L / "gallery-1.jpg",
    "uzi-koshka": L / "gallery-2.jpg",
    "vrach-siamskaya-koshka": L / "gallery-3.jpg",
    "osmotr-koshki": L / "gallery-4.jpg",
    "stacionar-kletka": L / "gallery-5.jpg",
    "vrachi-ovcharka": L / "about-veterinarians-dog.png",
    "pacient-devochka-koshka": Y / "y7.jpg",
    "pacient-bulli": Y / "y8.jpg",
    "pacient-kot-na-stole": Y / "y10.jpg",
    "pacient-chernyy-kotenok": Y / "y11.jpg",
    "pacient-ryzhiy-pes": Y / "y12.jpg",
    "pacient-vest-terer": Y / "y13.jpg",
    "fasad-kliniki": Y / "y5.jpg",
    "pacient-chihuahua": Y / "y1.jpg",
    "pacient-seraya-koshka": Y / "y6.jpg",
}


def grade(im):
    im = im.convert("RGB")
    im = ImageEnhance.Color(im).enhance(0.82)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {}
    for name, src in PHOTOS.items():
        im = grade(Image.open(src))
        meta[name] = {"w": im.size[0], "h": im.size[1]}
        for s in (640, 1280):
            k = im.copy()
            k.thumbnail((s, s))
            k.save(OUT / f"{name}-{s}.webp", "WEBP", quality=78, method=6)
    # картинки из статей: кладём как есть, но в WebP и не больше 1200 px
    art = OUT / "stati"
    art.mkdir(exist_ok=True)
    for f in L.iterdir():
        if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp") and not re.search(r"\.(jpg|png)\.\d$", f.name):
            continue
        try:
            im = Image.open(f).convert("RGB")
        except Exception:
            continue
        im.thumbnail((1200, 1200))
        im.save(art / (re.sub(r"[^A-Za-z0-9_-]", "-", f.name) + ".webp"), "WEBP", quality=76, method=6)
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print("фото:", len(meta))


if __name__ == "__main__":
    main()
