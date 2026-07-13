'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiCalendar, FiFlag, FiMusic, FiUser } from 'react-icons/fi';

export default function FestivalsPage() {
  const festivals = [
    {
      name: 'Meskel (Finding of the True Cross)',
      date: 'September 27th',
      description: 'One of Ethiopia\'s most colorful festivals, Meskel celebrates the discovery of the True Cross. The celebration includes burning of a large bonfire (Demera) and colorful processions.',
      icon: FiFlag,
      location: 'Addis Ababa & Nationwide'
    },
    {
      name: 'Timkat (Epiphany)',
      date: 'January 19th',
      description: 'The most important festival in Ethiopia, Timkat commemorates the baptism of Jesus. It features colorful processions, the ceremonial baptism of Tabots, and water splashing.',
      icon: FiCalendar,
      location: 'Gondar & Nationwide'
    },
    {
      name: 'Enkutatash (Ethiopian New Year)',
      date: 'September 11th',
      description: 'The Ethiopian New Year falls in September and is celebrated with music, dancing, and feasting. It marks the end of the rainy season and the beginning of the harvest season.',
      icon: FiMusic,
      location: 'Nationwide'
    },
    {
      name: 'Genna (Ethiopian Christmas)',
      date: 'January 7th',
      description: 'Ethiopian Christmas is celebrated with traditional games, church services, and feasting. People dress in white traditional clothing and participate in special ceremonies.',
      icon: FiUser,
      location: 'Nationwide'
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
            Ethiopian Festivals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Experience the vibrant celebrations and ancient traditions of Ethiopia
          </motion.p>
        </div>
      </section>

      {/* Festivals Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {festivals.map((festival, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-[#004525]/10 rounded-xl p-3">
                    <festival.icon className="text-3xl text-[#004525]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#004525]">
                      {festival.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-[#004525]/70 font-semibold">
                        {festival.date}
                      </span>
                      <span className="text-sm text-[#004525]/60">
                        📍 {festival.location}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {festival.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Festival Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-[#004525] text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">
            Festival Calendar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">September</div>
              <div className="text-sm">Enkutatash (New Year) & Meskel</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">January</div>
              <div className="text-sm">Genna (Christmas) & Timkat (Epiphany)</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">March/April</div>
              <div className="text-sm">Fasika (Easter) - varies by year</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">May</div>
              <div className="text-sm">Meskel Demera preparations begin</div>
            </div>
          </div>
        </motion.div>

        {/* Travel Tips for Festivals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#004525] mb-6 text-center">
            Festival Travel Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f5f7f5] rounded-xl p-4">
              <h3 className="font-bold text-[#004525] mb-2">Book Early</h3>
              <p className="text-sm text-gray-700">Accommodation fills up quickly during major festivals</p>
            </div>
            <div className="bg-[#f5f7f5] rounded-xl p-4">
              <h3 className="font-bold text-[#004525] mb-2">Attire</h3>
              <p className="text-sm text-gray-700">Wear comfortable shoes and modest clothing for church ceremonies</p>
            </div>
            <div className="bg-[#f5f7f5] rounded-xl p-4">
              <h3 className="font-bold text-[#004525] mb-2">Photography</h3>
              <p className="text-sm text-gray-700">Ask permission before taking photos of people, especially during ceremonies</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}