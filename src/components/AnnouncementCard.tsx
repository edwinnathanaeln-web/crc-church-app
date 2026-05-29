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
      className="group relative p-4 rounded-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-gold/60 hover:-translate-y-0.5"
      style={{
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(167,139,250,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* gold accent bar */}
      <span
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: 'linear-gradient(180deg, #D4AF37, #B8941F)' }}
        aria-hidden="true"
      />

      <div className="pl-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-base leading-snug" style={{ color: '#F5F0FF' }}>
            {announcement.title}
          </h3>
          {announcement.isRecurring && (
            <span
              className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}
            >
              <Repeat size={10} aria-hidden="true" />
              Recurring
            </span>
          )}
        </div>

        {announcement.description && (
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: 'rgba(196,181,253,0.85)', lineHeight: 1.6 }}
          >
            {announcement.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(196,181,253,0.55)' }}>
          {announcement.isRecurring ? (
            <>
              <span className="flex items-center gap-1">
                <Calendar size={13} aria-hidden="true" />
                {announcement.recurringDay}s
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} aria-hidden="true" />
                {announcement.recurringTime}
              </span>
            </>
          ) : (
            announcement.date && (
              <span className="flex items-center gap-1">
                <Calendar size={13} aria-hidden="true" />
                <time dateTime={announcement.date.toISOString()}>
                  {format(announcement.date, 'MMM dd, yyyy')}
                </time>
              </span>
            )
          )}
        </div>
      </div>
    </article>
  );
};
