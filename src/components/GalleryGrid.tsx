// src/components/GalleryGrid.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Play } from 'lucide-react';
import { GalleryItem } from '@/types';
import { YouTubeEmbed } from './YouTubeEmbed';
import { useTheme } from '@/contexts/ThemeContext';

interface GalleryGridProps {
  items: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { themeConfig } = useTheme();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              border: `2px solid ${themeConfig.accentColor}44`,
            }}
          >
            {item.type === 'image' && item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.caption || 'Gallery image'}
                fill
                className="object-cover"
              />
            ) : item.type === 'video' && item.youtubeUrl ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <Image
                  src={`https://img.youtube.com/vi/${extractYouTubeId(item.youtubeUrl)}/maxresdefault.jpg`}
                  alt={item.caption || 'Video thumbnail'}
                  fill
                  className="object-cover opacity-70"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: `${themeConfig.accentColor}33` }}
                >
                  <Play size={48} className="opacity-90" style={{ color: themeConfig.accentColor }} />
                </div>
              </div>
            ) : null}
            {item.caption && (
              <div
                className="absolute bottom-0 left-0 right-0 p-2 text-xs backdrop-blur-sm"
                style={{ backgroundColor: `${themeConfig.bgColor}cc` }}
              >
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: themeConfig.accentColor }}
          >
            <X size={32} />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedItem.type === 'image' && selectedItem.imageUrl ? (
              <div className="relative w-full" style={{ maxHeight: '80vh' }}>
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.caption || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ) : selectedItem.type === 'video' && selectedItem.youtubeUrl ? (
              <YouTubeEmbed url={selectedItem.youtubeUrl} title={selectedItem.caption} />
            ) : null}
            {selectedItem.caption && (
              <p className="mt-4 text-center text-white">{selectedItem.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}
