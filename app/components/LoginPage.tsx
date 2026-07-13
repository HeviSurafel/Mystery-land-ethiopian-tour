// components/LoginPage.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.error === 'Please verify your email first') {
          // Redirect to verification page
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      // Success - show toast and redirect
      setToastMessage('Welcome back, explorer!');
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 md:px-6 bg-[#f8f9ff]">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#004525]">
              Mystery Land Tours
            </h1>
            <p className="text-[#404942] mt-2">Welcome back to the extraordinary</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-8 glass-card"
          >
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-2">
              Welcome Back
            </h2>
            <p className="text-[#404942] text-sm mb-6">
              Please enter your credentials to continue your journey.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <FiAlertCircle className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#004525] block">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors outline-none"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#004525] block">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#006d3d] hover:text-[#004525] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707971] hover:text-[#004525] transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#c0c9bf] text-[#004525] focus:ring-[#004525]"
                  />
                  <span className="text-sm text-[#404942]">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-[#c0c9bf]/50" />
              <span className="mx-4 text-xs font-semibold text-[#707971]">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-[#c0c9bf]/50" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-12 bg-white border border-[#c0c9bf] rounded-xl hover:bg-[#f8f9ff] transition-all">
                <FcGoogle size={20} />
                <span className="text-sm font-semibold text-[#404942]">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-12 bg-white border border-[#c0c9bf] rounded-xl hover:bg-[#f8f9ff] transition-all">
                <FaApple size={20} />
                <span className="text-sm font-semibold text-[#404942]">Apple</span>
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-center mt-6 text-sm text-[#404942]">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-[#004525] font-semibold hover:underline transition-all"
              >
                Sign Up
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Toast Notification */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg border-l-4 border-[#006d3d]">
              <FiCheckCircle size={24} className="text-[#006d3d]" />
              <p className="text-sm font-semibold text-[#004525]">
                {toastMessage}
              </p>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}