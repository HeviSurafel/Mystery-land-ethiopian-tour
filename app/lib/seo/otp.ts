/**
 * Generate a 6-digit OTP (One-Time Password)
 * @returns {string} 6-digit OTP as string
 */
export const generateOTP = (): string => {
  // Generate random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Get OTP expiry date (10 minutes from now)
 * @returns {Date} Expiry date object
 */
export const getOTPExpiry = (): Date => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 10); // Add 10 minutes
  return expiryDate;
};

/**
 * Verify if OTP is still valid
 * @param {Date} expiryDate - The expiry date of the OTP
 * @returns {boolean} True if OTP is still valid, false if expired
 */
export const isOTPValid = (expiryDate: Date): boolean => {
  return new Date() < expiryDate;
};

/**
 * Generate a numeric OTP of specified length
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} OTP of specified length
 */
export const generateOTPWithLength = (length: number = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
  return otp;
};

/**
 * Generate an alphanumeric OTP (more secure but harder to type)
 * @param {number} length - Length of OTP (default: 8)
 * @returns {string} Alphanumeric OTP
 */
export const generateAlphanumericOTP = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
};

/**
 * Format expiry time for display
 * @param {Date} expiryDate - The expiry date
 * @returns {string} Formatted time string (e.g., "5 minutes", "2 hours")
 */
export const getExpiryTimeRemaining = (expiryDate: Date): string => {
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  } else {
    const diffSecs = Math.floor(diffMs / 1000);
    return `${diffSecs} second${diffSecs > 1 ? 's' : ''}`;
  }
};