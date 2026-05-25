'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star, BookOpen, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface SundayLesson { id: string; title: string; content: string; date: Date; ageGroup?: string; theme?: string; }

const COLORS = ['#FDE68A','#A7F3D0','#BFDBFE','#FCA5A5','#C4B5FD','#FED7AA'];

export default function SundaySchool() {
  const [lessons, setLessons] = useState<SundayLesson[]>([]);
  const [selected, setSelected] = useState<SundayLesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'sundaySchool'), orderBy('date', 'desc')))
      .then(snap => {
        setLessons(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() })) as SundayLesson[]);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="sunday-bg flex items-center justify-center min-h-screen">
      <div className="w-9 h-9 rounded-full border-4 border-orange-200 border-t-orange-400 animate-spin" />
    </div>
  );

  if (selected) return (
    <div className="sunday-bg page-transition pb-24 min-h-screen relative overflow-hidden">
      <div className="floating-blob w-48 h-48 bg-yellow-200 top-0 right-0" />
      <div className="floating-blob w-32 h-32 bg-orange-200 bottom-20 left-0" style={{ animationDelay: '-4s' }} />
      <div className="px-5 pt-12 pb-6 relative z-10">
        <button onClick={() => setSelected(null)}
          className="clay-button mb-6 text-sm py-2 px-4"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 4px 0 #047857, 0 6px 14px rgba(16,185,129,0.25)' }}>
          ← Back
        </button>
        {selected.ageGroup && (
          <span className="clay-badge inline-block mb-3">{selected.ageGroup}</span>
        )}
        <h1 className="font-baloo text-2xl font-bold mb-2 leading-tight" style={{ color: '#1C1917' }}>
          {selected.title}
        </h1>
        {selected.date && (
          <p className="text-sm mb-6 font-comic" style={{ color: '#78716C' }}>
            📅 {format(selected.date, 'MMMM d, yyyy')}
          </p>
        )}
        <div className="clay-card p-5">
          <p className="font-comic text-base leading-relaxed" style={{ color: '#1C1917' }}>
            {selected.content}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sunday-bg page-transition pb-24 min-h-screen relative overflow-hidden">
      {/* Blobs */}
      <div className="floating-blob w-56 h-56 bg-yellow-200 -top-10 -right-10" />
      <div className="floating-blob w-40 h-40 bg-orange-200 top-32 -left-10" style={{ animationDelay: '-3s' }} />
      <div className="floating-blob w-32 h-32 bg-green-200 bottom-32 right-0" style={{ animationDelay: '-6s' }} />

      {/* Header */}
      <div className="px-5 pt-12 pb-6 relative z-10">
        <div className="clay-card p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #FDE68A, #FCA5A5)', boxShadow: '0 4px 0 #e8d4a0, 0 6px 16px rgba(0,0,0,0.1)' }}>
              ✝️
            </div>
            <div>
              <h1 className="font-baloo text-2xl font-bold leading-tight" style={{ color: '#1C1917' }}>
                Sunday School
              </h1>
              <p className="font-comic text-sm" style={{ color: '#78716C' }}>
                Learn, Grow & Have Fun! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="px-5 relative z-10 space-y-4">
        {lessons.length === 0 ? (
          <div className="clay-card p-8 text-center">
            <p className="text-4xl mb-3">📖</p>
            <p className="font-baloo text-lg font-bold mb-1" style={{ color: '#1C1917' }}>
              Coming Soon!
            </p>
            <p className="font-comic text-sm" style={{ color: '#78716C' }}>
              Lessons are being prepared just for you
            </p>
          </div>
        ) : lessons.map((lesson, i) => (
          <button key={lesson.id} onClick={() => setSelected(lesson)} className="w-full text-left">
            <div className="clay-card p-5">
              <div className="flex items-start gap-4">
                {/* Color block */}
                <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: COLORS[i % COLORS.length],
                    boxShadow: `0 3px 0 ${COLORS[i % COLORS.length]}99`
                  }}>
                  <Star size={16} style={{ color: '#1C1917', opacity: 0.6 }} />
                </div>
                <div className="flex-1">
                  {lesson.ageGroup && (
                    <span className="clay-badge inline-block mb-2 text-[10px]">{lesson.ageGroup}</span>
                  )}
                  <h2 className="font-baloo text-base font-bold mb-1 leading-snug" style={{ color: '#1C1917' }}>
                    {lesson.title}
                  </h2>
                  <p className="font-comic text-xs line-clamp-2 leading-relaxed mb-2"
                    style={{ color: '#78716C' }}>
                    {lesson.content}
                  </p>
                  {lesson.date && (
                    <p className="font-comic text-[11px]" style={{ color: '#A8A29E' }}>
                      {format(lesson.date, 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} style={{ color: '#F97316', flexShrink: 0, marginTop: 4 }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
