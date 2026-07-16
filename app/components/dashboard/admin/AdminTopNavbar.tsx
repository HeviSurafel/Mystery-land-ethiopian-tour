"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  MessageCircle,
  BarChart3,
  Star,
  Tag
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface AdminTopNavbarProps {
  setIsMobileOpen: (value: boolean) => void;
  isCollapsed: boolean;
}

export const AdminTopNavbar = ({ setIsMobileOpen, isCollapsed }: AdminTopNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
 
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { user, logout } = useAuth();



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout"
    });

    if (result.isConfirmed) {
      await logout();
    }
  };

  


  return (
    <header className={`sticky top-0 z-20 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className={`px-4 py-3 flex items-center justify-between ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, bookings, tours..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
         

          {/* Notifications */}
        
          {/* Admin Badge */}
          <div className="hidden md:flex items-center space-x-1 px-2 py-1 bg-amber-100 rounded-full">
            <Shield className="w-3 h-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700 capitalize">{user?.role}</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
               
                  <User className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-3 border-b md:hidden">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                
                  <Link href="/dashboard/admin/settings">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center space-x-2 border-t"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};