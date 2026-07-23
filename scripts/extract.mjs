// Extract content from the legacy static site into Strapi seed JSON.
// Usage: node scripts/extract.mjs
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'cms', 'data', 'seed');
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
const slugify = (name) =>
  name
    .replace(/\.html$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// Rewrite legacy internal links & asset paths inside a body fragment.
function rewrite($, scope) {
  scope.find('a[href]').each((_, el) => {
    let href = $(el).attr('href');
    if (!href) return;
    if (/^(https?:|tel:|mailto:|#)/i.test(href)) return;
    href = href.replace(/^\.\.\//, '/').replace(/^\.\//, '');
    if (/^(index)(\.html(\.\d+)?)?(\.html)?$/i.test(href) || href === '') {
      href = '/';
    } else {
      href = href.replace(/^news\//i, 'news/');
      href = href.replace(/\.html$/i, '');
      if (!href.startsWith('/')) href = '/' + href;
    }
    $(el).attr('href', href);
  });
  scope.find('img[src]').each((_, el) => {
    let src = $(el).attr('src');
    if (!src || /^(https?:|data:)/i.test(src)) return;
    src = src.replace(/^\.\.\//, '/').replace(/^\.\//, '/');
    if (!src.startsWith('/')) src = '/' + src;
    $(el).attr('src', src);
    // strip lazy-loading noise but keep the rest
  });
}

function meta($, name, attr = 'name') {
  return $(`meta[${attr}="${name}"]`).attr('content') || '';
}

function extractPage(file, html, kind) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const contentEl = $('.concept-content').first();
  const title = ($('title').text() || '').trim();
  const metaDescription = meta($, 'description');
  const ogImage = meta($, 'og:image', 'property');
  const h1 = ($('h1').first().text() || '').trim();
  const kicker = ($('.concept-page-hero .concept-kicker').first().text() || '').trim();
  const breadcrumbLabel = ($('.concept-breadcrumbs__current').first().text() || title).trim();
  if (!contentEl.length) return null;
  rewrite($, contentEl);
  const body = contentEl.html().trim();
  const slug = slugify(basename(file));
  return { slug, title, metaDescription, ogImage, h1, kicker, breadcrumbLabel, body, kind };
}

// ---------- GLOBAL (from index.html) ----------
function extractGlobal() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });
  const menu = [];
  $('.concept-menu a').each((_, el) => {
    let href = $(el).attr('href') || '';
    href = href.replace(/^\.\.\//, '/').replace(/\.html$/i, '');
    if (/^index$/i.test(href) || href === '' || href === '/index') href = '/';
    else if (!/^#|^https?:/i.test(href) && !href.startsWith('/')) href = '/' + href;
    menu.push({ label: $(el).text().trim(), href });
  });
  const phone = ($('.concept-phone').first().text() || '').trim();
  const phoneHref = $('.concept-phone').first().attr('href') || '';
  const mapEmbed = $('.concept-map-card').first().html()?.trim() || '';
  const footerHtml = $('.concept-footer .concept-shell').first().html()?.trim() || '';
  const address = ($('.concept-page-hero .concept-kicker').first().text() || 'Раменское, Красноармейская, 13').trim();
  return {
    siteName: 'Ветеринар на связи',
    tagline: 'ветеринарная клиника',
    phone,
    phoneHref,
    address,
    menu,
    sideMenu: menu,
    mapEmbed,
    footerHtml,
  };
}

// ---------- HOME (index.html main) ----------
function extractHome() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });
  const main = $('main').first();
  if (!main.length) return null;
  rewrite($, main);
  return {
    slug: 'home',
    title: ($('title').text() || '').trim(),
    metaDescription: meta($, 'description'),
    ogImage: meta($, 'og:image', 'property'),
    h1: ($('h1').first().text() || '').trim(),
    kicker: '',
    breadcrumbLabel: 'Главная',
    pageType: 'home',
    body: main.html().trim(),
  };
}

// ---------- collect ----------
const skip = new Set(['index.html']);
const pages = [];
const articles = [];

// root pages
for (const f of readdirSync(ROOT)) {
  if (!f.endsWith('.html') || skip.has(f)) continue;
  if (/index\.html\.\d+/.test(f)) continue; // legacy dupes
  const html = readFileSync(join(ROOT, f), 'utf8');
  const p = extractPage(f, html, 'page');
  if (!p) continue;
  const isListing = /^(novosti|1|2|3|index-skolkovo)$/.test(p.slug);
  p.pageType = 'static';
  if (p.slug && !pages.find((x) => x.slug === p.slug)) {
    delete p.kind;
    pages.push(p);
  }
}

// home
const home = extractHome();
if (home) pages.unshift(home);

// news articles
const newsDir = join(ROOT, 'news');
if (existsSync(newsDir)) {
  for (const f of readdirSync(newsDir)) {
    if (!f.endsWith('.html') || f.startsWith('_')) continue;
    const html = readFileSync(join(newsDir, f), 'utf8');
    const p = extractPage(join('news', f), html, 'article');
    if (!p) continue;
    articles.push({
      slug: p.slug,
      title: p.title,
      metaDescription: p.metaDescription,
      h1: p.h1,
      excerpt: p.metaDescription,
      coverImage: p.ogImage,
      body: p.body,
      source: 'news',
    });
  }
}

const global = extractGlobal();

writeFileSync(join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
writeFileSync(join(OUT, 'articles.json'), JSON.stringify(articles, null, 2));
writeFileSync(join(OUT, 'global.json'), JSON.stringify(global, null, 2));

console.log(`pages: ${pages.length}`);
console.log(`articles: ${articles.length}`);
console.log(`global.menu: ${global.menu.length} items, phone: ${global.phone}`);
console.log(`sample page slugs: ${pages.slice(0, 8).map((p) => p.slug).join(', ')}`);
