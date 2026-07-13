'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiHome as FiRestaurant, FiCoffee, FiStar, FiHeart } from 'react-icons/fi';

export default function CuisinePage() {
  const dishes = [
    {
      name: 'Injera & Doro Wat',
      description: 'The national dish - spicy chicken stew served with injera (fermented flatbread). This iconic dish is a celebration of Ethiopian flavors and hospitality.',
      icon: FiRestaurant,
      region: 'National',
      image: '/Images/doro-wat.jpg',
      alt: 'Doro Wat served on injera'
    },
    {
      name: 'Kitfo',
      description: 'Minced raw beef marinated in spices and served with cheese and vegetables. A delicacy from the Gurage people, often eaten on special occasions.',
      icon: FiStar,
      region: 'Gurage',
      image: '/Images/kitfo.jpg',
      alt: 'Kitfo with cheese and vegetables'
    },
    {
      name: 'Tibs',
      description: 'Sautéed meat with vegetables and spices. Available in various styles - from the spicy zilzil tibs to the mild version, always served with injera.',
      icon: FiRestaurant,
      region: 'National',
      image: '/Images/tibs.jpg',
      alt: 'Sautéed meat tibs with vegetables'
    },
    {
      name: 'Shiro Wat',
      description: 'A delicious chickpea or broad bean flour stew, perfect for vegetarians. It\'s a staple in Ethiopian cuisine and enjoyed by all.',
      icon: FiHeart,
      region: 'National',
      image: '/Images/shiro-wat.jpg',
      alt: 'Shiro Wat stew served with injera'
    }
  ];

  const coffeeRegions = [
    { name: 'Yirgacheffe', description: 'Known for floral and fruity notes' },
    { name: 'Sidamo', description: 'Rich and full-bodied flavor' },
    { name: 'Harar', description: 'Winey and complex with fruit undertones' },
    { name: 'Limu', description: 'Well-balanced with citrus notes' }
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
            Ethiopian Cuisine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
          >
            Explore the rich flavors and traditions of Ethiopian food culture
          </motion.p>
        </div>
      </section>

      {/* Cuisine Content */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Ethiopian cuisine is a delightful blend of unique flavors, traditional cooking methods, 
            and cultural significance. From the spicy stews to the famous coffee ceremonies, 
            food is at the heart of Ethiopian hospitality.
          </p>
        </motion.div>

        {/* Featured Dishes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {dishes.map((dish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={dish.image}
                  alt={dish.alt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                      fallback.innerHTML = `
                        <div class="text-center">
                          <div class="text-4xl text-[#004525]/30">🍽️</div>
                          <p class="text-gray-500 text-sm">Image not available</p>
                        </div>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <dish.icon className="text-2xl text-[#004525]" />
                    <div>
                      <h3 className="text-xl font-bold text-[#004525]">{dish.name}</h3>
                      <span className="text-sm text-[#004525]/60">{dish.region}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{dish.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coffee Culture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#004525] mb-6 text-center">
            Ethiopian Coffee Culture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Ethiopia is the birthplace of coffee, and the coffee ceremony is an integral part of 
                Ethiopian culture. The ritual can take up to three hours and involves roasting, grinding, 
                and brewing coffee in a traditional clay pot called a jebena.
              </p>
              <div className="bg-[#f5f7f5] rounded-xl p-4">
                <h4 className="font-bold text-[#004525] mb-3">Famous Coffee Regions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {coffeeRegions.map((region, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold">{region.name}:</span>
                      <span className="text-gray-600"> {region.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/Images/coffee-ceremony.jpg"
                alt="Traditional Ethiopian coffee ceremony"
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
                        <div class="text-6xl text-[#004525]/30">☕</div>
                        <p class="text-gray-500 text-sm">Coffee ceremony image</p>
                      </div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Dining Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#004525] text-white rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-6 text-center">
            Ethiopian Dining Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🤲</div>
              <h3 className="font-bold mb-2">Eating with Hands</h3>
              <p className="text-sm text-white/80">Use your right hand to tear injera and scoop food</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌶️</div>
              <h3 className="font-bold mb-2">Spice Levels</h3>
              <p className="text-sm text-white/80">Start with mild dishes and work your way up</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="font-bold mb-2">Sharing Culture</h3>
              <p className="text-sm text-white/80">Ethiopian meals are traditionally shared from a common plate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">☕</div>
              <h3 className="font-bold mb-2">Coffee Ritual</h3>
              <p className="text-sm text-white/80">Always accept coffee when offered - it's a sign of respect</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}