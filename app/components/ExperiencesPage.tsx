// components/ExperiencesPage.tsx
'use client';

import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiUsers,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiCoffee,
} from 'react-icons/fi';
import {
  IoPeopleOutline,
  IoRestaurantOutline,
  IoCameraOutline,
} from 'react-icons/io5';
import {
  GiChurch,
  GiLion,
  GiCoffeeBeans,
  GiMountains,
  GiMeditation,
  GiCookingPot,
  GiTeacher,
  GiMusicalNotes,
  GiDrum,
} from 'react-icons/gi';
import {
  FaHeart,
  FaStar,
  FaUtensils,
  FaPaintBrush,
  FaDrum,
  FaFeather,
} from 'react-icons/fa';
import { MdOutlineTerrain, MdHistory, MdSelfImprovement } from 'react-icons/md';
import { RiAncientPavilionLine, RiBuilding4Line } from 'react-icons/ri';
import Header from './Header';
import Footer from './Footer';

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

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      title: 'Lalibela Church Ceremony & Spiritual Retreat',
      category: 'Spiritual & Cultural',
      location: 'Lalibela, Ethiopia',
      price: '$1,299',
      rating: 4.9,
      duration: '3 Days',
      maxGroup: 8,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Sacred Journey',
      icon: GiChurch,
      description: 'Participate in ancient Orthodox ceremonies and witness the breathtaking rock-hewn churches at dawn.',
    },
    {
      id: 2,
      title: 'Omo Valley Tribal Immersion',
      category: 'Cultural Exchange',
      location: 'Omo Valley, Ethiopia',
      price: '$2,499',
      rating: 4.8,
      duration: '5 Days',
      maxGroup: 6,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Authentic Encounter',
      icon: IoPeopleOutline,
      description: 'Live alongside indigenous tribes, learning ancient traditions, body art, and sustainable practices.',
    },
    {
      id: 3,
      title: 'Simien Mountains Wildlife Trek & Camping',
      category: 'Adventure & Nature',
      location: 'Simien Mountains, Ethiopia',
      price: '$1,899',
      rating: 4.9,
      duration: '4 Days',
      maxGroup: 10,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Wildlife Adventure',
      icon: GiMountains,
      description: 'Trek through dramatic landscapes, spot Gelada baboons, and camp under the stars in Africa\'s roof.',
    },
    {
      id: 4,
      title: 'Ethiopian Coffee Ceremony & Cuisine Class',
      category: 'Culinary & Traditions',
      location: 'Addis Ababa, Ethiopia',
      price: '$299',
      rating: 4.7,
      duration: '1 Day',
      maxGroup: 12,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Culinary Journey',
      icon: GiCoffeeBeans,
      description: 'Learn the ancient coffee ceremony and master traditional Ethiopian dishes like injera and doro wat.',
    },
    {
      id: 5,
      title: 'Lake Tana Monastery Boat Tour',
      category: 'Spiritual & Cultural',
      location: 'Lake Tana, Ethiopia',
      price: '$899',
      rating: 4.8,
      duration: '2 Days',
      maxGroup: 8,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Ancient History',
      icon: RiAncientPavilionLine,
      description: 'Explore ancient island monasteries with their priceless religious artifacts and stunning murals.',
    },
    {
      id: 6,
      title: 'Traditional Ethiopian Music & Dance Night',
      category: 'Performing Arts',
      location: 'Addis Ababa, Ethiopia',
      price: '$149',
      rating: 4.6,
      duration: '1 Evening',
      maxGroup: 20,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Cultural Celebration',
      icon: GiDrum,
      description: 'Experience an unforgettable evening of traditional Ethiopian music, mesmerising dance, and cultural stories.',
    },
    {
      id: 7,
      title: 'Rift Valley Wildlife Photography Safari',
      category: 'Wildlife & Photography',
      location: 'Rift Valley, Ethiopia',
      price: '$3,299',
      rating: 4.9,
      duration: '6 Days',
      maxGroup: 6,
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
      tag: 'Photography Masterclass',
      icon: IoCameraOutline,
      description: 'Capture extraordinary wildlife and landscapes with expert guides in Ethiopia\'s stunning Rift Valley.',
    },
    {
      id: 8,
      title: 'Ancient Ark of the Covenant Pilgrimage',
      category: 'Religious Heritage',
      location: 'Axum, Ethiopia',
      price: '$2,199',
      rating: 4.9,
      duration: '4 Days',
      maxGroup: 6,
      image: 'https://images.unsplash.com/photo-1564246558139-90b78d79e5c6?w=800&q=80',
      tag: 'Religious Pilgrimage',
      icon: RiBuilding4Line,
      description: 'Follow the ancient footsteps to the legendary Ark of the Covenant in the sacred city of Axum.',
    },
  ];

  const featuredCategories = [
    { name: 'Cultural Immersion', icon: IoPeopleOutline, color: '#004525' },
    { name: 'Wildlife Safaris', icon: GiLion, color: '#735c00' },
    { name: 'Culinary Arts', icon: GiCookingPot, color: '#cca830' },
    { name: 'Spiritual Journeys', icon: MdSelfImprovement, color: '#1f5d3a' },
  ];

  return (
    <>
      <Header />
      <main className="pt-32 pb-20 overflow-x-hidden">
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
              <FiAward size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Transform Your Journey
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
            >
              Beyond the <span className="italic text-[#735c00]">Ordinary</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-lg text-[#404942]"
            >
              Immerse yourself in Ethiopia's rich tapestry of ancient traditions, breathtaking landscapes, and warm hospitality.
            </motion.p>
          </motion.div>
        </section>

        {/* Featured Categories */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer"
                style={{ borderColor: `${category.color}20` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${category.color}10` }}
                >
                  <category.icon size={28} style={{ color: category.color }} />
                </div>
                <h4 className="font-semibold text-sm text-[#004525]">
                  {category.name}
                </h4>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Experiences Grid */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
            <div>
              <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#004525]">
                Curated Experiences
              </h2>
              <p className="text-[#404942]">Handpicked adventures that connect you to the soul of Ethiopia.</p>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-full border border-[#707971] flex items-center justify-center text-[#004525] hover:bg-[#004525] hover:text-white transition-all">
                <FiChevronLeft size={24} />
              </button>
              <button className="w-12 h-12 rounded-full border border-[#707971] flex items-center justify-center text-[#004525] hover:bg-[#004525] hover:text-white transition-all">
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-xl h-[460px] shadow-[0px_10px_30px_rgba(31,93,58,0.08)] transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${exp.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004525]/90 via-[#004525]/20 to-transparent" />

                <div className="absolute top-4 right-4 z-10">
                  <button className="bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-[#004525] transition-all">
                    <FiHeart size={20} />
                  </button>
                </div>

                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#ffe088] text-[#241a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {exp.tag}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <exp.icon size={16} className="text-[#ffe088]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#ffe088]/80">
                      {exp.category}
                    </span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-1 leading-tight">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 mb-3">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
                    <div className="flex items-center gap-1">
                      <FiMapPin size={14} /> {exp.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={14} /> {exp.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} /> Max {exp.maxGroup}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <FaStar size={14} className="text-[#ffe088]" />
                        <span className="font-bold text-sm">{exp.rating}</span>
                      </div>
                      <span className="text-xs text-white/60">•</span>
                      <span className="font-['Playfair_Display'] text-2xl font-bold">
                        {exp.price}
                      </span>
                    </div>
                    <button className="bg-white text-[#004525] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#ffe088] transition-all">
                      Book Experience
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Newsletter / CTA */}
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-[#004525] p-8 md:p-12 rounded-[48px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <GiCoffeeBeans size={160} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left max-w-xl">
                <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-white mb-3">
                  Craft Your Own Adventure
                </h2>
                <p className="text-white/80 text-lg">
                  Work with our expert concierge to design a bespoke Ethiopian experience tailored to your passions.
                </p>
              </div>
              <button className="bg-[#ffe088] text-[#004525] px-8 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform whitespace-nowrap">
                Start Planning
              </button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}