# Deployment Guide

## Prerequisites

1. Completed Firebase setup (see README.md)
2. Created admin user in Firebase Authentication
3. Added at least one app icon to `public/` folder
4. Tested the app locally

## Environment Variables

Ensure these are set in your deployment platform:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## Vercel Deployment (Recommended)

### Method 1: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables in Settings > Environment Variables
7. Deploy

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

3. Deploy to Netlify:
   - Via Netlify CLI: `netlify deploy --prod`
   - Or drag and drop `.next` folder to Netlify dashboard

4. Add environment variables in Site Settings > Build & Deploy > Environment

## Post-Deployment Checklist

- [ ] Test PWA installation on mobile
- [ ] Verify all pages load correctly
- [ ] Test admin login
- [ ] Add some sample content via admin panel
- [ ] Test image uploads
- [ ] Verify YouTube embeds work
- [ ] Test offline functionality
- [ ] Check service worker is registered (DevTools > Application)
- [ ] Verify manifest.json is accessible at /manifest.json

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Management
2. Add custom domain
3. Configure DNS

## SSL/HTTPS

Both Vercel and Netlify provide automatic HTTPS. PWAs require HTTPS to work.

## Monitoring

Monitor your deployment:
- Firebase Console for database/storage usage
- Vercel/Netlify dashboard for performance
- Browser DevTools for PWA status

## Updates

To deploy updates:

**Vercel:**
- Push to GitHub (auto-deploys)
- Or run `vercel --prod`

**Netlify:**
- Push to GitHub (if connected)
- Or run `netlify deploy --prod`

## Troubleshooting

### PWA Not Installing
- Ensure HTTPS is enabled
- Check service worker in DevTools
- Verify manifest.json is valid

### Images Not Loading
- Check Firebase Storage rules
- Verify image URLs in Firestore
- Check CORS settings in Firebase Storage

### Build Errors
- Clear `.next` folder and rebuild
- Check all environment variables are set
- Review build logs for specific errors

---

Need help? Check the main README.md or Firebase/Vercel/Netlify documentation.
