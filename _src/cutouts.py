#!/usr/bin/env python3
"""Животные и врачи, вырезанные по контуру, -> dist/assets/img/cut/*.webp (с прозрачностью).

Сама вырезка — cutouts/cutout (собирается из src/cutout.swift, Apple Vision):
  swiftc -O src/cutout.swift -o cutouts/cutout
  cutouts/cutout yphotos/y12.jpg cutouts/y12.png
"""
import json, os
from PIL import Image

NAMES = {"y12": "pes-ryzhiy", "y13": "vest-terer", "y10": "kot-belyy", "y11": "kotenok-chernyy",
         "y6": "koshka-seraya", "y1": "chihuahua", "y2": "vrach-dzhek-rassel", "y9": "vrach-kot",
         "y14": "vrachi-labrador", "y15": "vrach-shchenok", "ovcharka": "vrachi-ovcharka",
         "gallery-3": "vrach-siamskaya", "gallery-2": "vrach-ryzhiy-kot"}
os.makedirs("dist/assets/img/cut", exist_ok=True)
meta = {}
for k, v in NAMES.items():
    im = Image.open(f"cutouts/{k}.png").convert("RGBA")
    for s in (600, 1100):
        c = im.copy(); c.thumbnail((s, s))
        c.save(f"dist/assets/img/cut/{v}-{s}.webp", "WEBP", quality=82, method=6)
    c = im.copy(); c.thumbnail((1100, 1100)); meta[v] = c.size
json.dump(meta, open("dist/assets/img/cut/meta.json", "w"))
print(len(meta))
