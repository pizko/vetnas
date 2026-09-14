#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Сборка нового сайта «Ветеринар на связи» в dist/.

Контент: data/pages.json (его делает extract.py из живого vetnasvyaz.ru).
Адреса страниц сохраняются как на живом сайте (/uzi, /novosti/galitoz/ …).

  python3 src/build.py --base /vetnas/ --staging   # GitHub Pages pizko/vetnas
  python3 src/build.py --base /                    # боевой vetnasvyaz.ru
"""
import argparse, hashlib, html, json, pathlib, re, shutil
from datetime import date

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
DOMAIN = "https://vetnasvyaz.ru"
TODAY = date.today().isoformat()
e = html.escape

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="/")
ap.add_argument("--staging", action="store_true")
ARGS = ap.parse_args()
BASE = ARGS.base if ARGS.base.endswith("/") else ARGS.base + "/"
VER = hashlib.md5((SRC / "site.css").read_bytes() + (SRC / "site.js").read_bytes()).hexdigest()[:8]
META = json.loads((DIST / "assets/img/meta.json").read_text())

PHONE = "+7 (495) 144-48-03"
TEL = "tel:+74951444803"
ADDRESS = "Раменское, ул. Красноармейская, 13Б"
MAP = ("https://yandex.ru/map-widget/v1/?um=constructor%3A12c6f83f62633c0e3e8d6a48d06744f5b1911b877c4178e68e37"
       "3911f8e94fb7&source=constructor")
YANDEX_ORG = "https://yandex.ru/maps/org/veterinar_na_svyazi/96498726743/"
TELEGRAM = "https://t.me/veterinarnasvyazi"

# дубли, которые на живом сайте уже склеены 301-редиректом
DUPES = {"abstsess-u-koshki-ramenskoe", "mochekamennaya-bolezn-u-kota-ramenskoe", "sterilizatsiya-sobaki-suki-ramenskoe"}


def u(path=""):
    """Внутренняя ссылка с учётом базового пути (на GitHub Pages сайт лежит в /vetnas/)."""
    return BASE + path.lstrip("/")


def a(path):
    return u("assets/" + path)


def img(name, alt, sizes="100vw", eager=False, cls="", extra=""):
    m = META[name]
    k = min(1, 1280 / max(m["w"], m["h"]))
    w, h = round(m["w"] * k), round(m["h"] * k)
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    c = f' class="{cls}"' if cls else ""
    return (f'<img src="{a(f"img/{name}-1280.webp")}" srcset="{a(f"img/{name}-640.webp")} 640w, '
            f'{a(f"img/{name}-1280.webp")} 1280w" sizes="{sizes}" width="{w}" height="{h}" alt="{e(alt)}" '
            f'{load} decoding="async"{c}{extra}>')


def ld(obj):
    return ('<script type="application/ld+json">' +
            json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>")


CLINIC_ID = DOMAIN + "/#clinic"


def clinic():
    return {
        "@type": ["VeterinaryCare", "LocalBusiness"],
        "@id": CLINIC_ID,
        "name": "Ветеринар на связи",
        "description": "Ветеринарная клиника в Раменском: диагностика, хирургия, стационар и лечение животных 24/7.",
        "url": DOMAIN + "/",
        "telephone": "+74951444803",
        "image": DOMAIN + "/assets/img/vrach-dzhek-rassel-1280.webp",
        "priceRange": "₽₽",
        "address": {"@type": "PostalAddress", "streetAddress": "ул. Красноармейская, 13Б",
                    "addressLocality": "Раменское", "addressRegion": "Московская область",
                    "postalCode": "140109", "addressCountry": "RU"},
        "geo": {"@type": "GeoCoordinates", "latitude": 55.57263, "longitude": 38.23334},
        "openingHoursSpecification": [{"@type": "OpeningHoursSpecification",
                                       "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                                                     "Saturday", "Sunday"], "opens": "00:00", "closes": "23:59"}],
        "hasMap": YANDEX_ORG,
        "sameAs": [YANDEX_ORG, TELEGRAM],
        "areaServed": [{"@type": "City", "name": "Раменское"}, {"@type": "AdministrativeArea", "name": "Раменский городской округ"}],
    }


def website():
    return {"@type": "WebSite", "@id": DOMAIN + "/#website", "url": DOMAIN + "/", "name": "Ветеринар на связи",
            "inLanguage": "ru-RU", "publisher": {"@id": CLINIC_ID}}


def crumbs(items):
    node = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": DOMAIN + p} for i, (n, p) in enumerate(items)]}
    out = '<ol class="crumbs">' + "".join(
        f'<li><a href="{u(p)}">{e(n)}</a></li>' if i < len(items) - 1 else f'<li aria-current="page">{e(n)}</li>'
        for i, (n, p) in enumerate(items)) + "</ol>"
    return node, out


# ------------------------------------------------------------------ каркас

NAV = [("Клиника", "o-kompanii"), ("Услуги", "uslugi-i-tseny"), ("Врачи", "#vrachi"), ("Диагностика", "diagnostika"),
       ("Стационар", "stacionar"), ("Контакты", "contacts")]


def nav_href(p):
    return u("") + p if p.startswith("#") else u(p)


def head(title, desc, path, graph, og_image=None, preload=""):
    og = og_image or DOMAIN + "/assets/img/vrach-dzhek-rassel-1280.webp"
    robots = '<meta name="robots" content="noindex, nofollow">\n' if ARGS.staging else ""
    counters = "" if ARGS.staging else """<meta name="yandex-verification" content="010c8fea5b64bb1a">
<meta name="google-site-verification" content="6z5LWg_7OVz5SjBuYhUsi-6xImMs6lzzMsZf-xvE_5s">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FG7L5P8EDV"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-FG7L5P8EDV');</script>
"""
    return f"""<!DOCTYPE html>
<html lang="ru" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{DOMAIN}{path}">
{robots}<meta name="theme-color" content="#f4f1ea">
<meta property="og:site_name" content="Ветеринар на связи">
<meta property="og:locale" content="ru_RU">
<meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{DOMAIN}{path}">
<meta property="og:image" content="{og}">
<link rel="icon" href="{a('img/favicon.png')}">
<link rel="preload" href="{a('fonts/SourceSerif4-normal-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{a('fonts/Onest-normal-cyrillic.woff2')}" as="font" type="font/woff2" crossorigin>
{preload}<link rel="stylesheet" href="{a('site.css')}?v={VER}">
<script>document.documentElement.className='js'</script>
{counters}{ld({"@context": "https://schema.org", "@graph": graph})}
</head>
<body>
<a class="skip" href="#main">К содержанию</a>
"""


def header(active=""):
    nav = "".join(f'<a href="{nav_href(p)}"{" aria-current=\"page\"" if active == p else ""}>{n}</a>' for n, p in NAV)
    mob = "".join(f'<li><a href="{nav_href(p)}">{n}<span>→</span></a></li>' for n, p in
                  NAV + [("Новости", "novosti"), ("Вакансии", "vakansii")])
    return f"""<header class="hdr">
  <div class="wrap">
    <a class="logo" href="{u()}" aria-label="Ветеринар на связи — на главную"><i aria-hidden="true"></i><span>Ветеринар</span><span>на связи</span></a>
    <nav class="nav" aria-label="Основное меню">{nav}</nav>
    <div class="hdr-right">
      <div class="hdr-24"><b>24/7</b><a href="{TEL}">{PHONE}</a></div>
      <a class="btn btn--green" href="#zapis">Записаться <span class="arr">→</span></a>
      <button class="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav">
  <ul>{mob}</ul>
  <div class="foot"><span class="label"><b>24/7</b> · экстренная помощь</span><a href="{TEL}">{PHONE}</a><span class="muted">{ADDRESS}</span></div>
</div>
"""


def booking_and_contacts():
    return f"""<section class="section" id="zapis" aria-labelledby="zapis-h">
  <div class="wrap book">
    <div>
      <p class="label">Запись на приём</p>
      <h2 class="h-lg" id="zapis-h" style="margin-top:18px" data-reveal>Записаться<br>на приём.</h2>
      <p class="muted" style="max-width:460px;margin:24px 0 0" data-reveal>Оставьте имя и телефон — администратор свяжется с вами и уточнит удобное время. Если питомцу плохо прямо сейчас, звоните: мы принимаем круглосуточно.</p>
    </div>
    <form class="form" data-book data-php="{u('send.php')}" novalidate data-reveal>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="sr-only" for="f-name">Ваше имя</label>
      <input id="f-name" type="text" name="name" placeholder="Ваше имя" autocomplete="name" required>
      <label class="sr-only" for="f-phone">Телефон</label>
      <input id="f-phone" type="tel" name="phone" placeholder="Телефон" autocomplete="tel" required>
      <label class="consent"><input type="checkbox" name="consent" required><span>Даю согласие на обработку персональных данных в соответствии с <a href="{u('politika-konfidencialnosti')}">политикой конфиденциальности</a></span></label>
      <button class="btn btn--green" type="submit">Отправить заявку <span class="arr">→</span></button>
      <p class="form-note" role="status"></p>
    </form>
  </div>
</section>
<section class="wrap" aria-labelledby="kontakty-h">
  <div class="contacts">
    <div class="c-info">
      <p class="label">Контакты</p>
      <h2 class="h-md" id="kontakty-h" style="margin-top:18px">Мы рядом,<br>когда нужна помощь.</h2>
      <div class="c-rows">
        <div class="c-row"><span class="label">Адрес</span><span class="v">г. Раменское,<br>ул. Красноармейская, 13Б</span></div>
        <div class="c-row"><span class="label">Телефон</span><span class="v"><a class="big" href="{TEL}">{PHONE}</a></span></div>
        <div class="c-row"><span class="label">График</span><span class="v">24 / 7 — без выходных</span></div>
        <div class="c-row"><span class="label">Telegram</span><span class="v"><a class="link" href="{TELEGRAM}" rel="noopener" target="_blank">@veterinarnasvyazi <span class="arr">→</span></a></span></div>
      </div>
    </div>
    <div class="map"><iframe src="{MAP}" title="Ветеринар на связи на карте: Раменское, Красноармейская, 13Б" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>"""


def footer():
    return f"""<section class="sos" aria-label="Экстренная помощь">
  <div class="wrap"><p>Экстренная помощь 24/7 — без записи и выходных</p><a class="ph" href="{TEL}">{PHONE}</a></div>
</section>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div><p class="h">Ветеринар на связи</p><p style="margin:0;max-width:360px;color:rgba(244,241,234,.75)">Ветеринарная клиника в Раменском. Диагностика, хирургия, стационар и лечение животных круглосуточно.</p></div>
      <div><p class="h">Клиника</p><ul><li><a href="{u('o-kompanii')}">О клинике</a></li><li><a href="{u('uslugi-i-tseny')}">Услуги и цены</a></li><li><a href="{u('novosti')}">Новости</a></li><li><a href="{u('vakansii')}">Вакансии</a></li><li><a href="{u('contacts')}">Контакты</a></li></ul></div>
      <div><p class="h">Направления</p><ul><li><a href="{u('diagnostika')}">Диагностика</a></li><li><a href="{u('uzi')}">УЗИ</a></li><li><a href="{u('hirurgiya')}">Хирургия</a></li><li><a href="{u('stacionar')}">Стационар</a></li><li><a href="{u('kardiologiya')}">Кардиология</a></li></ul></div>
      <div><p class="h">Связь</p><ul><li>г. Раменское,<br>ул. Красноармейская, 13Б</li><li><a href="{TEL}">{PHONE}</a></li><li>24 / 7</li><li><a href="{u('politika-konfidencialnosti')}">Политика конфиденциальности</a></li></ul></div>
    </div>
  </div>
  <p class="ftr-word" aria-hidden="true">Ветеринар на связи</p>
  <div class="wrap ftr-base"><span>© {date.today().year} Ветеринар на связи</span><span>Раменское · 24/7</span></div>
</footer>
<nav class="bottom-bar" aria-label="Быстрая связь"><a href="{TEL}">Позвонить 24/7</a><a href="#zapis">Записаться</a></nav>
"""


def tail():
    metrika = "" if ARGS.staging else """<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(55798867,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script>
<noscript><div><img src="https://mc.yandex.ru/watch/55798867" style="position:absolute;left:-9999px" alt=""></div></noscript>
"""
    return f'<script src="{a("site.js")}?v={VER}" defer></script>\n{metrika}</body>\n</html>\n'


SITEMAP = []


def write(path, title, desc, graph, body, active="", og=None, preload=""):
    out = head(title, desc, path, graph, og, preload) + header(active) + '<main id="main">' + body + \
        "</main>" + booking_and_contacts() + footer() + tail()
    rel = path.strip("/")
    f = DIST / ("index.html" if not rel else (rel + "/index.html" if path.endswith("/") else rel + ".html"))
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(out, encoding="utf-8")
    SITEMAP.append(path)


# ------------------------------------------------------------------ контент страниц

CATS = ["vrach-siamskaya-koshka", "osmotr-koshki", "pacient-kot-na-stole", "pacient-chernyy-kotenok",
        "vrach-koshka-na-pleche", "pacient-devochka-koshka", "pacient-seraya-koshka"]
DOGS = ["vrach-dzhek-rassel", "vrach-shchenok-povyazka", "vrachi-labrador", "vrachi-ovcharka", "pacient-bulli",
        "pacient-ryzhiy-pes", "pacient-vest-terer", "pacient-chihuahua"]
CLINICAL = ["vrachi-konsultatsiya", "uzi-koshka", "vrach-koshka-na-pleche", "vrach-shchenok-povyazka",
            "osmotr-koshki", "vrach-dzhek-rassel", "vrachi-labrador"]


def pick(slug, text):
    s = slug + " " + text.lower()
    h = int(hashlib.md5(slug.encode()).hexdigest(), 16)
    if re.search(r"uzi|ekho|doppler|узи|эхо", s):
        return "uzi-koshka"
    if re.search(r"stacionar|kapeln|infuz|kateter|стационар|капельн", s):
        return "stacionar-kletka"
    if re.search(r"hirurg|operac|amputa|osteosint|enukleat|kesarev|narkoz|хирург|операц", s):
        return "vrachi-konsultatsiya"
    if re.search(r"kardio|ekg|auskult|serdts|кардио|сердц", s):
        return "vrach-koshka-na-pleche"
    if re.search(r"koshk|kosh|kot|kotyat|кошк|кот", s):
        return CATS[h % len(CATS)]
    if re.search(r"sobak|shchen|собак|щен", s):
        return DOGS[h % len(DOGS)]
    return CLINICAL[h % len(CLINICAL)]


def fix_links(b):
    def repl(m):
        attr, href = m.group(1), html.unescape(m.group(2))
        if href.startswith(("#", "tel:", "mailto:")):
            return m.group(0)
        href = re.sub(r"^https?://(www\.)?vetnasvyaz\.ru", "", href)
        if href.startswith("http"):
            return m.group(0)
        href = href.lstrip("./").lstrip("/")
        if href.startswith("assets/img/"):
            return f'{attr}="{u(href)}"'
        mm = re.match(r"news/([^/]+)\.html$", href)
        if mm:
            href = f"novosti/{mm.group(1)}/"
        href = re.sub(r"(^|/)index\.html$", r"\1", href)
        href = re.sub(r"\.html(#.*)?$", r"\1", href)
        slug = href.split("#")[0].strip("/")
        if slug in DUPES:
            href = {"abstsess-u-koshki-ramenskoe": "abscess-u-koshki-ramenskoe",
                    "mochekamennaya-bolezn-u-kota-ramenskoe": "mochekamennaya-bolezn-kota-ramenskoe",
                    "sterilizatsiya-sobaki-suki-ramenskoe": "sterilizatsiya-suki-ramenskoe-zapis"}[slug]
        return f'{attr}="{u(href)}"'
    return re.sub(r'(href)="([^"]*)"', repl, b)


def art_img(src):
    name = src.rsplit("/", 1)[-1]
    return u("assets/img/stati/" + re.sub(r"[^A-Za-z0-9_-]", "-", name) + ".webp")


def fmt_price(v):
    digits = re.sub(r"[^\d]", "", v)
    if not digits or len(digits) != len(v.replace(" ", "").replace(" ", "")):
        return e(v)
    return f"{int(digits):,}".replace(",", " ") + " ₽"


def process_body(p):
    b = p["body"]
    faq, related = [], []
    # связанные ссылки — отдельным блоком после текста
    rm = re.search(r"<h2>Похожие проблемы и услуги</h2>\s*(?:<p>.*?</p>)?\s*<ul class=\"vetnas-related\">(.*?)</ul>", b, re.S)
    if rm:
        related = re.findall(r'<a href="([^"]*)">(.*?)</a>', rm.group(1))
        b = b.replace(rm.group(0), "")
    # картинки из статей
    b = re.sub(r'<a href="[^"]*\.(?:jpg|png|jpeg)[^"]*">\s*(<img[^>]*>)\s*</a>', r"\1", b)
    b = re.sub(r'<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>',
               lambda m: f'<img src="{art_img(m.group(1))}" alt="{e(html.unescape(m.group(2)))}" loading="lazy" decoding="async">', b)
    b = re.sub(r'<img(?![^>]*alt=)[^>]*src="([^"]*)"[^>]*>',
               lambda m: f'<img src="{art_img(m.group(1))}" alt="" loading="lazy" decoding="async">', b)
    # прайс
    prices = []

    def table(m):
        rows = re.findall(r"<tr>(.*?)</tr>", m.group(0), re.S)
        cells = [[re.sub(r"<[^>]+>", "", c).strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, re.S)] for r in rows]
        if cells and all(len(c) == 2 for c in cells) and sum(bool(re.search(r"\d", c[1])) for c in cells) >= len(cells) * .6:
            body = "".join(f"<tr><td>{e(html.unescape(n))}</td><td>{fmt_price(html.unescape(v))}</td></tr>" for n, v in cells)
            prices.extend((html.unescape(n), re.sub(r"[^\d]", "", v)) for n, v in cells)
            return f'<table class="price"><thead><tr><th>Услуга</th><th>Цена</th></tr></thead><tbody>{body}</tbody></table>'
        return '<div style="overflow-x:auto">' + re.sub(r"\s(class)=\"[^\"]*\"", "", m.group(0)) + "</div>"
    b = re.sub(r"<table[^>]*>.*?</table>", table, b, flags=re.S)
    # частые вопросы -> аккордеон
    fm = re.search(r"<h2>(FAQ[^<]*|Частые вопросы[^<]*|Вопросы и ответы[^<]*)</h2>(.*?)(?=<h2|\Z)", b, re.S)
    if fm:
        pairs = re.findall(r"<h3>(.*?)</h3>\s*<p>(.*?)</p>", fm.group(2), re.S)
        if pairs:
            faq = [(re.sub(r"<[^>]+>", "", q).strip(), re.sub(r"<[^>]+>", "", x).strip()) for q, x in pairs]
            rest = re.sub(r"<h3>.*?</h3>\s*<p>.*?</p>", "", fm.group(2), flags=re.S)
            acc = "".join(f"<details><summary>{e(q)}</summary><div class=\"a\">{e(x)}</div></details>" for q, x in faq)
            b = b.replace(fm.group(0), f'<h2>Частые вопросы</h2><div class="faq">{acc}</div>{rest}')
    # мусор старой вёрстки
    b = re.sub(r'\sclass="(?!cards|card|price|faq|a)[^"]*"', "", b)
    b = re.sub(r"<article>|</article>", "", b)
    b = fix_links(b)
    toc = []

    def h2(m):
        toc.append(re.sub(r"<[^>]+>", "", m.group(1)).strip())
        return f'<h2 id="r{len(toc)}">{m.group(1)}</h2>'
    b = re.sub(r"<h2>(.*?)</h2>", h2, b, flags=re.S)
    return b, faq, related, prices, toc


def plain_date(s):
    m = re.search(r"(\d{1,2}) (\w+) (\d{4})", s)
    months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    if not m or m.group(2) not in months:
        return None
    return f"{m.group(3)}-{months.index(m.group(2)) + 1:02d}-{int(m.group(1)):02d}"


def build_page(p):
    path = p["url"]
    slug = path.strip("/")
    body, faq, related, prices, toc = process_body(p)
    is_news = p["kind"] == "news"
    parent = ("Новости", "/novosti") if is_news else (("Услуги и цены", "/uslugi-i-tseny")
                                                        if any(c[0] == "Услуги и цены" for c in p["crumbs"]) else None)
    items = [("Главная", "/")] + ([parent] if parent else []) + [(p["h1"], path)]
    bc_node, bc_html = crumbs(items)
    no_img = slug in ("politika-konfidencialnosti", "vakansii")
    photo = "fasad-kliniki" if slug in ("contacts", "o-kompanii") else pick(slug, p["h1"])
    graph = [clinic(), website(), bc_node]
    if is_news:
        d = plain_date(p["date"]) or "2026-08-01"
        graph.append({"@type": "Article", "headline": p["h1"], "description": p["description"], "datePublished": d,
                      "dateModified": TODAY, "author": {"@id": CLINIC_ID}, "publisher": {"@id": CLINIC_ID},
                      "mainEntityOfPage": DOMAIN + path, "inLanguage": "ru-RU"})
    elif parent:
        svc = {"@type": "Service", "name": p["h1"], "description": p["description"] or p["lead"], "provider": {"@id": CLINIC_ID},
               "areaServed": {"@type": "City", "name": "Раменское"}, "url": DOMAIN + path}
        if prices:
            svc["hasOfferCatalog"] = {"@type": "OfferCatalog", "name": "Цены", "itemListElement": [
                {"@type": "Offer", "price": v, "priceCurrency": "RUB", "itemOffered": {"@type": "Service", "name": n}}
                for n, v in prices if v][:60]}
        graph.append(svc)
    if len(faq) >= 2:
        graph.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q,
                                                           "acceptedAnswer": {"@type": "Answer", "text": x}} for q, x in faq]})
    label = "Новости" if is_news else ("Услуги / Раменское" if parent else "Клиника / Раменское")
    meta = f'<div class="meta"><span class="label">{e(p["date"].replace("Новости · ", ""))}</span></div>' if is_news and p["date"] else ""
    cta = "" if is_news else (f'<div class="cta"><a class="btn btn--green" href="#zapis">Записаться <span class="arr">→</span></a>'
                              f'<a class="btn" href="{TEL}">Позвонить 24/7</a></div>')
    hero_media = "" if no_img else f'<div class="p-hero-media">{img(photo, p["h1"], sizes="(max-width:860px) 100vw, 40vw", eager=True)}</div>'
    cover = ""
    if is_news and p["cover"]:
        cover = f'<img src="{art_img(p["cover"])}" alt="{e(p["h1"])}" loading="lazy" decoding="async" style="margin-top:0">'
    use_toc = len(toc) >= 4 and not is_news
    toc_html = ("<aside class=\"toc\" aria-label=\"Содержание\"><p class=\"label\">Содержание</p><ol>" +
                "".join(f'<li><a href="#r{i + 1}">{e(t)}</a></li>' for i, t in enumerate(toc)) + "</ol></aside>") if use_toc else ""
    rel_html = ""
    if related:
        rel_html = ('<section class="wrap section--tight" aria-labelledby="rel-h"><div class="sec-top"><h2 class="h-sm" id="rel-h">Похожие проблемы и услуги</h2>'
                    f'<a class="link" href="{u("uslugi-i-tseny")}">Все услуги <span class="arr">→</span></a></div><div class="rel rel-grid">' +
                    "".join(f'<a href="{fix_links(chr(34).join(["href=", h, ""]))[6:-1]}">{e(html.unescape(t))}<span class="arr">→</span></a>'
                            for h, t in related) + "</div></section>")
    body_html = f"""<section class="wrap">
  <div class="p-hero{' p-hero--noimg' if no_img else ''}">
    <div>
      {bc_html}
      <p class="label"><b>●</b> {label}</p>
      <h1>{e(p['h1'])}</h1>
      {f'<p class="lead">{e(p["lead"])}</p>' if p['lead'] and p['lead'] != p['h1'] else ''}
      {meta}{cta}
    </div>
    {hero_media}
  </div>
  <div class="doc{'' if use_toc else ' doc--wide'}">
    {toc_html}
    <article class="prose"{' style="max-width:820px"' if not use_toc else ''}>{cover}{body}</article>
  </div>
</section>
{rel_html}"""
    active = "stacionar" if slug == "stacionar" else ("diagnostika" if slug == "diagnostika" else
                                                       ("uslugi-i-tseny" if parent and not is_news else ""))
    write(path, p["title"], p["description"] or p["lead"], graph, body_html, active=active,
          og=None if no_img else DOMAIN + f"/assets/img/{photo}-1280.webp")


def build_services(p):
    """Услуги и цены: карточки направлений в две колонки."""
    cards = re.findall(r'<a class="concept-service-card" href="([^"]*)">\s*<span>(.*?)</span>\s*<h2>(.*?)</h2>\s*<p>(.*?)</p>', p["body"], re.S)
    bc_node, bc_html = crumbs([("Главная", "/"), ("Услуги и цены", "/uslugi-i-tseny")])
    grid = "".join(
        f'<a class="svc-card" {fix_links(chr(34).join(["href=", h, ""]))}><span class="label">{e(k)}</span>'
        f'<h2>{e(t)}</h2><p>{e(d)}</p><span class="arr" aria-hidden="true">→</span></a>' for h, k, t, d in cards)
    graph = [clinic(), website(), bc_node, {"@type": "ItemList", "name": "Услуги клиники «Ветеринар на связи»",
             "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": t,
                                  "url": DOMAIN + "/" + re.sub(r"\.html$", "", h)} for i, (h, k, t, d) in enumerate(cards)]}]
    body = f"""<section class="wrap">
  <div class="p-hero p-hero--noimg">
    <div>{bc_html}<p class="label"><b>●</b> Услуги / Раменское</p>
      <h1>Услуги и цены</h1>
      <p class="lead">Всё, что нужно для лечения: приём, диагностика, хирургия, стационар и профилактика. Откройте направление, чтобы посмотреть подробности и цены.</p></div>
  </div>
  <div class="section--tight"><div class="svc-grid">{grid}</div></div>
</section>"""
    write("/uslugi-i-tseny", p["title"], p["description"], graph, body, active="uslugi-i-tseny")


def build_news_lists(news):
    news = sorted(news, key=lambda n: n["url"])
    per = 6
    pages = [news[i:i + per] for i in range(0, len(news), per)]
    urls = ["/novosti"] + [f"/{i}" for i in range(1, len(pages))]

    def card(n):
        cov = f'<img src="{art_img(n["cover"])}" alt="{e(n["h1"])}" loading="lazy" decoding="async">' if n["cover"] else ""
        return (f'<a class="news-card" href="{u(n["url"])}"><div class="ph">{cov}</div>'
                f'<span class="label">{e(n["date"].replace("Новости · ", ""))}</span><h2>{e(n["h1"])}</h2><p>{e(n["lead"])}</p></a>')

    for i, chunk in enumerate(pages):
        pager = '<nav class="pager" aria-label="Страницы">' + "".join(
            f"<span>{j + 1}</span>" if j == i else f'<a href="{u(urls[j])}">{j + 1}</a>' for j in range(len(pages))) + "</nav>"
        title = "Новости" if i == 0 else f"Новости, стр.{i + 1}"
        bc_node, bc_html = crumbs([("Главная", "/"), ("Новости", "/novosti")] + ([(title, urls[i])] if i else []))
        body = f"""<section class="wrap">
  <div class="p-hero p-hero--noimg"><div>{bc_html}<p class="label"><b>●</b> Новости клиники</p><h1>{title}</h1>
  <p class="lead">Клинические случаи, советы по уходу и новости ветеринарной клиники «Ветеринар на связи» в Раменском.</p></div></div>
  <div class="section--tight"><div class="news-grid">{''.join(card(n) for n in chunk)}</div>{pager}</div>
</section>"""
        write(urls[i], f"{title} — Ветеринар на связи, Раменское",
              "Новости и клинические случаи ветеринарной клиники «Ветеринар на связи» в Раменском.",
              [clinic(), website(), bc_node], body)
    # /novosti/ — полный список
    bc_node, bc_html = crumbs([("Главная", "/"), ("Новости", "/novosti/")])
    body = f"""<section class="wrap"><div class="p-hero p-hero--noimg"><div>{bc_html}<p class="label"><b>●</b> Новости клиники</p><h1>Новости</h1>
  <p class="lead">Все материалы клиники: клинические случаи, профилактика и уход.</p></div></div>
  <div class="section--tight"><div class="news-grid">{''.join(card(n) for n in news)}</div></div></section>"""
    write("/novosti/", "Новости — Ветеринар на связи", "Все новости ветеринарной клиники «Ветеринар на связи» в Раменском.",
          [clinic(), website(), bc_node], body)


# ------------------------------------------------------------------ главная

DIRECTIONS = [
    ("hirurgiya", "Хирургия", "Плановые и срочные операции: стерилизации, ушивания, удаления, санации.", "vrachi-konsultatsiya"),
    ("kardiologiya", "Кардиология", "ЭКГ, ЭХО сердца и подбор терапии при болезнях сердца и сосудов.", "vrach-koshka-na-pleche"),
    ("travmatologiya", "Травматология", "Хромота, ушибы, переломы и повреждения конечностей.", "vrach-shchenok-povyazka"),
    ("onkologiya", "Онкология", "Осмотр новообразований, диагностика, хирургия и тактика лечения.", "osmotr-koshki"),
    ("rodentologiya", "Родентология", "Грызуны и кролики: зубы, ЖКТ, кожа и новообразования.", "pacient-chernyy-kotenok"),
    ("stacionar", "Стационар", "Круглосуточное наблюдение, капельницы и уход после операций.", "stacionar-kletka"),
    ("stomatologiya", "Стоматология", "Санация ротовой полости, чистка зубов, лечение и удаления.", "vrach-siamskaya-koshka"),
    ("laboratoriya-vns", "Лаборатория", "Анализы крови, мочи, цитология и гистология — без догадок.", "uzi-koshka"),
]

REVIEWS = [
    ("Хочу выразить благодарность Илье Сергеевичу. Это лучший ветврач в нашем городе — он спас моего кота Тимофея от гибели. Грамотно поставил диагноз и назначил лечение.", "Юлия Ю."),
    ("Илья Сергеевич буквально сутками был на связи, советовал, что делать. Это врач от Бога: он любит животных, и они ему доверяют. Если ищете ветеринара — только к нему!", "Марк Д."),
    ("Ветврач Илья очень любит животных, это чувствуется сразу. Профессионал: на глаз определил проблему, которая подтвердилась по анализам. И цены не кусаются.", "Ирина П."),
    ("Огромная благодарность нашему любимому ветврачу Илье Сергеевичу за многолетний труд, лечение, спасение, роды и внимание к моим любимым собачкам! Спасибо Вам!", "Елена С."),
    ("Были первый раз, очень понравилось. Внимательное отношение и понятные объяснения. Будем ходить только сюда.", "Анна К."),
]


def build_home(p):
    rows = "".join(
        f'<a class="dir-row" href="{u(s)}"><span class="n">{i + 1:02d}</span><h3>{t}</h3><p>{d}</p>'
        f'<span class="link"><span>Подробнее</span> <span class="arr">→</span></span></a>'
        for i, (s, t, d, ph) in enumerate(DIRECTIONS))
    prev = "".join(f'<img data-src="{a(f"img/{ph}-640.webp")}" alt="" width="640" height="800">' for s, t, d, ph in DIRECTIONS)
    team = [("vrach-dzhek-rassel", "На приёме", "Первичный осмотр"), ("vrach-shchenok-povyazka", "После травмы", "Перевязка и контроль"),
            ("vrach-siamskaya-koshka", "Терапия", "Спокойный контакт с пациентом"), ("vrachi-labrador", "Команда", "Работаем вдвоём, когда нужно"),
            ("osmotr-koshki", "Осмотр", "Кожа, шерсть, общее состояние"), ("vrach-koshka-na-pleche", "Кардиология", "Пациент под присмотром")]
    team_html = "".join(
        f'<figure data-reveal style="--d:{(i % 3) * 120}ms"><div class="ph">{img(n, c + " — ветеринарная клиника в Раменском", sizes="(max-width:860px) 50vw, 30vw")}</div>'
        f'<figcaption><strong>{c}</strong><span class="muted">{s}</span></figcaption></figure>' for i, (n, c, s) in enumerate(team))
    gal = [("pacient-devochka-koshka", "Клиника / Раменское"), ("uzi-koshka", "Диагностика"), ("pacient-bulli", "Приём"),
           ("pacient-vest-terer", "Пациент"), ("vrachi-ovcharka", "Команда"), ("stacionar-kletka", "Стационар"),
           ("pacient-kot-na-stole", "Осмотр"), ("fasad-kliniki", "Красноармейская, 13Б")]
    gal_html = "".join(
        f'<figure class="g{i + 1}" data-full="{a(f"img/{n}-1280.webp")}" data-reveal><img src="{a(f"img/{n}-640.webp")}" '
        f'srcset="{a(f"img/{n}-640.webp")} 640w, {a(f"img/{n}-1280.webp")} 1280w" sizes="(max-width:860px) 100vw, 50vw" '
        f'alt="{c} — ветклиника «Ветеринар на связи»" loading="lazy" decoding="async"><figcaption>{c}</figcaption></figure>'
        for i, (n, c) in enumerate(gal))
    revs = "".join(f'<figure class="rev-item"><blockquote>«{e(t)}»</blockquote><figcaption>{e(n)} · отзыв о клинике</figcaption></figure>'
                   for t, n in REVIEWS)
    graph = [clinic(), website(), {"@type": "WebPage", "@id": DOMAIN + "/#webpage", "url": DOMAIN + "/",
                                   "name": p["title"], "about": {"@id": CLINIC_ID}, "isPartOf": {"@id": DOMAIN + "/#website"}}]
    body = f"""<section class="hero" aria-labelledby="hero-h">
  <div class="hero-text">
    <div>
      <p class="label"><b>●</b> Ветеринарный госпиталь / Раменское</p>
      <h1 id="hero-h"><span class="seo">Ветеринарная клиника в Раменском</span><span class="main">Ветеринарная медицина <i>без&nbsp;догадок.</i></span></h1>
      <p class="hero-sub">Диагностика, хирургия, стационар и лечение животных 24/7. Сначала находим причину — потом лечим.</p>
      <div class="hero-cta"><a class="btn btn--green" href="#zapis">Записаться на приём <span class="arr">→</span></a><a class="btn" href="{TEL}">Позвонить 24/7</a></div>
    </div>
    <div class="hero-foot"><span class="label">Раменское / Красноармейская, 13Б</span><span class="label"><b>24/7</b> · {PHONE}</span></div>
  </div>
  <div class="hero-media">{img("vrach-dzhek-rassel", "Ветеринарный врач клиники «Ветеринар на связи» с пациентом", sizes="(max-width:860px) 100vw, 48vw", eager=True)}
    <a class="hero-badge" href="{YANDEX_ORG}reviews/" rel="noopener" target="_blank"><b>5,0</b><span class="label">464 оценки на Яндекс Картах</span></a>
  </div>
</section>

<section class="caps" aria-label="Возможности клиники">
  <div class="wrap"><ul>
    <li data-reveal><b>24/7</b><span>Круглосуточный приём</span></li>
    <li data-reveal style="--d:80ms"><b>УЗИ</b><span>Диагностика</span></li>
    <li data-reveal style="--d:160ms"><b>Хирургия</b><span>Плановая и экстренная</span></li>
    <li data-reveal style="--d:240ms"><b>Стационар</b><span>Наблюдение пациентов</span></li>
    <li data-reveal style="--d:320ms"><b>Лаборатория</b><span>Исследования</span></li>
  </ul></div>
</section>

<section class="section wrap" aria-labelledby="klinika-h">
  <div class="split">
    <div><p class="label">01 / Клиника</p><h2 class="h-lg" id="klinika-h" style="margin-top:22px" data-reveal>Медицина начинается с понимания причины.</h2></div>
    <div class="about-text" data-reveal style="--d:120ms">
      <p>Ветеринарная клиника «Ветеринар на связи» осуществляет лечение и реабилитацию самых разнообразных животных и предлагает широкий спектр ветеринарных услуг.</p>
      <p class="muted">Клиника работает в г. Раменское, Раменском районе и близлежащих городах. В основе работы — ответственное отношение, опыт персонала, современные подходы к диагностике и лечению и уважение к владельцам.</p>
      <a class="link" href="{u('o-kompanii')}">О клинике <span class="arr">→</span></a>
    </div>
  </div>
  <div class="about-facts">
    <div data-reveal><b>24/7</b><span class="muted">приём пациентов</span></div>
    <div data-reveal style="--d:100ms"><b>Раменское</b><span class="muted">Красноармейская, 13Б</span></div>
    <div data-reveal style="--d:200ms"><b>На месте</b><span class="muted">диагностика и лечение</span></div>
  </div>
</section>

<section class="section wrap" aria-labelledby="napr-h" style="padding-top:0">
  <div class="sec-top"><h2 class="h-md" id="napr-h">Направления</h2><a class="link" href="{u('uslugi-i-tseny')}">Услуги и цены <span class="arr">→</span></a></div>
  <div class="dir-list">{rows}<div class="dir-prev" aria-hidden="true">{prev}</div></div>
</section>

<section class="full" aria-labelledby="diag-h">
  <div class="full-media">{img("uzi-koshka", "Врач клиники с пациентом у аппарата УЗИ", extra=' data-parallax')}</div>
  <div class="wrap">
    <p class="label">02 / Диагностика</p>
    <h2 class="h-xl" id="diag-h" style="margin-top:20px" data-reveal>Мы не гадаем.<br>Мы диагностируем.</h2>
    <nav class="full-links" aria-label="Диагностика">
      <a href="{u('uzi')}">УЗИ</a><a href="{u('ekg-zhivotnym-ramenskoe')}">ЭКГ / ЭХО</a><a href="{u('laboratoriya-vns')}">Лабораторная диагностика</a><a href="{u('kardiologiya')}">Кардиология</a><a href="{u('dermatologiya-endokrinologiya')}">Дерматологическая диагностика</a><a href="{u('rentgen')}">Рентген</a>
    </nav>
  </div>
</section>

<section class="section wrap" aria-labelledby="stac-h">
  <div class="stac">
    <div class="stac-media img-reveal">{img("stacionar-kletka", "Врач рядом с пациентом в стационаре клиники", sizes="(max-width:860px) 100vw, 45vw")}</div>
    <div>
      <p class="label">03 / Стационар</p>
      <h2 class="h-lg" id="stac-h" style="margin-top:22px" data-reveal>Под наблюдением<br>24 часа.</h2>
      <p class="muted" style="font-size:19px;max-width:520px;margin:24px 0 0" data-reveal>Послеоперационное наблюдение, инфузионная терапия, уход и контроль состояния пациентов.</p>
      <ul class="stac-cats" data-reveal>
        <li>1 категория<span>стабильное животное</span></li>
        <li>2 категория<span>состояние средней тяжести</span></li>
        <li>3 категория<span>тяжёлое состояние</span></li>
      </ul>
      <a class="btn btn--green" href="{u('stacionar')}">Стационар <span class="arr">→</span></a>
    </div>
  </div>
</section>

<section class="dark section" aria-labelledby="hir-h">
  <div class="wrap surg">
    <div>
      <p class="label">04 / Хирургия</p>
      <h2 class="h-lg" id="hir-h" style="margin-top:22px" data-reveal>Когда нужно<br>действовать точно.</h2>
      <p class="muted" style="font-size:19px;max-width:520px;margin:24px 0 0" data-reveal>Стерилизации, экстренные операции, ушивания, удаления, санации. Наркоз под контролем и наблюдение после вмешательства.</p>
      <div class="surg-list" data-reveal>
        <a href="{u('hirurgiya')}">Хирургия<span>→</span></a><a href="{u('kastraciya-sterilizaciya')}">Кастрация и стерилизация<span>→</span></a>
        <a href="{u('travmatologiya')}">Травматология<span>→</span></a><a href="{u('narkoz-anesteziya')}">Наркоз и анестезия<span>→</span></a>
      </div>
    </div>
    <div class="surg-media img-reveal">{img("vrachi-konsultatsiya", "Врачи клиники обсуждают план лечения", sizes="(max-width:860px) 100vw, 45vw")}</div>
  </div>
</section>

<section class="section wrap" id="vrachi" aria-labelledby="vrachi-h">
  <div class="sec-top"><div><p class="label">05 / Врачи</p><h2 class="h-lg" id="vrachi-h" style="margin-top:18px">Те, кому вы доверяете своего питомца.</h2></div></div>
  <div class="team team--shift">{team_html}</div>
</section>

<section class="section wrap" aria-labelledby="gal-h" style="padding-top:0">
  <div class="sec-top"><h2 class="h-md" id="gal-h">Клиника изнутри</h2><span class="label">Раменское</span></div>
  <div class="gal">{gal_html}</div>
</section>

<section class="section wrap" aria-labelledby="rev-h" style="padding-top:0">
  <div class="rev">
    <div><p class="label">06 / Доверие</p><h2 class="h-md" id="rev-h" style="margin-top:18px">Они пришли к нам за помощью.</h2>
      <p class="muted" style="margin-top:22px"><a class="link" href="{YANDEX_ORG}reviews/" rel="noopener" target="_blank">5,0 на Яндекс Картах <span class="arr">→</span></a></p></div>
    <div>
      <div class="rev-stage" aria-live="polite">{revs}</div>
      <div class="rev-nav"><button type="button" class="rev-prev" aria-label="Предыдущий отзыв">←</button><button type="button" class="rev-next" aria-label="Следующий отзыв">→</button><span class="label rev-count"></span></div>
    </div>
  </div>
</section>"""
    write("/", p["title"], p["description"], graph, body,
          preload=f'<link rel="preload" as="image" href="{a("img/vrach-dzhek-rassel-1280.webp")}" imagesrcset="{a("img/vrach-dzhek-rassel-640.webp")} 640w, {a("img/vrach-dzhek-rassel-1280.webp")} 1280w" imagesizes="(max-width:860px) 100vw, 48vw" fetchpriority="high">\n')


# ------------------------------------------------------------------ сборка

def main():
    for x in list(DIST.iterdir()):
        if x.name != "assets":
            shutil.rmtree(x) if x.is_dir() else x.unlink()
    for x in (DIST / "assets").iterdir():
        if x.name != "img":
            shutil.rmtree(x) if x.is_dir() else x.unlink()
    (DIST / "assets/fonts").mkdir(parents=True, exist_ok=True)
    for f in (SRC / "fonts").glob("*.woff2"):
        shutil.copy2(f, DIST / "assets/fonts" / f.name)
    (DIST / "assets/site.css").write_text((SRC / "fonts/fonts.css").read_text() + (SRC / "site.css").read_text(), encoding="utf-8")
    shutil.copy2(SRC / "site.js", DIST / "assets/site.js")
    shutil.copy2(ROOT / "live/public_html/assets/img/favicon.png", DIST / "assets/img/favicon.png")

    pages = json.loads((ROOT / "data/pages.json").read_text())
    news = [p for p in pages if p["kind"] == "news"]
    for p in pages:
        slug = p["url"].strip("/")
        if slug in DUPES or slug in ("novosti", "1", "2", "3", "novosti/") or p["url"] == "/novosti/":
            continue
        if p["kind"] == "home":
            build_home(p)
        elif slug == "uslugi-i-tseny":
            build_services(p)
        else:
            build_page(p)
    build_news_lists(news)
    urls = "".join(f"<url><loc>{DOMAIN}{x}</loc><lastmod>{TODAY}</lastmod></url>\n" for x in SITEMAP)
    (DIST / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
    if ARGS.staging:
        (DIST / ".nojekyll").write_text("")
        (DIST / "robots.txt").write_text("User-agent: *\nDisallow: /\n")
    else:
        (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
    print(f"страниц: {len(SITEMAP)}, база: {BASE}, {'staging' if ARGS.staging else 'prod'}")


if __name__ == "__main__":
    main()
