"use client";

import { useState, useEffect } from 'react';
import {
  Lock,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export default function ClientSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/client/profile');
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {
      current: '',
      new: '',
      confirm: ''
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.current = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.new = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.new = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirm = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirm = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword() || submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/client/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your password has been changed successfully',
        timer: 3000,
        showConfirmButton: false
      });

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error: any) {
      console.error('Error changing password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to change password'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account?',
      html: `
        <div class="text-left">
          <p class="mb-4">This action is <strong>permanent</strong> and cannot be undone.</p>
          <p class="mb-4">All your bookings, reviews, and personal data will be permanently deleted.</p>
          <div class="bg-red-50 p-4 rounded-lg">
            <p class="text-sm text-red-700 mb-2">Please enter your password to confirm:</p>
            <input type="password" id="confirm-password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter your password">
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete my account',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const password = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
        if (!password) {
          Swal.showValidationMessage('Password is required');
          return false;
        }
        return password;
      }
    });

    if (!result.isConfirmed) return;

    const password = result.value;

    try {
      setSubmitting(true);

      const response = await fetch('http://localhost:3000/api/client/settings/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Account Deleted',
        text: 'Your account has been deleted successfully',
        timer: 3000,
        showConfirmButton: false
      });

      // Logout and redirect to home
      await logout();
      router.push('/');

    } catch (error: any) {
      console.error('Error deleting account:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete account'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and security</p>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Member since {formatDate(profile.createdAt)}</span>
              </div>
              {profile.lastLogin && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Last login: {formatDate(profile.lastLogin)}</span>
                </div>
              )}
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium capitalize">
              {profile.role}
            </div>
          </div>
        </div>
      )}

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg pr-10 ${
                  passwordErrors.current ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.current && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.current}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg pr-10 ${
                  passwordErrors.new ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.new && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.new}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg pr-10 ${
                  passwordErrors.confirm ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.confirm && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm}</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password strength:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm">
                  {passwordData.newPassword.length >= 6 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={passwordData.newPassword.length >= 6 ? 'text-green-700' : 'text-red-700'}>
                    At least 6 characters
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {/[A-Z]/.test(passwordData.newPassword) ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-700' : 'text-gray-600'}>
                    Contains uppercase letter (optional)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {/[0-9]/.test(passwordData.newPassword) ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={/[0-9]/.test(passwordData.newPassword) ? 'text-green-700' : 'text-gray-600'}>
                    Contains number (optional)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  {/[!@#$%^&*]/.test(passwordData.newPassword) ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={/[!@#$%^&*]/.test(passwordData.newPassword) ? 'text-green-700' : 'text-gray-600'}>
                    Contains special character (optional)
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
              <p className="text-sm text-red-600">Permanent actions that cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently delete your account and all associated data. This includes:
                </p>
                <ul className="text-sm text-gray-500 mt-2 list-disc list-inside space-y-1">
                  <li>All your booking history</li>
                  <li>Reviews you've written</li>
                  <li>Saved wishlist items</li>
                  <li>Personal information and preferences</li>
                </ul>
                <p className="text-sm font-medium text-red-600 mt-3">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-500 text-center">
        For any questions about your account or security, please contact support.
      </p>
    </div>
  );
}