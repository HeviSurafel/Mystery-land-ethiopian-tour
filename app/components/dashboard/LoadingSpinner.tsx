"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const LoadingSpinner = ({ size = "md", color = "amber" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const colorClasses = {
    amber: "border-amber-500",
    green: "border-green-500",
    blue: "border-blue-500",
    gray: "border-gray-500"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-t-transparent ${colorClasses[color as keyof typeof colorClasses]} rounded-full`}
      />
    </div>
  );
};

export default LoadingSpinner;