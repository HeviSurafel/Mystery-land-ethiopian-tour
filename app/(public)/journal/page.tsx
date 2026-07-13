// app/blog/page.tsx
import JournalPage from '@/components/JournalPage';

export const metadata = {
  title: 'Travel Journal - Ethiopian Stories & Insights | MYSTERY LAND ETHIOPIA TOURS',
  description: 'Explore stories, insights, and dispatches from across Ethiopia. Written by explorers who have ventured into the heart of this ancient land.',
  keywords: 'Ethiopia travel blog, Ethiopian culture, travel stories, adventure travel, cultural heritage',
};

export default function Page() {
  return <JournalPage />;
}