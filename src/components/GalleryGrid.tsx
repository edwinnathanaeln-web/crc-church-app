'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Play, ZoomIn } from 'lucide-react';
import { GalleryItem } from '@/types';
import { YouTubeEmbed } from './YouTubeEmbed';

interface GalleryGridProps {
  items: GalleryItem[];
}

function extractYouTubeId(url: string): string {
  const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : '';
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((item: GalleryItem, el: HTMLElement) => {
    triggerRef.current = el;
    setSelected(item);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    // return focus to the thumbnail that opened the lightbox
    setTimeout(() => (triggerRef.current as HTMLElement | null)?.focus(), 50);
  }, []);

  // trap focus inside lightbox & close on Escape
  useEffect(() => {
    if (!selected) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close]);

  return (
    <>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        role="list"
        aria-label="Gallery items"
      >
        {items.map(item => {
          const ytId = item.type === 'video' && item.youtubeUrl ? extractYouTubeId(item.youtubeUrl) : '';

          return (
            <div
              key={item.id}
              role="listitem"
              className="gallery-item"
              style={{ border: '1px solid rgba(167,139,250,0.18)' }}
            >
              <button
                className="w-full h-full focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none rounded-xl"
                aria-label={item.caption ? `View: ${item.caption}` : 'View gallery item'}
                onClick={e => open(item, e.currentTarget)}
              >
                {item.type === 'image' && item.imageUrl ? (
                  <div className="relative w-full" style={{ aspectRatio: '1' }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.caption || 'Church gallery photo'}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <span className="gallery-item-overlay">
                      <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </span>
                  </div>
                ) : ytId ? (
                  <div className="relative w-full bg-black" style={{ aspectRatio: '1' }}>
                    <Image
                      src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                      alt={item.caption || 'Video thumbnail'}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover opacity-70"
                      loading="lazy"
                    />
                    <span className="gallery-item-overlay" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <Play size={36} style={{ color: '#D4AF37' }} aria-hidden="true" />
                    </span>
                  </div>
                ) : null}

                {item.caption && (
                  <span
                    className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-[11px] text-white leading-tight text-left"
                    style={{ background: 'rgba(15,5,32,0.75)', backdropFilter: 'blur(4px)' }}
                  >
                    {item.caption}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.caption || 'Gallery image lightbox'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={close}
        >
          <button
            ref={closeRef}
            onClick={close}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 p-3 rounded-full transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#D4AF37' }}
          >
            <X size={22} aria-hidden="true" />
          </button>

          <div
            className="max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {selected.type === 'image' && selected.imageUrl ? (
              <Image
                src={selected.imageUrl}
                alt={selected.caption || 'Gallery image'}
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl"
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
                priority
              />
            ) : selected.type === 'video' && selected.youtubeUrl ? (
              <YouTubeEmbed url={selected.youtubeUrl} title={selected.caption} />
            ) : null}

            {selected.caption && (
              <p className="mt-3 text-center text-sm" style={{ color: 'rgba(196,181,253,0.85)' }}>
                {selected.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
