import { getPageBySlug } from '@/lib/strapi';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getPageBySlug('home');
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function HomePage() {
  const page = await getPageBySlug('home');
  if (!page) notFound();
  // Home body is the full <main> markup from the original index page.
  return <main dangerouslySetInnerHTML={{ __html: page.body || '' }} />;
}
