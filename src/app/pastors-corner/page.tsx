// src/app/pastors-corner/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { DailyMessage, Sermon } from '@/types';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { format } from 'date-fns';
import { BookOpen, Video } from 'lucide-react';

export default function PastorsCorner() {
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'daily' | 'sermons'>('daily');
  const [dailyMessages, setDailyMessages] = useState<DailyMessage[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<DailyMessage | null>(null);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('pastorscorner');
    fetchData();
  }, [setTheme]);

  const fetchData = async () => {
    try {
      // Fetch daily messages
      const messagesQuery = query(
        collection(db, 'dailyMessages'),
        orderBy('date', 'desc'),
        limit(10)
      );
      const messagesSnap = await getDocs(messagesQuery);
      const messagesData = messagesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as DailyMessage[];
      setDailyMessages(messagesData);
      if (messagesData.length > 0) {
        setSelectedMessage(messagesData[0]);
      }

      // Fetch sermons
      const sermonsQuery = query(
        collection(db, 'sermons'),
        orderBy('date', 'desc'),
        limit(20)
      );
      const sermonsSnap = await getDocs(sermonsQuery);
      const sermonsData = sermonsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Sermon[];
      setSermons(sermonsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cross-pattern">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen cross-pattern p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-playfair text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          Pastor's Corner
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'daily' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: activeTab === 'daily' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: activeTab === 'daily' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            <BookOpen className="inline mr-2" size={20} />
            Daily Message
          </button>
          <button
            onClick={() => setActiveTab('sermons')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'sermons' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: activeTab === 'sermons' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: activeTab === 'sermons' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            <Video className="inline mr-2" size={20} />
            Sunday Sermons
          </button>
        </div>

        {/* Daily Messages Tab */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {selectedMessage && (
              <div className="p-6 rounded-lg shadow-lg backdrop-blur-sm"
                   style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
                  {selectedMessage.title}
                </h2>
                <p className="text-sm opacity-75 mb-4">{format(selectedMessage.date, 'MMMM dd, yyyy')}</p>
                <YouTubeEmbed url={selectedMessage.youtubeUrl} title={selectedMessage.title} />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4">Previous Messages</h3>
              <div className="space-y-3">
                {dailyMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedMessage?.id === message.id ? 'shadow-lg' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: selectedMessage?.id === message.id 
                        ? 'rgba(212, 175, 55, 0.2)' 
                        : 'rgba(212, 175, 55, 0.05)',
                      borderLeft: selectedMessage?.id === message.id ? '4px solid var(--accent-color)' : 'none',
                    }}
                  >
                    <p className="font-semibold">{message.title}</p>
                    <p className="text-xs opacity-75 mt-1">{format(message.date, 'MMM dd, yyyy')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sermons Tab */}
        {activeTab === 'sermons' && (
          <div className="space-y-6">
            {selectedSermon && (
              <div className="p-6 rounded-lg shadow-lg backdrop-blur-sm"
                   style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
                  {selectedSermon.title}
                </h2>
                <p className="text-sm opacity-75 mb-4">{format(selectedSermon.date, 'MMMM dd, yyyy')}</p>
                <YouTubeEmbed url={selectedSermon.youtubeUrl} title={selectedSermon.title} />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4">Sermon Library</h3>
              <div className="space-y-3">
                {sermons.map((sermon) => (
                  <div
                    key={sermon.id}
                    onClick={() => setSelectedSermon(sermon)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedSermon?.id === sermon.id ? 'shadow-lg' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: selectedSermon?.id === sermon.id 
                        ? 'rgba(212, 175, 55, 0.2)' 
                        : 'rgba(212, 175, 55, 0.05)',
                      borderLeft: selectedSermon?.id === sermon.id ? '4px solid var(--accent-color)' : 'none',
                    }}
                  >
                    <p className="font-semibold">
                      {sermon.title}
                      {sermon.partNumber && ` - Part ${sermon.partNumber}`}
                    </p>
                    <p className="text-xs opacity-75 mt-1">{format(sermon.date, 'MMM dd, yyyy')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
