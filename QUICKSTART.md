# Quick Start Guide

Get your church app running in 15 minutes!

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

## Step 2: Firebase Setup (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "Christ Restoration Centre"
3. Enable:
   - Firestore Database (production mode)
   - Authentication > Email/Password
   - Storage

4. Add web app, copy config

5. Create admin user:
   - Authentication > Add user
   - Email: `admin@church.com`
   - Password: (create a secure one)

## Step 3: Configure Environment (2 min)

1. Copy environment template:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your Firebase values

## Step 4: Add Icons (3 min)

Create two PNG files with your church logo:
- `public/icon-192x192.png` (192×192 pixels)
- `public/icon-512x512.png` (512×512 pixels)

Or use placeholder text logos for now.

## Step 5: Initialize Firebase Data (2 min)

1. Go to Firebase Console > Firestore
2. Create collection: `appSettings`
3. Add document ID: `main`
4. Add fields:
   - `verseOfTheDay` (string): "Be strong and courageous..."
   - `givingUrl` (string): "" (leave empty for now)

## Step 6: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test Admin Panel

1. Go to http://localhost:3000/admin
2. Login with your admin credentials
3. Add test content:
   - Pastor's Corner > Daily Message
   - Youth > Announcement
   - etc.

## Next Steps

✅ Your app is running!

Now:
1. Customize colors in `tailwind.config.js`
2. Replace placeholder logo in `src/components/Logo.tsx`
3. Add real content via admin panel
4. Test PWA installation
5. Deploy (see DEPLOYMENT.md)

## Common Issues

**"Firebase not initialized"**
- Check `.env.local` file exists
- Verify all Firebase values are correct
- Restart dev server

**"Cannot read property of undefined"**
- Make sure `appSettings/main` document exists in Firestore
- Check Firestore rules allow public read

**Admin login fails**
- Verify user exists in Firebase Authentication
- Check email/password are correct
- Look for errors in browser console

---

Need more help? See full README.md
