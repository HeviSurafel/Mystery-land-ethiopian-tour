// components/HomePage/BlogSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiChevronRight,
} from 'react-icons/fi';

interface Article {
  id: string;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  images: string[];
  coverImage: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?limit=5&sortBy=publishedAt&sortOrder=desc');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog posts');
      }

      const posts = data.data || [];
      setArticles(posts);

      // Set featured article (first one or the one with featured flag)
      const featured = posts.find((a: Article) => a.featured) || posts[0] || null;
      setFeaturedArticle(featured);

      // Set recent articles (remaining posts, max 4)
      const remaining = posts.filter((a: Article) => a.id !== featured?.id);
      setRecentArticles(remaining.slice(0, 4));
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = (article: Article) => {
    return article.coverImage || article.images?.[0] || '';
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525]">
              Latest from the <span className="italic text-[#735c00]">Journal</span>
            </h2>
            <p className="text-[#404942] mt-1">Stories from across Ethiopia</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-80 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="flex h-24">
                  <div className="w-1/3 bg-gray-200"></div>
                  <div className="w-2/3 p-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchBlogPosts}
            className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No articles
  if (!articles.length) {
    return null;
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525]">
            Latest from the <span className="italic text-[#735c00]">Journal</span>
          </h2>
          <p className="text-[#404942] mt-1">Stories from across Ethiopia</p>
        </div>
        <Link
          href="/blog"
          className="hidden md:flex items-center gap-2 text-[#004525] font-semibold hover:text-[#735c00] transition-colors group"
        >
          View All
          <FiChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Article - Takes 2 columns */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href={`/blog/${featuredArticle.slug}`}>
              <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                <div className="relative h-80 overflow-hidden">
                  {getImageUrl(featuredArticle) ? (
                    <Image
                      src={getImageUrl(featuredArticle)}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-6xl font-bold">
                      {featuredArticle.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {featuredArticle.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ffe088] text-[#241a00] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-white">
                    <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      {featuredArticle.category?.name || 'Travel'}
                    </span>
                    {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                      <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                        #{featuredArticle.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-[#707971] mb-2">
                    <span className="flex items-center gap-1">
                      <FiUser size={14} /> {featuredArticle.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} /> {formatDate(featuredArticle.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} /> {featuredArticle.readTime || '5 min read'}
                    </span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-2 group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-[#404942] text-sm line-clamp-2 mb-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium text-[#004525]">
                    <span className="flex items-center gap-1">
                      Read More
                      <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Recent Articles - Takes 1 column */}
        <div className="space-y-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {recentArticles.map((article, index) => (
              <motion.div
                key={article.id}
                variants={fadeInUp}
              >
                <Link href={`/blog/${article.slug}`}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex h-28">
                    <div className="relative w-1/3 flex-shrink-0 overflow-hidden">
                      {getImageUrl(article) ? (
                        <Image
                          src={getImageUrl(article)}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#735c00] to-[#004525] flex items-center justify-center text-white text-2xl font-bold">
                          {article.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] text-[#707971] mb-1">
                          <span>{article.category?.name || 'Travel'}</span>
                          <span>•</span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <h4 className="font-['Playfair_Display'] text-sm font-semibold text-[#004525] group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#707971]">
                        <span className="flex items-center gap-1">
                          <FiUser size={10} /> {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={10} /> {article.readTime || '3 min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile View All */}
          <div className="text-center md:hidden mt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#004525] font-semibold hover:text-[#735c00] transition-colors"
            >
              View All Articles
              <FiChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}