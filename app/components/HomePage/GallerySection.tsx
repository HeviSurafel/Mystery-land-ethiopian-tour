// components/HomePage/GallerySection.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const galleryImages = [
  {
    id: 1,
    title: 'Lalibela Rock Churches',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    title: 'Simien Mountains',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    title: 'Omo Valley Tribes',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    title: 'Coffee Ceremony',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 5,
    title: 'Lake Tana Monasteries',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'col-span-1 row-span-1',
  },
];

export default function GallerySection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <h2 className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525]">
            Visual Stories
          </h2>
          <p className="text-lg text-[#404942] max-w-md">
            A glimpse into the extraordinary moments captured across Ethiopia.
          </p>
        </div>
        <a
          className="hidden md:flex items-center gap-1 text-[#004525] text-sm font-semibold hover:underline"
          href="/gallery"
        >
          View Full Gallery
          <ArrowUpRight size={20} />
        </a>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {galleryImages.map((item, index) => (
          <motion.div
            key={item.id}
            variants={{
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
            }}
            className={`relative overflow-hidden rounded-2xl group ${item.span}`}
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="font-['Playfair_Display'] text-lg font-semibold">
                {item.title}
              </h4>
              <p className="text-sm text-white/80">{item.location}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}