// src/app/admin/pastors/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DailyMessage, Sermon } from '@/types';
import { Plus, Trash2, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function PastorsAdmin() {
  const [activeTab, setActiveTab] = useState<'daily' | 'sermons'>('daily');
  const [dailyMessages, setDailyMessages] = useState<DailyMessage[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [date, setDate] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const messagesQuery = query(collection(db, 'dailyMessages'), orderBy('date', 'desc'));
    const messagesSnap = await getDocs(messagesQuery);
    setDailyMessages(messagesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as DailyMessage[]);

    const sermonsQuery = query(collection(db, 'sermons'), orderBy('date', 'desc'));
    const sermonsSnap = await getDocs(sermonsQuery);
    setSermons(sermonsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Sermon[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title,
        youtubeUrl,
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
        ...(activeTab === 'sermons' && partNumber ? { partNumber: parseInt(partNumber) } : {}),
      };

      await addDoc(collection(db, activeTab === 'daily' ? 'dailyMessages' : 'sermons'), data);

      // Reset form
      setTitle('');
      setYoutubeUrl('');
      setDate('');
      setPartNumber('');
      
      await fetchData();
      alert(`${activeTab === 'daily' ? 'Daily message' : 'Sermon'} added successfully!`);
    } catch (error) {
      console.error('Error adding:', error);
      alert('Error adding content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'daily' | 'sermons') => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      await deleteDoc(doc(db, type === 'daily' ? 'dailyMessages' : 'sermons', id));
      await fetchData();
      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting content');
    }
  };

  return (
    <AdminLayout title="Manage Pastor's Corner">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'daily' ? 'shadow-lg' : 'opacity-60'
          }`}
          style={{
            backgroundColor: activeTab === 'daily' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
            color: activeTab === 'daily' ? '#0D5C63' : '#FFFFFF',
          }}
        >
          Daily Messages
        </button>
        <button
          onClick={() => setActiveTab('sermons')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'sermons' ? 'shadow-lg' : 'opacity-60'
          }`}
          style={{
            backgroundColor: activeTab === 'sermons' ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)',
            color: activeTab === 'sermons' ? '#0D5C63' : '#FFFFFF',
          }}
        >
          Sunday Sermons
        </button>
      </div>

      {/* Add Form */}
      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus size={24} style={{ color: '#D4AF37' }} />
          Add New {activeTab === 'daily' ? 'Daily Message' : 'Sermon'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50"
              placeholder="e.g., The Armor of God - Part 1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">YouTube URL *</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50"
            />
          </div>

          {activeTab === 'sermons' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Part Number (optional)</label>
              <input
                type="number"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50"
                placeholder="e.g., 1, 2, 3..."
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: '#D4AF37', color: '#0D5C63' }}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Existing {activeTab === 'daily' ? 'Daily Messages' : 'Sermons'}
        </h2>

        <div className="space-y-3">
          {(activeTab === 'daily' ? dailyMessages : sermons).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm opacity-75 mt-1">{format(item.date, 'MMM dd, yyyy')}</p>
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 mt-1 opacity-75 hover:opacity-100"
                  style={{ color: '#D4AF37' }}
                >
                  <Video size={14} />
                  View on YouTube
                </a>
              </div>

              <button
                onClick={() => handleDelete(item.id, activeTab === 'daily' ? 'daily' : 'sermons')}
                className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all"
              >
                <Trash2 size={20} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
