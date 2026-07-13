"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { AdminSidebar } from "@/components/dashboard/admin/AdminSidebar";
import { AdminTopNavbar } from "@/components/dashboard/admin/AdminTopNavbar";


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        router.push('/login');
      } else if (!hasRole(['admin', 'owner'])) {
        router.push('/');
      }
    }
  }, [user, loading, mounted, router, hasRole]);

  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  if (!user || !hasRole(['admin', 'owner'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div 
        className={`transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <AdminTopNavbar 
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}