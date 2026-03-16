import { Metadata } from 'next';
import ArticleClient from './page-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const articleId = Array.isArray(id) ? id[0] : id;
  
  return {
    title: 'Reading Article',
    description: 'Read this article on NeoZ - your smart news dashboard.',
    openGraph: {
      title: 'Reading Article | NeoZ',
      description: 'Read this article on NeoZ - your smart news dashboard.',
      type: 'article',
      url: `https://neoz.news/article/${articleId}`,
    },
    twitter: {
      card: 'summary',
      title: 'Reading Article | NeoZ',
      description: 'Read this article on NeoZ.',
    },
  };
}

export default ArticleClient;
