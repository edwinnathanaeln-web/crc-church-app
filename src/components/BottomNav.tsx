'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, GraduationCap, Menu } from 'lucide-react';

const navItems = [
  { href: '/',              icon: Home,         label: 'Home'    },
  { href: '/pastors-corner',icon: BookOpen,     label: 'Pastors' },
  { href: '/youth',         icon: Users,        label: 'Youth'   },
  { href: '/sunday-school', icon: GraduationCap,label: 'Sunday'  },
  { href: '/more',          icon: Menu,         label: 'More'    },
];

// Section-aware theming
function getSectionTheme(pathname: string) {
  if (pathname.startsWith('/pastors-corner'))
    return { bg: 'rgba(13,13,13,0.95)', active: '#D4AF37', inactive: 'rgba(240,234,214,0.4)', border: 'rgba(212,175,55,0.15)' };
  if (pathname.startsWith('/youth'))
    return { bg: 'rgba(10,10,15,0.95)', active: '#00FF88', inactive: 'rgba(167,139,250,0.4)', border: 'rgba(124,58,237,0.2)' };
  if (pathname.startsWith('/sunday-school'))
    return { bg: 'rgba(255,248,240,0.97)', active: '#F97316', inactive: 'rgba(120,113,108,0.5)', border: 'rgba(249,115,22,0.15)' };
  // Default: home / other pages
  return { bg: 'rgba(15,5,32,0.95)', active: '#D4AF37', inactive: 'rgba(196,181,253,0.4)', border: 'rgba(167,139,250,0.15)' };
}

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const theme = getSectionTheme(pathname || '/');
  const isYouth = pathname?.startsWith('/youth');
  const isSunday = pathname?.startsWith('/sunday-school');
  const isPastor = pathname?.startsWith('/pastors-corner');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[68px] flex items-center justify-around"
      style={{
        background: theme.bg,
        borderTop: `1px solid ${theme.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname?.startsWith(item.href);
        const Icon = item.icon;
        const color = isActive ? theme.active : theme.inactive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full gap-[3px] cursor-pointer transition-all duration-200"
            style={{ minWidth: 44 }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{ width: 28, height: 28 }}
            >
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isYouth
                      ? 'rgba(0,255,136,0.12)'
                      : isSunday
                      ? 'rgba(249,115,22,0.12)'
                      : 'rgba(212,175,55,0.12)',
                  }}
                />
              )}
              <Icon
                size={20}
                style={{
                  color,
                  filter: isActive && !isSunday
                    ? `drop-shadow(0 0 6px ${theme.active}66)`
                    : 'none',
                  transition: 'all 200ms ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            </div>
            <span
              className="text-[10px] font-medium tracking-wide transition-all duration-200"
              style={{
                color,
                fontFamily: isSunday
                  ? "'Baloo 2', cursive"
                  : isYouth
                  ? "'Chakra Petch', sans-serif"
                  : isPastor
                  ? "'Cormorant Garamond', serif"
                  : 'inherit',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
