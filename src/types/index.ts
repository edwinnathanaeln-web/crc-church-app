// src/types/index.ts

export interface DailyMessage {
  id: string;
  title: string;
  youtubeUrl: string;
  date: Date;
  createdAt: Date;
}

export interface Sermon {
  id: string;
  title: string;
  youtubeUrl: string;
  date: Date;
  partNumber?: number;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category?: 'general' | 'youth' | 'sundaySchool';
  isRecurring?: boolean;
  recurringDay?: string;
  recurringTime?: string;
  createdAt: Date;
}

export interface GalleryItem {
  id: string;
  imageUrl?: string;
  youtubeUrl?: string;
  type: 'image' | 'video';
  tag: 'youth' | 'sundaySchool' | 'general';
  caption?: string;
  uploadedAt: Date;
}

export interface AppSettings {
  verseOfTheDay?: string;
  givingUrl?: string;
}

export interface VerseOfWeek {
  verse: string;
  reference: string;
  setDate: Date;
}

export type ThemeType = 'home' | 'pastorscorner' | 'youth' | 'sundayschool';

export interface ThemeConfig {
  bgColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  pattern?: string;
}
