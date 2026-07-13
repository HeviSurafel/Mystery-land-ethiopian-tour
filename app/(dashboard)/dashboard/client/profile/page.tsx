"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Calendar,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Save,
  Edit2,
  Award,
  Clock,
  Heart,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";

import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  bio: string;
  languages: string[];
  interests: string[];
  joinDate: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  stats: {
    totalBookings: number;
    totalSpent: number;
    reviewsGiven: number;
    wishlistCount: number;
  };
  recentActivity: {
    bookings: Array<{
      id: string;
      title: string;
      status: string;
      amount: number;
      formattedDate: string;
    }>;
    reviews: Array<{
      id: string;
      title: string;
      rating: number;
      itemName: string;
      formattedDate: string;
    }>;
  };
}

export default function ClientProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/client/profile');
        const data = await response.json();
        
        if (data.success) {
          // Ensure all nested objects exist with defaults
          const formattedData = {
            ...data.data,
            stats: data.data.stats || {
              totalBookings: 0,
              totalSpent: 0,
              reviewsGiven: 0,
              wishlistCount: 0
            },
            recentActivity: data.data.recentActivity || {
              bookings: [],
              reviews: []
            },
            socialLinks: data.data.socialLinks || {
              facebook: '',
              twitter: '',
              instagram: ''
            },
            languages: data.data.languages || ['English'],
            interests: data.data.interests || ['Cultural Tours', 'Photography', 'Hiking', 'Food'],
            phone: data.data.phone || '+251916712096',
            location: data.data.location || 'Addis Ababa, Ethiopia',
            bio: data.data.bio || 'Passionate traveler exploring Ethiopia\'s rich culture and traditions. Love photography and cultural experiences.',
            avatar: data.data.avatar || '/Images/avatar-placeholder.jpg'
          };
          setProfileData(formattedData);
        } else {
          Swal.fire({
            title: 'Error',
            text: data.error || 'Failed to load profile',
            icon: 'error',
            confirmButtonColor: '#B88A3D'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load profile',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          languages: profileData.languages,
          interests: profileData.interests,
          socialLinks: profileData.socialLinks
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        icon: "success",
        confirmButtonColor: "#B88A3D",
        timer: 2000
      });
      
      setIsEditing(false);
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && profileData) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        interests: profileData.interests.filter((_, i) => i !== index)
      });
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && profileData) {
      setProfileData({
        ...profileData,
        languages: [...profileData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        languages: profileData.languages.filter((_, i) => i !== index)
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Only JPEG, PNG, and WebP images are allowed',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Maximum file size is 2MB',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update profile with new avatar
      const updateResponse = await fetch('http://localhost:3000/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: data.url })
      });

      const updateData = await updateResponse.json();

      if (updateData.success && profileData) {
        setProfileData({
          ...profileData,
          avatar: data.url
        });
      }

      Swal.fire({
        title: 'Success',
        text: 'Profile picture updated',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load profile</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            isEditing 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-amber-100">
                  <Image
                    src={profileData.avatar}
                    alt={profileData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  </>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
              <p className="text-gray-500 text-sm">Member since {profileData.joinDate}</p>
              
              <div className="flex justify-center space-x-4 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">{profileData.stats?.totalBookings || 0}</div>
                  <div className="text-xs text-gray-500">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">{profileData.stats?.reviewsGiven || 0}</div>
                  <div className="text-xs text-gray-500">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">{profileData.stats?.wishlistCount || 0}</div>
                  <div className="text-xs text-gray-500">Wishlist</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-amber-500" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-amber-500" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-amber-500" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 text-amber-500" />
                  <span className="text-sm">Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="border-t border-gray-100 mt-6 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                    {lang}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveLanguage(index)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                      placeholder="Add language"
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="px-2 py-1 bg-amber-500 text-white text-sm rounded-r-lg hover:bg-amber-600"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-gray-100 mt-6 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Social Profiles</h3>
              <div className="flex space-x-3">
                {profileData.socialLinks?.facebook ? (
                  <a 
                    href={profileData.socialLinks.facebook} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed">
                    <Facebook className="w-5 h-5" />
                  </div>
                )}
                {profileData.socialLinks?.twitter ? (
                  <a 
                    href={profileData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-sky-50 text-sky-400 rounded-lg hover:bg-sky-100 transition"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed">
                    <Twitter className="w-5 h-5" />
                  </div>
                )}
                {profileData.socialLinks?.instagram ? (
                  <a 
                    href={profileData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed">
                    <Instagram className="w-5 h-5" />
                  </div>
                )}
              </div>
              {isEditing && (
                <p className="text-xs text-gray-400 mt-2">
                  Edit social links in the form below
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form / Bio Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Bio */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.location}</p>
                )}
              </div>
            </div>

            {/* Social Links Edit */}
            {isEditing && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.facebook || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: {
                          ...profileData.socialLinks,
                          facebook: e.target.value
                        }
                      })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Twitter URL</label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.twitter || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: {
                          ...profileData.socialLinks,
                          twitter: e.target.value
                        }
                      })}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.instagram || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: {
                          ...profileData.socialLinks,
                          instagram: e.target.value
                        }
                      })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm flex items-center"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveInterest(index)}
                      className="ml-2 text-amber-500 hover:text-amber-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                    placeholder="Add interest"
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleAddInterest}
                    className="px-2 py-1 bg-amber-500 text-white text-sm rounded-r-lg hover:bg-amber-600"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {profileData.recentActivity?.bookings && profileData.recentActivity.bookings.length > 0 ? (
                profileData.recentActivity.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        booking.status === 'confirmed' ? 'bg-green-50' :
                        booking.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}>
                        {booking.status === 'confirmed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : booking.status === 'pending' ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.title}</p>
                        <p className="text-xs text-gray-500">{booking.formattedDate}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">${booking.amount}</span>
                  </div>
                ))
              ) : null}
              
              {profileData.recentActivity?.reviews && profileData.recentActivity.reviews.length > 0 ? (
                profileData.recentActivity.reviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Star className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.title}</p>
                        <p className="text-xs text-gray-500">{review.itemName} • {review.formattedDate}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.rating} stars</span>
                  </div>
                ))
              ) : null}

              {(!profileData.recentActivity?.bookings || profileData.recentActivity.bookings.length === 0) && 
               (!profileData.recentActivity?.reviews || profileData.recentActivity.reviews.length === 0) && (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}