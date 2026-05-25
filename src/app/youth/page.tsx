'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Zap, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface YouthPost { id: string; title: string; content: string; date: Date; category?: string; }

export default function Youth() {
  const [posts, setPosts] = useState<YouthPost[]>([]);
  const [selected, setSelected] = useState<YouthPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'youth'), orderBy('date', 'desc')))
      .then(snap => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() })) as YouthPost[]);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="youth-bg flex items-center justify-center min-h-screen">
      <div className="loading-spinner" />
    </div>
  );

  if (selected) return (
    <div className="youth-bg page-transition pb-24 min-h-screen youth-grid-pattern">
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm mb-8 cursor-pointer"
          style={{ color: 'rgba(0,255,136,0.8)', fontFamily: "'Chakra Petch', sans-serif" }}>
          ← BACK
        </button>
        {selected.category && (
          <span className="youth-badge inline-block mb-4">{selected.category}</span>
        )}
        <h1 className="font-russo text-2xl mb-3 leading-tight" style={{ color: '#FFFFFF' }}>
          {selected.title}
        </h1>
        {selected.date && (
          <p className="text-xs mb-6" style={{ color: 'rgba(167,139,250,0.6)', fontFamily: "'Chakra Petch', sans-serif" }}>
            {format(selected.date, 'MMM d, yyyy').toUpperCase()}
          </p>
        )}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(0,255,136,0.5), transparent)', marginBottom: 24 }} />
        <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Chakra Petch', sans-serif", fontWeight: 300 }}>
          {selected.content}
        </p>
      </div>
    </div>
  );

  return (
    <div className="youth-bg page-transition pb-24 min-h-screen youth-grid-pattern">
      {/* Hero Header */}
      <div className="px-5 pt-12 pb-6 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} style={{ color: '#00FF88' }} />
            <span className="text-[10px] tracking-[3px] uppercase" style={{ color: 'rgba(0,255,136,0.7)', fontFamily: "'Chakra Petch', sans-serif" }}>
              Youth Ministry
            </span>
          </div>
          <h1 className="font-russo text-4xl mb-2 leading-none" style={{ color: '#FFFFFF' }}>
            RISE &<br />
            <span className="youth-neon-text">SHINE</span>
          </h1>
          <p style={{ color: 'rgba(167,139,250,0.7)', fontFamily: "'Chakra Petch', sans-serif", fontSize: 13 }}>
            Be bold. Be faith-filled. Be unstoppable.
          </p>
        </div>

        {/* Gradient line */}
        <div className="mt-6" style={{ height: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.5), rgba(0,255,136,0.5), transparent)' }} />
      </div>

      {/* Posts */}
      <div className="px-5 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} style={{ color: 'rgba(124,58,237,0.3)' }} className="mx-auto mb-3" />
            <p className="font-russo text-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>
              COMING SOON
            </p>
          </div>
        ) : posts.map((post) => (
          <button key={post.id} onClick={() => setSelected(post)} className="w-full text-left">
            <div className="youth-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {post.category && (
                    <span className="youth-badge inline-block mb-2 text-[10px]">{post.category}</span>
                  )}
                  <h2 className="font-russo text-base mb-2 leading-snug" style={{ color: '#FFFFFF' }}>
                    {post.title}
                  </h2>
                  <p className="text-sm line-clamp-2 leading-relaxed"
                    style={{ color: 'rgba(167,139,250,0.7)', fontFamily: "'Chakra Petch', sans-serif", fontWeight: 300 }}>
                    {post.content}
                  </p>
                  {post.date && (
                    <p className="text-[11px] mt-2"
                      style={{ color: 'rgba(0,255,136,0.5)', fontFamily: "'Chakra Petch', sans-serif" }}>
                      {format(post.date, 'MMM d, yyyy').toUpperCase()}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(0,255,136,0.4)', flexShrink: 0, marginTop: 4 }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
