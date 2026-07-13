// components/HomePage/index.tsx
'use client';

import Header from '../Header';
import Footer from '../Footer';
import HeroSection from './HeroSection';
import SearchSection from './SearchSection';
import GallerySection from './GallerySection';
import StatsSection from './StatsSection';
import DestinationsSection from './DestinationsSection';
import WhyChooseUs from './WhyChooseUs';
import FeaturedTours from './FeaturedTours';
import Testimonials from './Testimonials';
import NewsletterSection from './NewsletterSection';


export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <SearchSection />
        <StatsSection />
        <DestinationsSection />
        <WhyChooseUs />
        <FeaturedTours />
        <GallerySection />
        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}