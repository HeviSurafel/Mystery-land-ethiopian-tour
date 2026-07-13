"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Award,
  Star,
  TrendingUp,
  Users,
  Landmark,
  TreePine,
  Mountain
} from "lucide-react";

interface StatsProps {
  stats: any;
  loading: boolean;
}

export const DestinationStats = ({ stats, loading }: StatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Destinations",
      value: stats?.total || 0,
      icon: MapPin,
      color: "blue"
    },
    {
      title: "Active",
      value: stats?.active || 0,
      icon: Globe,
      color: "green"
    },
    {
      title: "Featured",
      value: stats?.featured || 0,
      icon: Award,
      color: "amber"
    },
    {
      title: "UNESCO Sites",
      value: stats?.unesco || 0,
      icon: Star,
      color: "purple"
    },
    {
      title: "Total Tours",
      value: stats?.totalTours || 0,
      icon: TrendingUp,
      color: "orange"
    },
    {
      title: "Avg Rating",
      value: stats?.avgRating?.toFixed(1) || "0.0",
      icon: Star,
      color: "yellow"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.title}</span>
              <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                <Icon className={`w-4 h-4 text-${stat.color}-600`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
};