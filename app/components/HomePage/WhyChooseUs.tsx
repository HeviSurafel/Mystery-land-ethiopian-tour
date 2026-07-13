// components/HomePage/WhyChooseUs.tsx
'use client';

import { motion } from 'framer-motion';
import { User, Shield, Headphones } from 'lucide-react';

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

const features = [
  {
    icon: <User size={40} />,
    title: 'Expert Guides',
    desc: 'Local historians and adventure specialists who bring every location to life with stories and secrets.',
  },
  {
    icon: <Shield size={40} />,
    title: 'Safe Travel',
    desc: 'Comprehensive insurance and real-time support ensure your journey is as secure as it is exciting.',
  },
  {
    icon: <Headphones size={40} />,
    title: '24/7 Support',
    desc: 'A dedicated concierge is always one call away, ready to assist with any request, anywhere in the world.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#eff4ff] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-6">
            Why Choose Mystery Land
          </h2>
          <p className="text-lg text-[#404942]">
            We prioritize your safety and comfort without compromising on the
            thrill of genuine discovery.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center p-6 glass-card rounded-xl hover-lift border-[#004525]/10"
            >
              <div className="bg-[#004525]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#004525]">
                {item.icon}
              </div>
              <h4 className="font-['Playfair_Display'] text-2xl font-semibold mb-3 text-[#004525]">
                {item.title}
              </h4>
              <p className="text-base text-[#404942]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#004525]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#735c00]/5 rounded-full blur-3xl" />
    </section>
  );
}