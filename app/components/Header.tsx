// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiCalendar,
  FiHeart,
  FiUser as FiUserIcon,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { 
    name: 'About', 
    path: '/about',
    submenu: [
      { name: 'About Us', path: '/about' },
      { name: 'Weather', path: '/ethiopia/weather' },
      { name: 'Travel Guide', path: '/ethiopia/travel-guide' },
      { name: 'Culture', path: '/ethiopia/culture' },
      { name: 'History', path: '/ethiopia/history' },
      { name: 'Cuisine', path: '/ethiopia/cuisine' },
      { name: 'Festivals', path: '/ethiopia/festivals' },
    ]
  },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Tours', path: '/tours' },
  { name: 'Experiences', path: '/experiences' },
  { name: 'Journal', path: '/journal' },
];

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close user menu on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Close about menu on route change
  useEffect(() => {
    setIsAboutMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const isSubmenuActive = (paths: string[]) => {
    return paths.some(path => pathname?.startsWith(path));
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prevent hydration mismatch by rendering a placeholder during SSR
  if (!isMounted) {
    return (
      <header className="fixed w-full top-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="font-['Playfair_Display'] text-xl md:text-2xl lg:text-4xl text-[#004525] tracking-tighter font-semibold">
              Mystery Land Tours
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 border-b border-white/20 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/60 backdrop-blur-md shadow-sm'
      }`}
      suppressHydrationWarning
    >
      <nav className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
            <Image
              src="/Images/mainlogo.png"
              alt="Mystery Land Ethiopia Tours"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'w-full h-full flex items-center justify-center bg-[#004525] text-white rounded-full text-xl font-bold';
                  fallback.textContent = 'ML';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <span className="font-['Playfair_Display'] text-xl md:text-2xl lg:text-3xl text-[#004525] tracking-tighter font-semibold hidden sm:block">
            Mystery Land Tours
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <div key={link.path} className="relative group">
              {link.submenu ? (
                <>
                  <button
                    onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
                    onMouseEnter={() => setIsAboutMenuOpen(true)}
                    onMouseLeave={() => setIsAboutMenuOpen(false)}
                    className={`${
                      isActive(link.path) || isSubmenuActive(link.submenu.map(item => item.path))
                        ? 'text-[#004525] border-b-2 border-[#004525] font-bold'
                        : 'text-[#404942] hover:text-[#004525] transition-colors'
                    } text-sm font-semibold pb-1 whitespace-nowrap flex items-center gap-1`}
                  >
                    {link.name}
                    <FiChevronDown 
                      size={14} 
                      className={`transition-transform duration-300 ${
                        isAboutMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAboutMenuOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#c0c9bf]/30 py-2 overflow-hidden z-50"
                      onMouseEnter={() => setIsAboutMenuOpen(true)}
                      onMouseLeave={() => setIsAboutMenuOpen(false)}
                    >
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`${
                            isActive(subItem.path)
                              ? 'bg-[#004525]/10 text-[#004525] font-bold'
                              : 'text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525]'
                          } block px-4 py-2.5 text-sm transition-colors`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-[#004525] border-b-2 border-[#004525] font-bold'
                      : 'text-[#404942] hover:text-[#004525] transition-colors'
                  } text-sm font-semibold pb-1 whitespace-nowrap`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Button */}
          <button className="text-[#004525] p-2 hover:bg-[#004525]/10 rounded-full transition-all duration-300">
            <FiSearch size={20} className="md:size-[22px]" />
          </button>

          {/* User Menu - Desktop */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-[#004525] hover:bg-[#004525]/10 px-3 py-2 rounded-full transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-[#004525]/20 animate-pulse" />
              ) : user ? (
                <div className="w-8 h-8 rounded-full bg-[#004525] text-white flex items-center justify-center text-sm font-semibold">
                  {getUserInitials()}
                </div>
              ) : (
                <FiUser size={20} />
              )}
              <FiChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isUserMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#c0c9bf]/30 py-2 overflow-hidden z-50"
                >
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm text-[#707971]">
                      Loading...
                    </div>
                  ) : user ? (
                    <>
                      <div className="px-4 py-3 border-b border-[#c0c9bf]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#004525] text-white flex items-center justify-center text-sm font-semibold">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#004525]">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#707971] truncate max-w-[150px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525] transition-colors"
                      >
                        <FiUserIcon size={18} />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525] transition-colors"
                      >
                        <FiSettings size={18} />
                        Dashboard
                      </Link>
                      <Link
                        href="/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525] transition-colors"
                      >
                        <FiCalendar size={18} />
                        My Bookings
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525] transition-colors"
                      >
                        <FiHeart size={18} />
                        Wishlist
                      </Link>
                      <hr className="my-1 border-[#c0c9bf]/30" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <FiLogOut size={18} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#404942] hover:bg-[#004525]/5 hover:text-[#004525] transition-colors"
                      >
                        <FiLogIn size={18} />
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#004525] font-semibold hover:bg-[#004525]/5 transition-colors"
                      >
                        <FiUserPlus size={18} />
                        Sign Up
                      </Link>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </div>

          {/* Book Now Button */}
          <Link
            href="/book"
            className="hidden md:block bg-[#004525] text-white px-4 lg:px-6 py-2 rounded-full text-sm font-semibold hover:translate-y-[-2px] active:scale-95 transition-all shadow-md whitespace-nowrap"
          >
            Book Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#004525] p-2 hover:bg-[#004525]/10 rounded-full transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
        <div className="px-4 py-4 flex flex-col gap-2">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 pb-3 border-b border-[#c0c9bf]/20">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/Images/logo/logo.png"
                alt="Mystery Land Tours"
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <span className="font-['Playfair_Display'] text-lg font-semibold text-[#004525]">
              Mystery Land Tours
            </span>
          </div>

          {navLinks.map((link) => (
            <div key={link.path}>
              {link.submenu ? (
                <>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.path}
                      className={`${
                        isActive(link.path)
                          ? 'text-[#004525] font-bold'
                          : 'text-[#404942] hover:text-[#004525] transition-colors'
                      } text-sm font-semibold py-3`}
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)}
                      className="p-2"
                    >
                      <FiChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isAboutMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                  {isAboutMenuOpen && (
                    <div className="ml-4 flex flex-col gap-1 border-l-2 border-[#004525]/20 pl-3">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`${
                            isActive(subItem.path)
                              ? 'text-[#004525] font-semibold'
                              : 'text-[#404942] hover:text-[#004525]'
                          } text-sm py-2 transition-colors`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-[#004525] border-l-2 border-[#004525] pl-3 font-bold'
                      : 'text-[#404942] hover:text-[#004525] transition-colors pl-3'
                  } text-sm font-semibold py-3 block`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          <hr className="border-[#c0c9bf]/30 my-2" />

          {/* Mobile Auth Links */}
          {isLoading ? (
            <div className="pl-3 py-3 text-sm text-[#707971]">Loading...</div>
          ) : user ? (
            <>
              <div className="pl-3 py-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#004525] text-white flex items-center justify-center text-sm font-semibold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#004525]">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#707971] truncate max-w-[200px]">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                href="/profile"
                className="text-[#404942] hover:text-[#004525] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiUserIcon size={18} />
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="text-[#404942] hover:text-[#004525] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiSettings size={18} />
                Dashboard
              </Link>
              <Link
                href="/bookings"
                className="text-[#404942] hover:text-[#004525] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiCalendar size={18} />
                My Bookings
              </Link>
              <Link
                href="/wishlist"
                className="text-[#404942] hover:text-[#004525] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiHeart size={18} />
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#404942] hover:text-[#004525] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiLogIn size={18} />
                Login
              </Link>
              <Link
                href="/signup"
                className="text-[#004525] hover:text-[#1f5d3a] transition-colors pl-3 py-2 text-sm font-semibold flex items-center gap-3"
              >
                <FiUserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}

          <Link
            href="/book"
            className="bg-[#004525] text-white px-6 py-3 rounded-full text-sm font-semibold hover:translate-y-[-2px] active:scale-95 transition-all shadow-md mt-3 text-center"
          >
            Book Now
          </Link>
        </div>
      </motion.div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
}