#!/usr/bin/env python3
"""Build static landing pages from an XLSX workbook.

The script intentionally uses only the Python standard library so it can run on
fresh machines without installing packages.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import zipfile
from datetime import date
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TEMPLATE = ROOT / "landing-template.html"
DEFAULT_INPUT = ROOT / "data" / "veterinar.xlsx"
DEFAULT_OUTPUT = ROOT
DEFAULT_SITE_URL = "https://pizko.github.io/vetnas/"

EXPECTED_COLUMNS = [
    "slug",
    "title",
    "description",
    "keywords",
    "h1",
    "hero_kicker",
    "hero_subtitle",
    "primary_keyword",
    "additional_keywords",
    "cluster",
    "page_type",
    "intent",
    "anti_duplicates",
    "intro_html",
    "service_cards",
    "benefits",
    "when_to_contact_html",
    "diagnostics_html",
    "price_html",
    "faq_html",
    "cta_text",
    "internal_links",
    "status",
]

ALLOWED_HTML_TAGS = {
    "p",
    "strong",
    "b",
    "em",
    "i",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "br",
    "a",
}

SUSPICIOUS_SLUG_PARTS = {
    "500",
    "7000",
    "deshevo",
    "nedorogo",
    "skidka",
    "luchshaya",
    "5-zvezd",
    "kruglosutochnaya",
    "nochnoy",
    "vse-vklyucheno-0",
}


def xml_name(tag: str) -> str:
    return f"{{http://schemas.openxmlformats.org/spreadsheetml/2006/main}}{tag}"


def rel_name(tag: str) -> str:
    return f"{{http://schemas.openxmlformats.org/package/2006/relationships}}{tag}"


def office_rel_name(tag: str) -> str:
    return f"{{http://schemas.openxmlformats.org/officeDocument/2006/relationships}}{tag}"


def read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []

    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for si in root.findall(xml_name("si")):
        chunks = [node.text or "" for node in si.iter(xml_name("t"))]
        strings.append("".join(chunks))
    return strings


def resolve_first_sheet_path(zf: zipfile.ZipFile) -> str:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    sheet = workbook.find(f"{xml_name('sheets')}/{xml_name('sheet')}")
    if sheet is None:
        raise ValueError("Workbook has no sheets")

    rel_id = sheet.attrib.get(office_rel_name("id"))
    if not rel_id:
        raise ValueError("First sheet has no relationship id")

    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    for rel in rels.findall(rel_name("Relationship")):
        if rel.attrib.get("Id") == rel_id:
            target = rel.attrib["Target"].lstrip("/")
            return target if target.startswith("xl/") else f"xl/{target}"

    raise ValueError(f"Cannot resolve sheet relationship {rel_id}")


def col_index(cell_ref: str) -> int:
    letters = re.sub(r"[^A-Z]", "", cell_ref.upper())
    value = 0
    for ch in letters:
        value = value * 26 + (ord(ch) - 64)
    return value - 1


def cell_text(cell: ET.Element, shared_strings: list[str]) -> str:
    cell_type = cell.attrib.get("t")
    value = cell.find(xml_name("v"))

    if cell_type == "inlineStr":
        inline = cell.find(xml_name("is"))
        if inline is None:
            return ""
        return "".join(node.text or "" for node in inline.iter(xml_name("t"))).strip()

    if value is None or value.text is None:
        return ""

    raw = value.text
    if cell_type == "s":
        try:
            return shared_strings[int(raw)].strip()
        except (IndexError, ValueError):
            return ""
    if cell_type == "b":
        return "TRUE" if raw == "1" else "FALSE"
    return raw.strip()


def read_xlsx_rows(path: Path) -> list[dict[str, str]]:
    with zipfile.ZipFile(path) as zf:
        shared_strings = read_shared_strings(zf)
        sheet_path = resolve_first_sheet_path(zf)
        sheet = ET.fromstring(zf.read(sheet_path))

    rows: list[list[str]] = []
    for row in sheet.iter(xml_name("row")):
        values: dict[int, str] = {}
        for cell in row.findall(xml_name("c")):
            ref = cell.attrib.get("r", "")
            values[col_index(ref)] = cell_text(cell, shared_strings)

        if values:
            max_col = max(values)
            rows.append([values.get(i, "") for i in range(max_col + 1)])

    if not rows:
        return []

    headers = [normalize_header(value) for value in rows[0]]
    result: list[dict[str, str]] = []
    for raw_row in rows[1:]:
        row = {headers[i]: raw_row[i].strip() if i < len(raw_row) else "" for i in range(len(headers))}
        if any(row.values()):
            result.append(row)
    return result


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9_]+", "_", value.strip().lower()).strip("_")


def safe_slug(value: str) -> str:
    slug = value.strip().lower()
    slug = re.sub(r"\.html?$", "", slug)
    slug = re.sub(r"[^a-z0-9-]+", "-", slug)
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug


def strip_unsafe_html(value: str) -> str:
    value = value.strip()
    if not value:
        return ""

    value = re.sub(r"<!--.*?-->", "", value, flags=re.S)
    value = re.sub(r"<\s*(script|style|iframe|object|embed)[^>]*>.*?<\s*/\s*\1\s*>", "", value, flags=re.I | re.S)
    value = re.sub(r"\s+on[a-z]+\s*=\s*(['\"]).*?\1", "", value, flags=re.I | re.S)
    value = re.sub(r"\s+javascript\s*:", ":", value, flags=re.I)

    def clean_tag(match: re.Match[str]) -> str:
        slash, tag_name, attrs = match.group(1), match.group(2).lower(), match.group(3) or ""
        if tag_name not in ALLOWED_HTML_TAGS:
            return ""
        if slash:
            return f"</{tag_name}>"
        if tag_name == "a":
            href_match = re.search(r"""href\s*=\s*(['"])(.*?)\1""", attrs, flags=re.I | re.S)
            href = href_match.group(2).strip() if href_match else "#"
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#")) or href.endswith(".html"):
                return f'<a href="{html.escape(href, quote=True)}">'
        return f"<{tag_name}>"

    value = re.sub(r"<\s*(/)?\s*([a-zA-Z0-9]+)([^>]*)>", clean_tag, value)
    return value


def paragraphs_from_text(value: str) -> str:
    value = value.strip()
    if not value:
        return ""
    if "<" in value and ">" in value:
        return strip_unsafe_html(value)
    chunks = [chunk.strip() for chunk in re.split(r"\n{2,}", value) if chunk.strip()]
    return "\n".join(f"<p>{html.escape(chunk)}</p>" for chunk in chunks)


def parse_pipe_rows(value: str) -> list[tuple[str, str]]:
    items: list[tuple[str, str]] = []
    for line in value.splitlines():
        line = line.strip(" -\t")
        if not line:
            continue
        if "|" in line:
            title, text = line.split("|", 1)
        elif ":" in line:
            title, text = line.split(":", 1)
        else:
            title, text = line, ""
        title, text = title.strip(), text.strip()
        if title:
            items.append((title, text))
    return items


def cards_html(value: str, title: str) -> str:
    items = parse_pipe_rows(value)
    if not items:
        return ""
    cards = []
    for item_title, item_text in items[:8]:
        text_html = f"<p>{html.escape(item_text)}</p>" if item_text else ""
        cards.append(
            "<article class=\"vetnas-landing-card\">"
            f"<h3>{html.escape(item_title)}</h3>{text_html}"
            "</article>"
        )
    return (
        "<section class=\"vetnas-landing-cards\">"
        f"<h2>{html.escape(title)}</h2>"
        + "".join(cards)
        + "</section>"
    )


def links_html(value: str) -> str:
    items = parse_pipe_rows(value)
    if not items:
        return ""
    links = []
    for anchor, href in items[:8]:
        href = href or "#"
        links.append(f'<li><a href="{html.escape(href, quote=True)}">{html.escape(anchor)}</a></li>')
    return (
        "<section class=\"vetnas-landing-block vetnas-landing-links\">"
        "<h2>Полезные разделы</h2><ul>"
        + "".join(links)
        + "</ul></section>"
    )


def build_landing_content(row: dict[str, str]) -> str:
    parts: list[str] = []

    service_cards = cards_html(row.get("service_cards", ""), "Что входит в помощь")
    if service_cards:
        parts.append(service_cards)

    benefits = cards_html(row.get("benefits", ""), "Что важно для владельца")
    if benefits:
        parts.append(benefits)

    for key in ["when_to_contact_html", "diagnostics_html", "price_html", "faq_html"]:
        block = paragraphs_from_text(row.get(key, ""))
        if block:
            parts.append(f'<section class="vetnas-landing-block">{block}</section>')

    cta = row.get("cta_text", "").strip()
    if cta:
        parts.append(
            '<section class="vetnas-landing-cta">'
            f"<p>{html.escape(cta)}</p>"
            '<a class="vetnas-landing-button" href="tel:+74951444803">Позвонить в клинику</a>'
            "</section>"
        )

    links = links_html(row.get("internal_links", ""))
    if links:
        parts.append(links)

    if not parts:
        return ""
    return '<section class="vetnas-landing-content">\n<div class="vetnas-landing-inner">\n' + "\n".join(parts) + "\n</div>\n</section>\n"


def replace_first_screen(template: str, row: dict[str, str]) -> str:
    hero_kicker = row.get("hero_kicker", "").strip() or "Ветеринарная помощь в Раменском"
    hero_subtitle = row.get("hero_subtitle", "").strip() or row.get("h1", "").strip()

    template = re.sub(
        r"(<div class='heading heading--u-iuc0kycev'[^>]*>\s*<span class='text-block-wrap-div' >).*?(</span>\s*</div>)",
        lambda m: m.group(1) + html.escape(hero_kicker) + m.group(2),
        template,
        flags=re.S,
    )
    template = re.sub(
        r"(<div class='text text--u-i64fd56bl'[^>]*>\s*<span class='text-block-wrap-div' >).*?(</span>\s*</div>)",
        lambda m: m.group(1) + html.escape(hero_subtitle) + m.group(2),
        template,
        flags=re.S,
    )
    return template


def render_page(template: str, row: dict[str, str]) -> str:
    title = row.get("title", "").strip() or row.get("h1", "").strip()
    description = row.get("description", "").strip()
    keywords = row.get("keywords", "").strip() or row.get("additional_keywords", "").strip()
    h1 = row.get("h1", "").strip() or title
    intro = paragraphs_from_text(row.get("intro_html", ""))
    landing_content = build_landing_content(row)

    page = template
    page = re.sub(r"\n?<!--\s*LANDING TEMPLATE FOR MASS SEO PAGES.*?-->\s*", "\n", page, flags=re.S)
    page = page.replace("{{TITLE}}", html.escape(title, quote=False))
    page = page.replace("{{DESCRIPTION}}", html.escape(description, quote=True))
    page = page.replace("{{KEYWORDS}}", html.escape(keywords, quote=True))
    page = replace_first_screen(page, row)
    page = re.sub(
        r"(<h1 class='page-title page-title--u-igq3w5yqd' id='igq3w5yqd_0'>).*?(</h1>)",
        lambda m: m.group(1) + "\n" + html.escape(h1) + "\n" + m.group(2),
        page,
        flags=re.S,
    )
    if intro:
        page = re.sub(
            r"(<div class='rich-text rich-text--u-iwzf2l0gi' id='iwzf2l0gi_0'>\s*<div class='text-block-wrap-div' >).*?(</div>\s*</div>)",
            lambda m: m.group(1) + intro + "\n" + m.group(2),
            page,
            count=1,
            flags=re.S,
        )
    if landing_content:
        marker = "<div class='section section--u-ihxy1c2s2'"
        page = page.replace(marker, landing_content + marker, 1)

    data = {
        "primary_keyword": row.get("primary_keyword", ""),
        "cluster": row.get("cluster", ""),
        "page_type": row.get("page_type", ""),
        "intent": row.get("intent", ""),
    }
    page = page.replace(
        "</head>",
        f'<script type="application/json" id="vetnas-landing-meta">{json.dumps(data, ensure_ascii=False)}</script>\n</head>',
        1,
    )
    return page


def validate_row(row: dict[str, str], index: int) -> list[str]:
    errors: list[str] = []
    if not safe_slug(row.get("slug", "")):
        errors.append(f"row {index}: empty/invalid slug")
    if not row.get("title", "").strip():
        errors.append(f"row {index}: empty title")
    if not row.get("h1", "").strip():
        errors.append(f"row {index}: empty h1")
    return errors


def is_suspicious_slug(slug: str) -> bool:
    if slug == "stranica" or re.fullmatch(r"stranica-\d+", slug):
        return True
    return any(part in slug for part in SUSPICIOUS_SLUG_PARTS)


def write_landing_index(output_dir: Path, pages: list[tuple[str, str]]) -> None:
    items = "\n".join(
        f'<li><a href="{html.escape(slug)}.html">{html.escape(title)}</a></li>'
        for slug, title in sorted(pages, key=lambda item: item[1].lower())
    )
    output = f"""<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Посадочные страницы | Ветеринар на связи</title>
  <meta name="robots" content="noindex,follow">
  <link rel="stylesheet" href="vetnas-fallback.css">
</head>
<body>
  <main class="vetnas-landing-content">
    <div class="vetnas-landing-inner">
      <section class="vetnas-landing-block">
        <h1>Посадочные страницы</h1>
        <p>Технический индекс для навигации и проверки сгенерированных SEO-страниц.</p>
        <ul>
          {items}
        </ul>
      </section>
    </div>
  </main>
</body>
</html>
"""
    (output_dir / "landings.html").write_text(output, encoding="utf-8")


def write_sitemap(output_dir: Path, site_url: str) -> None:
    base = site_url.rstrip("/") + "/"
    today = date.today().isoformat()
    urls = []
    for path in sorted(output_dir.glob("*.html")):
        if path.name in {"landing-template.html", "landings.html", "index-skolkovo.html"}:
            continue
        loc = base + path.name
        urls.append(f"  <url><loc>{html.escape(loc)}</loc><lastmod>{today}</lastmod></url>")
    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    output_dir.joinpath("sitemap.xml").write_text(sitemap, encoding="utf-8")
    output_dir.joinpath("sitemap.php").write_text(sitemap, encoding="utf-8")
    output_dir.joinpath("robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base}sitemap.php\n", encoding="utf-8")


def build(
    input_path: Path,
    template_path: Path,
    output_dir: Path,
    limit: int | None = None,
    include_suspicious: bool = False,
    site_url: str = DEFAULT_SITE_URL,
) -> int:
    if not input_path.exists():
        raise FileNotFoundError(f"Input XLSX not found: {input_path}")
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")

    template = template_path.read_text(encoding="utf-8")
    rows = read_xlsx_rows(input_path)
    if limit:
        rows = rows[:limit]

    generated = 0
    errors: list[str] = []
    generated_pages: list[tuple[str, str]] = []
    for index, row in enumerate(rows, start=2):
        row_errors = validate_row(row, index)
        if row_errors:
            errors.extend(row_errors)
            continue
        if row.get("status", "").strip().lower() in {"skip", "ignore", "no"}:
            continue
        slug = safe_slug(row["slug"])
        if not include_suspicious and is_suspicious_slug(slug):
            errors.append(f"row {index}: skipped suspicious slug {slug}")
            continue
        output_path = output_dir / f"{slug}.html"
        output_path.write_text(render_page(template, row), encoding="utf-8")
        generated += 1
        generated_pages.append((slug, row.get("title", "").strip() or row.get("h1", "").strip() or slug))

    write_landing_index(output_dir, generated_pages)
    write_sitemap(output_dir, site_url)
    for error in errors:
        print(f"WARNING: {error}", file=sys.stderr)
    print(f"Generated {generated} page(s) from {input_path}")
    return generated


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--template", type=Path, default=DEFAULT_TEMPLATE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--limit", type=int)
    parser.add_argument("--include-suspicious", action="store_true")
    parser.add_argument("--site-url", default=DEFAULT_SITE_URL)
    args = parser.parse_args(argv)

    build(args.input, args.template, args.output_dir, args.limit, args.include_suspicious, args.site_url)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
