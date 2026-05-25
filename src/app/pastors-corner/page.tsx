'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookOpen, Calendar, ChevronRight, Mic } from 'lucide-react';
import { format } from 'date-fns';

interface PastorMessage { id: string; title: string; content: string; date: Date; author?: string; scripture?: string; }

export default function PastorsCorner() {
  const [messages, setMessages] = useState<PastorMessage[]>([]);
  const [selected, setSelected] = useState<PastorMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'pastorsCorner'), orderBy('date', 'desc')))
      .then(snap => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate() })) as PastorMessage[]);
      }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pastor-bg flex items-center justify-center min-h-screen">
      <div className="loading-spinner" />
    </div>
  );

  if (selected) return (
    <div className="pastor-bg page-transition pb-24 min-h-screen">
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm mb-8 cursor-pointer transition-opacity hover:opacity-70"
          style={{ color: 'rgba(212,175,55,0.8)', fontFamily: "'Cormorant Garamond', serif" }}>
          ← Back to Messages
        </button>
        <div className="pastor-divider" />
        {selected.scripture && (
          <p className="text-xs tracking-[2px] uppercase mb-2" style={{ color: 'rgba(212,175,55,0.6)' }}>
            {selected.scripture}
          </p>
        )}
        <h1 className="font-cinzel text-2xl font-bold leading-tight mb-2" style={{ color: '#F0EAD6' }}>
          {selected.title}
        </h1>
        {selected.author && (
          <p className="text-sm mb-1" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
            — {selected.author}
          </p>
        )}
        {selected.date && (
          <p className="text-xs mb-8" style={{ color: 'rgba(156,163,175,0.7)' }}>
            {format(selected.date, 'MMMM d, yyyy')}
          </p>
        )}
        <div className="pastor-divider" />
        <p className="font-cormorant text-lg leading-[1.9]" style={{ color: 'rgba(240,234,214,0.9)' }}>
          {selected.content}
        </p>
      </div>
    </div>
  );

  return (
    <div className="pastor-bg page-transition pb-24 min-h-screen">
      {/* Header */}
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <Mic size={18} style={{ color: '#D4AF37' }} />
          </div>
          <div>
            <h1 className="font-cinzel text-xl font-bold" style={{ color: '#F0EAD6' }}>
              Pastor's Corner
            </h1>
            <p className="text-xs" style={{ color: 'rgba(156,163,175,0.7)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
              Words of wisdom & devotion
            </p>
          </div>
        </div>
        <div className="pastor-divider" />
      </div>

      {/* Messages */}
      <div className="px-5 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} style={{ color: 'rgba(212,175,55,0.3)' }} className="mx-auto mb-3" />
            <p className="font-cormorant text-lg italic" style={{ color: 'rgba(240,234,214,0.5)' }}>
              No messages yet
            </p>
          </div>
        ) : messages.map((msg, i) => (
          <button key={msg.id} onClick={() => setSelected(msg)} className="w-full text-left">
            <div className="pastor-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {msg.scripture && (
                    <p className="text-[10px] tracking-[2px] uppercase mb-2"
                      style={{ color: 'rgba(212,175,55,0.6)' }}>
                      {msg.scripture}
                    </p>
                  )}
                  <h2 className="font-cinzel text-base font-semibold leading-snug mb-2"
                    style={{ color: '#F0EAD6' }}>
                    {msg.title}
                  </h2>
                  <p className="text-sm leading-relaxed line-clamp-2 font-cormorant"
                    style={{ color: 'rgba(156,163,175,0.8)' }}>
                    {msg.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {msg.author && (
                      <span className="text-[11px] italic" style={{ color: 'rgba(212,175,55,0.6)', fontFamily: "'Cormorant Garamond', serif" }}>
                        — {msg.author}
                      </span>
                    )}
                    {msg.date && (
                      <span className="text-[11px]" style={{ color: 'rgba(156,163,175,0.5)' }}>
                        {format(msg.date, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(212,175,55,0.4)', flexShrink: 0, marginTop: 4 }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
