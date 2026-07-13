"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Tag,
  Percent,
  Calendar,
  Clock,
  Users,
  Award,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  X,
  Save,
  Grid3X3,
  List,
  AlertTriangle,
  Sparkles,
  Zap,
  Sun,
  GraduationCap,
  Baby,
  HeartHandshake,
  Camera,
  MapPin,
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import { Offer } from "@/types/types";
import { offerService, OfferFilters } from "@/services/offerService";

const categories = [
  { value: "early-bird", label: "Early Bird", icon: Clock, color: "blue" },
  { value: "group", label: "Group", icon: Users, color: "green" },
  { value: "seasonal", label: "Seasonal", icon: Sun, color: "amber" },
  { value: "last-minute", label: "Last Minute", icon: Zap, color: "orange" },
  { value: "family", label: "Family", icon: Heart, color: "pink" },
  { value: "student", label: "Student", icon: GraduationCap, color: "purple" },
  { value: "senior", label: "Senior", icon: HeartHandshake, color: "teal" },
  { value: "military", label: "Military", icon: Award, color: "red" }
];

const discountTypes = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount ($)" },
  { value: "bogo", label: "BOGO / Free Person" },
  { value: "special", label: "Special Offer" }
];

const statuses = ["active", "inactive", "expired"];

// Create Offer Modal Component
const CreateOfferModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState<Partial<Offer>>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    discount: "",
    discountType: "percentage",
    discountValue: 0,
    code: "",
    validFrom: "",
    validUntil: "",
    category: "early-bird",
    featured: false,
    status: "active",
    tourIds: [],
    destinationIds: [],
    minParticipants: undefined,
    maxParticipants: undefined,
    bookingDeadline: "",
    images: [],
    highlights: [],
    inclusions: [],
    terms: [],
    maxUsage: undefined,
    usageCount: 0
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...(formData.highlights || []), newHighlight.trim()]
      });
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index)
    });
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...(formData.inclusions || []), newInclusion.trim()]
      });
      setNewInclusion("");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: (formData.inclusions || []).filter((_, i) => i !== index)
    });
  };

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      setFormData({
        ...formData,
        terms: [...(formData.terms || []), newTerm.trim()]
      });
      setNewTerm("");
    }
  };

  const handleRemoveTerm = (index: number) => {
    setFormData({
      ...formData,
      terms: (formData.terms || []).filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    
    try {
      const formDataObj = new FormData();
      Array.from(files).forEach(file => {
        formDataObj.append('images', file);
      });

      const result = await offerService.uploadImages(formDataObj);
      
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...result.urls]
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to upload images",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.shortDescription || !formData.description || !formData.validFrom || !formData.validUntil) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
      return;
    }

    // Generate slug if empty
    if (!formData.slug) {
      formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Generate discount display string
    if (formData.discountType === "percentage") {
      formData.discount = `${formData.discountValue}% OFF`;
    } else if (formData.discountType === "fixed") {
      formData.discount = `$${formData.discountValue} OFF`;
    } else if (formData.discountType === "bogo") {
      formData.discount = "Buy One Get One Free";
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Offer</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new special offer or promotion</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., Early Bird Special"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category || "early-bird"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Offer['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., EARLY20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Brief description of the offer..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Detailed description of the offer..."
                />
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Discount Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                 
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value
                  </label>
                  <div className="relative">
                    {formData.discountType === "fixed" && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    )}
                    {formData.discountType === "percentage" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    )}
                    <input
                      type="number"
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none ${
                        formData.discountType === "fixed" ? "pl-7" : ""
                      }`}
                      placeholder={formData.discountType === "percentage" ? "25" : "100"}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Usage
                  </label>
                  <input
                    type="number"
                    value={formData.maxUsage || ""}
                    onChange={(e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Unlimited if empty"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Validity Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom || ""}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil || ""}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Deadline
                  </label>
                  <input
                    type="text"
                    value={formData.bookingDeadline || ""}
                    onChange={(e) => setFormData({ ...formData, bookingDeadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 2 weeks before departure"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(formData.images || []).map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`Offer image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="relative h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 transition cursor-pointer flex flex-col items-center justify-center">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Participant Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Participants
                  </label>
                  <input
                    type="number"
                    value={formData.minParticipants || ""}
                    onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants || ""}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 8"
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Highlights</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                />
                <button
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.highlights || []).map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    <span>{highlight}</span>
                    <button
                      onClick={() => handleRemoveHighlight(index)}
                      className="ml-1 text-green-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add an inclusion..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInclusion()}
                />
                <button
                  onClick={handleAddInclusion}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.inclusions || []).map((inclusion, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    <span>{inclusion}</span>
                    <button
                      onClick={() => handleRemoveInclusion(index)}
                      className="ml-1 text-blue-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Add a term..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTerm()}
                />
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.terms || []).map((term, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    <span>{term}</span>
                    <button
                      onClick={() => handleRemoveTerm(index)}
                      className="ml-1 text-purple-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status & Featured */}
            <div className="flex items-center space-x-6 pt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Feature this offer</span>
              </label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Offer['status'] })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Offer</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Edit Offer Modal Component
const EditOfferModal = ({ isOpen, onClose, onSave, offer }: any) => {
  const [formData, setFormData] = useState<Partial<Offer>>(offer || {});
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData(offer);
    }
  }, [offer]);

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...(formData.highlights || []), newHighlight.trim()]
      });
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index)
    });
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...(formData.inclusions || []), newInclusion.trim()]
      });
      setNewInclusion("");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: (formData.inclusions || []).filter((_, i) => i !== index)
    });
  };

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      setFormData({
        ...formData,
        terms: [...(formData.terms || []), newTerm.trim()]
      });
      setNewTerm("");
    }
  };

  const handleRemoveTerm = (index: number) => {
    setFormData({
      ...formData,
      terms: (formData.terms || []).filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    
    try {
      const formDataObj = new FormData();
      Array.from(files).forEach(file => {
        formDataObj.append('images', file);
      });

      const result = await offerService.uploadImages(formDataObj);
      
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...result.urls]
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to upload images",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !offer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Offer</h2>
              <p className="text-sm text-gray-500 mt-1">{formData.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Similar to Create Modal with populated data */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category || "early-bird"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Offer['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Discount Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value
                  </label>
                  <div className="relative">
                    {formData.discountType === "fixed" && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    )}
                    {formData.discountType === "percentage" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    )}
                    <input
                      type="number"
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none ${
                        formData.discountType === "fixed" ? "pl-7" : ""
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Usage
                  </label>
                  <input
                    type="number"
                    value={formData.maxUsage || ""}
                    onChange={(e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Validity Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom?.split('T')[0] || ""}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil?.split('T')[0] || ""}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Deadline
                  </label>
                  <input
                    type="text"
                    value={formData.bookingDeadline || ""}
                    onChange={(e) => setFormData({ ...formData, bookingDeadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(formData.images || []).map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`Offer image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="relative h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 transition cursor-pointer flex flex-col items-center justify-center">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Participant Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Participants
                  </label>
                  <input
                    type="number"
                    value={formData.minParticipants || ""}
                    onChange={(e) => setFormData({ ...formData, minParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants || ""}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Highlights</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                />
                <button
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.highlights || []).map((highlight: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    <span>{highlight}</span>
                    <button
                      onClick={() => handleRemoveHighlight(index)}
                      className="ml-1 text-green-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add an inclusion..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInclusion()}
                />
                <button
                  onClick={handleAddInclusion}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.inclusions || []).map((inclusion: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    <span>{inclusion}</span>
                    <button
                      onClick={() => handleRemoveInclusion(index)}
                      className="ml-1 text-blue-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Add a term..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTerm()}
                />
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.terms || []).map((term: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    <span>{term}</span>
                    <button
                      onClick={() => handleRemoveTerm(index)}
                      className="ml-1 text-purple-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status & Featured */}
            <div className="flex items-center space-x-6 pt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Feature this offer</span>
              </label>
              <select
                value={formData.status || "active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Offer['status'] })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Usage Stats */}
            {formData.usageCount !== undefined && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Usage</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.usageCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max Usage</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.maxUsage || "Unlimited"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Delete Offer Modal Component
const DeleteOfferModal = ({ isOpen, onClose, onConfirm, offer }: any) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(offer);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !offer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Offer</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{offer.name}</span>? 
              This action cannot be undone and the offer will no longer be available to customers.
            </p>
            
            {offer.usageCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-700">
                  ⚠️ This offer has been used {offer.usageCount} times. Deleting it may affect existing bookings.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Offers Page
export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchOffers();
  }, [searchTerm, categoryFilter, statusFilter, pagination.page]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const filters: OfferFilters = {
        search: searchTerm || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await offerService.getOffers(filters);

      setOffers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch offers",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers; // Server-side filtering already applied

  const handleCreateOffer = async (newOffer: Partial<Offer>) => {
    try {
      const created = await offerService.createOffer(newOffer);
      setOffers([created, ...offers]);
      setShowCreateModal(false);
      
      Swal.fire({
        title: "Success!",
        text: "Offer created successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create offer",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleEditOffer = async (updatedOffer: Partial<Offer>) => {
    if (!selectedOffer?.id) return;
    
    try {
      const updated = await offerService.updateOffer(selectedOffer.id, updatedOffer);
      setOffers(offers.map(o => o.id === updated.id ? updated : o));
      setShowEditModal(false);
      setSelectedOffer(null);
      
      Swal.fire({
        title: "Success!",
        text: "Offer updated successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update offer",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleDeleteOffer = async (offer: Offer) => {
    try {
      await offerService.deleteOffer(offer.id);
      setOffers(offers.filter(o => o.id !== offer.id));
      setShowDeleteModal(false);
      setSelectedOffer(null);
      
      Swal.fire({
        title: "Deleted!",
        text: "Offer has been deleted",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to delete offer",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleDuplicateOffer = async (offer: Offer) => {
    try {
      const duplicated = await offerService.duplicateOffer(offer.id);
      setOffers([duplicated, ...offers]);
      
      Swal.fire({
        title: "Duplicated!",
        text: "Offer has been duplicated",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to duplicate offer",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOffers.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedOffers.length} offers?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      try {
        await offerService.bulkDeleteOffers(selectedOffers);
        setOffers(offers.filter(o => !selectedOffers.includes(o.id)));
        setSelectedOffers([]);
        Swal.fire("Deleted!", `${selectedOffers.length} offers deleted.`, "success");
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to delete offers",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedOffers.length === 0) return;

    try {
      await offerService.bulkUpdateStatus(selectedOffers, status);
      setOffers(offers.map(o => 
        selectedOffers.includes(o.id) ? { ...o, status: status as Offer['status'] } : o
      ));
      setSelectedOffers([]);
      
      Swal.fire({
        title: "Updated!",
        text: `Offer status updated to ${status}`,
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update status",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const found = categories.find(c => c.value === category);
    return found?.icon || Tag;
  };

  const getCategoryColor = (category: string) => {
    const found = categories.find(c => c.value === category);
    return found?.color || "gray";
  };

  const getStatusColor = (status: string = 'active') => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const getDaysLeft = (validUntil: string) => {
    const days = Math.ceil((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
console.log(`offers: ${JSON.stringify(offers)}`);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Special Offers</h1>
          <p className="text-gray-600 mt-1">Manage promotions, discounts, and special packages</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </button>
          <button 
            onClick={fetchOffers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Offer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search offers by name, description, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOffers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-700">
            {selectedOffers.length} offers selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              Set Inactive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Offers Count */}
          <div className="text-sm text-gray-500">
            Showing {offers.length} of {pagination.total} offers
          </div>

          {/* Offers Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer, index) => {
                const CategoryIcon = getCategoryIcon(offer.category);
                const categoryColor = getCategoryColor(offer.category);
                const expired = isExpired(offer.validUntil);
                const daysLeft = getDaysLeft(offer.validUntil);
                
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-40">
                      <Image
                        src={offer.images[0] || "/Images/placeholder.jpg"}
                        alt={offer.name}
                        fill
                        className="object-cover"
                      />
                      {offer.featured && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${categoryColor}-100 text-${categoryColor}-800`}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {categories.find(c => c.value === offer.category)?.label}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <input
                          type="checkbox"
                          checked={selectedOffers.includes(offer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOffers([...selectedOffers, offer.id]);
                            } else {
                              setSelectedOffers(selectedOffers.filter(id => id !== offer.id));
                            }
                          }}
                          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {offer.discount}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{offer.shortDescription}</p>
                        </div>
                      </div>

                      {offer.code && (
                        <div className="mt-2 inline-block bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {offer.code}
                        </div>
                      )}

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(offer.validFrom).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(offer.validUntil).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(offer.status)}`}>
                            {offer.status}
                          </span>
                          {!expired && offer.status === 'active' && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                              {daysLeft} days left
                            </span>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">{offer.usageCount || 0}</span>
                          <span className="text-xs text-gray-500">/{offer.maxUsage || '∞'}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                        <Link href={`/offers/${offer.slug}`} target="_blank">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateOffer(offer)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOffer(offer);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOffers.length === filteredOffers.length && filteredOffers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOffers(filteredOffers.map(o => o.id));
                          } else {
                            setSelectedOffers([]);
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                      />
                    </th>
                    <th className="px-6 py-4">Offer</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Valid Period</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOffers.map((offer) => {
                    const expired = isExpired(offer.validUntil);
                    
                    return (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOffers.includes(offer.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOffers([...selectedOffers, offer.id]);
                              } else {
                                setSelectedOffers(selectedOffers.filter(id => id !== offer.id));
                              }
                            }}
                            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                              <Image
                                src={offer.images[0] || "/Images/placeholder.jpg"}
                                alt={offer.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{offer.name}</p>
                              <p className="text-xs text-gray-500">{offer.shortDescription.substring(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">{offer.category}</td>
                        <td className="px-6 py-4 font-semibold text-amber-600">{offer.discount}</td>
                        <td className="px-6 py-4">
                          {offer.code && (
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {offer.code}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{new Date(offer.validFrom).toLocaleDateString()}</div>
                            <div className="text-gray-400">to</div>
                            <div>{new Date(offer.validUntil).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(offer.status)}`}>
                            {offer.status}
                            {expired && offer.status === 'active' && ' (Expired)'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="font-medium">{offer.usageCount || 0}</span>
                            <span className="text-gray-400">/{offer.maxUsage || '∞'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link href={`/offers/${offer.slug}`} target="_blank">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedOffer(offer);
                                setShowEditModal(true);
                              }}
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateOffer(offer)}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOffer(offer);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      pagination.page === i + 1
                        ? 'bg-amber-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && offers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No offers found</h3>
          <p className="text-gray-500 mt-2">Get started by creating your first special offer.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateOfferModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateOffer}
      />

      <EditOfferModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOffer(null);
        }}
        onSave={handleEditOffer}
        offer={selectedOffer}
      />

      <DeleteOfferModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedOffer(null);
        }}
        onConfirm={handleDeleteOffer}
        offer={selectedOffer}
      />
    </div>
  );
}