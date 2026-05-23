# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static Progressive Web App for tracking study progress for Malaysian Form 2–5 and SPM exam preparation. No build step — the frontend runs directly in a browser. Firebase Firestore is the backend/database, loaded via CDN.

## Commands

**Validate project integrity:**
```bash
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

- **`js/subject.js`** — Master data source. Exports 13 named objects (e.g. `mathsData`, `physicsData`), each containing an array of chapters with `form`, `chapter`, `status`, `confidence`, and `last_updated` fields. This is the single source of truth for curriculum content.
- **`js/subject-registry.js`** — Maps each subject to its Firestore collection key, HTML progress bar element IDs, href, and whether to auto-seed Firestore (`loadSeed: true/false`).
- **`js/dashboard.js`** — Initialises Firebase, sets up `onSnapshot` listeners for real-time progress updates, and auto-seeds Firestore documents for subjects where `loadSeed: true`.
- **`subjects/*.html`** — One page per subject. Each page reads/writes its Firestore document directly and imports seed data from `subject.js`.
- **`tools/validate-project.mjs`** — Node.js ESM script that cross-checks exports in `subject.js`, entries in `subject-registry.js`, links in `index.html`, and existence of subject pages. Exits with code 1 on errors.

### Adding a New Subject

1. Add chapter data export to `js/subject.js`
2. Add an entry to `js/subject-registry.js` (set `loadSeed: true` to auto-seed Firestore)
3. Create `subjects/<name>.html` following the pattern of existing subject pages
4. Add a subject card to `index.html` with matching progress bar IDs
5. Run `node tools/validate-project.mjs` to verify everything is wired correctly

### Authentication & Authorisation

- **`index.html` / `dashboard.js`** — publicly viewable by anyone, no PIN required.
- **`subjects/*.html`** — each page calls `await requireAuth()` at startup, which shows a PIN overlay before allowing edits. The PIN is verified client-side and stored in `sessionStorage` for the duration of the browser session.
- **`js/auth.js`** — contains `CORRECT_PIN` and exports `requireAuth()` and `isAuthenticated()`. To change the PIN, update `CORRECT_PIN` in this file.

**Firestore security rules** (set in Firebase Console — currently open for reads, unrestricted writes since auth is PIN-based):
```
match /subjects/{subjectId} {
  allow read: if true;
  allow write: if true;
}
```

### Firebase

- Credentials are hardcoded in `js/firebase.js` (public project; access is controlled via Firestore security rules).
- Firestore structure: `subjects/{subjectId}` — each document holds the chapters array for that subject.
- SDK version: Firebase v10.12.2, loaded from CDN (no npm install needed).
