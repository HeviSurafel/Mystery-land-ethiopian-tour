// components/HomePage/index.tsx
'use client';

import AboutAbselam from "./AboutAbselam";
import BlogSection from "./BlogSection";
import Footer from "./Footer";
import Header from "./Header";
import DestinationsSection from "./HomePage/DestinationsSection";
import FeaturedTours from "./HomePage/FeaturedTours";
import GallerySection from "./HomePage/GallerySection";
import HeroSection from "./HomePage/HeroSection";
import NewsletterSection from "./HomePage/NewsletterSection";
import SearchSection from "./HomePage/SearchSection";
import StatsSection from "./HomePage/StatsSection";
import Testimonials from "./HomePage/Testimonials";
import WhyChooseUs from "./HomePage/WhyChooseUs";
import ReviewsSection from "./ReviewsSection";



export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <SearchSection />
        <AboutAbselam />
        
        <StatsSection />
        <DestinationsSection />
        <WhyChooseUs />
        <FeaturedTours />
        <BlogSection />
        <ReviewsSection />
        
      </main>
      <Footer />
    </>
  );
}