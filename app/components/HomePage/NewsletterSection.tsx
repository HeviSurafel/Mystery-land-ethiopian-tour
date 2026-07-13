// components/HomePage/NewsletterSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function NewsletterSection() {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto glass-card rounded-2xl p-6 md:p-12 border-[#735c00]/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Mail size={160} className="text-[#735c00] rotate-12" />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-3">
            The Traveler&apos;s Journal
          </h2>
          <p className="text-lg text-[#404942] mb-6">
            Exclusive offers, hidden destination guides, and luxury travel
            tips delivered to your inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-6 max-w-xl mx-auto">
            <input
              className="flex-grow bg-white border border-[#c0c9bf] rounded-full px-6 py-4 focus:ring-2 focus:ring-[#004525] focus:border-transparent outline-none"
              placeholder="Your email address"
              type="email"
            />
            <button
              className="bg-[#735c00] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-[#cca830] transition-colors shadow-lg active:scale-95"
              type="submit"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs font-semibold text-[#404942] mt-4 opacity-60">
            Join 50,000+ world travelers. Unsubscribe at any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}