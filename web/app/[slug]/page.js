import { getPageBySlug, getAllPageSlugs } from '@/lib/strapi';
import { ContentPage } from '../components';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.filter((s) => s && s !== 'home').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `https://vetnasvyaz.ru/${slug}` },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (slug === 'home') notFound();
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  return (
    <ContentPage
      kicker={page.kicker}
      breadcrumbLabel={page.breadcrumbLabel}
      h1={page.h1}
      bodyHtml={page.body}
    />
  );
}
