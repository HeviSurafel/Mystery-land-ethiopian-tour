'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiCalendar, FiSun, FiCloud, FiDroplet, FiWind } from 'react-icons/fi';

export default function WeatherPage() {
  const regions = [
    {
      name: 'Addis Ababa',
      description: 'Mild climate year-round with average temperatures of 16-25°C',
      weather: 'Sunny',
      temp: '22°C',
      icon: '☀️'
    },
    {
      name: 'Gondar',
      description: 'Pleasant weather with cool evenings and mild days',
      weather: 'Partly Cloudy',
      temp: '20°C',
      icon: '⛅'
    },
    {
      name: 'Lalibela',
      description: 'Cool highland climate with occasional rain',
      weather: 'Cloudy',
      temp: '18°C',
      icon: '☁️'
    },
    {
      name: 'Axum',
      description: 'Warm and dry climate with sunny days',
      weather: 'Sunny',
      temp: '25°C',
      icon: '☀️'
    },
    {
      name: 'Bahir Dar',
      description: 'Moderate climate with Lake Tana influence',
      weather: 'Mild',
      temp: '21°C',
      icon: '🌤️'
    },
    {
      name: 'Harar',
      description: 'Warm climate with distinct wet and dry seasons',
      weather: 'Warm',
      temp: '26°C',
      icon: '🌤️'
    }
  ];

  const seasons = [
    { name: 'Dry Season', months: 'October - May', description: 'Best time to visit with clear skies and pleasant temperatures' },
    { name: 'Rainy Season', months: 'June - September', description: 'Lush green landscapes with afternoon showers' }
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
            Weather in Ethiopia
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover the diverse climate and best times to visit this beautiful country
          </motion.p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#004525] mb-6">
            Climate Overview
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Ethiopia's diverse topography creates a wide range of climate zones, from the hot and arid lowlands 
            to the cool and temperate highlands. The country experiences two main seasons: the dry season and 
            the rainy season, each offering unique experiences for travelers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasons.map((season, index) => (
              <div key={index} className="bg-[#f5f7f5] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#004525] mb-2">{season.name}</h3>
                <p className="text-[#004525]/70 text-sm font-semibold mb-2">{season.months}</p>
                <p className="text-gray-700">{season.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional Weather */}
        <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#004525] mb-8 text-center">
          Regional Weather
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#004525]">{region.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{region.description}</p>
                  </div>
                  <span className="text-4xl">{region.icon}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <FiSun className="text-[#004525]" />
                    <span className="font-semibold">{region.temp}</span>
                  </div>
                  <span className="text-sm text-gray-600">{region.weather}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Travel Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-[#004525] text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6">
            Weather Travel Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <FiCalendar className="text-2xl mb-2" />
              <h3 className="font-bold mb-1">Best Time to Visit</h3>
              <p className="text-sm text-white/80">October to March for clear skies</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <FiSun className="text-2xl mb-2" />
              <h3 className="font-bold mb-1">Sun Protection</h3>
              <p className="text-sm text-white/80">Bring sunscreen and hats for high altitude</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <FiCloud className="text-2xl mb-2" />
              <h3 className="font-bold mb-1">Rain Gear</h3>
              <p className="text-sm text-white/80">Pack rain jackets during rainy season</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <FiWind className="text-2xl mb-2" />
              <h3 className="font-bold mb-1">Layered Clothing</h3>
              <p className="text-sm text-white/80">Evenings can be cool in highlands</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}