// app/verify-email/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCheckCircle, FiAlertCircle, FiMail, FiRefreshCw } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

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
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#004525]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail size={32} className="text-[#004525]" />
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
                Verify Your Email
              </h2>
              <p className="text-[#404942] text-sm mt-2">
                We've sent a 6-digit verification code to <br />
                <span className="font-semibold text-[#004525]">{email}</span>
              </p>
            </div>

            {success ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <FiCheckCircle className="text-[#006d3d] flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-[#004525]">Email Verified!</p>
                  <p className="text-sm text-[#404942]">
                    Your email has been successfully verified. Redirecting to login...
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

                <form onSubmit={handleVerify} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="text-sm font-semibold text-[#004525] block mb-3 text-center">
                      Enter Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-semibold bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] focus:ring-2 focus:ring-[#004525]/20 transition-all outline-none"
                          autoFocus={index === 0}
                          required
                        />
                      ))}
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
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-[#404942]">
                    Didn't receive the code?{' '}
                    {canResend ? (
                      <button
                        onClick={handleResendOTP}
                        disabled={isResending}
                        className="text-[#004525] font-semibold hover:underline transition-all disabled:opacity-50"
                      >
                        {isResending ? 'Sending...' : 'Resend OTP'}
                      </button>
                    ) : (
                      <span className="text-[#707971]">
                        Resend in {countdown}s
                      </span>
                    )}
                  </p>
                </div>

                {/* Back to Login */}
                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[#404942] hover:text-[#004525] transition-colors"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}