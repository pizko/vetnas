import { getArticleBySlug, getAllArticles } from '@/lib/strapi';
import { ContentPage } from '../../components';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: `https://vetnasvyaz.ru/news/${slug}` },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return (
    <ContentPage
      kicker="Новости"
      breadcrumbLabel={article.h1 || article.title}
      h1={article.h1 || article.title}
      bodyHtml={article.body}
    />
  );
}
