import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  MapPin,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { ApiExperience } from "./types";

interface ExperienceCardProps {
  experience: ApiExperience;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (experience: ApiExperience) => void;
  onEdit?: (experience: ApiExperience) => void;
}

export const ExperienceCard = ({
  experience,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onEdit,
}: ExperienceCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const id = experience._id || experience.id || '';

  const getStatusColor = (status: string = "active") => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-gray-600 bg-gray-50";
      case "upcoming":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tribal": return "👥";
      case "coffee": return "☕";
      case "festivals": return "🎉";
      case "food": return "🍽️";
      case "hiking": return "🥾";
      case "birding": return "🦅";
      case "photography": return "📸";
      case "wellness": return "🧘";
      default: return "✨";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group relative"
    >
      <div className="relative h-48">
        <Image
          src={experience.images?.[0] || "/Images/placeholder.jpg"}
          alt={experience.name}
          fill
          className="object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(id)}
            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
          />
        </div>
      
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>{experience.rating?.toFixed(1) || "0.0"}</span>
          <span>({experience.reviewCount || 0})</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {experience.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
                {getCategoryIcon(experience.category)} {experience.category}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <Link href={`/admin/experiences/${id}`}>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </Link>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(experience)}
                      className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDuplicate(experience)}
                    className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {experience.shortDescription || experience.description}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-3 h-3 mr-2" />
            {experience.duration}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-3 h-3 mr-2" />
            {experience.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-3 h-3 mr-2" />
            {experience.bookings || 0} bookings
          </div>
        </div>
      </div>
    </motion.div>
  );
};