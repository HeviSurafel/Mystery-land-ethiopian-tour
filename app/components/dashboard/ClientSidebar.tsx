"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Star,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Clock,
  MapPin,
  Users,
  Camera,
  Award,
  Bell
} from "lucide-react";
import Image from "next/image";

import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

interface ClientSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export const ClientSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: ClientSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/dashboard/client", 
      icon: LayoutDashboard,
      color: "text-amber-500"
    },
    { 
      name: "My Bookings", 
      href: "/dashboard/client/bookings", 
      icon: Calendar,
      color: "text-blue-500"
    },
    { 
      name: "Wishlist", 
      href: "/dashboard/client/wishlist", 
      icon: Heart,
      color: "text-rose-500"
    },
    { 
      name: "Reviews", 
      href: "/dashboard/client/reviews", 
      icon: Star,
      color: "text-yellow-500"
    },
    { 
      name: "Profile", 
      href: "/dashboard/client/profile", 
      icon: User,
      color: "text-green-500"
    },
    { 
      name: "Settings", 
      href: "/dashboard/client/settings", 
      icon: Settings,
      color: "text-purple-500"
    },
  ];

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
      router.push('/');
    }
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
    mobileOpen: { x: 0 },
    mobileClosed: { x: "-100%" }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial="mobileClosed"
              animate="mobileOpen"
              exit="mobileClosed"
              variants={sidebarVariants}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image 
                        src="/Images/mainlogo.png" 
                        alt="MYSTERY LAND ETHIOPIA TOURS" 
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <span className="font-bold text-[#1a472a]">MYSTERY LAND ETHIOPIA TOURS</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-amber-50 text-amber-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}>
                              <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Mobile User Info & Logout */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    
                        <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 left-0 bottom-0 bg-white shadow-xl hidden lg:block z-30"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image 
                    src="/Images/mainlogo.png" 
                    alt="MYSTERY LAND ETHIOPIA TOURS" 
                    fill
                    className="object-contain"
                  />
                </div>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-bold text-[#1a472a]"
                  >
                   MYSTERY LAND ETHIOPIA TOURS
                  </motion.span>
                )}
              </div>
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors group ${
                        isActive 
                          ? 'bg-amber-50 text-amber-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                        {!isCollapsed && (
                          <span className="font-medium">{item.name}</span>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                            {item.name}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            {!isCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    
                     
                      <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex justify-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
              >
                <LogOut className="w-5 h-5" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  Logout
                </div>
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};