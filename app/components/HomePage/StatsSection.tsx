// components/HomePage/StatsSection.tsx
'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '10,000+', label: 'Happy Travelers' },
  { value: '120+', label: 'Destinations' },
  { value: '500+', label: 'Luxury Partners' },
  { value: '15+', label: 'Years Experience' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525]">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-[#707971] uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}