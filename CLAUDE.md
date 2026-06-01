# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static Progressive Web App for tracking study progress for Malaysian Form 2–5 and SPM exam preparation. No build step — the frontend runs directly in a browser. Firebase Firestore is the backend/database, loaded via CDN.

## Commands

**Validate project integrity:**
```bash
npm run validate
# or directly:
node tools/validate-project.mjs
```
Run this after modifying `js/subject.js`, `js/subject-registry.js`, or `index.html` to catch data inconsistencies, missing fields, duplicate chapters, and broken references.

**Run locally:**
Serve the root directory with any static file server, e.g.:
```bash
npx serve .
```
Or open `index.html` directly in a browser (Firebase SDK loads from CDN).

## Architecture

### Data Flow
```
index.html (dashboard)
  └── js/dashboard.js ──► Firebase Firestore (project: study-dashboard-7ca48)
                               ▲
       js/subject.js ──────────┘  seeds Firestore on first load if doc missing
       js/subject-registry.js     maps each subject → page, Firestore doc, seed data
  └── subjects/*.html ──► same Firestore, per-subject documents
```

### Key Files

- **`js/firebase.js`** — Single source for Firebase initialisation. Exports `db` (Firestore). Also calls `signInAnonymously()` at startup so Firestore security rules pass for unauthenticated visitors.
- **`js/auth.js`** — PIN-based auth. Exports `requireAuth()` and `isAuthenticated()`. The PIN is stored as a SHA-256 hash (`CORRECT_PIN_HASH`). To change the PIN, replace the hash with the SHA-256 of the new value.
- **`js/subject.js`** — Master data source. Exports 14 named objects (e.g. `mathsData`, `seniData`), each containing an array of chapters with `form`, `chapter`, `status`, `confidence`, and `last_updated` fields.
- **`js/subject-registry.js`** — Maps each subject to its Firestore collection key, HTML progress bar element IDs, href, and whether to auto-seed Firestore (`loadSeed: true/false`).
- **`js/dashboard.js`** — Sets up `onSnapshot` listeners for real-time progress updates, auto-seeds Firestore documents, and handles the Export Progress button.
- **`subjects/*.html`** — One page per subject (14 total, including Seni). Each page calls `await requireAuth()`, reads/writes its Firestore document, and writes `data.last_saved` (ISO timestamp) on every save.
- **`manifest.json`** — PWA manifest for home screen install. Requires icon files at `icons/icon-192.png` and `icons/icon-512.png`.
- **`sw.js`** — Service worker. Caches all static assets on install; serves cached assets offline. Firestore API calls bypass the cache (network-first).
- **`tools/validate-project.mjs`** — Node.js ESM script that cross-checks exports in `subject.js`, entries in `subject-registry.js`, links in `index.html`, and existence of subject pages. Exits with code 1 on errors.

### Subjects

14 subjects: Maths, Add Maths, Science, Physics, Chemistry, Biology, English, Chinese, Malay, Moral, History, Geografi, Reka Bentuk, **Seni** (T2–T3).

### Adding a Chapter Notes Page

When asked to wire up a chapter notes HTML file (e.g. "add history chapter 4"):

**Before making any changes**, confirm the HTML file exists on disk. If it is missing, stop and tell the user to upload the file first — do not create or write the HTML.

Once the file is confirmed present:
1. Find the matching chapter entry in `js/subject.js` and add `resourceUrl: "../<dir>/<file>.html"`
2. Add the path to `STATIC_ASSETS` in `sw.js`
3. Run `npm run validate` — this checks the `resourceUrl` file exists on disk
4. Commit

### Adding a New Subject

1. Add chapter data export to `js/subject.js`
2. Add an entry to `js/subject-registry.js` (set `loadSeed: true` to auto-seed Firestore)
3. Create `subjects/<name>.html` following the pattern of existing subject pages
4. Add a subject card to `index.html` with matching progress bar IDs
5. Add the page path to the `STATIC_ASSETS` array in `sw.js`
6. Run `npm run validate` to verify everything is wired correctly

### Changing the PIN

The PIN is hashed with SHA-256 in `js/auth.js`. To change it:
1. Generate the SHA-256 hash of the new PIN (use browser DevTools: `await crypto.subtle.digest("SHA-256", new TextEncoder().encode("NEWPIN"))` then convert to hex)
2. Replace `CORRECT_PIN_HASH` in `js/auth.js`

### Export Progress

The **Export Progress** button on the dashboard downloads all Firestore subject data as a dated JSON file (`study-progress-YYYY-MM-DD.json`).

### Authentication & Authorisation

- **`index.html` / `dashboard.js`** — publicly viewable by anyone, no PIN required.
- **`subjects/*.html`** — each page calls `await requireAuth()` at startup, showing a PIN overlay before allowing edits. PIN verification is stored in `sessionStorage` for the session.
- **`js/firebase.js`** — calls `signInAnonymously()` at startup. **Anonymous sign-in must be enabled in the Firebase Console** (Authentication → Sign-in method → Anonymous → Enable), otherwise progress bars will show 0%.

**Firestore security rules:**
```
match /subjects/{subjectId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
}
```

### Firebase

- Credentials are hardcoded in `js/firebase.js` (public project; access is controlled via Firestore security rules).
- Firestore structure: `subjects/{subjectId}` — each document holds the chapters array and a `last_saved` ISO timestamp updated on every write.
- SDK version: Firebase v10.12.2, loaded from CDN (no npm install needed).
