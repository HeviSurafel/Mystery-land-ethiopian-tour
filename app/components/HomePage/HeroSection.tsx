// components/HomePage/HeroSection.tsx
'use client';

import { easeInOut, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles, MapPin, Calendar, Users, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: easeInOut,
  }
};

export default function HeroSection() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <section className="relative h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Images/photo_37_2025-12-31_13-51-31.jpg"
          alt="Mystery Land Ethiopia Tours - Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Decorative Overlay Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Floating Badges */}
      <motion.div
        className="absolute top-32 right-10 z-10 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Limited Spots</p>
              <p className="text-white/60 text-xs">Book now, travel later</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-10 z-10 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">2,500+ Travelers</p>
              <p className="text-white/60 text-xs">Joined this year</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          className="max-w-3xl"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white/90 text-xs font-medium tracking-widest uppercase">
              Now Booking 2026 Tours
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInLeft}
            className="font-['Playfair_Display'] text-5xl md:text-7xl lg:text-8xl mb-6 leading-[1.1] font-bold text-white"
          >
            Discover Hidden
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Wonders Around
            </span>
            <span className="text-white">The World</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl mb-8 text-white/80 max-w-xl"
          >
            Adventure begins where the ordinary ends. Experience curated
            journeys to the world&apos;s most exclusive and untouched
            locations.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/tours">
              <button className="group bg-gradient-to-r from-amber-500 to-amber-400 text-white px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/25 flex items-center gap-2">
                Explore Tours
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <button 
              onClick={() => setIsImageModalOpen(true)}
              className="group glass-card text-white border-white/30 px-8 py-4 rounded-full text-sm font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              <Play size={18} className="fill-white" />
              View Gallery
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-white/10"
          >
            {[
              { icon: MapPin, label: "Destinations", value: "50+" },
              { icon: Calendar, label: "Tours", value: "200+" },
              { icon: Users, label: "Happy Travelers", value: "12K+" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <stat.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        animate={floatingAnimation}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          Scroll
        </span>
        <ChevronDown size={20} />
      </motion.div>

      {/* Image Gallery Modal */}
      {isImageModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setIsImageModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/Images/photo_6_2025-12-25_02-23-55.jpg"
                alt="Hero Gallery"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                quality={100}
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-lg">Discover Ethiopia's Hidden Wonders</h3>
              <p className="text-white/60 text-sm">Explore our curated collection of extraordinary destinations</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}