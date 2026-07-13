// components/TermsOfServicePage.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiChevronRight, FiFileText, FiCheckCircle, FiAlertCircle, FiDollarSign, FiUsers, FiMapPin } from 'react-icons/fi';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TermsOfServicePage() {
  const sections = [
    {
      id: 'acceptance',
      icon: <FiCheckCircle size={24} />,
      title: 'Acceptance of Terms',
      content: `
        By using our website and services, you agree to comply with these terms and conditions. 
        If you do not agree, please do not use our services.

        These terms apply to all users of our website, including tour bookings, account creation, 
        and any other interactions with our services.
      `,
    },
    {
      id: 'bookings',
      icon: <FiMapPin size={24} />,
      title: 'Tour Bookings & Payments',
      content: `
        • All bookings are subject to availability
        • A deposit is required to confirm bookings
        • Final payment is due 30 days before departure
        • Payments are processed securely through our payment partners
        • Prices are in USD unless otherwise stated
        • We reserve the right to adjust prices due to currency fluctuations or unforeseen circumstances
      `,
    },
    {
      id: 'cancellations',
      icon: <FiAlertCircle size={24} />,
      title: 'Cancellation Policy',
      content: `
        • 60+ days before departure: Full refund minus 10% processing fee
        • 30-59 days before departure: 50% refund
        • 15-29 days before departure: 25% refund
        • 14 days or less: No refund
        • Trip interruption or cancellation insurance is strongly recommended
        • We reserve the right to cancel tours due to safety concerns or minimum participant requirements
      `,
    },
    {
      id: 'liability',
      icon: <FiFileText size={24} />,
      title: 'Liability & Responsibility',
      content: `
        • We act as a tour operator and service provider
        • We are not responsible for delays, changes, or losses caused by events beyond our control
        • Participants are responsible for their own health and safety
        • Travel insurance is mandatory for all participants
        • We reserve the right to refuse service to anyone for safety or behavioral reasons
      `,
    },
    {
      id: 'user-obligations',
      icon: <FiUsers size={24} />,
      title: 'User Obligations',
      content: `
        • You agree to provide accurate and complete information
        • You are responsible for maintaining account confidentiality
        • You agree not to misuse our website or services
        • You agree to comply with local laws and regulations
        • You agree to respect local cultures and traditions
      `,
    },
  ];

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full mb-4"
          >
            <FiFileText size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Terms & Conditions
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#004525] mb-4"
          >
            Terms of <span className="italic text-[#735c00]">Service</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg text-[#404942]"
          >
            Last Updated: {lastUpdated}
          </motion.p>
        </motion.div>
      </section>

      {/* Breadcrumb */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-[#707971]">
          <Link href="/" className="hover:text-[#004525] transition-colors">
            Home
          </Link>
          <FiChevronRight size={14} />
          <span className="text-[#004525] font-medium">Terms of Service</span>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="space-y-8"
        >
          {/* Introduction */}
          <motion.div
            variants={fadeInUp}
            className="bg-[#f8f9ff] p-8 rounded-2xl border border-[#c0c9bf]/30"
          >
            <p className="text-[#404942] leading-relaxed">
              Welcome to <span className="font-semibold text-[#004525]">Mystery Land Ethiopia Tours</span>. 
              By booking with us or using our website, you agree to these terms and conditions. 
              Please read them carefully before making any bookings.
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={fadeInUp}
              className="bg-white p-8 rounded-2xl shadow-[0px_10px_30px_rgba(31,93,58,0.06)] border border-[#c0c9bf]/20 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#004525]/10 p-3 rounded-xl text-[#004525] flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-3">
                    {section.title}
                  </h2>
                  <div className="text-[#404942] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Update Notice */}
          <motion.div
            variants={fadeInUp}
            className="bg-[#004525] p-8 rounded-2xl text-white text-center"
          >
            <p className="text-white/80 text-sm">
              These terms were last updated on {lastUpdated}. We reserve the right to modify 
              these terms at any time. Please check this page periodically for changes.
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            variants={fadeInUp}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#004525] hover:text-[#1f5d3a] transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}