# Study Dashboard

A study progress tracker for Malaysian Form 2–5 and SPM exam preparation. Tracks chapter completion and confidence levels across 13 subjects, with real-time sync via Firebase Firestore.

## Features

- Progress tracking across 13 subjects (200+ chapters)
- Per-chapter status: Not Started / In Progress / Mastered
- Confidence scoring (0–100%) per chapter
- Exam countdown for Form 2–5 mid/final exams and SPM
- Real-time sync via Firebase Firestore
- Mobile-responsive, no build step required

## Subjects

Maths, Add Maths, Science, Physics, Chemistry, Biology, English, Chinese, Malay, Moral, History, Geografi, Reka Bentuk

## Running Locally

Open `index.html` directly in a browser, or serve with a static file server:

```bash
npx serve .
```

## Validation

After editing subject data or registry files, run:

```bash
node tools/validate-project.mjs
```

## Tech Stack

- Vanilla HTML / CSS / JavaScript (ES6 modules)
- Firebase Firestore v10.12.2 (via CDN)
- No npm dependencies for the frontend
