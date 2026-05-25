# Project File Structure

Complete file-by-file breakdown of the Christ Restoration Centre PWA.

## Root Configuration Files

```
├── package.json                 # Dependencies and scripts
├── next.config.js              # Next.js config with PWA support
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
├── .gitignore                  # Git ignore rules
├── .env.local.example          # Environment template
├── README.md                   # Main documentation
├── QUICKSTART.md               # Quick setup guide
├── DEPLOYMENT.md               # Deployment instructions
└── FILE_STRUCTURE.md           # This file
```

## Public Assets

```
public/
├── manifest.json               # PWA manifest
├── icon-192x192.png           # App icon (small) - CREATE THIS
├── icon-512x512.png           # App icon (large) - CREATE THIS
├── sw.js                      # Service worker (auto-generated)
└── workbox-*.js               # Workbox files (auto-generated)
```

## Source Code

### App Router Pages

```
src/app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page
├── globals.css                # Global styles and animations
│
├── pastors-corner/
│   └── page.tsx              # Pastor's Corner page
│
├── youth/
│   └── page.tsx              # Youth Corner page
│
├── sunday-school/
│   └── page.tsx              # Sunday School page
│
├── announcements/
│   └── page.tsx              # All announcements page
│
├── gallery/
│   └── page.tsx              # Gallery page
│
├── giving/
│   └── page.tsx              # Giving page
│
├── more/
│   └── page.tsx              # More options page
│
└── admin/
    ├── page.tsx              # Admin login
    ├── dashboard/
    │   └── page.tsx          # Admin dashboard
    ├── pastors/
    │   └── page.tsx          # Manage Pastor's Corner
    ├── youth/
    │   └── page.tsx          # Manage Youth Corner
    ├── sunday-school/
    │   └── page.tsx          # Manage Sunday School
    ├── announcements-mgmt/
    │   └── page.tsx          # Manage Announcements
    └── gallery-mgmt/
        └── page.tsx          # Manage Gallery
```

### Components

```
src/components/
├── Logo.tsx                   # Church logo with eagle-cross SVG
├── BottomNav.tsx              # Bottom navigation bar
├── InstallButton.tsx          # PWA install prompt
├── YouTubeEmbed.tsx           # YouTube video player
├── AnnouncementCard.tsx       # Announcement display card
├── GalleryGrid.tsx            # Gallery grid with lightbox
│
└── admin/
    └── AdminLayout.tsx        # Admin page wrapper
```

### Contexts

```
src/contexts/
├── ThemeContext.tsx           # Theme management and transitions
└── AuthContext.tsx            # Firebase authentication
```

### Library Files

```
src/lib/
└── firebase.ts                # Firebase initialization
```

### Types

```
src/types/
└── index.ts                   # TypeScript type definitions
```

## Key File Purposes

### Configuration Files

**package.json**
- Lists all npm dependencies
- Defines build and dev scripts
- Project metadata

**next.config.js**
- Configures next-pwa for service worker
- Sets up runtime caching for Firebase and YouTube
- Configures image domains

**tailwind.config.js**
- Defines custom color schemes for each ministry
- Sets up custom fonts (Playfair, Poppins, Nunito)
- Configures animations (float, slide-in, fade-in)

**tsconfig.json**
- TypeScript compiler options
- Path aliases (@/* → src/*)

### Core App Files

**src/app/layout.tsx**
- Wraps app in ThemeProvider and AuthProvider
- Includes BottomNav component
- Sets metadata for PWA

**src/app/globals.css**
- Tailwind imports
- Google Fonts imports
- Custom animations and patterns
- Theme transition styles

**src/lib/firebase.ts**
- Initializes Firebase app
- Exports db, storage, and auth instances
- Uses environment variables for config

### Theme System

**src/contexts/ThemeContext.tsx**
- Manages current theme state
- Provides theme configs for each section
- Updates CSS variables on theme change
- Enables smooth transitions between sections

### Authentication

**src/contexts/AuthContext.tsx**
- Manages Firebase Auth state
- Provides signIn and signOut functions
- Protects admin routes

### Components

**Logo.tsx**: Eagle-cross SVG logo
**BottomNav.tsx**: Fixed bottom navigation with theme-aware icons
**InstallButton.tsx**: PWA install prompt using beforeinstallprompt
**YouTubeEmbed.tsx**: Responsive YouTube video player
**AnnouncementCard.tsx**: Themed announcement display
**GalleryGrid.tsx**: Masonry grid with lightbox modal
**AdminLayout.tsx**: Protected admin page wrapper

### Public Pages

All pages in src/app/* follow similar patterns:
1. Set theme on mount
2. Fetch data from Firebase
3. Display with themed styling
4. Handle loading states

### Admin Pages

Admin pages (src/app/admin/*):
1. Check authentication
2. Provide forms for adding content
3. List existing content
4. Allow deletion
5. Use Firebase Firestore and Storage APIs

## Data Flow

```
Firebase Firestore
    ↓
Pages fetch data on mount
    ↓
Display in themed components
    ↓
User interactions
    ↓
Update via Admin Panel
    ↓
Changes reflected immediately
```

## PWA Architecture

```
User visits site
    ↓
Manifest.json loaded
    ↓
Service worker registered
    ↓
App installable
    ↓
Content cached for offline
```

## Firebase Collections Structure

```
Firestore
├── dailyMessages          # Pastor's daily messages
├── sermons                # Sunday sermons
├── youthAnnouncements     # Youth announcements
├── sundaySchoolAnnouncements
├── globalAnnouncements    # Church-wide announcements
├── galleryItems           # Photos and videos
├── appSettings            # App configuration (single doc: main)
├── youthVerseOfWeek       # Youth verse (single doc: current)
└── sundaySchoolMemoryVerse # SS verse (single doc: current)
```

## Build Process

```
npm run dev → Development server
npm run build → Production build with PWA
npm start → Serve production build
```

## Missing Files (You Need to Create)

1. **Icons**: Create app icons
   - public/icon-192x192.png
   - public/icon-512x512.png

2. **Environment**: Copy and configure
   - .env.local (from .env.local.example)

3. **Admin Pages**: Additional admin pages can be created following the pattern of existing ones

All other files are provided in this project.
