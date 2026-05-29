'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  LogOut, Menu, X, LayoutDashboard, Megaphone, Image,
  GraduationCap, Users, BookOpen, Settings, ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const navLinks = [
  { href: '/admin/dashboard',          icon: LayoutDashboard, label: 'Dashboard'       },
  { href: '/admin/announcements-mgmt', icon: Megaphone,       label: 'Announcements'   },
  { href: '/admin/gallery-mgmt',       icon: Image,           label: 'Gallery'         },
  { href: '/admin/sunday-school',      icon: GraduationCap,   label: 'Sunday School'   },
  { href: '/admin/youth',              icon: Users,           label: 'Youth'           },
  { href: '/admin/pastors',            icon: BookOpen,        label: "Pastor's Corner" },
  { href: '/admin/settings',           icon: Settings,        label: 'Settings'        },
];

function SidebarContent({
  pathname,
  onSignOut,
  onClose,
}: {
  pathname: string;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#0f0520', borderRight: '1px solid rgba(167,139,250,0.15)' }}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(167,139,250,0.1)' }}>
        <div>
          <p className="font-cinzel text-xs gold-text font-bold tracking-widest uppercase">CRC Admin</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(196,181,253,0.45)' }}>Management Portal</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none lg:hidden"
            style={{ color: 'rgba(196,181,253,0.6)' }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1" aria-label="Admin navigation">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
              style={{
                background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                color: isActive ? '#D4AF37' : 'rgba(196,181,253,0.7)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
              {isActive && <ChevronRight size={14} className="ml-auto" aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-6" style={{ borderTop: '1px solid rgba(167,139,250,0.1)' }}>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none mt-3"
          style={{ color: 'rgba(239,68,68,0.8)' }}
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/admin');
  }, [user, loading, router]);

  // close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // trap focus in drawer on mobile
  useEffect(() => {
    if (drawerOpen) drawerRef.current?.focus();
  }, [drawerOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0520' }}>
        <div className="loading-spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#07020f', color: '#F5F0FF' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="admin-sidebar-overlay lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden transition-transform duration-300"
        style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        aria-label="Admin sidebar"
        aria-hidden={!drawerOpen}
      >
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header
          className="flex items-center gap-4 px-5 py-4 lg:hidden sticky top-0 z-30"
          style={{ background: 'rgba(7,2,15,0.95)', borderBottom: '1px solid rgba(167,139,250,0.1)', backdropFilter: 'blur(12px)' }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="p-2 rounded-xl focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
            style={{ background: 'rgba(124,58,237,0.15)', color: '#D4AF37' }}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <h1 className="font-cinzel text-base font-bold gold-text truncate">{title}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 max-w-6xl w-full mx-auto">
          {/* Desktop page title */}
          <h1 className="hidden lg:block font-cinzel text-2xl font-bold gold-text mb-8">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};
