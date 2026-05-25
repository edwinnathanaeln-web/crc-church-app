// src/components/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, GraduationCap, Menu } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeType } from '@/types';

const navItems = [
  { href: '/', icon: Home, label: 'Home', theme: 'home' as ThemeType },
  { href: '/pastors-corner', icon: BookOpen, label: 'Pastors', theme: 'pastorscorner' as ThemeType },
  { href: '/youth', icon: Users, label: 'Youth', theme: 'youth' as ThemeType },
  { href: '/sunday-school', icon: GraduationCap, label: 'Sunday', theme: 'sundayschool' as ThemeType },
  { href: '/more', icon: Menu, label: 'More', theme: 'home' as ThemeType },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { setTheme, themeConfig } = useTheme();

  const handleNavClick = (theme: ThemeType) => {
    setTheme(theme);
  };

  // Don't show bottom nav on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg transition-all duration-500"
      style={{
        backgroundColor: `${themeConfig.bgColor}dd`,
        borderTopColor: `${themeConfig.accentColor}44`,
      }}
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.theme)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
            >
              <Icon
                size={24}
                className={`transition-all duration-300 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-70'
                }`}
                style={{ color: isActive ? themeConfig.accentColor : themeConfig.textColor }}
              />
              <span
                className={`text-xs mt-1 transition-all duration-300 ${
                  isActive ? 'font-semibold' : 'font-normal opacity-70'
                }`}
                style={{ color: isActive ? themeConfig.accentColor : themeConfig.textColor }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
