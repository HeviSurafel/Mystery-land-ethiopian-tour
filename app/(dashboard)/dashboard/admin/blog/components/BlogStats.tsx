import React from 'react';
import { Newspaper, CheckCircle2, Eye, MessageCircle } from 'lucide-react';
import { BlogStatsProps } from '../types/blog.types';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

export const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Articles" 
          value={stats.totalArticles} 
          icon={Newspaper} 
          color="blue" 
        />
        <StatCard 
          title="Published" 
          value={stats.publishedArticles} 
          icon={CheckCircle2} 
          color="green" 
        />
        <StatCard 
          title="Total Views" 
          value={stats.totalViews.toLocaleString()} 
          icon={Eye} 
          color="purple" 
        />
        <StatCard 
          title="Comments" 
          value={stats.totalComments} 
          icon={MessageCircle} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-yellow-600">Drafts</p>
          <p className="text-lg font-bold text-yellow-700">{stats.draftArticles}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-blue-600">Scheduled</p>
          <p className="text-lg font-bold text-blue-700">{stats.scheduledArticles}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-xs text-amber-600">Archived</p>
          <p className="text-lg font-bold text-amber-700">{stats.archivedArticles}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-xs text-purple-600">Categories</p>
          <p className="text-lg font-bold text-purple-700">{stats.categoriesCount}</p>
        </div>
      </div>
    </>
  );
};