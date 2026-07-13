// components/GalleryPage.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiX, FiZoomIn, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
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
      staggerChildren: 0.05,
    },
  },
};

const galleryImages = [
  {
    id: 1,
    title: 'Lalibela Rock Churches',
    location: 'Lalibela, Ethiopia',
    category: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    title: 'Simien Mountains Sunset',
    location: 'Simien Mountains, Ethiopia',
    category: 'Landscape',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 3,
    title: 'Omo Valley Tribes',
    location: 'Omo Valley, Ethiopia',
    category: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 4,
    title: 'Traditional Coffee Ceremony',
    location: 'Addis Ababa, Ethiopia',
    category: 'Culinary',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 5,
    title: 'Lake Tana Monasteries',
    location: 'Lake Tana, Ethiopia',
    category: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 6,
    title: 'Danakil Depression',
    location: 'Danakil, Ethiopia',
    category: 'Landscape',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 7,
    title: 'Gelada Baboons',
    location: 'Simien Mountains, Ethiopia',
    category: 'Wildlife',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
  {
    id: 8,
    title: 'Axum Obelisks',
    location: 'Axum, Ethiopia',
    category: 'Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
  },
];

const categories = ['All', 'Cultural Heritage', 'Landscape', 'Wildlife', 'Culinary'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

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
            <motion.h1
              variants={fadeInUp}
              className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
            >
              Visual <span className="italic text-[#735c00]">Stories</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg text-[#404942]"
            >
              A curated collection of moments captured across Ethiopia's most extraordinary destinations.
            </motion.p>
          </motion.div>
        </section>

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#004525] text-white'
                    : 'bg-[#f8f9ff] text-[#404942] hover:bg-[#004525]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                variants={fadeInUp}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${image.span || ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${image.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-['Playfair_Display'] text-lg font-semibold">
                    {image.title}
                  </h4>
                  <p className="text-sm text-white/80">{image.location}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                    <FiZoomIn size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-[#ffe088] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <FiX size={32} />
            </button>
            <div
              className="max-w-5xl w-full h-[80vh] bg-cover bg-center rounded-2xl"
              style={{ backgroundImage: `url("${selectedImage.image}")` }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white">
              <h3 className="font-['Playfair_Display'] text-2xl font-semibold">
                {selectedImage.title}
              </h3>
              <p className="text-white/80">{selectedImage.location}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}