"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Mountain,
  Landmark,
  TreePine,
  Camera,
  Compass,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  X,
  Save,
  Globe,
  Tag,
  Award,
  Heart,
  Share2,
  Grid3X3,
  List,
  Settings,
  FileText,
  Image as ImageIcon,
  Map,
  Navigation,
  Sunrise,
  Sunset,
  Coffee,
  Wine,
  Tent,
  Battery,
  Wifi,
  Car,
  Plane,
  Ship,
  Bike,
  Smartphone,
  Shield,
  HelpCircle,
  Info,
  AlertTriangle
} from "lucide-react";
import Swal from "sweetalert2";
import CreateTourModal from "./CreateTourModal";
// Mock data - replace with API calls
const mockTours = [
  {
    id: "tour-001",
    name: "3 Day Omo Valley Highlights",
    slug: "omo-valley-highlights-3-days",
    description: "Experience the best of Omo Valley with visits to local tribes, traditional markets, and stunning landscapes.",
    category: "cultural",
    duration: "3 Days / 2 Nights",
    location: "Omo Valley",
    groupSize: "2-8 people",
    difficulty: "Easy",
    rating: 4.7,
    reviewCount: 42,
    images: ["/Images/omovalley3.webp", "/Images/omo1.webp", "/Images/omo2.webp"],
    status: "active",
    featured: true,
    bookingsCount: 156,
    revenue: 132600,
    createdAt: "2024-01-15",
    updatedAt: "2024-10-01",
    highlights: ["Visit Hammer Tribe", "Traditional Markets", "Local Villages"],
    itinerary: [
      { day: 1, title: "Arrival in Jinka", description: "Arrive in Jinka, meet your guide, and transfer to your lodge." },
      { day: 2, title: "Mursi Village", description: "Visit Mursi tribe and experience their unique culture." },
      { day: 3, title: "Departure", description: "Breakfast and transfer to airport for departure." }
    ],
    inclusions: ["All meals", "Professional guide", "Transportation", "Park fees"],
    exclusions: ["International flights", "Travel insurance", "Personal expenses"],
    bestTime: ["June to September", "December to February"],
    departurePoint: "Jinka",
    languages: ["English", "Amharic"],
    coordinates: { lat: 5.4652, lng: 36.4869 }
  },
  {
    id: "tour-002",
    name: "7 Day Tribal Expedition",
    slug: "omo-valley-tribal-expedition-7-days",
    description: "Comprehensive Omo Valley expedition visiting multiple tribes including Hamer, Mursi, Karo, and Dassanech.",
    category: "cultural",
    duration: "7 Days / 6 Nights",
    location: "Omo Valley",
    
    groupSize: "4-10 people",
    difficulty: "Moderate",
    rating: 4.9,
    reviewCount: 78,
    images: ["/Images/omo1.webp", "/Images/omo2.webp", "/Images/omo3.webp"],
    status: "active",
    featured: true,
    bookingsCount: 98,
    revenue: 181300,
    createdAt: "2024-01-20",
    updatedAt: "2024-09-28"
  },
  {
    id: "tour-003",
    name: "Simien Mountains Trek",
    slug: "simien-mountains-trek",
    description: "Trek through the dramatic landscapes of the Simien Mountains National Park.",
    category: "nature",
    duration: "6 Days / 5 Nights",
    location: "Simien Mountains",
    groupSize: "4-8 people",
    difficulty: "Challenging",
    rating: 4.8,
    reviewCount: 63,
    images: ["/Images/simien1.webp", "/Images/simien2.webp", "/Images/simien3.webp"],
    status: "active",
    featured: true,
    bookingsCount: 87,
    revenue: 104400,
    createdAt: "2024-02-10",
    updatedAt: "2024-09-25"
  },
  {
    id: "tour-004",
    name: "Historical North Circuit",
    slug: "historical-north-circuit",
    description: "Explore ancient kingdoms and UNESCO sites including Lalibela, Axum, and Gondar.",
    category: "historical",
    duration: "10 Days / 9 Nights",
    location: "Northern Ethiopia",
    groupSize: "6-12 people",
    difficulty: "Easy",
    rating: 4.7,
    reviewCount: 56,
    images: ["/Images/lalibela1.webp", "/Images/axum1.webp", "/Images/gondar1.webp"],
    status: "active",
    featured: true,
    bookingsCount: 76,
    revenue: 167200,
    createdAt: "2024-02-15",
    updatedAt: "2024-09-20"
  },
  {
    id: "tour-005",
    name: "Danakil Depression Expedition",
    slug: "danakil-depression-expedition",
    description: "Journey to one of Earth's most extreme environments with active volcanoes and colorful sulfur springs.",
    category: "adventure",
    duration: "4 Days / 3 Nights",
    location: "Danakil Depression",
    groupSize: "6-12 people",
    difficulty: "Challenging",
    rating: 4.9,
    reviewCount: 38,
    images: ["/Images/danakil1.webp", "/Images/danakil2.webp", "/Images/danakil3.webp"],
    status: "active",
    featured: true,
    bookingsCount: 45,
    revenue: 94500,
    createdAt: "2024-03-01",
    updatedAt: "2024-09-18"
  },
  {
    id: "tour-006",
    name: "Lake Tana Monasteries",
    slug: "lake-tana-monasteries",
    description: "Explore ancient monasteries on the islands of Lake Tana, source of the Blue Nile.",
    category: "cultural",
    duration: "3 Days / 2 Nights",
    location: "Bahir Dar",
  
    groupSize: "2-8 people",
    difficulty: "Easy",
    rating: 4.6,
    reviewCount: 31,
    images: ["/Images/bahirdar1.webp", "/Images/bahirdar2.webp", "/Images/bahirdar3.webp"],
    status: "inactive",
    featured: false,
    bookingsCount: 23,
    revenue: 14950,
    createdAt: "2024-03-10",
    updatedAt: "2024-09-10"
  }
];

const categories = [
  { value: "cultural", label: "Cultural", icon: Users },
  { value: "historical", label: "Historical", icon: Landmark },
  { value: "nature", label: "Nature", icon: TreePine },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "trekking", label: "Trekking", icon: Compass }
];

const difficulties = ["Easy", "Moderate", "Challenging"];
const statuses = ["active", "inactive", "upcoming"];

// Create Tour Modal


// Edit Tour Modal
const EditTourModal = ({ isOpen, onClose, onSave, tour }: any) => {
  const [formData, setFormData] = useState(tour || {});
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newBestTime, setNewBestTime] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({ day: 1, title: "", description: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (tour) {
      setFormData(tour);
    }
  }, [tour]);

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
      highlights: formData.highlights.filter((_: any, i: number) => i !== index)
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
      inclusions: formData.inclusions.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setFormData({
        ...formData,
        exclusions: [...(formData.exclusions || []), newExclusion.trim()]
      });
      setNewExclusion("");
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: formData.exclusions.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddBestTime = () => {
    if (newBestTime.trim()) {
      setFormData({
        ...formData,
        bestTime: [...(formData.bestTime || []), newBestTime.trim()]
      });
      setNewBestTime("");
    }
  };

  const handleRemoveBestTime = (index: number) => {
    setFormData({
      ...formData,
      bestTime: formData.bestTime.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), newLanguage.trim()]
      });
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_: any, i: number) => i !== index)
    });
  };

  const handleAddItineraryDay = () => {
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      setFormData({
        ...formData,
        itinerary: [...(formData.itinerary || []), { 
          ...newItineraryDay, 
          day: (formData.itinerary?.length || 0) + 1 
        }]
      });
      setNewItineraryDay({ day: (formData.itinerary?.length || 0) + 2, title: "", description: "" });
    }
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_: any, i: number) => i !== index)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImage(true);
    
    setTimeout(() => {
      const newImages = Array.from(files).map(() => "/Images/placeholder.jpg");
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newImages]
      });
      setUploadingImage(false);
    }, 1500);
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_: any, i: number) => i !== index)
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen || !tour) return null;

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
              <h2 className="text-xl font-bold text-gray-900">Edit Tour</h2>
              <p className="text-sm text-gray-500 mt-1">{formData.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Similar to Create Modal but with populated data */}
          <div className="p-6 space-y-6">
            {/* Same form fields as Create Modal with formData values */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Name *
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
                    value={formData.category || "cultural"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty || "Easy"}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Feature this tour</span>
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`Tour image ${index + 1}`}
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
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
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

            {/* Location & Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location & Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size
                  </label>
                  <input
                    type="text"
                    value={formData.groupSize || ""}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
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
                {formData.highlights?.map((highlight: string, index: number) => (
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
                {formData.inclusions?.map((inclusion: string, index: number) => (
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

            {/* Exclusions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's Not Included</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="Add an exclusion..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
                />
                <button
                  onClick={handleAddExclusion}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.exclusions?.map((exclusion: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    <span>{exclusion}</span>
                    <button
                      onClick={() => handleRemoveExclusion(index)}
                      className="ml-1 text-red-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTourModal;