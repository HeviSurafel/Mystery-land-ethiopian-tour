// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiClock,
  FiEye,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiTag,
  FiArrowRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  excerpt: string;
  images: string[];
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  relatedArticles: {
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    publishedAt: string;
  }[];
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch article');
      }

      setArticle(data.data);
    } catch (err: any) {
      console.error('Error fetching article:', err);
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-[400px] bg-gray-200 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-[#004525] mb-4">Article Not Found</h2>
            <p className="text-[#404942] mb-6">{error || 'The article you are looking for does not exist.'}</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
            >
              Back to Journal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <article className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#004525] hover:text-[#1f5d3a] transition-colors mb-6"
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Back to Journal</span>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-[#735c00] mb-3">
            <span className="bg-[#ffe088] px-3 py-1 rounded-full font-semibold">
              {article.category?.name || 'Travel'}
            </span>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-[10px] font-medium text-[#707971]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#004525] mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#707971]">
            <span className="flex items-center gap-1">
              <FiUser size={16} /> {article.author}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={16} /> {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={16} /> {article.readTime || '5 min read'}
            </span>
            <span className="flex items-center gap-1">
              <FiEye size={16} /> {article.views || 0} views
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {article.coverImage || article.images?.[0] ? (
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={article.coverImage || article.images[0]}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-[#004525] prose-p:text-[#404942] prose-a:text-[#735c00] mb-12">
          <p className="text-lg leading-relaxed">{article.content || article.description}</p>
        </div>

        {/* Share & Save */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#004525]/10 text-[#004525] rounded-full hover:bg-[#004525]/20 transition-colors">
              <FiHeart size={18} />
              <span className="font-medium">{article.likes || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#404942] rounded-full hover:bg-gray-200 transition-colors">
              <FiShare2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#404942] rounded-full hover:bg-gray-200 transition-colors">
              <FiBookmark size={18} />
              Save
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-6">
            Related Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedArticles.map((related) => (
              <Link key={related.id} href={`/blog/${related.slug}`}>
                <div className="group bg-white rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(31,93,58,0.08)] hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    {related.coverImage ? (
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-3xl font-bold">
                        {related.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-['Playfair_Display'] text-lg font-semibold text-[#004525] mb-2 group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-[#404942] line-clamp-2 mb-3">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#707971]">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {formatDate(related.publishedAt)}
                      </span>
                      <span className="text-[#004525] font-semibold flex items-center gap-1">
                        Read More <FiArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}