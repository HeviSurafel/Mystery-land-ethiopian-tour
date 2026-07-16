"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Map,
  Calendar,
  Image as Images,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Star,
  Tag,
  BarChart3,
  Shield,
  Award,
  Camera,
  BookOpen,
  Gift,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Flag,
  Home,
  Globe,
  Coffee,
  Mountain,
  Landmark,
  TreePine,
  Heart,
  MessageCircle,
  Bell,
  PenLineIcon
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

// Define allowed role types
type UserRole = "client" | "admin" | "owner";

export const AdminSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}: AdminSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Type-safe navigation items
  const navigation = [
    { 
      name: "Dashboard", 
      href: "/dashboard/admin", 
      icon: LayoutDashboard,
      color: "text-amber-500" as const
    },
    { 
      name: "Users", 
      href: "/dashboard/admin/users", 
      icon: Users,
      color: "text-blue-500" as const,
      badge: "",
      permissions: ['admin', 'owner'] as UserRole[]
    },
    {
      name: "Management",
      icon: Package,
      color: "text-green-500" as const,
      submenu: [
        { 
          name: "Tours", 
          href: "/dashboard/admin/tours", 
          icon: Mountain,
          color: "text-emerald-500" as const
        },
        { 
          name: "Experiences", 
          href: "/dashboard/admin/experiences", 
          icon: Star,
          color: "text-purple-500" as const,
          badge: "5"
        },
        { 
          name: "Destinations", 
          href: "/dashboard/admin/destinations", 
          icon: Map,
          color: "text-indigo-500" as const
        },
        { 
          name: "Special Offers", 
          href: "/dashboard/admin/offers", 
          icon: Tag,
          color: "text-rose-500" as const
        }
      ]
    },
    {
      name: "Bookings",
      icon: Calendar,
      href: "/dashboard/admin/bookings",
      color: "text-orange-500" as const,
    },
    {
      name: "Content",
      icon: FileText,
      color: "text-purple-500" as const,
      submenu: [
        { 
          name: "Blog Posts", 
          href: "/dashboard/admin/blog", 
          icon: BookOpen,
          color: "text-indigo-500" as const
        },
        { 
          name: "Gallery", 
          href: "/dashboard/admin/gallery", 
          icon: Camera,
          color: "text-pink-500" as const
        },
        
      ]
    },
    {
      name:'Reviews',
      icon: PenLineIcon,
      href: "/dashboard/admin/reviews",
      color: "text-sky-500" as const
    },
  
    {
      name:'Inquiries',
      icon: MessageCircle,
      href: "/dashboard/admin/inquiries",
      color: "text-sky-500" as const
    },
    { 
      name: "Settings", 
      href: "/dashboard/admin/settings", 
      icon: Settings,
      color: "text-gray-500" as const
    }
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

  // Define types for navigation items
  interface NavItemType {
    name: string;
    href?: string;
    icon: any;
    color: string;
    badge?: string;
    permissions?: UserRole[];
    submenu?: SubNavItemType[];
  }

  interface SubNavItemType {
    name: string;
    href: string;
    icon: any;
    color: string;
    badge?: string;
  }

  const NavItem = ({ item }: { item: NavItemType }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.href ? pathname === item.href : false;
    const isSubmenuOpen = openSubmenu === item.name;

    // Check permissions - with proper type checking
    if (item.permissions && user?.role) {
      const userRole = user.role as UserRole;
      if (!item.permissions.includes(userRole)) {
        return null;
      }
    }

    if (hasSubmenu) {
      return (
        <div className="mb-1">
          <button
            onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-colors group relative ${
              isSubmenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              {!isCollapsed && (
                <span className="font-medium text-gray-700">{item.name}</span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                isSubmenuOpen ? 'rotate-90' : ''
              }`} />
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </button>

          <AnimatePresence>
            {isSubmenuOpen && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-11 mt-1 space-y-1"
              >
                {item.submenu?.map((subItem: SubNavItemType, index: number) => (
                  <Link key={index} href={subItem.href}>
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      pathname === subItem.href 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <subItem.icon className={`w-4 h-4 ${subItem.color}`} />
                        <span className="text-sm">{subItem.name}</span>
                      </div>
                      {subItem.badge && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          {subItem.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link href={item.href!}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors group relative ${
          isActive 
            ? 'bg-amber-50 text-amber-600' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}>
          <item.icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          )}
          {isCollapsed && (
            <>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {item.name}
                {item.badge && ` (${item.badge})`}
              </div>
            </>
          )}
        </div>
      </Link>
    );
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
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image 
                        src="/Images/mainlogo.jpg" 
                        alt="MYSTERY LAND ETHIOPIA TOURS" 
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <span className="font-bold text-[#1a472a]">Admin Panel</span>
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
                  {navigation.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                </nav>

                {/* Mobile User Info & Logout */}
                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
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
        className="fixed top-0 left-0 bottom-0 bg-white shadow-xl hidden lg:block z-30 overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b sticky top-0 bg-white">
            <Link href={`/`}>
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
                    Admin Panel
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
            {navigation.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t sticky bottom-0 bg-white">
            {!isCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <User className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
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