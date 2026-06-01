'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, GraduationCap, MoreHorizontal } from 'lucide-react';

const navItems = [
  { href: '/',               icon: Home,           label: 'Home'    },
  { href: '/pastors-corner', icon: BookOpen,        label: 'Pastors' },
  { href: '/youth',          icon: Users,           label: 'Youth'   },
  { href: '/sunday-school',  icon: GraduationCap,   label: 'Sunday'  },
  { href: '/more',           icon: MoreHorizontal,  label: 'More'    },
];

function getAccentColor(pathname: string) {
  if (pathname.startsWith('/pastors-corner')) return '#D4AF37';
  if (pathname.startsWith('/youth'))          return '#00FF88';
  if (pathname.startsWith('/sunday-school'))  return '#F97316';
  return '#D4AF37';
}

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const accent = getAccentColor(pathname || '/');

  return (
    <nav
      aria-label="Main navigation"
      className="bottom-nav"
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className="nav-item"
          >
            {/* 44×44 touch target with pill background when active */}
            <span
              className="relative flex items-center justify-center rounded-2xl transition-all duration-200"
              style={{
                width: 44,
                height: 36,
                background: isActive ? `${accent}18` : 'transparent',
                border: isActive ? `1px solid ${accent}30` : '1px solid transparent',
              }}
            >
              <Icon
                size={19}
                aria-hidden="true"
                style={{
                  color: isActive ? accent : 'rgba(138,143,152,0.7)',
                  filter: isActive ? `drop-shadow(0 0 6px ${accent}80)` : 'none',
                  transition: 'all 200ms ease',
                }}
              />
            </span>

            <span
              className="text-[10px] tracking-wide transition-colors duration-200"
              style={{
                color: isActive ? accent : 'rgba(138,143,152,0.55)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
