'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiUsers, FiMusic, FiCoffee, FiFeather } from 'react-icons/fi';

export default function CulturePage() {
  const culturalAspects = [
    {
      title: 'Languages & Ethnicity',
      icon: FiUsers,
      description: 'Ethiopia is home to over 80 ethnic groups and 80+ languages, with Amharic, Oromo, and Tigrinya being the most widely spoken. The country\'s diverse ethnic makeup contributes to its rich cultural tapestry.',
      image: '/Images/languages.jpg',
      alt: 'Ethiopian ethnic groups and languages'
    },
    {
      title: 'Coffee Ceremony',
      icon: FiCoffee,
      description: 'The Ethiopian coffee ceremony is a ritualistic experience that can take hours. It involves roasting coffee beans, grinding them, and brewing in a traditional clay pot called "jebena". It\'s a symbol of hospitality and community.',
      image: '/Images/coffee1.webp',
      alt: 'Traditional Ethiopian coffee ceremony'
    },
    {
      title: 'Music & Dance',
      icon: FiMusic,
      description: 'Ethiopian music is unique with its pentatonic scale. Traditional dances like "Eskista" involve distinctive shoulder and chest movements. Each region has its own dance styles and musical traditions.',
      image: '/Images/music.jpg',
      alt: 'Traditional Ethiopian music and dance'
    },
    {
      title: 'Arts & Crafts',
      icon: FiFeather,
      description: 'Ethiopian art includes religious iconography, traditional weaving, and unique crosses. The Lalibela rock-hewn churches and Axum obelisks showcase ancient architectural mastery.',
      image: '/Images/art.jpg',
      alt: 'Ethiopian arts and crafts'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-[#004525] to-[#006b3a]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-4"
          >
            Ethiopian Culture
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover the rich cultural heritage of Ethiopia, from ancient traditions to modern expressions
          </motion.p>
        </div>
      </section>

      {/* Culture Content */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {culturalAspects.map((aspect, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <aspect.icon className="text-4xl text-[#004525] mb-4" />
                <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#004525] mb-4">
                  {aspect.title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {aspect.description}
                </p>
              </div>
            </div>
            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={aspect.image}
                  alt={aspect.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                      fallback.innerHTML = `
                        <div class="text-center">
                          <div class="text-6xl text-[#004525]/30 mx-auto mb-2">${aspect.icon({ className: 'text-6xl' })}</div>
                          <p class="text-gray-500 text-sm">Image not available</p>
                        </div>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Fun Facts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#004525] text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">
            Cultural Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🏛️</div>
              <h3 className="font-bold mb-2">Ancient Civilizations</h3>
              <p className="text-sm text-white/80">Ethiopia is one of the oldest civilizations in the world</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-bold mb-2">Unique Calendar</h3>
              <p className="text-sm text-white/80">Ethiopia follows its own calendar system</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">✝️</div>
              <h3 className="font-bold mb-2">Religious Heritage</h3>
              <p className="text-sm text-white/80">Home to the Ark of the Covenant tradition</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}