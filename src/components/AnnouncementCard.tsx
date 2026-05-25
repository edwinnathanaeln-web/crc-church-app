// src/components/AnnouncementCard.tsx
'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Announcement } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const { themeConfig } = useTheme();

  return (
    <div
      className="p-4 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: `${themeConfig.accentColor}22`,
        borderLeft: `4px solid ${themeConfig.accentColor}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{announcement.title}</h3>
        {announcement.isRecurring && (
          <span
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: themeConfig.accentColor,
              color: themeConfig.bgColor,
            }}
          >
            <Repeat size={12} />
            Recurring
          </span>
        )}
      </div>

      <p className="text-sm opacity-90 mb-3">{announcement.description}</p>

      <div className="flex items-center gap-4 text-xs opacity-75">
        {announcement.isRecurring ? (
          <>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {announcement.recurringDay}s
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {announcement.recurringTime}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {format(announcement.date, 'MMM dd, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
};
