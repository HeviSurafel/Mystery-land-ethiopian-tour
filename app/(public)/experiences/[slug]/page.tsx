// app/experiences/[slug]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiCalendar,
  FiUsers,
  FiStar,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiChevronDown,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiAward,
  FiGlobe,
  FiDollarSign,
  FiArrowRight,
  FiLoader,
  FiUser,
  FiMail,
  FiPhone,
  FiAlertCircle,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Experience {
  _id: string;
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  duration: string;
  location: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  bestTimeToVisit: string;
  difficulty: string;
  category: string;
  tag: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  languages: string[];
  groupSize: string;
  ageRange: string;
  whatToBring: string[];
  meetingPoint: string;
  startTimes: string[];
  culturalSignificance: string;
  seasonalAvailability: string;
  price: number;
  status: string;
  isUnesco: boolean;
  unesco: boolean;
}

export default function ExperienceDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Ethiopia',
    preferredDate: '',
    specialRequests: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const [refReady, setRefReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: isMounted && refReady ? heroRef : undefined,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  useEffect(() => {
    setIsMounted(true);
    fetchExperience();
  }, [slug]);

  useEffect(() => {
    if (isMounted && heroRef.current) {
      setRefReady(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/experiences/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch experience');
      }

      if (data.data) {
        const expData = {
          ...data.data,
          price: data.data.price || 0,
        };

        if (!expData.images || expData.images.length === 0) {
          expData.images = [
            `https://picsum.photos/seed/${expData.slug || 'experience'}/800/600`,
            `https://picsum.photos/seed/${expData.slug || 'experience'}-2/800/600`,
            `https://picsum.photos/seed/${expData.slug || 'experience'}-3/800/600`,
          ];
        } else {
          expData.images = expData.images
            .filter((img: string) => img && img.trim() !== '')
            .map((img: string) => img);
          
          if (expData.images.length === 0) {
            expData.images = [
              `https://picsum.photos/seed/${expData.slug || 'experience'}/800/600`,
              `https://picsum.photos/seed/${expData.slug || 'experience'}-2/800/600`,
              `https://picsum.photos/seed/${expData.slug || 'experience'}-3/800/600`,
            ];
          }
        }

        setExperience(expData);
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          preferredDate: tomorrow.toISOString().split('T')[0],
        }));
      }
    } catch (err: any) {
      console.error('Error fetching experience:', err);
      setError(err.message || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (experience?.images) {
      setCurrentSlide((prev) => (prev + 1) % experience.images.length);
    }
  };

  const prevSlide = () => {
    if (experience?.images) {
      setCurrentSlide((prev) => (prev - 1 + experience.images.length) % experience.images.length);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const getCurrentImage = () => {
    if (!experience?.images || experience.images.length === 0) {
      return `https://picsum.photos/seed/${experience?.slug || 'experience'}/800/600`;
    }
    
    const imagePath = experience.images[currentSlide];
    if (!imagePath || imagePath.trim() === '' || imageErrors.has(currentSlide)) {
      return `https://picsum.photos/seed/${experience?.slug || 'experience'}-${currentSlide}/800/600`;
    }
    
    return imagePath;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Challenging': 'bg-orange-100 text-orange-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookNow = () => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      router.push('/login');
      return;
    }
    setIsBookingModalOpen(true);
    setBookingStep(1);
    setBookingError('');
    setBookingSuccess(false);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingStep(1);
    setBookingError('');
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBookingError('');

    if (!experience) {
      setBookingError('Experience not found');
      setSubmitting(false);
      return;
    }

    if (!user) {
      setBookingError('Please login to complete your booking');
      setSubmitting(false);
      return;
    }

    // Validate preferredDate
    if (!formData.preferredDate) {
      setBookingError('Please select a preferred date');
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        fullName: formData.fullName || user.name,
        email: formData.email || user.email,
        phone: formData.phone || '',
        country: formData.country,
        preferredDate: formData.preferredDate,
        travelers: travelers,
        specialRequests: formData.specialRequests,
        itemId: experience._id || experience.id,
        itemName: experience.name,
        itemType: 'experience',
        userId: user.id,
        price: experience.price,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setBookingReference(data.data?.bookingReference || '');
      setBookingSuccess(true);
      setBookingStep(3);
      toast.success('Booking confirmed!');
    } catch (err: any) {
      setBookingError(err.message || 'Something went wrong. Please try again.');
      toast.error(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = experience ? (experience.price || 0) * travelers : 0;
  const minDate = new Date().toISOString().split('T')[0];

  if (!isMounted || loading) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-[#004525] mb-4">Experience Not Found</h2>
        <p className="text-[#404942] mb-6">{error || 'The experience you are looking for does not exist.'}</p>
        <Link
          href="/experiences"
          className="inline-block px-6 py-3 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
        >
          Back to Experiences
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#f8f9ff] min-h-screen">
      {/* Hero Gallery Slider */}
      <section ref={heroRef} className="relative w-full h-[716px] group overflow-hidden bg-[#1a1a2e]">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="relative w-full h-[716px]">
            <Image
              src={getCurrentImage()}
              alt={experience.name}
              fill
              className="object-cover object-center"
              priority
              onError={() => handleImageError(currentSlide)}
              unoptimized={true}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </motion.div>

        {/* Image counter */}
        {experience.images && experience.images.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              {currentSlide + 1} / {experience.images.length}
            </span>
          </div>
        )}

        {/* UNESCO Badge */}
        {(experience.isUnesco || experience.unesco) && (
          <div className="absolute top-6 left-6 z-20">
            <span className="bg-[#cca830] text-[#4f3e00] px-4 py-2 rounded-full text-[12px] leading-[16px] font-semibold uppercase tracking-wider flex items-center gap-2">
              <FiAward size={16} />
              UNESCO World Heritage
            </span>
          </div>
        )}

        {/* Slider Controls */}
        {experience.images && experience.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronDown className="rotate-90" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronDown className="-rotate-90" size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {experience.images && experience.images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {experience.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-8 h-1 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-12 px-4 md:px-6 max-w-[1280px] mx-auto z-10 pointer-events-none">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-block bg-[#cca830] text-[#4f3e00] px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium">
                {experience.category || 'Experience'}
              </span>
              {experience.tag && (
                <span className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium">
                  {experience.tag}
                </span>
              )}
              <span className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium flex items-center gap-1">
                <FiStar size={14} className="text-[#cca830]" />
                {experience.rating} ({experience.reviewCount} reviews)
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-[40px] md:text-[64px] leading-[48px] md:leading-[72px] tracking-[-0.02em] font-bold mb-3">
              {experience.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <FiMapPin size={18} />
                {experience.location || experience.coordinates?.city}, {experience.coordinates?.region || 'Ethiopia'}
              </span>
              <span className="flex items-center gap-2">
                <FiClock size={18} />
                {experience.duration}
              </span>
              <span className="flex items-center gap-2">
                <FiUsers size={18} />
                {experience.groupSize || '2-8 people'}
              </span>
            </div>
            <p className="text-[18px] leading-[28px] text-white/90 mt-4 max-w-2xl">
              {experience.shortDescription || experience.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section id="overview">
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] border-l-4 border-[#004525] pl-4 mb-4">
              The Experience
            </h2>
            <p className="text-[18px] leading-[28px] text-[#404942] mb-6">
              {experience.description}
            </p>
            
            {/* Highlights */}
            {experience.highlights && experience.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525] mb-3">
                  Experience Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experience.highlights.map((highlight, index) => (
                    <span key={index} className="bg-[#004525]/10 text-[#004525] px-3 py-1 rounded-full text-[14px] leading-[20px] font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiCalendar size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Duration</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{experience.duration}</p>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiUsers size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Group Size</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{experience.groupSize || '2-8'}</p>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiStar size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Difficulty</p>
                <span className={`px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium ${getDifficultyColor(experience.difficulty)}`}>
                  {experience.difficulty || 'Easy'}
                </span>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiMapPin size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Location</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{experience.location || experience.coordinates?.city || 'Ethiopia'}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {experience.bestTimeToVisit && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiCalendar size={18} /> Best Time to Visit
                  </h4>
                  <p className="text-[#404942]">{experience.bestTimeToVisit}</p>
                </div>
              )}
              {experience.languages && experience.languages.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiGlobe size={18} /> Languages
                  </h4>
                  <p className="text-[#404942]">{experience.languages.join(', ')}</p>
                </div>
              )}
              {experience.ageRange && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiUsers size={18} /> Age Range
                  </h4>
                  <p className="text-[#404942]">{experience.ageRange}</p>
                </div>
              )}
              {experience.seasonalAvailability && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiClock size={18} /> Availability
                  </h4>
                  <p className="text-[#404942]">{experience.seasonalAvailability}</p>
                </div>
              )}
            </div>
          </section>

          {/* Inclusions / Exclusions Bento */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#004525]/5 p-6 rounded-3xl border border-[#004525]/10">
              <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525] mb-4 flex items-center gap-2">
                <FiCheck size={24} className="text-[#004525]" /> Included
              </h3>
              <ul className="space-y-2">
                {experience.included && experience.included.length > 0 ? (
                  experience.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[16px] leading-[24px] text-[#404942]">
                      <FiCheck size={18} className="text-[#004525] mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-[#404942]">No inclusions listed</li>
                )}
              </ul>
            </div>
            <div className="bg-[#eff4ff] p-6 rounded-3xl border border-[#c0c9bf]">
              <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#404942] mb-4 flex items-center gap-2">
                <FiX size={24} className="text-[#ba1a1a]" /> Not Included
              </h3>
              <ul className="space-y-2">
                {experience.notIncluded && experience.notIncluded.length > 0 ? (
                  experience.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[16px] leading-[24px] text-[#404942] opacity-70">
                      <FiX size={18} className="text-[#ba1a1a] mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-[#404942] opacity-70">No exclusions listed</li>
                )}
              </ul>
            </div>
          </section>

          {/* What to Bring */}
          {experience.whatToBring && experience.whatToBring.length > 0 && (
            <section>
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] mb-4">
                What to Bring
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-[#c0c9bf]/30">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.whatToBring.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#404942]">
                      <FiCheck size={18} className="text-[#004525] mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Cultural Significance */}
          {experience.culturalSignificance && (
            <section>
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] mb-4">
                Cultural Significance
              </h2>
              <div className="bg-[#004525]/5 p-6 rounded-2xl border border-[#004525]/10">
                <p className="text-[16px] leading-[28px] text-[#404942]">
                  {experience.culturalSignificance}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right: Sidebar Sticky Widget */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white/60 backdrop-blur-[20px] border border-white/20 p-6 rounded-3xl shadow-[0px_10px_30px_rgba(31,93,58,0.08)]">
              <div className="mb-4">
                <p className="text-[12px] leading-[16px] font-medium text-[#707971] uppercase tracking-widest">Experience Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#004525]">
                    {experience.price > 0 ? `$${experience.price.toLocaleString()}` : 'Contact for Price'}
                  </span>
                  {experience.price > 0 && (
                    <span className="text-[16px] leading-[24px] text-[#404942]">/ per person</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[14px] leading-[20px] font-semibold block mb-1 text-[#121c2a]">Select Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleBookingInputChange}
                    className="w-full bg-white border-[#c0c9bf] rounded-xl p-3 text-[16px] leading-[24px] focus:ring-[#004525] focus:border-[#004525]"
                    min={minDate}
                  />
                </div>
                <div>
                  <label className="text-[14px] leading-[20px] font-semibold block mb-1 text-[#121c2a]">Travelers</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-10 h-10 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="text-2xl font-bold text-[#004525] w-12 text-center">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(12, travelers + 1))}
                      className="w-10 h-10 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-[#004525] text-white font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold py-4 rounded-xl hover:bg-[#1f5d3a] transition-all shadow-[0px_10px_30px_rgba(31,93,58,0.08)]"
                >
                  Book This Experience
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#c0c9bf]/30 text-center space-y-2">
                <div className="flex justify-center gap-4 text-[#707971]">
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="hover:text-[#004525] transition-colors flex items-center gap-1"
                  >
                    <FiHeart className={isWishlisted ? 'fill-red-500 text-red-500' : ''} size={18} /> 
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                  <button className="hover:text-[#004525] transition-colors flex items-center gap-1">
                    <FiShare2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* UNESCO Info */}
            {(experience.isUnesco || experience.unesco) && (
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#c0c9bf]/30">
                <div className="flex items-start gap-3">
                  <FiAward size={24} className="text-[#735c00] flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-[#004525]">UNESCO World Heritage Site</h5>
                    <p className="text-[12px] leading-[16px] text-[#404942]">This experience includes a UNESCO World Heritage site, recognized for its outstanding cultural or natural significance.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Point */}
            {experience.meetingPoint && (
              <div className="bg-white p-4 rounded-2xl border border-[#c0c9bf]/30">
                <h5 className="font-semibold text-[#004525] flex items-center gap-2 mb-1">
                  <FiMapPin size={16} /> Meeting Point
                </h5>
                <p className="text-[14px] text-[#404942]">{experience.meetingPoint}</p>
                {experience.startTimes && experience.startTimes.length > 0 && (
                  <p className="text-[12px] text-[#707971] mt-1">
                    Starts at: {experience.startTimes.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
                  {bookingSuccess ? 'Booking Confirmed!' : 'Book This Experience'}
                </h2>
                <button
                  onClick={closeBookingModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={24} className="text-[#404942]" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#97f3b5]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck size={32} className="text-[#004525]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#004525] mb-2">Booking Confirmed!</h3>
                  <p className="text-[#404942] mb-4">
                    Your booking reference is: <strong>{bookingReference}</strong>
                  </p>
                  <p className="text-[#404942] text-sm">
                    We've sent a confirmation to your email.
                  </p>
                  <button
                    onClick={closeBookingModal}
                    className="mt-6 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleBookingInputChange}
                        required
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleBookingInputChange}
                        required
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleBookingInputChange}
                        required
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        placeholder="+251 912 345 678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleBookingInputChange}
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      >
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleBookingInputChange}
                        required
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        min={minDate}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Number of Travelers
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          className="w-10 h-10 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                        >
                          <FiMinus size={18} />
                        </button>
                        <span className="text-2xl font-bold text-[#004525] w-12 text-center">
                          {travelers}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTravelers(Math.min(12, travelers + 1))}
                          className="w-10 h-10 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#004525] block mb-1">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleBookingInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        placeholder="Dietary restrictions, accessibility needs..."
                      />
                    </div>

                    {bookingError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{bookingError}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bf]/30">
                      <div>
                        <p className="text-sm text-[#404942]">Total</p>
                        <p className="font-['Playfair_Display'] text-2xl font-bold text-[#004525]">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <FiLoader className="animate-spin" size={18} />
                            Processing...
                          </>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}