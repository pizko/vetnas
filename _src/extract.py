#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Вынимает контент живого vetnasvyaz.ru (выгрузка в live/public_html) в data/pages.json.

С каждой страницы берём только смысл: title, description, адрес, H1, лид,
хлебные крошки и тело статьи. Вёрстка старого сайта (обёртки Тильды, карточки,
карта, финальный призыв) выбрасывается — её заново рисует build.py.
"""
import html, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
LIVE = ROOT / "live/public_html"
OUT = ROOT / "data/pages.json"

EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U0001F900-\U0001F9FF⬀-⯿️‍⠀-⣿"
    "▪▫◻◼✅✔✖❌❗‼]+")


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def url_of(rel):
    """Путь файла -> канонический адрес без .html, как на живом сайте."""
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[:-len("index.html")]
    return "/" + rel[:-len(".html")]


def clean_body(b):
    b = re.sub(r"<!--.*?-->", "", b, flags=re.S)
    b = EMOJI.sub("", b)
    b = b.replace("⠀", " ").replace("⠀", " ")
    # обёртки старого конструктора: div без смысла
    b = re.sub(r"</?div[^>]*>", "", b)
    b = re.sub(r"</?span[^>]*>", "", b)
    # карточки посадочных -> простые пункты
    b = re.sub(r'<article class="vetnas-landing-card">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*</article>',
               r'<li class="card"><strong>\1</strong><span>\2</span></li>', b, flags=re.S)
    b = re.sub(r"(?:<li class=\"card\">.*?</li>\s*)+",
               lambda m: '<ol class="cards">' + m.group(0) + "</ol>", b, flags=re.S)
    # «Полезные разделы» — дубли меню, в новом дизайне не нужны
    b = re.sub(r"<h2>Полезные разделы</h2>\s*<ul>.*?</ul>", "", b, flags=re.S)
    # кнопки звонка внутри текста — у страницы есть свой призыв
    b = re.sub(r'<a href="tel:[^"]*">[^<]*</a>', "", b)
    # атрибуты оформления
    b = re.sub(r'\s(?:style|width|height|border|cellpadding|cellspacing|align|target|rel|loading)="[^"]*"', "", b)
    b = re.sub(r"<p>\s*(?:&nbsp;|\s)*</p>", "", b)
    b = re.sub(r"\n\s*\n+", "\n", b)
    return b.strip()


def main():
    pages = []
    for f in sorted(LIVE.rglob("*.html")):
        rel = str(f.relative_to(LIVE))
        if rel.startswith(("news/", "d/", "g/", "assets/")) or "_article-template" in rel:
            continue
        s = f.read_text(encoding="utf-8", errors="replace")
        title = text(re.search(r"<title>(.*?)</title>", s, re.S).group(1))
        dm = re.search(r'<meta name="description" content="([^"]*)"', s)
        main_m = re.search(r"<main[^>]*>(.*?)</main>", s, re.S)
        main = main_m.group(1) if main_m else ""
        hero = re.search(r'<section class="concept-(?:page-)?hero[^"]*">(.*?)</section>', main, re.S)
        hero_html = hero.group(1) if hero else ""
        h1m = re.search(r"<h1[^>]*>(.*?)</h1>", hero_html or main, re.S)
        lead = ""
        after = (hero_html or "").split("</h1>", 1)
        if len(after) == 2:
            lm = re.search(r"<p[^>]*>(.*?)</p>", after[1], re.S)
            lead = text(lm.group(1)) if lm else ""
        crumbs = []
        nav = re.search(r'<nav class="concept-breadcrumbs"[^>]*>(.*?)</nav>', main, re.S)
        if nav:
            for a_href, a_txt in re.findall(r'<a href="([^"]*)">(.*?)</a>', nav.group(1)):
                crumbs.append([text(a_txt), a_href])
        meta_date = re.search(r'concept-article__meta">([^<]*)<', main)
        cover = re.search(r'class="concept-article__cover" src="([^"]*)"', main)
        content = re.search(r'<div class="concept-content">(.*)</div>\s*(?:<div class="concept-article__actions">|</div>\s*</div>\s*</section>)',
                            main, re.S)
        body = content.group(1) if content else ""
        # у главной свой шаблон — берём её тексты отдельно в build.py
        pages.append({
            "file": rel,
            "url": url_of(rel),
            "title": title,
            "description": html.unescape(dm.group(1)) if dm else "",
            "h1": EMOJI.sub("", text(h1m.group(1))) if h1m else "",
            "lead": EMOJI.sub("", lead),
            "crumbs": crumbs,
            "date": text(meta_date.group(1)) if meta_date else "",
            "cover": cover.group(1) if cover else "",
            "body": clean_body(body),
            "kind": ("news" if rel.startswith("novosti/") and rel != "novosti/index.html" else
                     "home" if rel == "index.html" else "page"),
        })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(pages, ensure_ascii=False, indent=1), encoding="utf-8")
    print("страниц:", len(pages), "пустых тел:", sum(1 for p in pages if not p["body"]))


if __name__ == "__main__":
    main()
