// src/app/gallery/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { GalleryItem } from '@/types';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Filter } from 'lucide-react';

export default function Gallery() {
  const { setTheme } = useTheme();
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'youth' | 'sundaySchool' | 'general'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('home');
    fetchGallery();
  }, [setTheme]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item => item.tag === filter));
    }
  }, [filter, allItems]);

  const fetchGallery = async () => {
    try {
      const q = query(collection(db, 'galleryItems'), orderBy('uploadedAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      })) as GalleryItem[];
      setAllItems(data);
      setFilteredItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          Church Gallery
        </h1>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter size={20} style={{ color: 'var(--accent-color)' }} />
          {['all', 'general', 'youth', 'sundaySchool'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                filter === f ? 'shadow-lg' : 'opacity-60'
              }`}
              style={{
                backgroundColor: filter === f ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
                color: filter === f ? 'var(--bg-color)' : 'var(--text-color)',
              }}
            >
              {f === 'sundaySchool' ? 'Sunday School' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <GalleryGrid items={filteredItems} />
        ) : (
          <p className="text-center opacity-75 p-6">No gallery items in this category.</p>
        )}
      </div>
    </div>
  );
}
