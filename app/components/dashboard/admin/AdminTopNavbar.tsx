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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "New Booking", 
      message: "John Doe booked Omo Valley Tour", 
      time: "2 min ago", 
      read: false,
      type: "booking",
      icon: Calendar,
      color: "text-blue-500"
    },
    { 
      id: 2, 
      title: "Payment Received", 
      message: "$850 payment for Tour #1234", 
      time: "15 min ago", 
      read: false,
      type: "payment",
      icon: DollarSign,
      color: "text-green-500"
    },
    { 
      id: 3, 
      title: "New User Registered", 
      message: "Sarah Williams joined as client", 
      time: "1 hour ago", 
      read: true,
      type: "user",
      icon: Users,
      color: "text-purple-500"
    },
    { 
      id: 4, 
      title: "System Alert", 
      message: "Backup completed successfully", 
      time: "3 hours ago", 
      read: true,
      type: "system",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const quickActions = [
    { name: "Add New Tour", href: "/admin/tours/create", icon: Calendar, color: "text-blue-500" },
    { name: "Add Experience", href: "/admin/experiences/create", icon: Star, color: "text-purple-500" },
    { name: "Create Offer", href: "/admin/offers/create", icon: Tag, color: "text-rose-500" },
    { name: "Add User", href: "/admin/users/create", icon: User, color: "text-green-500" },
    { name: "View Reports", href: "/admin/reports", icon: BarChart3, color: "text-amber-500" },
  ];

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
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Clock className="w-5 h-5 text-gray-600" />
            </button>

            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="py-2">
                    {quickActions.map((action, index) => (
                      <Link key={index} href={action.href}>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3">
                          <action.icon className={`w-4 h-4 ${action.color}`} />
                          <span className="text-sm text-gray-700">{action.name}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-amber-600 hover:text-amber-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <notification.icon className={`w-4 h-4 ${notification.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm text-gray-900">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t">
                    <Link href="/admin/notifications">
                      <button className="text-xs text-amber-600 hover:text-amber-700 w-full text-center">
                        View all notifications
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                  <Link href="/admin/profile">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  </Link>
                  <Link href="/admin/settings">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </Link>
                  <Link href="/admin/activity">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Activity Log</span>
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