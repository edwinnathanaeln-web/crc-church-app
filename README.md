# CRC PWA — Integration Guide

All files in this package are drop-in additions to your existing Next.js repo.
No existing files are overwritten except `src/app/layout.tsx` (merge notes below).

---

## File Map

```
public/
  manifest.json                  ← Web App Manifest
  sw.js                          ← Service Worker (cache + offline + push)

src/
  app/
    layout.tsx                   ← Root layout (PWA meta + SW registration)
    offline/
      page.tsx                   ← Offline fallback page

  components/
    InstallButton.tsx            ← "Install App" button (Android + iOS hint)
    ServiceWorkerRegistration.tsx ← Registers SW on mount (add to layout once)

scripts/
  generate-icons.js              ← Generates all icon PNGs from SVG source
```

---

## Step 1 — Generate Icons

```bash
npm install sharp --save-dev
node scripts/generate-icons.js
```

This creates `public/icons/` with every size listed in `manifest.json`.
Replace the SVG in `generate-icons.js` with your actual church logo if you have one.

---

## Step 2 — Drop in the files

Copy all files to your repo preserving the paths above.

---

## Step 3 — Merge `layout.tsx`

If you already have a `layout.tsx`, merge these parts in:

```tsx
// 1. Add these imports
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

// 2. Add to <head>
export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'CRC' },
  // ... rest of your metadata
};

export const viewport: Viewport = {
  themeColor: '#050506',
  viewportFit: 'cover',
};

// 3. Add inside <body> (before children)
<ServiceWorkerRegistration />
```

---

## Step 4 — Add InstallButton to Home

`InstallButton` is already imported in `src/app/page.tsx` — it's used in the hero section.
It auto-hides when the app is already installed or when neither Android nor iOS install is available.

---

## Step 5 — next.config.js headers (recommended)

Add service worker headers so browsers don't cache-bust the SW:

```js
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
```

---

## Caching Strategy Summary

| Request type          | Strategy                  |
|-----------------------|---------------------------|
| HTML navigation       | Network-first → offline fallback |
| `_next/static/*`      | Cache-first (immutable)   |
| Google Fonts          | Cache-first               |
| Images                | Cache-first (max 60)      |
| API / Firestore       | Bypassed (live always)    |
| Everything else       | Stale-while-revalidate    |

---

## Push Notifications (optional)

The service worker already handles `push` and `notificationclick` events.
To send a push, POST a JSON payload to your server with:

```json
{
  "title": "New Announcement",
  "body": "Join us this Sunday at 9am",
  "url": "/announcements",
  "tag": "announcement-123"
}
```

---

## Lighthouse PWA Checklist

After deploying, run Lighthouse (Chrome DevTools → Lighthouse → PWA).
You should score 100 on PWA with these files in place.
