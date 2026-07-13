'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiMap, FiCompass, FiGlobe, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function TravelGuidePage() {
  const sections = [
    {
      title: 'Getting There',
      icon: FiGlobe,
      content: [
        'Addis Ababa Bole International Airport is the main gateway',
        'Direct flights from major European, Middle Eastern, and African cities',
        'Ethiopian Airlines offers extensive international connections'
      ]
    },
    {
      title: 'Visa Requirements',
      icon: FiInfo,
      content: [
        'E-visa available for most nationalities',
        'Visa on arrival at Addis Ababa airport',
        'Check latest requirements before travel'
      ]
    },
    {
      title: 'Best Time to Visit',
      icon: FiCompass,
      content: [
        'October to March: Dry season, ideal for travel',
        'April to September: Rainy season, lush landscapes',
        'Consider regional climate variations'
      ]
    },
    {
      title: 'Getting Around',
      icon: FiMap,
      content: [
        'Domestic flights to major cities',
        'Road travel with buses and 4x4 vehicles',
        'Train services in some regions'
      ]
    }
  ];

  const travelTips = [
    'Learn a few Amharic phrases - locals appreciate the effort',
    'Respect local customs and dress modestly in religious sites',
    'Always carry bottled water and stay hydrated',
    'Use reputable tour operators for safety',
    'Try local cuisine but start with mild options',
    'Carry small bills for tips and local purchases'
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
            Ethiopia Travel Guide
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Your comprehensive guide to exploring the wonders of Ethiopia
          </motion.p>
        </div>
      </section>

      {/* Quick Info Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <section.icon className="text-3xl text-[#004525] mb-4" />
              <h3 className="text-xl font-bold text-[#004525] mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                    <FiCheckCircle className="text-[#004525] mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Essential Travel Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#004525] mb-6 text-center">
            Essential Travel Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 bg-[#f5f7f5] rounded-xl p-4">
                <FiCheckCircle className="text-[#004525] text-xl flex-shrink-0 mt-1" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Safety Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#004525] text-white rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiAlertCircle className="text-3xl" />
            <h2 className="text-3xl font-bold font-['Playfair_Display']">Safety Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Health Precautions</h3>
              <p className="text-sm text-white/80">Yellow fever vaccination required, malaria prevention recommended</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Emergency Contacts</h3>
              <p className="text-sm text-white/80">Police: 911, Ambulance: 907, Fire: 939</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold mb-2">Travel Insurance</h3>
              <p className="text-sm text-white/80">Comprehensive travel insurance is strongly recommended</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}