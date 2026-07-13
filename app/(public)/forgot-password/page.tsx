// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
          variants={fadeInUp}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 glass-card">
            {/* Back to Login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[#404942] hover:text-[#004525] transition-colors mb-6"
            >
              <FiArrowLeft size={18} />
              <span className="text-sm">Back to Login</span>
            </Link>

            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-2">
              Reset Password
            </h2>
            <p className="text-[#404942] text-sm mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {success ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <FiCheckCircle className="text-[#006d3d] flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-[#004525]">Email Sent!</p>
                  <p className="text-sm text-[#404942]">
                    If an account exists with {email}, you will receive a password reset link.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                    <FiAlertCircle className="flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⟳</span>
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}