// components/ReviewsWithMap.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiStar,
  FiMapPin,
  FiThumbsUp,
  FiHeart,
  FiShare2,
  FiArrowRight,
  FiExternalLink,
  FiCamera,
  FiGlobe,
  FiMessageCircle,
} from 'react-icons/fi';
import { FaTripadvisor, FaGoogle } from 'react-icons/fa';
import { MdVerified, MdLocationOn } from 'react-icons/md';

// Google Maps Embed Component
const GoogleMapEmbed = () => {
  return (
    <div className="w-full h-[450px] relative rounded-2xl overflow-hidden shadow-xl">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63320.418232564955!2d37.483797!3d6.0333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b2a4e5b2e5b2e5%3A0x5b2e5b2e5b2e5b2e!2sArba%20Minch%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Map Overlay Info */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#c0c9bf]/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FaGoogle className="w-5 h-5 text-[#4285F4]" />
              <span className="font-semibold text-[#004525]">5.0</span>
              <span className="text-sm text-[#707971]">(7 reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[#707971]">
              <span className="w-px h-6 bg-[#c0c9bf]/50" />
              <FaTripadvisor className="w-4 h-4 text-[#00af87]" />
              <span className="font-semibold text-[#004525]">5.0</span>
              <span className="text-sm">(3 reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://maps.app.goo.gl/ZqrQ6u9vzbTcy7ka8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#004525] font-semibold hover:text-[#735c00] transition-colors"
            >
              <FaGoogle className="w-4 h-4 text-[#4285F4]" />
              <span className="hidden sm:inline">View on Google Maps</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g776853-d27115500-Reviews-Mystery_Land_Ethiopia_Tour-Arba_Minch_Southern_Nations_Nationalities_and_People_.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#004525] font-semibold hover:text-[#00af87] transition-colors"
            >
              <FaTripadvisor className="w-4 h-4 text-[#00af87]" />
              <span className="hidden sm:inline">View on TripAdvisor</span>
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Review {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  tourName: string;
  helpfulCount: number;
  source: 'google' | 'tripadvisor';
  reviewCount?: string;
  photosCount?: string;
  isLocalGuide?: boolean;
  response?: {
    author: string;
    content: string;
    date: string;
  };
}

const reviews: Review[] = [
  // Google Reviews
  {
    id: '1',
    name: 'Emishaw Tefera',
    location: 'Addis Ababa, Ethiopia',
    date: '7 months ago',
    rating: 5,
    title: 'My Family tour to Arbaminch',
    content: `I recently visited Arbaminch for a family vacation, and it was an unforgettable experience. We explored Dorze Village, the Forty Springs, the Crocodile Ranch, and Lake Chamo, each offering its own unique beauty and charm.

Our tour guide, #Abselam, was exceptional. He is a professional photographer, knowledgeable, well-educated, and passionate guide who provided detailed information about every place we visited. His explanations added depth to our experience and helped us appreciate the culture, history, and natural wonders of Arbaminch even more.

One of the highlights of the trip was the warmth of the people we met along the way. From the welcoming communities in Dorze Village to the friendly locals around Forty Springs and Lake Chamo, everyone we encountered was incredibly natural, kind, and loving. Their hospitality made the journey feel even more special and authentic.

Overall, our Arbaminch trip was a perfect blend of nature, culture, and warm human connection. I highly recommend visiting—and if possible, exploring it with a guide like #Abselam who truly brings the experience to life.`,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD8pQWdXmVYpTeHKvThqIGFv9IbGxLr4XnlQr9R9zZbLQsUJXf9Ww'],
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso Tour',
    helpfulCount: 12,
    source: 'google',
    reviewCount: '3 reviews',
    photosCount: '14 photos',
  },
  {
    id: '2',
    name: 'Victor Berndsen',
    location: 'Netherlands',
    date: '2 months ago',
    rating: 5,
    title: 'Superb Arba Minch tour',
    content: `Me and my wife had the pleasure of spending 3 days with Abselam. During his guided tours he showcased some natural and cultural highlights in Arba Minch and surroundings. We had a special request to focus on culinary experiences as we love Ethiopian food a lot, and Abselam made sure that we could taste many different local dishes and experience multiple local markets. I highly recommend contacting Mystery Land tours if you are planning to visiting Arba Minch!`,
    isVerified: true,
    tourName: '3-Day Arba Minch Culinary Tour',
    helpfulCount: 8,
    source: 'google',
    reviewCount: '4 reviews',
    photosCount: '4 photos',
  },
  {
    id: '3',
    name: 'Toby Bennett',
    location: 'United Kingdom',
    date: '6 months ago',
    rating: 5,
    title: 'What an amazing experience',
    content: `What an amazing experience. Abi looked after us for the 3 days we were in Arba Minch. Great organisation and always on time. He took us around the great sites of the area and his knowledge of the culture and sites was amazing. Definitely recommend.`,
    isVerified: true,
    tourName: '3-Day Arba Minch Cultural Tour',
    helpfulCount: 10,
    source: 'google',
    reviewCount: '6 reviews',
    photosCount: '5 photos',
  },
  {
    id: '4',
    name: 'Mulualem Dagmawi',
    location: 'Addis Ababa, Ethiopia',
    date: '10 months ago',
    rating: 5,
    title: '2 Day Tour with Abselam',
    content: `We booked a 2 day tour with Abselam after seeing his google reviews, and he didn't disappoint. He is passionate about his work, very well connected, really good with camera's and made everything run smoothly. In a short time, we managed to experience so much; a boat ride on Lake Chamo, tasting fresh fish at the local market, exploring Nech Sar National Park with its famous 40 springs, visited the crocodile ranch, and immersing ourselves in the culture of Dorze village. Highly recommended for anyone visiting Arba Minch.`,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCQnqXH9YvP3mRdD7wN'],
    isVerified: true,
    tourName: '2-Day Arba Minch & Dorze Village Tour',
    helpfulCount: 15,
    source: 'google',
    reviewCount: '3 reviews',
    photosCount: '31 photos',
    isLocalGuide: true,
  },
  {
    id: '5',
    name: 'Nicoline Lavanchy',
    location: 'Switzerland',
    date: '9 months ago',
    rating: 5,
    title: 'Amazing 2-day adventure',
    content: `My husband and I planned last-minute to go to Arba Minch and booked with Abselam upon arrival. He was amazing from the beginning, accommodating to our late requests and tailoring the experience to our centre of interests, such as eating fresh fish from Lake Chamo, or getting deep in the forest of Nech Sar National Park. We had a wonderful 2-day adventure with him, both in the lowland and higher up in Dorze, immersing in the local culture and unique landscape.

Abselam is extremely knowledgeable and shares his passion with us with so much enthusiasm. And he is great with a Camera too, to capture memorable moments.

We are already looking forward to returning to Arba Minch and continuing to explore the region with him in the next couple of weeks. I truly couldn't recommend a guide more! Thank you so much for the great time.`,
    isVerified: true,
    tourName: '2-Day Arba Minch & Dorze Village Tour',
    helpfulCount: 7,
    source: 'google',
    reviewCount: '4 reviews',
  },
  {
    id: '6',
    name: 'JK',
    location: 'Traveler',
    date: '3 months ago',
    rating: 5,
    title: '10/10 Guide - Book him!',
    content: `Abselam is a 10/10 guide. We have explored Arba Minch and surroundings with him twice. He always goes the extra mile and the experiences we had were unforgettable. Don't think twice - book him!`,
    isVerified: true,
    tourName: 'Arba Minch & Surroundings Tour',
    helpfulCount: 5,
    source: 'google',
    reviewCount: '8 reviews',
  },
  {
    id: '7',
    name: 'Hana Lemma',
    location: 'Addis Ababa, Ethiopia',
    date: 'a year ago',
    rating: 5,
    title: '2nd time visiting Arbaminch',
    content: `It was the 2nd time we visited Arbaminch, and it was with Abselam. He is knowledgeable about the place and history of Arbaminch. He makes the trip interesting and enjoyable. Although he is helpful, kind and goes beyond on top of all this. He is a good camera operator! Thanks Abselam.`,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC'],
    isVerified: true,
    tourName: 'Arba Minch & Surroundings Tour',
    helpfulCount: 9,
    source: 'google',
    reviewCount: '2 reviews',
    photosCount: '7 photos',
  },
  // TripAdvisor Reviews
  {
    id: '8',
    name: 'Jonas Q',
    location: 'Traveler',
    date: 'June 2026',
    rating: 5,
    title: 'Truly authentic, diverse and fun experience',
    content: `It's been a fantastic trip with Abselam and the team of Mystery Land Ethiopia. Within a short time, Abselam crafted a program that included trips to Lake Chamo, where we experienced crocodiles, hippos, and a wide variety of unique birds, as well as a visit to the springs that gave Arba Minch its name. We also visited the Dorze community in the mountains, followed by a beautiful hike through the surrounding nature.

In all his interactions, he was extremely professional, respectful, friendly, and genuinely eager to provide the best possible experience and memories of Arba Minch. One thing that stood out in particular was the deep respect and appreciation he showed toward the local communities. He introduced us to Dorze culture at an appropriate pace, allowing for meaningful learning and authentic interactions with the people.

With him and his team, you can enjoy a truly authentic experience of Arba Minch, its people, culture, and natural beauty in a fun, diverse, and respectful way. I would highly recommend this trip and would gladly do it again.`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso Tour',
    helpfulCount: 12,
    source: 'tripadvisor',
  },
  {
    id: '9',
    name: 'Mary K',
    location: 'Berlin, Germany',
    date: 'June 2026',
    rating: 5,
    title: 'Humble guide, incredible tour!',
    content: `We travelled with our 10 month old twins and had such an amazing time with Abselam, discovering Arbaminch and its surroundings! We went on lake Chamo and saw incredible wildlife. My husband took a trip to the Dorze village and we also saw the 40 springs nestled in the heart of the beautiful canopy forest. Abselam advised us on suitable tours, was so friendly with our babies, brought us water for the road and made sure we felt safe. He is an exceptional guide with indepth knowledge of the places to visit and is an overall kind person. If you're looking for a lovely tour in Arbaminch, we absolutely recommend Mystery land tours!`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso Tour',
    helpfulCount: 8,
    source: 'tripadvisor',
  },
  {
    id: '10',
    name: 'sarahamarshall1',
    location: 'London, United Kingdom',
    date: 'June 2026',
    rating: 5,
    title: 'Fantastic guide and a wonderful visit',
    content: `Abselam was a great guide. He listened to what we wanted to do, knew all the best places to go and was great company for the trips. Overall a wonderful experience.`,
    isVerified: true,
    tourName: '3-Day Arba Minch & Konso Tour',
    helpfulCount: 6,
    source: 'tripadvisor',
    response: {
      author: 'Abselam - Mystery Land Ethiopia Tour',
      content: `Dear Sarah, Thank you so much for the fantastic 5-star review! It was an absolute pleasure guiding you and your family in Arba Minch Ethiopia this June. I am glad I could help tailor the journey to exactly what you wanted to see and ensure you experienced the very best of our beautiful region. Your kind words mean the world to us and we hope to welcome you back to explore even more hidden gems in Ethiopia! Best regards, Mystery Land Ethiopia Tour! [Abselam]`,
      date: 'June 14, 2026'
    }
  }
];

const StarRating = ({ rating, size = 'sm', showEmpty = true }: { rating: number; size?: 'sm' | 'md' | 'lg'; showEmpty?: boolean }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`${sizes[size]} ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : showEmpty ? 'text-gray-300' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const truncateContent = (content: string, maxLength: number = 280) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 shadow-[0px_10px_30px_rgba(31,93,58,0.06)] border border-[#c0c9bf]/20 hover:shadow-xl transition-all group"
    >
      {/* Source Badge */}
      <div className="flex justify-end mb-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
          review.source === 'google' 
            ? 'bg-[#4285F4]/10 text-[#4285F4]' 
            : 'bg-[#00af87]/10 text-[#00af87]'
        }`}>
          {review.source === 'google' ? (
            <FaGoogle className="w-3 h-3" />
          ) : (
            <FaTripadvisor className="w-3 h-3" />
          )}
          {review.source === 'google' ? 'Google' : 'TripAdvisor'}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-[#004525]">{review.name}</h4>
              {review.isVerified && (
                <MdVerified className="w-4 h-4 text-blue-500" />
              )}
              {review.isLocalGuide && (
                <span className="bg-[#004525]/10 text-[#004525] text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Local Guide
                </span>
              )}
              <span className="text-xs text-[#707971]">•</span>
              <span className="text-xs text-[#707971]">{review.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707971]">
              <span>{review.location}</span>
              {review.reviewCount && (
                <>
                  <span>•</span>
                  <span className="text-xs">{review.reviewCount}</span>
                </>
              )}
              {review.photosCount && (
                <>
                  <span>•</span>
                  <span className="text-xs flex items-center gap-1">
                    <FiCamera className="w-3 h-3" /> {review.photosCount}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#004525] mb-2">
        {review.title}
      </h3>

      {/* Content */}
      <p className="text-[#404942] text-sm leading-relaxed mb-3">
        {showFullContent ? review.content : truncateContent(review.content)}
      </p>

      {review.content.length > 280 && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-[#004525] text-sm font-semibold hover:text-[#735c00] transition-colors"
        >
          {showFullContent ? 'Read less' : 'Read more'}
        </button>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {review.images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={img}
                alt={`Review image ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
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
      <AnimatePresence>
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
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-semibold text-[#004525] text-sm">
                    {review.response.author}
                  </h5>
                  <span className="text-xs text-[#707971]">{review.response.date}</span>
                  <span className="text-[10px] bg-[#004525]/10 text-[#004525] px-2 py-0.5 rounded-full">
                    Owner Response
                  </span>
                </div>
                <p className="text-sm text-[#404942] mt-1 whitespace-pre-line">
                  {review.response.content}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ReviewsWithMap() {
  const [activeTab, setActiveTab] = useState<'all' | 'google' | 'tripadvisor'>('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const getFilteredReviews = () => {
    if (activeTab === 'google') {
      return reviews.filter(r => r.source === 'google');
    }
    if (activeTab === 'tripadvisor') {
      return reviews.filter(r => r.source === 'tripadvisor');
    }
    return reviews;
  };

  const filteredReviews = getFilteredReviews();
  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    googleCount: reviews.filter(r => r.source === 'google').length,
    tripadvisorCount: reviews.filter(r => r.source === 'tripadvisor').length,
  };

  const tabs = [
    { id: 'all', label: 'All Reviews', count: stats.total, icon: FiGlobe },
    { id: 'google', label: 'Google', count: stats.googleCount, icon: FaGoogle, color: 'text-[#4285F4]' },
    { id: 'tripadvisor', label: 'TripAdvisor', count: stats.tripadvisorCount, icon: FaTripadvisor, color: 'text-[#00af87]' },
  ];

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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-[#004525] to-[#1f5d3a] rounded-xl p-5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiGlobe className="w-5 h-5 text-white/80" />
            <span className="font-semibold text-white/80">Total Reviews</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <div className="flex justify-center mt-1">
            <StarRating rating={Math.round(parseFloat(stats.average))} />
          </div>
          <p className="text-sm text-white/60 mt-1">Average {stats.average} ★</p>
        </div>

        <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-[#c0c9bf]/20 hover:border-[#4285F4]/30 transition-all">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaGoogle className="w-5 h-5 text-[#4285F4]" />
            <span className="font-semibold text-[#004525]">Google Reviews</span>
          </div>
          <p className="text-3xl font-bold text-[#4285F4]">{stats.googleCount}</p>
          <div className="flex justify-center mt-1">
            <StarRating rating={5} />
          </div>
          <p className="text-sm text-[#707971] mt-1">5.0 ★ average</p>
        </div>

        <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-[#c0c9bf]/20 hover:border-[#00af87]/30 transition-all">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaTripadvisor className="w-5 h-5 text-[#00af87]" />
            <span className="font-semibold text-[#004525]">TripAdvisor Reviews</span>
          </div>
          <p className="text-3xl font-bold text-[#00af87]">{stats.tripadvisorCount}</p>
          <div className="flex justify-center mt-1">
            <StarRating rating={5} />
          </div>
          <p className="text-sm text-[#707971] mt-1">5.0 ★ average</p>
        </div>
      </motion.div>

      {/* Google Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <GoogleMapEmbed />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl p-2 border border-[#c0c9bf]/20 shadow-sm inline-flex w-full md:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all flex-1 md:flex-none justify-center ${
                  isActive
                    ? 'bg-[#004525] text-white shadow-lg'
                    : 'text-[#404942] hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color || 'text-[#707971]'}`} />
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-[#707971]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {displayedReviews.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {displayedReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-2xl border border-[#c0c9bf]/20"
            >
              <p className="text-[#404942]">No {activeTab !== 'all' ? activeTab : ''} reviews yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {filteredReviews.length > visibleCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 6, filteredReviews.length))}
            className="px-8 py-3 border-2 border-[#004525] text-[#004525] rounded-full font-semibold hover:bg-[#004525] hover:text-white transition-all"
          >
            Load More Reviews ({visibleCount} of {filteredReviews.length})
          </button>
        </div>
      )}

      {/* Platform Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-[#c0c9bf]/20"
      >
        <a
          href="https://maps.app.goo.gl/ZqrQ6u9vzbTcy7ka8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#4285F4]/10 text-[#4285F4] rounded-full font-medium hover:bg-[#4285F4]/20 transition-all hover:scale-105"
        >
          <FaGoogle className="w-5 h-5" />
          <span>Read all reviews on Google Maps</span>
          <FiArrowRight className="w-4 h-4" />
        </a>
        <a
          href="https://www.tripadvisor.com/Attraction_Review-g776853-d27115500-Reviews-Mystery_Land_Ethiopia_Tour-Arba_Minch_Southern_Nations_Nationalities_and_People_.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#00af87]/10 text-[#00af87] rounded-full font-medium hover:bg-[#00af87]/20 transition-all hover:scale-105"
        >
          <FaTripadvisor className="w-5 h-5" />
          <span>Read all reviews on TripAdvisor</span>
          <FiArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}