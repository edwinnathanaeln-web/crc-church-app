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

function getSectionTheme(pathname: string) {
  if (pathname.startsWith('/pastors-corner'))
    return { bg: 'rgba(13,13,13,0.96)', active: '#D4AF37', inactive: 'rgba(240,234,214,0.38)', border: 'rgba(212,175,55,0.15)', glow: '#D4AF37' };
  if (pathname.startsWith('/youth'))
    return { bg: 'rgba(10,10,15,0.96)', active: '#00FF88', inactive: 'rgba(167,139,250,0.38)', border: 'rgba(124,58,237,0.2)', glow: '#00FF88' };
  if (pathname.startsWith('/sunday-school'))
    return { bg: 'rgba(255,248,240,0.97)', active: '#F97316', inactive: 'rgba(120,113,108,0.45)', border: 'rgba(249,115,22,0.15)', glow: '#F97316' };
  return { bg: 'rgba(15,5,32,0.96)', active: '#D4AF37', inactive: 'rgba(196,181,253,0.38)', border: 'rgba(167,139,250,0.15)', glow: '#D4AF37' };
}

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const theme = getSectionTheme(pathname || '/');

  return (
    <nav
      aria-label="Main navigation"
      className="bottom-nav"
      style={{
        background: theme.bg,
        borderTop: `1px solid ${theme.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
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
            {/* icon wrapper — min 44×44 touch target */}
            <span
              className="relative flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 44,
                height: 44,
                background: isActive ? `${theme.active}1a` : 'transparent',
              }}
            >
              <Icon
                size={20}
                aria-hidden="true"
                style={{
                  color: isActive ? theme.active : theme.inactive,
                  filter: isActive ? `drop-shadow(0 0 5px ${theme.glow}55)` : 'none',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 200ms ease',
                }}
              />
              {isActive && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: theme.active }}
                  aria-hidden="true"
                />
              )}
            </span>

            <span
              className="text-[10px] font-medium tracking-wide transition-colors duration-200"
              style={{
                color: isActive ? theme.active : theme.inactive,
                fontWeight: isActive ? 700 : 400,
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
