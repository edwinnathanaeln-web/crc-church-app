// src/components/admin/AdminLayout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D5C63' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0D5C63', color: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#D4AF37' }}>
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
};
