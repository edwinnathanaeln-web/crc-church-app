'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  return (
    <article
      className="relative p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* top shimmer line */}
      <span
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3">
        {/* gold dot */}
        <span
          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.6)' }}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-base leading-snug" style={{ color: '#EDEDEF' }}>
              {announcement.title}
            </h3>
            {announcement.isRecurring && (
              <span
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest"
                style={{ background: 'rgba(212,175,55,0.12)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <Repeat size={9} aria-hidden="true" />
                Recurring
              </span>
            )}
          </div>

          {announcement.description && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(138,143,152,0.9)', lineHeight: 1.6 }}>
              {announcement.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(138,143,152,0.6)' }}>
            {announcement.isRecurring ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} aria-hidden="true" />
                  {announcement.recurringDay}s
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} aria-hidden="true" />
                  {announcement.recurringTime}
                </span>
              </>
            ) : (
              announcement.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} aria-hidden="true" />
                  <time dateTime={announcement.date.toISOString()}>
                    {format(announcement.date, 'MMM dd, yyyy')}
                  </time>
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
