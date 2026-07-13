// components/ReviewsSection.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FiStar,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiHeart,
  FiArrowRight,
} from 'react-icons/fi';
import { FaTripadvisor } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

interface Review {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  image?: string;
  isVerified: boolean;
  tourName: string;
  helpfulCount: number;
  source: 'tripadvisor' | 'google';
  response?: {
    author: string;
    content: string;
    date: string;
  };
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Jonas Q',
    location: 'Traveler',
    date: 'June 2026',
    rating: 5,
    title: 'Truly authentic, diverse and fun experience',
    content: `It's been a fantastic trip with Abselam and the team of Mystery Land Ethiopia. Within a short time, Abselam crafted a program that included trips to Lake Chamo, where we experienced crocodiles, hippos, and a wide variety of unique birds, as well as a visit to the springs that gave Arba Minch its name. We also visited the Dorze community in the mountains, followed by a beautiful hike through the surrounding nature.

In all his interactions, he was extremely professional, respectful, friendly, and genuinely eager to provide the best possible experience and memories of Arba Minch. One thing that stood out in particular was the deep respect and appreciation he showed toward the local communities. He introduced us to Dorze culture at an appropriate pace, allowing for meaningful learning and authentic interactions with the people.

With him and his team, you can enjoy a truly authentic experience of Arba Minch, its people, culture, and natural beauty in a fun, diverse, and respectful way. I would highly recommend this trip and would gladly do it again.`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 12,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Founder & Tour Guide',
      content: `Dear Jonas,

Thank you so much for your wonderful review and for choosing Mystery Land Ethiopia Tour for your visit to Arba Minch.

We are delighted to hear that you enjoyed the diverse experiences, from the wildlife of Lake Chamo and the natural springs of Arba Minch to the rich culture and traditions of the Dorze community. It means a great deal to us that you appreciated not only the destinations but also the authentic connections with the local people and communities.

Your kind words about our professionalism, hospitality, and commitment to creating meaningful travel experiences are truly appreciated. We believe that responsible tourism is about sharing Ethiopia's natural beauty and cultural heritage with respect, and we are glad this was reflected throughout your journey.

Thank you again for taking the time to share your experience. We hope to welcome you back to Ethiopia in the future for more unforgettable adventures and discoveries.

Warm regards,
Abselam
Founder & Tour Guide
Mystery Land Ethiopia Tour!`,
      date: 'June 25, 2026'
    }
  },
  {
    id: '2',
    name: 'Mary K',
    location: 'Berlin, Germany',
    date: 'June 2026',
    rating: 5,
    title: 'Humble guide, incredible tour!',
    content: `We travelled with our 10 month old twins and had such an amazing time with Abselam, discovering Arbaminch and its surroundings!

We went on lake Chamo and saw incredible wildlife. My husband took a trip to the Dorze village and we also saw the 40 springs nestled in the heart of the beautiful canopy forest.

Abselam advised us on suitable tours, was so friendly with our babies, brought us water for the road and made sure we felt safe. He is an exceptional guide with indepth knowledge of the places to visit and is an overall kind person. If you're looking for a lovely tour in Arbaminch, we absolutely recommend Mystery land tours!`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 8,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Mary,

Thank you so much for your wonderful review and for taking the time to share your experience. It was a true pleasure to meet you, your husband, and your lovely twins.

I am delighted to hear that you enjoyed exploring Arba Minch, Lake Chamo, the Dorze Village, and the Forty Springs. Knowing that your family felt safe, comfortable, and well cared for throughout the tour means a great deal to me.

Thank you for your kind words about my guidance, local knowledge, and hospitality. It was an honor to help make your visit to Ethiopia memorable, and I truly appreciate your recommendation of Mystery Land Ethiopia Tour.

I hope to welcome you and your family back to Ethiopia again someday for more unforgettable adventures.

Warm regards,
Abselam
Mystery Land Ethiopia Tour! 🇪🇹`,
      date: 'June 20, 2026'
    }
  },
  {
    id: '3',
    name: 'sarahamarshall1',
    location: 'London, United Kingdom',
    date: 'June 2026',
    rating: 5,
    title: 'Fantastic guide and a wonderful visit',
    content: `Abselam was a great guide. He listened to what we wanted to do, knew all the best places to go and was great company for the trips. Overall a wonderful experience.`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 6,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Sarah,

Thank you so much for the fantastic 5-star review! It was an absolute pleasure guiding you and your family in Arba Minch Ethiopia this June. I am glad I could help tailor the journey to exactly what you wanted to see and ensure you experienced the very best of our beautiful region.

Your kind words mean the world to us and we hope to welcome you back to explore even more hidden gems in Ethiopia!

Best regards,
Mystery Land Ethiopia Tour!
[Abselam]`,
      date: 'June 14, 2026'
    }
  },
  {
    id: '4',
    name: 'Alex M',
    location: 'Kinshasa, Democratic Republic of the Congo',
    date: 'June 2026',
    rating: 5,
    title: 'Brilliant tour in a spectacular place',
    content: `We had such an amazing experience touring around Arba Minch with Abselam. The landscape is spectacular and all the activities organised for us were fantastic. Everything went incredibly smoothly and Abselam was very knowledgeable, friendly, patient and flexible. We had a whole range of ages with us including very small children, and he made sure that the tour worked well for everyone. Highly recommended to anyone visiting this beautiful place.`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 10,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Alex,

Thank you very much for your wonderful review and for choosing Mystery Land Ethiopia Tour for your family's adventure in Arba Minch.

It was truly a pleasure hosting you and your family. I am delighted to hear that you enjoyed the spectacular landscapes, Lake Chamo wildlife, Dorze village cultural experiences, Forty springs and all the activities during your stay. Knowing that every member of your family, from the youngest children to the adults, had a comfortable and memorable experience means a lot to me.

Your kind words about my knowledge, flexibility, and service are greatly appreciated. My goal is always to provide authentic, safe, and unforgettable experiences for every guest visiting this beautiful part of Ethiopia.

Thank you again for your trust and recommendation. I hope to welcome you and your family back to Ethiopia in the future to explore even more of our country's incredible cultures, wildlife, and landscapes.

Warm regards,
Mystery Land Ethiopia Tour!
[Abselam]`,
      date: 'June 13, 2026'
    }
  },
  {
    id: '5',
    name: 'Mbolatiana Nala R',
    location: 'Traveler',
    date: 'May 2026',
    rating: 5,
    title: 'Amazing tour in Chamo Lake Arba Minch',
    content: `Amazing Lake Chamo Boat Tour with Mystery Land Ethiopia Tour & Guide Abselam

During our stay in Arba Minch, we were initially planning to visit only the town and its surroundings. However, our guide Abselam from Mystery Land Ethiopia Tour convinced us to join a half-day boat tour on Lake Chamo, and it turned out to be one of the highlights of our trip to Ethiopia.

Abselam was highly professional, well-organized, and very knowledgeable throughout the excursion. The boat trip allowed us to get incredibly close to the famous Nile crocodiles at the Crocodile Market, sometimes less than a meter away, which was both thrilling and unforgettable. We also had the opportunity to observe many beautiful bird species in their natural habitat.

Another unique experience was visiting the local Fish Market, where fishermen brought in their fresh catch. We even had the chance to taste freshly caught raw fish, a truly authentic local experience that we would never have discovered on our own.

Everything was perfectly organized, and Abselam made sure we felt comfortable and safe throughout the tour. He is also able to arrange many other activities in the region and provides excellent recommendations based on your interests.

I highly recommend Mystery Land Ethiopia Tour and Abselam to anyone visiting Arba Minch. If you have the opportunity, don't miss the Lake Chamo boat tour—it is absolutely worth it!

5 stars for professionalism, organization, and an unforgettable experience! ⭐⭐⭐⭐⭐`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 15,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Mbolatinan,

Thank you so much for your wonderful review and for choosing Mystery Land Ethiopia Tour during your visit to Arba Minch.

We are delighted to hear that the Lake Chamo boat tour was one of the highlights of your trip to Ethiopia. It was a pleasure sharing the beauty of Lake Chamo, the Nile crocodiles, local fish market, and the incredible birdlife with you.

Your kind words about our professionalism, organization, and local knowledge mean a lot to us. We always strive to provide authentic, safe, and memorable experiences for our guests.

Thank you again for your recommendation. We hope to welcome you back to Ethiopia in the future for more unforgettable adventures.

Warm regards,
Abselam
Mystery Land Ethiopia Tour!`,
      date: 'May 31, 2026'
    }
  },
  {
    id: '6',
    name: 'Victor B',
    location: 'Traveler',
    date: 'May 2026',
    rating: 5,
    title: 'Superb Arba Minch tour',
    content: `Me and my wife had the pleasure of spending 3 days with Abselam. During his guided tours he showcased some natural and cultural highlights in Arba Minch and surroundings. We had a special request to focus on culinary experiences as we love Ethiopian food a lot, and Abselam made sure that we could taste many different local dishes and experience multiple local markets. I highly recommend contacting Mystery Land tours if you are planning to visiting Arba Minch!`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso: Culture, Wildlife & Local Tour',
    helpfulCount: 7,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Victor,

Thank you very much for your wonderful review! It was truly a pleasure hosting you and your wife during your 3-day stay in Arba Minch. I'm very happy to hear that you enjoyed both the cultural and natural highlights of the area.

I'm especially glad that we could focus on the culinary experiences you requested—Ethiopian food is such an important part of our culture, and it's always a joy to share it with guests who appreciate it. Visiting crocodile market, Dorze village, and tasting different dishes together made the experience even more special.

Your kind recommendation means a lot to me and to Mystery Land Ethiopia Tours. I hope to welcome you again in the future for another adventure in Ethiopia!

Warm regards,
Abselam
Mystery Land Ethiopia Tour!`,
      date: 'May 4, 2026'
    }
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 shadow-[0px_10px_30px_rgba(31,93,58,0.06)] border border-[#c0c9bf]/20 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white font-bold text-lg">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[#004525]">{review.name}</h4>
              {review.isVerified && (
                <MdVerified className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707971]">
              <span>{review.location}</span>
              <span>•</span>
              <span>{review.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.source === 'tripadvisor' && (
            <FaTripadvisor className="w-5 h-5 text-[#00af87]" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-2">
        {review.title}
      </h3>

      {/* Content */}
      <p className="text-[#404942] text-sm leading-relaxed mb-3">
        {isExpanded ? review.content : truncateContent(review.content)}
      </p>

      {review.content.length > 300 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#004525] text-sm font-semibold hover:text-[#735c00] transition-colors"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}

      {/* Tour Name */}
      <div className="mt-3 flex items-center gap-2 text-sm text-[#707971]">
        <FiMapPin className="w-4 h-4" />
        <span>{review.tourName}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 pt-3 border-t border-[#c0c9bf]/20">
        <button className="flex items-center gap-1 text-sm text-[#707971] hover:text-[#004525] transition-colors">
          <FiThumbsUp className="w-4 h-4" />
          <span>{review.helpfulCount}</span>
        </button>
        <button className="flex items-center gap-1 text-sm text-[#707971] hover:text-[#004525] transition-colors">
          <FiHeart className="w-4 h-4" />
          <span>Helpful</span>
        </button>
        <button className="flex items-center gap-1 text-sm text-[#707971] hover:text-[#004525] transition-colors">
          <FiShare2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        {review.response && (
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-1 text-sm text-[#004525] font-semibold hover:text-[#735c00] transition-colors ml-auto"
          >
            <FiMessageCircle className="w-4 h-4" />
            {showResponse ? 'Hide Response' : 'View Response'}
          </button>
        )}
      </div>

      {/* Response */}
      {showResponse && review.response && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-[#f8f9ff] rounded-xl border border-[#c0c9bf]/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#004525] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              ML
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-semibold text-[#004525] text-sm">
                  {review.response.author}
                </h5>
                <span className="text-xs text-[#707971]">{review.response.date}</span>
              </div>
              <p className="text-sm text-[#404942] mt-1 whitespace-pre-line">
                {review.response.content}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function ReviewsSection() {
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3'>('all');
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.rating >= parseInt(filter);
  });

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full mb-4">
          <FiStar className="w-4 h-4 fill-current" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Traveler Reviews
          </span>
        </div>
        <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#004525] mb-4">
          What Our <span className="italic text-[#735c00]">Travelers</span> Say
        </h2>
        <p className="text-[#404942] text-lg max-w-2xl mx-auto">
          Real stories from real travelers who explored Ethiopia with us.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#c0c9bf]/20">
          <p className="text-3xl font-bold text-[#004525]">{stats.average}</p>
          <div className="flex justify-center mt-1">
            <StarRating rating={Math.round(parseFloat(stats.average))} />
          </div>
          <p className="text-xs text-[#707971] mt-1">Average Rating</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#c0c9bf]/20">
          <p className="text-3xl font-bold text-[#004525]">{stats.total}</p>
          <p className="text-xs text-[#707971] mt-1">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#c0c9bf]/20">
          <p className="text-3xl font-bold text-[#004525]">{stats.fiveStar}</p>
          <div className="flex justify-center mt-1">
            <StarRating rating={5} />
          </div>
          <p className="text-xs text-[#707971] mt-1">5-Star Reviews</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#c0c9bf]/20">
          <p className="text-3xl font-bold text-[#004525]">100%</p>
          <p className="text-xs text-[#707971] mt-1">Recommended</p>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#004525] text-white'
              : 'bg-white text-[#404942] hover:bg-gray-100 border border-[#c0c9bf]/30'
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => setFilter('5')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === '5'
              ? 'bg-[#004525] text-white'
              : 'bg-white text-[#404942] hover:bg-gray-100 border border-[#c0c9bf]/30'
          }`}
        >
          <FiStar className="w-4 h-4 fill-current" /> 5 Stars
        </button>
        <button
          onClick={() => setFilter('4')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            filter === '4'
              ? 'bg-[#004525] text-white'
              : 'bg-white text-[#404942] hover:bg-gray-100 border border-[#c0c9bf]/30'
          }`}
        >
          <FiStar className="w-4 h-4 fill-current" /> 4+ Stars
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {displayedReviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Load More */}
      {filteredReviews.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 4, filteredReviews.length))}
            className="px-8 py-3 border-2 border-[#004525] text-[#004525] rounded-full font-semibold hover:bg-[#004525] hover:text-white transition-all"
          >
            Load More Reviews
          </button>
        </div>
      )}

      {/* TripAdvisor Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g776853-d27115500-Reviews-Mystery_Land_Ethiopia_Tour-Arba_Minch_Southern_Nations_Nationalities_and_People_.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#004525] hover:text-[#735c00] transition-colors font-medium"
        >
          <FaTripadvisor className="w-5 h-5" />
          Read all reviews on TripAdvisor
          <FiArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}