// components/BlogPage.tsx
'use client';

import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiTag,
} from 'react-icons/fi';
import { GiMountains, GiCoffeeBeans, GiChurch } from 'react-icons/gi';
import Header from './Header';
import Footer from './Footer';

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

const blogPosts = [
  {
    id: 1,
    title: 'The Rock-Hewn Wonders of Lalibela: A Spiritual Journey',
    excerpt: 'Discover the breathtaking 12th-century churches carved from solid rock, where faith and architecture merge in the Ethiopian highlands.',
    category: 'Cultural Heritage',
    date: 'March 15, 2024',
    readTime: '8 min read',
    author: 'Elena Rodriguez',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    icon: GiChurch,
  },
  {
    id: 2,
    title: 'Tracking the Gelada Baboons in the Simien Mountains',
    excerpt: 'An intimate encounter with the world\'s rarest primate species amid dramatic landscapes that feel like the edge of the world.',
    category: 'Wildlife & Nature',
    date: 'March 10, 2024',
    readTime: '6 min read',
    author: 'David Kimani',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    icon: GiMountains,
  },
  {
    id: 3,
    title: 'The Ancient Coffee Ceremony: Ethiopia\'s Gift to the World',
    excerpt: 'Step into the heart of Ethiopian culture through the sacred coffee ceremony, a ritual of hospitality that has endured for centuries.',
    category: 'Culinary & Culture',
    date: 'March 5, 2024',
    readTime: '5 min read',
    author: 'Maria Santos',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    icon: GiCoffeeBeans,
  },
  {
    id: 4,
    title: 'Trekking the Great Rift Valley: Where Earth\'s Story Unfolds',
    excerpt: 'Journey through the geological marvel that shaped human evolution, from the Danakil Depression to the lush highlands.',
    category: 'Adventure',
    date: 'February 28, 2024',
    readTime: '7 min read',
    author: 'Michael Okafor',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
  },
  {
    id: 5,
    title: 'Island Monasteries of Lake Tana: Hidden Treasures',
    excerpt: 'Explore the ancient monasteries scattered across Lake Tana\'s islands, housing priceless religious artifacts and stunning murals.',
    category: 'Cultural Heritage',
    date: 'February 20, 2024',
    readTime: '6 min read',
    author: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 6,
    title: 'Surviving the Danakil Depression: Earth\'s Hottest Place',
    excerpt: 'An expedition into one of the most extreme environments on Earth, where colorful sulfur springs and salt flats create an otherworldly landscape.',
    category: 'Extreme Adventure',
    date: 'February 15, 2024',
    readTime: '9 min read',
    author: 'James Harrison',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 overflow-x-hidden">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full mb-4"
            >
              <FiTag size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Travel Stories
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
            >
              The Traveler's <span className="italic text-[#735c00]">Journal</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg text-[#404942]"
            >
              Stories, insights, and dispatches from across Ethiopia — written by explorers who have ventured into its heart.
            </motion.p>
          </motion.div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className="group bg-white rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(31,93,58,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  {post.icon && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#004525]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                        <post.icon size={14} />
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-2 group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#404942] line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#707971]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={12} /> {post.readTime}
                      </span>
                    </div>
                    <button className="text-[#004525] font-semibold hover:text-[#735c00] transition-colors flex items-center gap-1">
                      Read More <FiArrowRight size={14} />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#c0c9bf]/30 flex items-center gap-2">
                    <FiUser size={14} className="text-[#707971]" />
                    <span className="text-xs text-[#707971]">{post.author}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}