import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
import Image from "next/image";
const CreateTourModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "cultural",
    duration: "",
    location: "",
    groupSize: "",
    difficulty: "Easy",
    status: "active",
    featured: false,
    highlights: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    bestTime: [] as string[],
    languages: [] as string[],
    departurePoint: "",
    images: [] as string[],
    itinerary: [] as { day: number; title: string; description: string }[],
    coordinates: {
      lat: "",
      lng: ""
    }
  });
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

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newBestTime, setNewBestTime] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({ day: 1, title: "", description: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newHighlight.trim()]
      });
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, newInclusion.trim()]
      });
      setNewInclusion("");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions.filter((_, i) => i !== index)
    });
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setFormData({
        ...formData,
        exclusions: [...formData.exclusions, newExclusion.trim()]
      });
      setNewExclusion("");
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: formData.exclusions.filter((_, i) => i !== index)
    });
  };

  const handleAddBestTime = () => {
    if (newBestTime.trim()) {
      setFormData({
        ...formData,
        bestTime: [...formData.bestTime, newBestTime.trim()]
      });
      setNewBestTime("");
    }
  };

  const handleRemoveBestTime = (index: number) => {
    setFormData({
      ...formData,
      bestTime: formData.bestTime.filter((_, i) => i !== index)
    });
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  const handleAddItineraryDay = () => {
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      setFormData({
        ...formData,
        itinerary: [...formData.itinerary, { ...newItineraryDay, day: formData.itinerary.length + 1 }]
      });
      setNewItineraryDay({ day: formData.itinerary.length + 2, title: "", description: "" });
    }
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImage(true);
    
    // Simulate upload
    setTimeout(() => {
      const newImages = Array.from(files).map(() => "/Images/placeholder.jpg");
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
      setUploadingImage(false);
    }, 1500);
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.duration || !formData.location) {
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

    onSave(formData);
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
              <h2 className="text-xl font-bold text-gray-900">Create New Tour</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new tour package</p>
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
                    Tour Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 3 Day Omo Valley Highlights"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
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
                    value={formData.category}
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
                    value={formData.difficulty}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Detailed description of the tour..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Feature this tour</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
                {formData.images.map((image, index) => (
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., Omo Valley"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 3 Days / 2 Nights"
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size
                  </label>
                  <input
                    type="text"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., 2-8 people"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Point
                  </label>
                  <input
                    type="text"
                    value={formData.departurePoint}
                    onChange={(e) => setFormData({ ...formData, departurePoint: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="e.g., Jinka"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={formData.coordinates.lat}
                      onChange={(e) => setFormData({
                        ...formData,
                        coordinates: { ...formData.coordinates, lat: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="e.g., 5.4652"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={formData.coordinates.lng}
                      onChange={(e) => setFormData({
                        ...formData,
                        coordinates: { ...formData.coordinates, lng: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="e.g., 36.4869"
                    />
                  </div>
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
                {formData.highlights.map((highlight, index) => (
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
                {formData.inclusions.map((inclusion, index) => (
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
                {formData.exclusions.map((exclusion, index) => (
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

            {/* Best Time to Visit */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Best Time to Visit</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newBestTime}
                  onChange={(e) => setNewBestTime(e.target.value)}
                  placeholder="e.g., June to September"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBestTime()}
                />
                <button
                  onClick={handleAddBestTime}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.bestTime.map((time, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    <span>{time}</span>
                    <button
                      onClick={() => handleRemoveBestTime(index)}
                      className="ml-1 text-purple-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                />
                <button
                  onClick={handleAddLanguage}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <span>{language}</span>
                    <button
                      onClick={() => handleRemoveLanguage(index)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Itinerary</h3>
              <div className="space-y-3">
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{day.title}</p>
                      <p className="text-sm text-gray-600">{day.description}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItineraryDay(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 border border-dashed border-gray-300 rounded-lg">
                <input
                  type="text"
                  placeholder="Day title"
                  value={newItineraryDay.title}
                  onChange={(e) => setNewItineraryDay({ ...newItineraryDay, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <textarea
                  placeholder="Day description"
                  value={newItineraryDay.description}
                  onChange={(e) => setNewItineraryDay({ ...newItineraryDay, description: e.target.value })}
                  rows={2}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleAddItineraryDay}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Add Day
                </button>
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
              <span>Create Tour</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default CreateTourModal;