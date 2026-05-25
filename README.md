# Christ Restoration Centre - Progressive Web App

A complete Progressive Web App (PWA) for Christ Restoration Centre church, featuring ministry sections, admin panel, and offline functionality.

## Features

- 📱 **Installable PWA** - Add to home screen on mobile devices
- 🎨 **Themed Sections** - Distinct designs for Home, Pastor's Corner, Youth, and Sunday School
- 📺 **YouTube Integration** - Daily messages and Sunday sermons
- 📅 **Event Management** - Announcements with recurring events support
- 🖼️ **Media Gallery** - Photos and videos organized by ministry
- 💰 **Online Giving** - Bank details and online giving links
- 🔐 **Admin Panel** - Complete content management system
- 🌐 **Offline Support** - Cached content for offline viewing
- 🎭 **Smooth Transitions** - Theme changes with beautiful animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend & Database**: Firebase (Firestore, Storage, Authentication)
- **PWA**: next-pwa with service worker caching
- **UI Components**: Lucide React icons, custom components
- **Deployment**: Ready for Vercel or Netlify

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "Christ Restoration Centre"
3. Enable these services:
   - **Firestore Database**: Create in production mode
   - **Authentication**: Enable Email/Password provider
   - **Storage**: Enable for image uploads

4. Create a web app in Firebase:
   - Project Settings > General > Your apps > Add app > Web
   - Copy the configuration values

5. Set up Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for all collections
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

6. Set up Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

7. Create an admin user in Firebase Console:
   - Authentication > Users > Add user
   - Email: admin@church.com (or your email)
   - Set a secure password

### 3. Project Setup

1. Clone or download this project

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Add your Firebase configuration to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Create app icons:
   - Create `public/icon-192x192.png` (192x192px)
   - Create `public/icon-512x512.png` (512x512px)
   - Use a logo with the eagle-cross design or your church logo

### 4. Initial Data Setup

The app uses these Firestore collections:
- `dailyMessages` - Daily devotional messages
- `sermons` - Sunday sermon videos
- `youthAnnouncements` - Youth ministry announcements
- `sundaySchoolAnnouncements` - Sunday School announcements
- `globalAnnouncements` - Church-wide announcements
- `galleryItems` - Photos and videos
- `appSettings` - App configuration (single document: `main`)
- `youthVerseOfWeek` - Youth verse (single document: `current`)
- `sundaySchoolMemoryVerse` - Sunday School memory verse (single document: `current`)

Create an `appSettings` document manually in Firestore:
1. Go to Firestore > Start collection > `appSettings`
2. Document ID: `main`
3. Add fields:
   - `verseOfTheDay` (string): "Be strong and courageous..."
   - `givingUrl` (string): https://your-giving-platform.com

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Testing the App

1. **Test Public Pages:**
   - Home (/)
   - Pastor's Corner (/pastors-corner)
   - Youth (/youth)
   - Sunday School (/sunday-school)
   - Announcements (/announcements)
   - Gallery (/gallery)
   - Giving (/giving)

2. **Test Admin Panel:**
   - Go to /admin
   - Login with your Firebase admin credentials
   - Add sample content:
     - Daily message
     - Sermon
     - Announcements
     - Gallery items
     - Verses

3. **Test PWA Installation:**
   - Open in Chrome/Edge on desktop or mobile
   - Look for "Install" button in address bar
   - Or use the "Add to Home Screen" button on the home page

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to Netlify
3. Add environment variables in Netlify dashboard
4. Configure rewrites in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## App Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel pages
│   ├── pastors-corner/    # Pastor's corner page
│   ├── youth/             # Youth ministry page
│   ├── sunday-school/     # Sunday School page
│   ├── announcements/     # Announcements page
│   ├── gallery/           # Gallery page
│   ├── giving/            # Giving page
│   └── more/              # More options page
├── components/            # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── Logo.tsx          # Church logo component
│   ├── BottomNav.tsx     # Bottom navigation
│   ├── InstallButton.tsx # PWA install prompt
│   └── ...
├── contexts/              # React contexts
│   ├── ThemeContext.tsx  # Theme management
│   └── AuthContext.tsx   # Authentication
├── lib/                   # Utility libraries
│   └── firebase.ts       # Firebase configuration
└── types/                 # TypeScript type definitions
```

## Admin Panel Features

Access at `/admin` with authenticated credentials:

- **Dashboard**: Overview and quick access
- **Pastor's Corner**: Add/edit daily messages and sermons
- **Youth Corner**: Manage youth announcements, gallery, verse of week
- **Sunday School**: Manage Sunday School content
- **Announcements**: Create global and recurring announcements
- **Gallery**: Upload images and add YouTube videos

## Customization

### Colors

Edit `tailwind.config.js` to change theme colors:
```javascript
colors: {
  brand: {
    teal: '#0D5C63',    // Main brand color
    gold: '#D4AF37',     // Accent color
  },
  pastor: {
    bg: '#3A2C3E',       // Pastor's Corner background
    accent: '#D4AF37',   // Pastor's Corner accent
  },
  // ... more themes
}
```

### Fonts

Fonts are loaded from Google Fonts in `globals.css`:
- Playfair Display (Home, Pastor's Corner)
- Poppins (Youth)
- Nunito (Sunday School)

### Logo

Replace the eagle-cross SVG in `src/components/Logo.tsx` with your church logo.

## Troubleshooting

### PWA Not Installing
- Ensure you're using HTTPS (required for PWA)
- Check manifest.json is accessible
- Verify service worker is registered

### Firebase Errors
- Check environment variables are correct
- Verify Firebase services are enabled
- Check Firestore/Storage security rules

### Images Not Loading
- Verify images are uploaded to Firebase Storage
- Check Storage security rules allow public read
- Ensure image URLs are valid

## Support

For issues or questions:
- Check Firebase Console for errors
- Review browser console for JavaScript errors
- Verify Firestore data structure matches expected format

## License

This project is created for Christ Restoration Centre church.

---

Built with ❤️ for the Kingdom of God
