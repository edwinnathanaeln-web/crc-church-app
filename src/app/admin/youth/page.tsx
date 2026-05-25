// src/app/admin/youth/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Announcement, GalleryItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function YouthAdmin() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'gallery' | 'verse'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [verse, setVerse] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const announcementsQuery = query(collection(db, 'youthAnnouncements'), orderBy('date', 'desc'));
    const announcementsSnap = await getDocs(announcementsQuery);
    setAnnouncements(announcementsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Announcement[]);

    const galleryQuery = query(collection(db, 'galleryItems'), orderBy('uploadedAt', 'desc'));
    const gallerySnap = await getDocs(galleryQuery);
    setGalleryItems(gallerySnap.docs.filter(doc => doc.data().tag === 'youth').map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate(),
    })) as GalleryItem[]);
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'youthAnnouncements'), {
        title,
        description,
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });

      setTitle('');
      setDescription('');
      setDate('');
      await fetchData();
      alert('Announcement added!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data: any = {
        tag: 'youth',
        caption,
        uploadedAt: Timestamp.now(),
      };

      if (imageFile) {
        const storageRef = ref(storage, `gallery/youth/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        data = { ...data, type: 'image', imageUrl };
      } else if (youtubeUrl) {
        data = { ...data, type: 'video', youtubeUrl };
      }

      await addDoc(collection(db, 'galleryItems'), data);

      setImageFile(null);
      setYoutubeUrl('');
      setCaption('');
      await fetchData();
      alert('Gallery item added!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleVerseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, 'youthVerseOfWeek', 'current'), {
        verse,
        reference,
        setDate: Timestamp.now(),
      });

      alert('Verse of the week updated!');
      setVerse('');
      setReference('');
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating verse');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'announcement' | 'gallery') => {
    if (!confirm('Are you sure?')) return;

    try {
      await deleteDoc(doc(db, type === 'announcement' ? 'youthAnnouncements' : 'galleryItems', id));
      await fetchData();
      alert('Deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting');
    }
  };

  return (
    <AdminLayout title="Manage Youth Corner">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {['announcements', 'gallery', 'verse'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: activeTab === tab ? '#00E5FF' : 'rgba(0, 229, 255, 0.2)',
              color: activeTab === tab ? '#1E1E24' : '#FFFFFF',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div>
          <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }}>
            <h2 className="text-xl font-bold mb-4">Add Youth Announcement</h2>
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Title"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold"
                style={{ backgroundColor: '#00E5FF', color: '#1E1E24' }}
              >
                {loading ? 'Adding...' : 'Add Announcement'}
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }}>
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm opacity-75">{format(a.date, 'MMM dd, yyyy')}</p>
                </div>
                <button onClick={() => handleDelete(a.id, 'announcement')}>
                  <Trash2 size={20} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div>
          <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }}>
            <h2 className="text-xl font-bold mb-4">Add Gallery Item</h2>
            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
                />
              </div>
              <div className="text-center opacity-75">OR</div>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
              />
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption (optional)"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
              />
              <button
                type="submit"
                disabled={loading || (!imageFile && !youtubeUrl)}
                className="w-full py-3 rounded-lg font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#00E5FF', color: '#1E1E24' }}
              >
                {loading ? 'Adding...' : 'Add to Gallery'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {galleryItems.map(item => (
              <div key={item.id} className="relative group">
                {item.type === 'image' && item.imageUrl && (
                  <img src={item.imageUrl} alt={item.caption} className="w-full h-32 object-cover rounded-lg" />
                )}
                <button
                  onClick={() => handleDelete(item.id, 'gallery')}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verse Tab */}
      {activeTab === 'verse' && (
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)' }}>
          <h2 className="text-xl font-bold mb-4">Set Verse of the Week</h2>
          <form onSubmit={handleVerseSubmit} className="space-y-4">
            <textarea
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              required
              placeholder="Verse text"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
            />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
              placeholder="Reference (e.g., John 3:16)"
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold"
              style={{ backgroundColor: '#00E5FF', color: '#1E1E24' }}
            >
              {loading ? 'Updating...' : 'Update Verse'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
