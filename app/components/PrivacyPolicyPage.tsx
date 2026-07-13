// components/PrivacyPolicyPage.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiChevronRight, FiShield, FiLock, FiEye, FiDatabase, FiMail, FiUserCheck, FiGlobe } from 'react-icons/fi';

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

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'information-collection',
      icon: <FiDatabase size={24} />,
      title: 'Information We Collect',
      content: `
        We collect information you provide directly to us when you:
        • Book a tour or experience
        • Create an account
        • Subscribe to our newsletter
        • Contact us with questions
        • Participate in surveys or promotions

        This may include:
        • Name and contact information (email, phone, address)
        • Payment information
        • Travel preferences and requirements
        • Emergency contact details
        • Special requests or dietary needs
      `,
    },
    {
      id: 'how-we-use',
      icon: <FiEye size={24} />,
      title: 'How We Use Your Information',
      content: `
        We use your information to:
        • Process bookings and payments
        • Provide travel services and support
        • Send booking confirmations and updates
        • Personalize your travel experience
        • Send marketing communications (with your consent)
        • Improve our services and website
        • Comply with legal obligations
      `,
    },
    {
      id: 'information-sharing',
      icon: <FiUserCheck size={24} />,
      title: 'Information Sharing',
      content: `
        We may share your information with:
        • Local tour operators and guides
        • Accommodation providers
        • Transportation services
        • Payment processors
        • Legal authorities when required by law

        We require all third parties to respect your privacy and comply with data protection laws.
      `,
    },
    {
      id: 'data-security',
      icon: <FiLock size={24} />,
      title: 'Data Security',
      content: `
        We implement appropriate technical and organizational measures to protect your personal information, including:
        • SSL encryption for data transmission
        • Secure servers and databases
        • Access controls and authentication
        • Regular security assessments
        • Staff training on data protection
      `,
    },
    {
      id: 'your-rights',
      icon: <FiShield size={24} />,
      title: 'Your Rights',
      content: `
        Under applicable data protection laws, you have the right to:
        • Access your personal information
        • Correct inaccurate information
        • Request deletion of your data
        • Object to processing
        • Data portability
        • Withdraw consent at any time
      `,
    },
    {
      id: 'cookies',
      icon: <FiGlobe size={24} />,
      title: 'Cookies & Tracking',
      content: `
        We use cookies and similar technologies to:
        • Enhance your browsing experience
        • Analyze website traffic and usage
        • Personalize content and ads
        • Remember your preferences

        You can control cookie settings through your browser preferences.
      `,
    },
    {
      id: 'contact',
      icon: <FiMail size={24} />,
      title: 'Contact Us',
      content: `
        If you have questions about this privacy policy or our data practices, please contact us:

        Email: info@mysterylandethiopiatour.com
        Phone: +251 972597270
        Address: Arbaminch, Southern Ethiopia
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
            <FiShield size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Your Privacy Matters
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#004525] mb-4"
          >
            Privacy <span className="italic text-[#735c00]">Policy</span>
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
          <span className="text-[#004525] font-medium">Privacy Policy</span>
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
              At <span className="font-semibold text-[#004525]">Mystery Land Ethiopia Tours</span>, we are committed to protecting 
              your privacy and ensuring the security of your personal information. This privacy policy explains 
              how we collect, use, and safeguard your data when you interact with our services.
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
              This privacy policy was last updated on {lastUpdated}. We may update this policy from time 
              to time. Please check this page periodically for any changes.
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