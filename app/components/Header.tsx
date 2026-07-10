// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';

const navLinks = ['Home', 'Destinations', 'Tours', 'Experiences', 'Journal'];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 border-b border-white/20 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/60 backdrop-blur-md shadow-sm'
      }`}
    >
      <nav className="flex justify-between items-center px-lg py-md max-w-container-max mx-auto h-20">
        <div className="flex items-center gap-base">
          <span className="font-display-lg text-headline-md md:text-display-lg text-primary dark:text-inverse-primary tracking-tighter">
            Mystery Land Tours
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-lg">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className={`${
                link === 'Home'
                  ? 'text-primary border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-label-md`}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-md">
          <button className="text-primary p-base hover:bg-primary/10 rounded-full transition-all duration-300">
            <Search size={24} />
          </button>
          <button className="hidden md:block bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md hover:translate-y-[-2px] active:scale-95 transition-all shadow-md">
            Book Now
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary p-base hover:bg-primary/10 rounded-full transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-white/20"
      >
        <div className="px-lg py-md flex flex-col gap-sm">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className={`${
                link === 'Home'
                  ? 'text-primary border-l-2 border-primary pl-sm font-bold'
                  : 'text-on-surface-variant hover:text-primary transition-colors pl-sm'
              } font-label-md text-label-md py-sm`}
            >
              {link}
            </a>
          ))}
          <button className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md hover:translate-y-[-2px] active:scale-95 transition-all shadow-md mt-sm">
            Book Now
          </button>
        </div>
      </motion.div>
    </header>
  );
}