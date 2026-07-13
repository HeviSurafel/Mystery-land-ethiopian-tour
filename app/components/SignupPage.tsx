// components/SignupPage.tsx
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
  FiCheckCircle,
  FiUser,
  FiUserPlus,
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

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Success - show toast and redirect to verification
      setToastMessage('Account created! Please verify your email.');
      setShowToast(true);

      // Redirect to verification page after 2 seconds
      setTimeout(() => {
        setShowToast(false);
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
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
            <p className="text-[#404942] mt-2">Begin your extraordinary journey</p>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-xl p-8 glass-card"
          >
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-2">
              Create Account
            </h2>
            <p className="text-[#404942] text-sm mb-6">
              Join the inner circle of extraordinary explorers.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                <FiAlertCircle className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#004525] block">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" size={20} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                <label className="text-sm font-semibold text-[#004525] block">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors outline-none"
                    placeholder="Create strong password"
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
                <p className="text-xs text-[#707971]">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#004525] block">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707971] hover:text-[#004525] transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c0c9bf] text-[#004525] focus:ring-[#004525] mt-0.5"
                  required
                />
                <label className="text-sm text-[#404942] cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#004525] hover:underline font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#004525] hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !agreeTerms}
                className="w-full h-12 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiUserPlus size={20} />
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

            {/* Social Signup */}
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
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-[#004525] font-semibold hover:underline transition-all"
              >
                Sign In
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