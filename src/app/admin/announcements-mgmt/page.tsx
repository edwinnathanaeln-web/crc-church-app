// src/app/admin/announcements-mgmt/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Announcement } from '@/types';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<'general' | 'youth' | 'sundaySchool'>('general');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('');
  const [recurringTime, setRecurringTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const q = query(collection(db, 'globalAnnouncements'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    setAnnouncements(snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Announcement[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        title,
        description,
        category,
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      };

      if (isRecurring) {
        data.isRecurring = true;
        data.recurringDay = recurringDay;
        data.recurringTime = recurringTime;
      }

      await addDoc(collection(db, 'globalAnnouncements'), data);

      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setIsRecurring(false);
      setRecurringDay('');
      setRecurringTime('');
      
      await fetchAnnouncements();
      alert('Announcement added!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await deleteDoc(doc(db, 'globalAnnouncements', id));
      await fetchAnnouncements();
      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting announcement');
    }
  };

  return (
    <AdminLayout title="Manage Announcements">
      {/* Add Form */}
      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
        <h2 className="text-xl font-bold mb-4">Add Global Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
              placeholder="Announcement details"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
            >
              <option value="general">General</option>
              <option value="youth">Youth</option>
              <option value="sundaySchool">Sunday School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
            />
          </div>

          {/* Recurring Options */}
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="recurring" className="font-semibold">Recurring Event</label>
          </div>

          {isRecurring && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Recurring Day *</label>
                <select
                  value={recurringDay}
                  onChange={(e) => setRecurringDay(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
                >
                  <option value="">Select day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Recurring Time *</label>
                <input
                  type="time"
                  value={recurringTime}
                  onChange={(e) => setRecurringTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: '#D4AF37', color: '#0D5C63' }}
          >
            {loading ? 'Adding...' : 'Add Announcement'}
          </button>
        </form>
      </div>

      {/* List of Announcements */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Announcements</h2>

        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start justify-between p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  {announcement.isRecurring && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#D4AF37', color: '#0D5C63' }}>
                      Recurring
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full text-xs opacity-75" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    {announcement.category}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">{announcement.description}</p>
                <p className="text-xs opacity-75">
                  {announcement.isRecurring 
                    ? `Every ${announcement.recurringDay} at ${announcement.recurringTime}`
                    : format(announcement.date, 'MMM dd, yyyy')}
                </p>
              </div>

              <button
                onClick={() => handleDelete(announcement.id)}
                className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all ml-4"
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
