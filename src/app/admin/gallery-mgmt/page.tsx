// src/app/admin/gallery-mgmt/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { GalleryItem } from '@/types';
import { Trash2, Image as ImageIcon, Video } from 'lucide-react';
import { format } from 'date-fns';

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tag, setTag] = useState<'youth' | 'sundaySchool' | 'general'>('general');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const q = query(collection(db, 'galleryItems'), orderBy('uploadedAt', 'desc'));
    const snap = await getDocs(q);
    setGalleryItems(snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate(),
    })) as GalleryItem[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      let data: any = {
        tag,
        caption,
        uploadedAt: Timestamp.now(),
      };

      if (imageFile) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `gallery/${tag}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        
        data = {
          ...data,
          type: 'image',
          imageUrl,
        };
      } else if (youtubeUrl) {
        data = {
          ...data,
          type: 'video',
          youtubeUrl,
        };
      } else {
        alert('Please select an image or enter a YouTube URL');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'galleryItems'), data);

      // Reset form
      setImageFile(null);
      setYoutubeUrl('');
      setCaption('');
      
      await fetchGallery();
      alert('Gallery item added!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding gallery item');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'galleryItems', id));
      await fetchGallery();
      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting item');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setYoutubeUrl(''); // Clear YouTube URL if image is selected
    }
  };

  return (
    <AdminLayout title="Manage Gallery">
      {/* Add Form */}
      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
        <h2 className="text-xl font-bold mb-4">Add Gallery Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
            >
              <option value="general">General</option>
              <option value="youth">Youth</option>
              <option value="sundaySchool">Sunday School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <ImageIcon className="inline mr-2" size={16} />
              Upload Image (max 5MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
            />
            {imageFile && (
              <p className="text-sm mt-2 opacity-75">Selected: {imageFile.name}</p>
            )}
          </div>

          <div className="text-center py-2 opacity-50">
            — OR —
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <Video className="inline mr-2" size={16} />
              YouTube Video URL
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                if (e.target.value) setImageFile(null); // Clear image if YouTube URL is entered
              }}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none"
              placeholder="Brief description"
            />
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%`, backgroundColor: '#D4AF37' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (!imageFile && !youtubeUrl)}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#D4AF37', color: '#0D5C63' }}
          >
            {loading ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </form>
      </div>

      {/* Gallery Items Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Gallery Items ({galleryItems.length})</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            >
              {item.type === 'image' && item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.caption || 'Gallery image'}
                  className="w-full h-48 object-cover"
                />
              ) : item.type === 'video' && item.youtubeUrl ? (
                <div className="w-full h-48 bg-black flex items-center justify-center relative">
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(item.youtubeUrl)}/maxresdefault.jpg`}
                    alt={item.caption || 'Video thumbnail'}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <Video size={48} className="absolute text-white opacity-90" />
                </div>
              ) : null}

              {/* Overlay info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-75 text-white text-xs">
                <p className="font-semibold mb-1">{item.caption || 'No caption'}</p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#D4AF37', color: '#0D5C63' }}>
                    {item.tag === 'sundaySchool' ? 'Sunday School' : item.tag}
                  </span>
                  <span>{format(item.uploadedAt, 'MMM dd')}</span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <p className="text-center opacity-75 py-12">No gallery items yet. Add your first one above!</p>
        )}
      </div>
    </AdminLayout>
  );
}

function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}
