'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GalleryItem } from '@/types';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Image as ImageIcon } from 'lucide-react';

type FilterKey = 'all' | 'youth' | 'sundaySchool' | 'general';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'All'          },
  { key: 'general',     label: 'General'      },
  { key: 'youth',       label: 'Youth'        },
  { key: 'sundaySchool',label: 'Sunday School' },
];

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl bg-white/5" style={{ aspectRatio: '1' }} />
      ))}
    </div>
  );
}

export default function Gallery() {
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, 'galleryItems'), orderBy('uploadedAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          uploadedAt: d.data().uploadedAt?.toDate(),
        })) as GalleryItem[];
        setAllItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? allItems : allItems.filter(i => i.tag === filter);

  return (
    <main className="home-bg page-transition min-h-screen pb-28">
      <div className="max-w-6xl mx-auto px-5 pt-10">

        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.28)' }}
          >
            <ImageIcon size={18} style={{ color: '#D4AF37' }} aria-hidden="true" />
          </div>
          <h1 className="font-cinzel text-xl font-bold gold-text">Church Gallery</h1>
        </header>

        {/* Filter chips */}
        <div
          className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none"
          role="group"
          aria-label="Filter gallery by category"
        >
          {filters.map(({ key, label }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={isActive}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #D4AF37, #B8941F)'
                    : 'rgba(124,58,237,0.12)',
                  color: isActive ? '#0f0520' : 'rgba(196,181,253,0.8)',
                  border: isActive ? 'none' : '1px solid rgba(167,139,250,0.2)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <GallerySkeleton />
        ) : filtered.length > 0 ? (
          <GalleryGrid items={filtered} />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(167,139,250,0.12)' }}
          >
            <ImageIcon size={40} style={{ color: 'rgba(167,139,250,0.3)' }} aria-hidden="true" />
            <p className="mt-3 text-sm" style={{ color: 'rgba(196,181,253,0.5)' }}>
              No items in this category yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
