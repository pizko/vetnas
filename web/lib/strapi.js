const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function api(path, { revalidate = 60 } = {}) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Strapi ${res.status} for ${path}`);
  }
  return res.json();
}

export async function getGlobal() {
  const json = await api('/global');
  return json?.data || null;
}

export async function getPageBySlug(slug) {
  const json = await api(`/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[limit]=1`);
  return json?.data?.[0] || null;
}

export async function getAllPageSlugs() {
  const json = await api('/pages?fields[0]=slug&pagination[limit]=1000');
  return (json?.data || []).map((p) => p.slug);
}

export async function getArticleBySlug(slug) {
  const json = await api(`/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[limit]=1`);
  return json?.data?.[0] || null;
}

export async function getAllArticles() {
  const json = await api('/articles?pagination[limit]=1000&sort=title:asc');
  return json?.data || [];
}
