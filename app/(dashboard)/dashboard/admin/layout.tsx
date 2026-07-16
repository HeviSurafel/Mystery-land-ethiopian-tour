// app/dashboard/client/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { ClientTopNavbar } from "@/components/dashboard/ClientTopNavbar";


export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && mounted) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.toLowerCase() === 'admin') {
        // Redirect admin to admin dashboard
        router.push('/dashboard/admin');
      } else if (user.role?.toLowerCase() !== 'client') {
        // Redirect other roles to home
        router.push('/dashboard/client');
      }
    }
  }, [user, isLoading, mounted, router]);

  if (!mounted || isLoading) {
    return <LoadingSpinner />;
  }

  // Only render client layout if user is client
  if (!user || user.role?.toLowerCase() !== 'client') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar 
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
        <ClientTopNavbar 
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