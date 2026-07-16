// components/HomePage/AboutAbselam.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiMapPin,
  FiCamera,
  FiAward,
  FiUsers,
  FiStar,
  FiCalendar,
  FiCompass,
  FiHeart,
  FiMessageCircle,
  FiGlobe,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiCompass as FiCompassIcon,
  FiFeather,
} from 'react-icons/fi';
import { FaTripadvisor, FaGoogle } from 'react-icons/fa';

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

const stats = [
  { icon: FiUsers, label: 'Happy Travelers', value: '2,500+' },
  { icon: FiCalendar, label: 'Years Experience', value: '10+' },
  { icon: FiMapPin, label: 'Destinations', value: '30+' },
  { icon: FiCompass, label: 'Custom Tours', value: '200+' },
];

const whyChooseUs = [
  {
    icon: FiGlobe,
    title: 'Locally Owned & Operated',
    description: 'Founded by a native of the region with intimate knowledge of Ethiopia\'s hidden gems.',
  },
  {
    icon: FiStar,
    title: 'Experienced Tour Guide',
    description: 'Over a decade of guiding individual and group tours across Ethiopia\'s diverse landscapes.',
  },
  {
    icon: FiFeather,
    title: 'Tailor-Made Itineraries',
    description: 'Customized trips that match your interests, time, and travel style.',
  },
  {
    icon: FiHeart,
    title: 'Cultural Sensitivity',
    description: 'Responsible and ethical tourism, especially in culturally sensitive regions like the Omo Valley.',
  },
  {
    icon: FiShield,
    title: 'Safety & Comfort',
    description: 'Your safety and comfort are our top priorities throughout your journey.',
  },
  {
    icon: FiCamera,
    title: 'Professional Photography',
    description: 'Capture your memories with a guide who is also a professional photographer.',
  },
];

const expertise = [
  'Tribal Culture & Traditions',
  'Nature & Wildlife',
  'Religious Heritage',
  'Local Festivals',
  'Off-the-Beaten-Path Adventures',
  'Great Rift Valley Lakes',
  'Omo Valley Tribes',
  'Historical Sites',
];

export default function AboutAbselam() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
      >
        {/* Left Column - Image & Stats */}
        <motion.div variants={fadeInUp} className="relative lg:sticky lg:top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-[4/5] relative">
              <Image
                src="/Images/3d858218-7c8b-4654-a93e-89404bbeddf6.jpeg"
                alt="Abselam - Founder & Lead Guide at Mystery Land Ethiopia Tours"
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-6xl font-bold';
                    fallback.textContent = 'A';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <FiAward className="w-4 h-4 text-[#735c00]" />
              <span className="text-sm font-semibold text-[#004525]">10+ Years</span>
              <span className="text-xs text-[#707971]">Experience</span>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <FiCompass className="w-4 h-4 text-[#004525]" />
              <span className="text-sm font-semibold text-[#004525]">30+</span>
              <span className="text-xs text-[#707971]">Destinations</span>
            </div>
          </div>

          {/* Stats Overlay */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 gap-3 mt-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#c0c9bf]/20 hover:shadow-md transition-all"
                >
                  <Icon className="w-5 h-5 text-[#004525] mx-auto mb-1" />
                  <p className="text-lg font-bold text-[#004525]">{stat.value}</p>
                  <p className="text-xs text-[#707971]">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Column - Content */}
        <motion.div variants={stagger} className="space-y-8">
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
              Meet Your Guide
            </span>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#004525] leading-tight">
              About <span className="text-[#735c00]">Abselam</span>
            </h2>
            <p className="text-[#404942] text-lg mt-2">
              Founder & Lead Guide at Mystery Land Ethiopia Tours
            </p>
          </motion.div>

          {/* Main Story */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <p className="text-[#404942] leading-relaxed">
              Welcome to <strong className="text-[#004525]">Mystery Land Ethiopia Tours</strong>, 
              your trusted gateway to the heart and soul of Ethiopia. Founded by <strong className="text-[#004525]">Abselam</strong>, 
              a passionate and experienced tour guide based in Arbaminch, we are dedicated to delivering 
              unforgettable, authentic, and culturally rich travel experiences across the diverse landscapes 
              of Ethiopia.
            </p>

            <div className="bg-[#004525]/5 p-6 rounded-2xl border border-[#004525]/10">
              <h4 className="font-semibold text-[#004525] text-lg mb-2 flex items-center gap-2">
                <FiCompassIcon className="w-5 h-5" />
                Discover the Beauty of Borena with Us!
              </h4>
              <p className="text-[#404942] leading-relaxed">
                With over <strong>10 years</strong> of hands-on experience in guiding travelers through the wonders 
                of Ethiopia, Abselam has turned his deep-rooted knowledge, local connections, and love for 
                storytelling into a professional and personalized tour service. His expertise spans the lush 
                highlands, the mystical Omo Valley, the Great Rift Valley lakes, and the country's vibrant 
                historic and tribal regions.
              </p>
            </div>

            <p className="text-[#404942] leading-relaxed">
              At Mystery Land Ethiopia Tours, we specialize in crafting <strong>immersive tours</strong> that go 
              beyond sightseeing. Whether you're interested in tribal culture, nature and wildlife, religious 
              heritage, local festivals, or off-the-beaten-path adventures, we ensure every journey is 
              informative, respectful, and truly memorable.
            </p>
          </motion.div>

          {/* Expertise Areas */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-[#004525] text-lg mb-3">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {expertise.map((item, index) => (
                <span
                  key={index}
                  className="bg-[#004525]/10 text-[#004525] px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-[#004525] text-lg mb-3 flex items-center gap-2">
              <FiHeart className="w-5 h-5 text-[#735c00]" />
              Why Travel With Us?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-[#c0c9bf]/20 hover:border-[#004525]/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#004525]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#004525] transition-colors">
                        <Icon className="w-4 h-4 text-[#004525] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-[#004525] text-sm">{item.title}</h5>
                        <p className="text-xs text-[#707971] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
            <Link href="/about">
              <button className="px-8 py-3 bg-[#004525] text-white rounded-full font-semibold hover:bg-[#1f5d3a] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                Learn More About Abselam
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-3 border-2 border-[#004525] text-[#004525] rounded-full font-semibold hover:bg-[#004525] hover:text-white transition-all flex items-center gap-2 group">
                <FiMessageCircle className="w-4 h-4" />
                Contact Abselam
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}