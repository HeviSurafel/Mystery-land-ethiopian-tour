'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiClock, FiMap, FiBook, FiFlag } from 'react-icons/fi';

export default function HistoryPage() {
  const historicalPeriods = [
    {
      title: 'Axumite Empire',
      period: '100 - 940 AD',
      description: 'The Axumite Empire was a powerful trading civilization that controlled the Red Sea trade routes. It was one of the four great powers of its time, alongside Rome, China, and Persia. The empire is known for its obelisks and as the birthplace of Ethiopian Christianity.',
      icon: FiMap,
      image: '/Images/axum.jpg',
      alt: 'Axumite Empire obelisks and ruins'
    },
    {
      title: 'Zagwe Dynasty',
      period: '900 - 1270 AD',
      description: 'The Zagwe dynasty is famous for the rock-hewn churches of Lalibela, which are considered one of the wonders of the world. These monumental structures were carved out of solid rock and remain a testament to architectural brilliance.',
      icon: FiBook,
      image: '/Images/lalibela.jpg',
      alt: 'Rock-hewn churches of Lalibela'
    },
    {
      title: 'Solomonic Dynasty',
      period: '1270 - 1974 AD',
      description: 'The Solomonic dynasty claimed descent from King Solomon and the Queen of Sheba. This period saw the rise and fall of various emperors, including the famous Emperor Haile Selassie, and the country\'s modernization efforts.',
      icon: FiFlag,
      image: '/Images/gondar.jpg',
      alt: 'Fasil Ghebbi castle in Gondar'
    },
    {
      title: 'Modern Ethiopia',
      period: '1974 - Present',
      description: 'Modern Ethiopian history includes the fall of the monarchy, the Derg regime, the Eritrean-Ethiopian conflict, and current development initiatives. Ethiopia has emerged as one of Africa\'s fastest-growing economies.',
      icon: FiClock,
      image: '/Images/addis1.webp',
      alt: 'Modern Addis Ababa cityscape'
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
            Ethiopian History
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Journey through thousands of years of Ethiopian civilization and heritage
          </motion.p>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#004525]/20 hidden md:block" />
          
          {historicalPeriods.map((period, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative mb-12 md:mb-20 ${
                index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
              }`}
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <period.icon className="text-3xl text-[#004525]" />
                      <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#004525]">
                        {period.title}
                      </h2>
                    </div>
                    <p className="text-[#004525] font-semibold text-sm mb-3">{period.period}</p>
                    <p className="text-gray-700 leading-relaxed">{period.description}</p>
                  </div>
                </div>
                <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={period.image}
                      alt={period.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                          fallback.innerHTML = `
                            <div class="text-center">
                              <div class="text-6xl text-[#004525]/30 mx-auto mb-2">${period.icon({ className: 'text-6xl' })}</div>
                              <p class="text-gray-500 text-sm">Image not available</p>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#004525] rounded-full border-4 border-white shadow-md hidden md:block" />
            </motion.div>
          ))}
        </div>

        {/* Historical Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-[#004525] text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">
            Historical Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🗿</div>
              <h3 className="font-bold mb-2">Rock-Hewn Churches</h3>
              <p className="text-sm text-white/80">11 monolithic churches in Lalibela</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🏯</div>
              <h3 className="font-bold mb-2">Fasil Ghebbi</h3>
              <p className="text-sm text-white/80">Ancient fortress city in Gondar</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">📜</div>
              <h3 className="font-bold mb-2">Kebra Nagast</h3>
              <p className="text-sm text-white/80">Ancient Ethiopian epic text</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}