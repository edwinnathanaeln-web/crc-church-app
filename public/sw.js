// ═══════════════════════════════════════════════════════════
//  CRC Church App — Service Worker
//  Cinematic PWA with offline support
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'v1';
const STATIC_CACHE  = `crc-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `crc-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE   = `crc-images-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/giving',
  '/gallery',
  '/announcements',
  '/offline',
  '/manifest.json',
  // fonts are loaded via Google Fonts — handled by runtime cache below
];

const MAX_DYNAMIC_ITEMS = 40;
const MAX_IMAGE_ITEMS   = 60;

// ── INSTALL ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];

  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => !allowedCaches.includes(key))
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, browser-extension, and firebase/analytics requests
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) return;
  if (url.hostname.includes('firestore.googleapis.com')) return;
  if (url.hostname.includes('firebase')) return;
  if (url.pathname.includes('/_next/webpack-hmr')) return;

  // Images — cache-first with size limit
  if (request.destination === 'image' ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_IMAGE_ITEMS));
    return;
  }

  // Google Fonts — cache-first (they're stable)
  if (url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Next.js static assets (_next/static) — cache-first (hash-named, immutable)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML navigation — network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS));
});

// ── STRATEGIES ─────────────────────────────────────────────

async function cacheFirst(request, cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      if (maxItems) await trimCache(cacheName, maxItems);
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Try static cache
    const staticCached = await caches.match(request, { ignoreSearch: true });
    if (staticCached) return staticCached;

    // Offline fallback page
    const offlinePage = await caches.match('/offline');
    if (offlinePage) return offlinePage;

    return new Response(offlineHTML(), {
      headers: { 'Content-Type': 'text/html' },
      status: 503,
    });
  }
}

async function staleWhileRevalidate(request, cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
        if (maxItems) trimCache(cacheName, maxItems);
      }
      return response;
    })
    .catch(() => null);

  return cached || await fetchPromise || new Response('Offline', { status: 503 });
}

// ── CACHE TRIM ─────────────────────────────────────────────
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

// ── INLINE OFFLINE PAGE ────────────────────────────────────
function offlineHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offline — Christ Restoration Centre</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(160deg, #020203 0%, #05040a 50%, #020203 100%);
      color: #EDEDEF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      -webkit-font-smoothing: antialiased;
    }
    .cross {
      width: 48px; height: 60px;
      position: relative; margin: 0 auto 28px;
    }
    .cross::before {
      content:''; position:absolute;
      left:50%; top:0; transform:translateX(-50%);
      width:10px; height:100%;
      background:#D4AF37; border-radius:5px;
    }
    .cross::after {
      content:''; position:absolute;
      top:30%; left:0;
      width:100%; height:10px;
      background:#D4AF37; border-radius:5px;
    }
    h1 {
      font-size:22px; font-weight:700;
      background:linear-gradient(135deg,#D4AF37 0%,#F5D479 50%,#B8941F 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      margin-bottom:10px;
    }
    p { font-size:14px; color:rgba(138,143,152,0.85); line-height:1.6; max-width:280px; }
    button {
      margin-top:28px;
      padding:12px 28px;
      background:linear-gradient(135deg,#D4AF37,#B8941F);
      color:#020203; border:none;
      border-radius:12px; font-size:14px;
      font-weight:600; cursor:pointer;
      box-shadow:0 4px 20px rgba(212,175,55,0.25);
    }
  </style>
</head>
<body>
  <div class="cross" aria-hidden="true"></div>
  <h1>You're Offline</h1>
  <p>Check your connection and try again. Pages you've already visited will still load.</p>
  <button onclick="location.reload()">Try Again</button>
</body>
</html>`;
}

// ── PUSH NOTIFICATIONS ─────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'CRC Update', body: event.data.text() };
  }

  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.tag || 'crc-notification',
    data: { url: payload.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Christ Restoration Centre', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
  );
});
