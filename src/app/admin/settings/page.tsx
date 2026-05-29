// src/app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Facebook, Instagram, ArrowLeft, Save, Check } from 'lucide-react';
import Link from 'next/link';

interface AppSettings {
  verseOfTheDay: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export default function AdminSettings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>({ verseOfTheDay: '', facebookUrl: '', instagramUrl: '', tiktokUrl: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !user) router.push('/admin'); }, [user, loading, router]);
  useEffect(() => { if (user) fetchSettings(); }, [user]);

  const fetchSettings = async () => {
    try {
      const snap = await getDoc(doc(db, 'appSettings', 'main'));
      if (snap.exists()) {
        const d = snap.data();
        setSettings({ verseOfTheDay: d.verseOfTheDay||'', facebookUrl: d.facebookUrl||'', instagramUrl: d.instagramUrl||'', tiktokUrl: d.tiktokUrl||'' });
      }
    } catch(e) { console.error(e); } finally { setFetching(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db,'appSettings','main'), settings, { merge: true });
      setSaved(true); setTimeout(()=>setSaved(false),3000);
    } catch(e) { console.error(e); } finally { setSaving(false); }
  };

  if (loading || !user || fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#0a0a0e'}}>
      <div style={{width:32,height:32,border:'2px solid rgba(200,168,75,0.3)',borderTop:'2px solid #c8a84b',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
    </div>
  );

  const inp = { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'#f0ece4', fontSize:14, width:'100%', outline:'none', fontFamily:'inherit', transition:'border-color 200ms' } as React.CSSProperties;
  const lbl = { fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase' as const, color:'rgba(200,168,75,0.6)', marginBottom:8, display:'flex', alignItems:'center', gap:6 };
  const sec = { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:22, marginBottom:14 };

  return (
    <div style={{minHeight:'100vh',paddingBottom:48,background:'linear-gradient(160deg,#09080e 0%,#0f0d18 100%)',color:'#f0ece4',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{padding:'52px 22px 24px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <Link href="/admin/dashboard">
          <button style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(200,168,75,0.7)',background:'none',border:'none',cursor:'pointer',marginBottom:20,padding:0}}>
            <ArrowLeft size={14}/> Back to Dashboard
          </button>
        </Link>
        <p style={{fontSize:9,fontWeight:600,letterSpacing:3,textTransform:'uppercase',color:'rgba(200,168,75,0.4)',marginBottom:8}}>Admin</p>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,letterSpacing:-0.5,marginBottom:4}}>App Settings</h1>
        <p style={{fontSize:14,color:'rgba(155,149,168,0.7)',fontStyle:'italic',fontFamily:"'Instrument Serif',serif"}}>Verse of the day & social media</p>
      </div>

      <div style={{padding:'22px 22px 0'}}>

        {/* Verse */}
        <div style={sec}>
          <p style={{fontSize:13,fontWeight:600,color:'#e6cc7a',marginBottom:4}}>✝ Verse of the Day</p>
          <p style={{fontSize:11,color:'rgba(155,149,168,0.5)',marginBottom:14}}>Displayed on the home screen</p>
          <label style={lbl}>Verse Text</label>
          <textarea value={settings.verseOfTheDay} onChange={e=>setSettings(p=>({...p,verseOfTheDay:e.target.value}))}
            placeholder="e.g. The Lord is my shepherd, I shall not want. — Psalm 23:1"
            rows={4} style={{...inp,resize:'vertical',lineHeight:1.6}}
            onFocus={e=>(e.target.style.borderColor='rgba(200,168,75,0.5)')}
            onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
        </div>

        {/* Social */}
        <div style={sec}>
          <p style={{fontSize:13,fontWeight:600,color:'#e6cc7a',marginBottom:4}}>Social Media Links</p>
          <p style={{fontSize:11,color:'rgba(155,149,168,0.5)',marginBottom:18}}>
            Paste your full profile URL. Leave blank to hide the button on the home screen.
          </p>

          <div style={{marginBottom:14}}>
            <label style={lbl}><Facebook size={12}/> Facebook URL</label>
            <input type="url" value={settings.facebookUrl} onChange={e=>setSettings(p=>({...p,facebookUrl:e.target.value}))}
              placeholder="https://facebook.com/yourpage" style={inp}
              onFocus={e=>(e.target.style.borderColor='rgba(200,168,75,0.5)')}
              onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
          </div>

          <div style={{marginBottom:14}}>
            <label style={lbl}><Instagram size={12}/> Instagram URL</label>
            <input type="url" value={settings.instagramUrl} onChange={e=>setSettings(p=>({...p,instagramUrl:e.target.value}))}
              placeholder="https://instagram.com/yourhandle" style={inp}
              onFocus={e=>(e.target.style.borderColor='rgba(200,168,75,0.5)')}
              onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
          </div>

          <div>
            <label style={lbl}><TikTokIcon/> TikTok URL</label>
            <input type="url" value={settings.tiktokUrl} onChange={e=>setSettings(p=>({...p,tiktokUrl:e.target.value}))}
              placeholder="https://tiktok.com/@yourhandle" style={inp}
              onFocus={e=>(e.target.style.borderColor='rgba(200,168,75,0.5)')}
              onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.1)')} />
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{width:'100%',padding:14,borderRadius:12,border:'none',
          background: saved ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#c8a84b,#8a6e2a)',
          color: saved ? 'white' : '#0a0a0e',fontWeight:700,fontSize:14,cursor:saving?'not-allowed':'pointer',
          opacity:saving?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 200ms',letterSpacing:'0.5px'}}>
          {saved ? <><Check size={16}/> Saved!</> : saving ? 'Saving…' : <><Save size={16}/> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
