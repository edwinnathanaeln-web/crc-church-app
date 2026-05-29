// src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { BookOpen, Users, GraduationCap, Megaphone, Image, LogOut, Settings } from 'lucide-react';

export default function AdminDashboard() {
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

  const adminCards = [
    { href: '/admin/pastors', icon: BookOpen, label: 'Pastors Corner', description: 'Manage daily messages & sermons', color: '#3A2C3E' },
    { href: '/admin/youth', icon: Users, label: 'Youth Corner', description: 'Manage youth content', color: '#1E1E24' },
    { href: '/admin/sunday-school', icon: GraduationCap, label: 'Sunday School', description: 'Manage Sunday School', color: '#A8DADC' },
    { href: '/admin/announcements-mgmt', icon: Megaphone, label: 'Announcements', description: 'Manage all announcements', color: '#D4AF37' },
    { href: '/admin/gallery-mgmt', icon: Image, label: 'Gallery', description: 'Manage media gallery', color: '#0D5C63' },
    { href: '/admin/settings', icon: Settings, label: 'App Settings', description: 'Verse of the day & social media links', color: '#7C3AED' },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0D5C63' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
              Admin Dashboard
            </h1>
            <p className="opacity-75 mt-1">Welcome, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <div
                  className="p-6 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                  style={{
                    backgroundColor: `${card.color}33`,
                    border: `2px solid ${card.color}66`,
                  }}
                >
                  <Icon size={40} className="mb-4" style={{ color: card.color }} />
                  <h3 className="text-xl font-bold mb-2">{card.label}</h3>
                  <p className="text-sm opacity-75">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#D4AF37' }}>Quick Tips</h2>
          <ul className="text-sm space-y-2 opacity-90">
            <li>• Upload high-quality images for better engagement</li>
            <li>• Keep announcements concise and clear</li>
            <li>• Update the verse of the day regularly</li>
            <li>• Add new sermons and daily messages consistently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
