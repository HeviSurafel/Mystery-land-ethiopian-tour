// components/Footer.tsx
'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

interface Destination {
  id: string;
  _id: string;
  name: string;
  slug: string;
  region: string;
  featured: boolean;
}

const infoLinks = [
  { name: 'About Us', slug: '/about' },
  { name: 'Tours', slug: '/tours' },
  { name: 'Destinations', slug: '/destinations' },
  { name: 'Blog', slug: '/blog' },
  { name: 'Contact', slug: '/contact' },
];

const quickLinks = [
  { name: 'Cultural Tours', slug: '/tours?category=cultural' },
  { name: 'Nature Tours', slug: '/tours?category=nature' },
  { name: 'Adventure Tours', slug: '/tours?category=adventure' },
  { name: 'Historical Tours', slug: '/tours?category=historical' },
  { name: 'Festival Tours', slug: '/tours?category=festivals' },
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/mysterylandethiopia', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/mysterylandethiopia', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/mysterylandeth', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/mysterylandethiopia', label: 'YouTube' },
];

export default function Footer() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations/featured?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setDestinations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#004525] w-full pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 pb-12 max-w-7xl mx-auto">
        {/* Brand Section */}
        <div className="col-span-1">
          <span className="font-['Playfair_Display'] text-2xl font-semibold text-[#95d5a8] block mb-4">
            Mystery Land Ethiopia Tours
          </span>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Your trusted gateway to the heart and soul of Ethiopia. Discover ancient mysteries, 
            vibrant cultures, breathtaking landscapes, and unforgettable people.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ffe088] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <h4 className="text-[#ffe088] font-bold mb-4 uppercase tracking-widest text-xs">
            Popular Destinations
          </h4>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-white/10 rounded animate-pulse w-3/4"></div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2.5">
              {destinations.slice(0, 5).map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-white/70 hover:text-white hover:translate-x-1 transition-all text-sm inline-block"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[#ffe088] font-bold mb-4 uppercase tracking-widest text-xs">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {infoLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.slug}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all text-sm inline-block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tour Types */}
        <div>
          <h4 className="text-[#ffe088] font-bold mb-4 uppercase tracking-widest text-xs">
            Tour Types
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.slug}
                  className="text-white/70 hover:text-white hover:translate-x-1 transition-all text-sm inline-block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <Mail size={18} className="text-[#ffe088] flex-shrink-0" />
            <a href="mailto:info@mysterylandethiopiatour.com" className="text-sm">
              info@mysterylandethiopiatour.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <Phone size={18} className="text-[#ffe088] flex-shrink-0" />
            <a href="tel:+251916712096" className="text-sm">
              +251916712096
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <MapPin size={18} className="text-[#ffe088] flex-shrink-0" />
            <span className="text-sm">Arbaminch, Southern Ethiopia</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            © {currentYear} Mystery Land Ethiopia Tours. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}