// components/HomePage/Testimonials.tsx
'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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

const testimonials = [
  {
    name: 'Eleanor Thorne',
    role: 'Travel Journalist',
    quote: '"The level of detail and care Mystery Land Tours puts into their itineraries is unmatched. I\'ve traveled the globe for 20 years, and their Ethiopia tour was a revelation."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA16qSoXdGbrZe6f-ZehWollKsmu7TKnzQ7z_ZGR7K0cyr_3kud5T0gtYfgOQtYbnr-BqZ6kwCSu5YW6fVZNrdCgy9Lz1Ygz1mJ0G5r5APyWbm0qM0QMxHueTK1SxZ_aM9O2nuTIoVqydNPVXDj3goC1cpkDmuG5f3H4_418A_uOZvr8BQkKgP7iWlLUx_QhEkTNA05ybVuyZdTziHQw5tUuHNL3STbGeUBUofXo-DvD9ZQdvtl-C3lfQ',
  },
  {
    name: 'Marcus Chen',
    role: 'Photography Enthusiast',
    quote: '"Getting into the Simien Mountains as the sun rose without any other tourists around was a dream come true. Their \'hidden wonders\' promise is absolutely real."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOImArHLT3jU-rP3A4OX19zscSiRZrZhDA1eiWQ7yt-Jre0DBSEy0u_kqMkTG1KNM9TEWs5aaInF8wnvwzixCD8kWmWXvzp8s-G0UEtxF9w5iBP2qgxyeKPnjASAUR5Y7l_W0Nre83oVBWIa4FTXam8Y31RBEJYdbx97-l65v_4cq6AHaFpW2aEoPN1gdIdMTNDzfQL4s_n69a5MOmYyAvovrGMPYZJtzZ216VqQmfOLEtyeE-vNgSMg',
  },
  {
    name: 'The Sterling Family',
    role: 'World Explorers',
    quote: '"Finally, a tour company that understands both the need for adventure and the desire for true comfort. Every accommodation in Ethiopia was more stunning than the last."',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA06YJJae7o08Symjc7tX0Laadue9569MWOUvVQ88sdFiFClJ5RtkbooOlCqF5wQETCZlFVG3jYAi-A4TC26lN3NTQhS7AHMELJ_U9atZqIOMAFsZxN6z3vZ8JIScsTn8bVfq0ayjGMefPqvXAXpLrZAvGrDQGpxAII37MoO3R_UrLzBHnm9lNQRS6wOtbMdqt8mxmb-pyKeXZpuff_HM6OXJNWAupTum0B70xOPGykxrRPD8oXegFjvw',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#004525] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="font-['Playfair_Display'] text-4xl font-semibold mb-12 text-center text-[#95d5a8]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Voices from the Path
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-[#1f5d3a] p-6 rounded-xl border border-white/10 hover-lift"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#ffe088] overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                </div>
                <div>
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-xs text-[#94d4a7] opacity-80 uppercase">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-base italic leading-relaxed">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}