// components/HomePage/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="w-full h-full bg-cover bg-center transition-transform duration-[10s] scale-105 hover:scale-100"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0HGZZVJH9MddLFJi0qXdxn0ryMEfbFAPkdICs5lLmPnfuEpr1iF0kw80aW0atKudDtP7eg3xU6Jd68SNZ9ENrg28VbVrbP1gnzR3oB3RQdVdAkhcOZIhbUnABg6NeH0yU1LLNQ26T63VT0BsN5BnbIT82Lz5DESGZg-IB1CYY0UAYz-lmtZRKIc0QiimptasEX2aZajrAUOlnmdZyMWnrba12XJw4UFuiNLyRsHyOrl7LUsa5FP62RA")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          className="max-w-2xl text-white"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block mb-6 bg-[#ffe088] text-[#241a00] px-3 py-1 rounded-lg text-xs font-semibold tracking-widest uppercase"
          >
            The Extraordinary Awaits
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-6xl mb-6 leading-tight font-bold"
          >
            Discover Hidden Wonders Around the World
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg mb-6 text-white/90"
          >
            Adventure begins where the ordinary ends. Experience curated
            journeys to the world&apos;s most exclusive and untouched
            locations.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-6"
          >
            <button className="bg-[#004525] text-white px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
              Explore Tours
              <ArrowRight size={20} />
            </button>
            <button className="glass-card text-white border-white/40 px-8 py-4 rounded-full text-sm font-semibold hover:bg-white/20 transition-all">
              Plan Your Journey
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
        <span className="text-xs font-semibold uppercase tracking-widest">
          Scroll
        </span>
        <ChevronDown size={24} />
      </div>
    </section>
  );
}