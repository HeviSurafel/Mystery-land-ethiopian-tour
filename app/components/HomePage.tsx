// components/HomePage.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  MapPin,
  Compass,
  User,
  Shield,
  Headphones,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPinIcon,
  Facebook,
  Instagram,
  Share2,
  Star,
  Sparkles,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

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

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              className="w-full h-full bg-cover bg-center transition-transform duration-[10s] scale-105 hover:scale-100"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0HGZZVJH9MddLFJi0qXdxn0ryMEfbFAPkdICs5lLmPnfuEpr1iF0kw80aW0atKudDtP7eg3xU6Jd68SNZ9ENrg28VbVrbP1gnzR3oB3RQdVdAkhcOZIhbUnABg6NeH0yU1LLNQ26T63VT0BsN5BnbIT82Lz5DESGZg-IB1CYY0UAYz-lmtZRKIc0QiimptasEX2aZajrAUOlnmdZyMWnrba12XJw4UFuiNLyRsHyOrl7LUsa5FP62RA")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-container-max mx-auto px-lg w-full">
            <motion.div
              className="max-w-2xl text-white"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block mb-md bg-tertiary-fixed text-on-tertiary-fixed px-sm py-xs rounded-lg font-label-md text-label-md tracking-widest uppercase"
              >
                The Extraordinary Awaits
              </motion.span>
              <motion.h1
                variants={fadeInUp}
                className="font-display-lg text-display-lg-mobile md:text-display-lg mb-md leading-tight"
              >
                Discover Hidden Wonders Around the World
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="font-body-lg text-body-lg mb-lg text-white/90"
              >
                Adventure begins where the ordinary ends. Experience curated
                journeys to the world&apos;s most exclusive and untouched
                locations.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-md"
              >
                <button className="bg-primary text-on-primary px-xl py-md rounded-full font-label-md text-label-md hover:scale-105 transition-transform shadow-lg flex items-center gap-base">
                  Explore Tours
                  <ArrowRight size={20} />
                </button>
                <button className="glass-card text-white border-white/40 px-xl py-md rounded-full font-label-md text-label-md hover:bg-white/20 transition-all">
                  Plan Your Journey
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-xs text-white/60 animate-bounce">
            <span className="text-label-sm font-label-sm uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown size={24} />
          </div>
        </section>

        {/* Filter / Search Section */}
        <section className="relative z-20 -mt-16 px-lg max-w-container-max mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-xl p-lg grid grid-cols-1 md:grid-cols-4 gap-gutter border border-outline-variant"
          >
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-outline uppercase flex items-center gap-xs">
                <MapPin size={18} />
                Destinations
              </label>
              <select className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-primary text-body-md py-sm">
                <option>Where to go?</option>
                <option>Tuscany, Italy</option>
                <option>Kyoto, Japan</option>
                <option>Serengeti, Tanzania</option>
                <option>Patagonia, Chile</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-outline uppercase flex items-center gap-xs">
                <Compass size={18} />
                Tour Type
              </label>
              <select className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-primary text-body-md py-sm">
                <option>All Types</option>
                <option>Eco-Luxury</option>
                <option>Adventure</option>
                <option>Cultural</option>
                <option>Private Retreat</option>
              </select>
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-label-sm text-outline uppercase flex items-center gap-xs">
                <Calendar size={18} />
                Duration
              </label>
              <select className="w-full bg-surface-container-lowest border-none rounded-lg focus:ring-primary text-body-md py-sm">
                <option>Any Duration</option>
                <option>1-5 Days</option>
                <option>1-2 Weeks</option>
                <option>Month+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors flex justify-center items-center gap-base h-[44px]">
                Find Tours
              </button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-xl bg-surface-bright">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
              {[
                { value: '10,000+', label: 'Happy Travelers' },
                { value: '120+', label: 'Destinations' },
                { value: '500+', label: 'Luxury Partners' },
                { value: '15+', label: 'Years Experience' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="font-headline-lg text-primary">{stat.value}</p>
                  <p className="text-label-md font-label-md text-outline uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-xl px-lg max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Popular Destinations
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-md">
                Our most sought-after retreats chosen by discerning travelers
                worldwide.
              </p>
            </div>
            <a
              className="hidden md:flex items-center gap-xs text-primary font-label-md text-label-md hover:underline"
              href="#"
            >
              View All Destinations
              <ArrowUpRight size={20} />
            </a>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                title: 'Tuscany, Italy',
                region: 'Europe',
                price: '$3,200',
                rating: '4.9',
                days: '7 Days',
                type: 'Eco-Luxury',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAvvzSGhqrUNifGjwLS6--JpTsx4MzM9shGC8SgXAYMaUvHeKyTqMJpolkzWQ-cL2zGmh11YD6ddwxx1m-E6QGnUdDgDb4ILPaSdk8Jara0Mtd4bhAPI9GZT_qbpX7UGeXllfX1on_L3EmWe21XIi5gv4bAfK2x6XNT3nPK7HGFFVXfGLrIkG8vbVk66hJjrWuE9mzVaxaKa3zqXoP46xF0LeBpYVKy-v0967U4KaODYtdpDThlPTi-rA',
              },
              {
                title: 'Kyoto, Japan',
                region: 'Asia',
                price: '$4,500',
                rating: '5.0',
                days: '10 Days',
                type: 'Cultural',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBVF6_DZC8lYdyYip4LoWuQgsqSaeIQppublrWqPRq4I8-Qvs6QiCLSluN-zD-of1XQvBNy7trmt-ZnWX5LUKVpPHyp4TT0hKnBMwSY0RzZoumFTLqWKdNjGslS4IJQMApQIDQF_Rhiz-iOET4gqexQ_UxaKN-0mX-yq933T9SLuBku2DsAGDv5yA1NPrN7CQpvpk4isTzQ3MD8iOJFVgK5yHkiEHa3wDXSdjxMeBkkqPHG3WjtP8yRTw',
              },
              {
                title: 'Serengeti, Tanzania',
                region: 'Africa',
                price: '$5,800',
                rating: '4.8',
                days: '12 Days',
                type: 'Adventure',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOTYBoaXruVeSl9X9AwxcZIFfqaa0yu6KJDuNVAZ7Mgld8EXvccPuxgSurlk95qBcDpodj6D78M69e6WiAy9Zgxx701ItP4FwAINzEBE3u4rbWlRaKfkwqvv-SaOOCteW03-M6zVn1hnB6BkNtrsG7lhcNeInqSE9sTfQjAJPavUzrQTkiDjFg8oedV2y2rYmjgRa8fCF-abhJHYemS3VzeExDG0DPsF4HyTjPmQBh58aE0bpefdbieA',
              },
            ].map((dest, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden hover-lift"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${dest.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-md right-md">
                  <span className="bg-white/20 backdrop-blur-md text-white px-sm py-xs rounded-full text-label-sm font-label-sm border border-white/20 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {dest.rating}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-lg text-white">
                  <p className="text-label-sm font-label-sm uppercase tracking-widest text-white/80 mb-xs">
                    {dest.region}
                  </p>
                  <h3 className="font-headline-md text-headline-md mb-xs">
                    {dest.title}
                  </h3>
                  <p className="text-body-md text-white/90 mb-md">
                    From {dest.price} / person
                  </p>
                  <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                    <span className="bg-primary px-sm py-xs rounded text-label-sm font-label-sm">
                      {dest.days}
                    </span>
                    <span className="bg-primary px-sm py-xs rounded text-label-sm font-label-sm">
                      {dest.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="py-xl bg-surface-container-low overflow-hidden relative">
          <div className="max-w-container-max mx-auto px-lg relative z-10">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-headline-lg text-headline-lg text-primary mb-md">
                Why Choose Mystery Land
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                We prioritize your safety and comfort without compromising on the
                thrill of genuine discovery.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-xl"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
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
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center p-lg glass-card rounded-xl hover-lift border-primary/10"
                >
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-md text-primary">
                    {item.icon}
                  </div>
                  <h4 className="font-headline-sm text-headline-sm mb-sm text-primary">
                    {item.title}
                  </h4>
                  <p className="text-body-md text-on-surface-variant">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl" />
        </section>

        {/* Featured Tours */}
        <section className="py-xl px-lg max-w-container-max mx-auto">
          <motion.h2
            className="font-headline-lg text-headline-lg text-primary mb-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Curated Adventure Packages
          </motion.h2>

          <motion.div
            className="flex flex-col gap-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter bg-white rounded-2xl overflow-hidden shadow-md border border-outline-variant">
              <div className="lg:col-span-7 h-[400px] lg:h-auto overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkNQg62CiI_dkGdGVT8QsbiaAA-vi51E_wOtRq3E00XXwcodtLofVxT4Du6lwpgDPLNdlX1PrIge0N6BMWWizijnZOmtZvdHo0Zi38aHnB9j-KHl4iAtOHdbVnd4zibKVsCYqVavBnnChzh5buGk2LAYwIFGNzwTtD7Oh7-PTv_eWrx5iUyrhwpdMGeq_ePbMowWn_CSZpogMVMkoZTJTB4XYfLehDDDr5l1aJmwCfeLvGwECeVkn_jg")',
                  }}
                />
              </div>
              <div className="lg:col-span-5 p-lg flex flex-col justify-center">
                <div className="flex items-center gap-sm mb-sm">
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-sm py-xs rounded">
                    Limited Availability
                  </span>
                  <span className="text-on-surface-variant text-label-sm font-label-sm flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> 4.9 (124 reviews)
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-md text-primary">
                  Mediterranean Secrets: Yacht &amp; Villa Experience
                </h3>
                <p className="text-body-md text-on-surface-variant mb-lg">
                  Traverse the coastline of Italy and Greece on a private vessel.
                  Stay in clifftop villas accessible only by water, with private
                  chefs and exclusive wine tastings included.
                </p>
                <div className="flex items-center justify-between mb-lg border-t border-b border-outline-variant py-md">
                  <div>
                    <p className="text-label-sm font-label-sm text-outline uppercase">
                      Duration
                    </p>
                    <p className="font-bold text-primary">14 Days</p>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline uppercase">
                      Group Size
                    </p>
                    <p className="font-bold text-primary">Max 6</p>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline uppercase">
                      Price
                    </p>
                    <p className="font-bold text-primary">$12,500 pp</p>
                  </div>
                </div>
                <button className="bg-primary text-on-primary w-full py-md rounded-full font-label-md text-label-md hover:bg-primary-container transition-all">
                  View Full Itinerary
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="py-xl bg-primary text-on-primary">
          <div className="max-w-container-max mx-auto px-lg">
            <motion.h2
              className="font-headline-lg text-headline-lg mb-xl text-center text-inverse-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Voices from the Path
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-lg"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                {
                  name: 'Eleanor Thorne',
                  role: 'Travel Journalist',
                  quote: '"The level of detail and care Mystery Land Tours puts into their itineraries is unmatched. I\'ve traveled the globe for 20 years, and their Japan tour was a revelation."',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA16qSoXdGbrZe6f-ZehWollKsmu7TKnzQ7z_ZGR7K0cyr_3kud5T0gtYfgOQtYbnr-BqZ6kwCSu5YW6fVZNrdCgy9Lz1Ygz1mJ0G5r5APyWbm0qM0QMxHueTK1SxZ_aM9O2nuTIoVqydNPVXDj3goC1cpkDmuG5f3H4_418A_uOZvr8BQkKgP7iWlLUx_QhEkTNA05ybVuyZdTziHQw5tUuHNL3STbGeUBUofXo-DvD9ZQdvtl-C3lfQ',
                },
                {
                  name: 'Marcus Chen',
                  role: 'Photography Enthusiast',
                  quote: '"Getting into the Serengeti as the sun rose without any other tourists around was a dream come true. Their \'hidden wonders\' promise is absolutely real."',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOImArHLT3jU-rP3A4OX19zscSiRZrZhDA1eiWQ7yt-Jre0DBSEy0u_kqMkTG1KNM9TEWs5aaInF8wnvwzixCD8kWmWXvzp8s-G0UEtxF9w5iBP2qgxyeKPnjASAUR5Y7l_W0Nre83oVBWIa4FTXam8Y31RBEJYdbx97-l65v_4cq6AHaFpW2aEoPN1gdIdMTNDzfQL4s_n69a5MOmYyAvovrGMPYZJtzZ216VqQmfOLEtyeE-vNgSMg',
                },
                {
                  name: 'The Sterling Family',
                  role: 'World Explorers',
                  quote: '"Finally, a tour company that understands both the need for adventure and the desire for true comfort. Every accommodation was more stunning than the last."',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA06YJJae7o08Symjc7tX0Laadue9569MWOUvVQ88sdFiFClJ5RtkbooOlCqF5wQETCZlFVG3jYAi-A4TC26lN3NTQhS7AHMELJ_U9atZqIOMAFsZxN6z3vZ8JIScsTn8bVfq0ayjGMefPqvXAXpLrZAvGrDQGpxAII37MoO3R_UrLzBHnm9lNQRS6wOtbMdqt8mxmb-pyKeXZpuff_HM6OXJNWAupTum0B70xOPGykxrRPD8oXegFjvw',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-primary-container p-lg rounded-xl border border-on-primary/10 hover-lift"
                >
                  <div className="flex items-center gap-md mb-md">
                    <div className="w-16 h-16 rounded-full border-2 border-tertiary-fixed overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={testimonial.image}
                        alt={testimonial.name}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-body-lg">{testimonial.name}</p>
                      <p className="text-label-sm text-on-primary-container opacity-80 uppercase">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-body-md italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-xl px-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card rounded-2xl p-lg md:p-xl border-tertiary/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-lg opacity-10">
              <Mail size={160} className="text-tertiary rotate-12" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">
                The Traveler&apos;s Journal
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-lg">
                Exclusive offers, hidden destination guides, and luxury travel
                tips delivered to your inbox.
              </p>
              <form className="flex flex-col md:flex-row gap-md max-w-xl mx-auto">
                <input
                  className="flex-grow bg-white border border-outline-variant rounded-full px-lg py-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Your email address"
                  type="email"
                />
                <button
                  className="bg-tertiary text-on-tertiary px-xl py-md rounded-full font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-lg active:scale-95"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-md opacity-60">
                Join 50,000+ world travelers. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}