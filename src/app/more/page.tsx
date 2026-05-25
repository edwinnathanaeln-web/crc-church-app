// src/app/more/page.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, Image, Heart, Settings } from 'lucide-react';

export default function More() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('home');
  }, [setTheme]);

  const menuItems = [
    { href: '/announcements', icon: Calendar, label: 'All Announcements', description: 'View all church events' },
    { href: '/gallery', icon: Image, label: 'Gallery', description: 'Browse our photo collection' },
    { href: '/giving', icon: Heart, label: 'Giving', description: 'Support God\'s work' },
    { href: '/admin', icon: Settings, label: 'Admin Panel', description: 'Manage church content' },
  ];

  return (
    <div className="page-transition min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          More Options
        </h1>

        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="flex items-center gap-4 p-5 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    borderLeft: '4px solid var(--accent-color)',
                  }}
                >
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    <Icon size={24} style={{ color: 'var(--bg-color)' }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    <p className="text-sm opacity-75">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center opacity-75">
          <p className="text-sm">Christ Restoration Centre</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
