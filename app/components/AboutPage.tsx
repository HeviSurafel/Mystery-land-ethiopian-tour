// components/AboutPage.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiMapPin, 
  FiUsers, 
  FiAward, 
  FiCompass, 
  FiHeart, 
  FiShield, 
  FiGlobe,
  FiMail,
  FiPhone,
  FiNavigation,
  FiUser
} from 'react-icons/fi';
import { 
  GiMountains, 
  GiChurch, 
  GiCoffeeBeans, 
  GiLion, 
  GiHut,
  GiDesert
} from 'react-icons/gi';
import { MdOutlineExplore, MdHistoryEdu } from 'react-icons/md';
import { FaHandsHelping, FaStar } from 'react-icons/fa';

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

export default function AboutPage() {
  // Owner/Founder data
  const owner = {
    name: 'Abselam',
    role: 'Founder & Lead Tour Guide',
    image: '/Images/abeselam.jpg',
    alt: 'Abselam - Founder of Mystery Land Ethiopia Tours',
    description: 'With over 10 years of experience, Abselam has dedicated his life to sharing the beauty and culture of Ethiopia with travelers from around the world.'
  };

  // Tour attractions data
  const attractions = [
    {
      icon: <GiHut size={32} />,
      title: 'Omo Valley Tribes',
      description: 'Meet the Mursi, Hamar, and Karo peoples.',
      color: 'bg-amber-500/10 text-amber-700'
    },
    {
      icon: <GiChurch size={32} />,
      title: "Lalibela's Sacred Wonders",
      description: 'Walk through the legendary rock-hewn churches.',
      color: 'bg-purple-500/10 text-purple-700'
    },
    {
      icon: <GiDesert size={32} />,
      title: 'Danakil Depression Expedition',
      description: 'Witness one of Earth\'s most surreal landscapes.',
      color: 'bg-orange-500/10 text-orange-700'
    },
    {
      icon: <GiMountains size={32} />,
      title: 'Bale Mountains National Park',
      description: 'Hike through lush forests and spot endemic species.',
      color: 'bg-green-500/10 text-green-700'
    },
    {
      icon: <MdHistoryEdu size={32} />,
      title: "Gondar's Imperial Castles",
      description: 'Explore the "Camelot of Africa."',
      color: 'bg-blue-500/10 text-blue-700'
    },
    {
      icon: <FaStar size={32} />,
      title: 'Ethiopian Festivals Tour',
      description: 'Celebrate Timket, Meskel, and more.',
      color: 'bg-yellow-500/10 text-yellow-700'
    },
  ];

  // Why travel with us points
  const whyUs = [
    {
      icon: <FiMapPin size={24} />,
      title: 'Locally Owned & Operated',
      description: 'Founded by Abselam, a native of Arbaminch who knows Ethiopia like the back of his hand.'
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Experienced Tour Guide',
      description: 'More than a decade of guiding individual and group tours across Ethiopia.'
    },
    {
      icon: <FiCompass size={24} />,
      title: 'Tailor-Made Itineraries',
      description: 'Customized trips that match your interests, time, and travel style.'
    },
    {
      icon: <FaHandsHelping size={24} />,
      title: 'Cultural Sensitivity',
      description: 'We believe in responsible and ethical tourism, especially in culturally sensitive regions like the Omo Valley.'
    },
    {
      icon: <FiShield size={24} />,
      title: 'Safety & Comfort',
      description: 'We prioritize your safety and comfort throughout your trip.'
    },
  ];

  return (
    <main className="pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
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
            <FiCompass size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Welcome to Mystery Land Ethiopia Tours
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
          >
            Discover the <span className="italic text-[#735c00]">Heart</span> of Ethiopia
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-lg text-[#404942] leading-relaxed"
          >
            Founded by <span className="font-semibold text-[#004525]">Abselam</span>, a passionate and experienced tour guide based in Arbaminch, 
            we are dedicated to delivering unforgettable, authentic, and culturally rich travel experiences across the diverse landscapes of Ethiopia.
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg text-[#404942] mt-4 italic"
          >
            Discover the Beauty of Borena with Us!
          </motion.p>
        </motion.div>
      </section>

      {/* Founder/Owner Section */}
      <section className="bg-[#f8f9ff] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#004525]/10 rounded-full mb-4">
                <FiUser className="text-[#004525]" size={16} />
                <span className="text-xs font-semibold text-[#004525] uppercase tracking-wider">
                  Meet Your Guide
                </span>
              </div>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-2">
                {owner.name}
              </h2>
              <p className="text-[#735c00] text-lg font-semibold mb-4">{owner.role}</p>
              <p className="text-[#404942] text-lg leading-relaxed mb-6">
                {owner.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-[#404942]">
                  <FiMapPin className="text-[#004525]" />
                  <span>Based in Arbaminch, Ethiopia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#404942]">
                  <FiAward className="text-[#004525]" />
                  <span>10+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#404942]">
                  <FiGlobe className="text-[#004525]" />
                  <span>Guided 1000+ Travelers</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="order-1 lg:order-2 relative h-[400px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src={owner.image}
                alt={owner.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = 'relative h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-2xl font-bold';
                    parent.innerHTML = `
                      <div class="text-center">
                        <div class="text-6xl mb-4">👤</div>
                        <div class="font-['Playfair_Display']">${owner.name}</div>
                        <div class="text-sm text-white/70">${owner.role}</div>
                      </div>
                    `;
                  }
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
                Over 10 Years of{' '}
                <span className="italic text-[#735c00]">Excellence</span>
              </h2>
              <p className="text-[#404942] text-lg leading-relaxed mb-4">
                With over 10 years of hands-on experience in guiding travelers through the wonders of Ethiopia, 
                Abselam has turned his deep-rooted knowledge, local connections, and love for storytelling 
                into a professional and personalized tour service.
              </p>
              <p className="text-[#404942] text-lg leading-relaxed">
                His expertise spans the lush highlands, the mystical Omo Valley, the Great Rift Valley lakes, 
                and the country's vibrant historic and tribal regions.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src="/Images/about-hero.jpg"
                alt="Ethiopian landscape"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = 'relative h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-2xl font-bold';
                    parent.textContent = '🌍 Discover Ethiopia';
                  }
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section className="bg-[#f8f9ff] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
              Why Travel With Us?
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {whyUs.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl shadow-[0px_10px_30px_rgba(31,93,58,0.08)] hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="bg-[#004525]/10 w-14 h-14 rounded-full flex items-center justify-center text-[#004525] mb-4">
                  {item.icon}
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#404942] text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tour Attractions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
              Our Popular Tour <span className="italic text-[#735c00]">Attractions</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {attractions.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${item.color} p-6 rounded-2xl transition-all hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525]">
                      {item.title}
                    </h3>
                    <p className="text-[#404942] text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-[#004525] p-8 md:p-12 rounded-[48px] relative overflow-hidden text-center text-white"
          >
            <div className="absolute top-0 right-0 opacity-5">
              <FiCompass size={120} className="text-white" />
            </div>
            <div className="relative z-10">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold mb-4">
                Begin Your Adventure With Us
              </h2>
              <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
                Don't wait — experience the adventure of a lifetime. Let Mystery Land Ethiopia Tours 
                lead you into the hidden treasures of Ethiopia — a land of ancient mysteries, 
                vibrant cultures, breathtaking landscapes, and unforgettable people.
              </p>
              <p className="text-white/90 font-['Playfair_Display'] text-xl mb-8">
                Discover the Real Ethiopia with Us. Your Journey Starts Here.
              </p>
              <Link href="/tours">
                <button className="bg-[#ffe088] text-[#004525] px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg">
                  START THE JOURNEY
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#f8f9ff] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
              Get In <span className="italic text-[#735c00]">Touch</span>
            </h2>
            <p className="text-[#404942] text-lg max-w-2xl mx-auto">
              Ready to explore Ethiopia? Contact us to start planning your unforgettable journey.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl text-center shadow-[0px_10px_30px_rgba(31,93,58,0.08)]"
            >
              <div className="bg-[#004525]/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004525]">
                <FiPhone size={24} />
              </div>
              <h3 className="font-semibold text-[#004525] mb-2">Phone</h3>
              <a href="tel:+251916712096" className="text-[#404942] hover:text-[#004525] transition-colors">
                +251916712096
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl text-center shadow-[0px_10px_30px_rgba(31,93,58,0.08)]"
            >
              <div className="bg-[#004525]/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004525]">
                <FiMail size={24} />
              </div>
              <h3 className="font-semibold text-[#004525] mb-2">Email</h3>
              <a href="mailto:info@mysterylandethiopiatour.com" className="text-[#404942] hover:text-[#004525] transition-colors break-all">
                info@mysterylandethiopiatour.com
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl text-center shadow-[0px_10px_30px_rgba(31,93,58,0.08)]"
            >
              <div className="bg-[#004525]/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004525]">
                <FiNavigation size={24} />
              </div>
              <h3 className="font-semibold text-[#004525] mb-2">Address</h3>
              <p className="text-[#404942]">
                Arbaminch, Southern Ethiopia
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}