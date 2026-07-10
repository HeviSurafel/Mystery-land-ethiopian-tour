// components/Footer.tsx
'use client';

import { Mail, Phone, MapPin, Facebook, Instagram, Share2 } from 'lucide-react';

const destinations = [
  'Tuscany, Italy',
  'Kyoto, Japan',
  'Serengeti, Tanzania',
  'Patagonia, Chile',
];
const infoLinks = ['Private Jets', 'Eco-Luxury', 'Our Story', 'Travel Policy'];

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-primary-container w-full pt-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-xl px-lg py-xl max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1">
          <span className="font-headline-md text-headline-md text-inverse-primary block mb-md">
            Mystery Land Tours
          </span>
          <p className="text-on-primary/80 font-body-md text-body-md mb-lg">
            Crafting extraordinary journeys for the brave, the curious, and the
            refined explorer since 2008.
          </p>
          <div className="flex gap-md">
            <a
              className="text-on-primary hover:text-tertiary-fixed transition-colors"
              href="#"
            >
              <Facebook size={24} />
            </a>
            <a
              className="text-on-primary hover:text-tertiary-fixed transition-colors"
              href="#"
            >
              <Instagram size={24} />
            </a>
            <a
              className="text-on-primary hover:text-tertiary-fixed transition-colors"
              href="#"
            >
              <Share2 size={24} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-tertiary-fixed font-bold mb-md uppercase tracking-widest text-label-md">
            Destinations
          </h4>
          <ul className="space-y-sm">
            {destinations.map((dest, index) => (
              <li key={index}>
                <a
                  className="text-on-primary/80 hover:text-on-primary hover:translate-x-1 transition-transform inline-block"
                  href="#"
                >
                  {dest}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-tertiary-fixed font-bold mb-md uppercase tracking-widest text-label-md">
            Information
          </h4>
          <ul className="space-y-sm">
            {infoLinks.map((link, index) => (
              <li key={index}>
                <a
                  className="text-on-primary/80 hover:text-on-primary hover:translate-x-1 transition-transform inline-block"
                  href="#"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-tertiary-fixed font-bold mb-md uppercase tracking-widest text-label-md">
            Contact Us
          </h4>
          <ul className="space-y-sm">
            <li className="flex items-center gap-base text-on-primary/80">
              <Mail size={18} />
              concierge@mysteryland.com
            </li>
            <li className="flex items-center gap-base text-on-primary/80">
              <Phone size={18} />
              +1 (800) MYSTERY
            </li>
            <li className="flex items-center gap-base text-on-primary/80">
              <MapPin size={18} />
              Mayfair, London, UK
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-on-primary/10 py-lg">
        <div className="max-w-container-max mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="text-on-primary/60 text-body-md font-body-md">
            © 2024 Mystery Land Tours. All rights reserved.
          </p>
          <div className="flex gap-lg">
            <a
              className="text-on-primary/60 hover:text-on-primary text-label-sm uppercase tracking-widest"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-primary/60 hover:text-on-primary text-label-sm uppercase tracking-widest"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}