"use client";

import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  Users,
  CreditCard
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    description: "3 Day Omo Valley Highlights",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    id: 2,
    type: "review",
    title: "Review Submitted",
    description: "7 Day Tribal Expedition",
    time: "1 day ago",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Processed",
    description: "Lake Chamo Safari - $650",
    time: "3 days ago",
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    id: 4,
    type: "tour",
    title: "Tour Completed",
    description: "Simien Mountains Trek",
    time: "1 week ago",
    icon: MapPin,
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
];

export const RecentActivity = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <div className={`p-2 ${activity.bg} rounded-lg`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.description}</p>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {activity.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};