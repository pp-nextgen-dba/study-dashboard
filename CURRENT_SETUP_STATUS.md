# Current Single PC Setup Status

**Date:** June 11, 2026  
**PC:** Paul's Development PC (Windows 11)  
**Project:** study-dashboard (study progress tracker)

---

## Environment

- **Node.js:** v24.16.0 ✅
- **npm:** 11.13.0 ✅
- **Git:** Installed ✅
- **Repository:** `pp-nextgen-dba/study-dashboard` (GitHub)
- **Local Path:** `C:\development\paul\study-dashboard\`
- **Branch:** main (up to date with origin)

---

## Project Status

### Validation
```
✅ 14 dashboard subjects validated
✅ All subject data consistent
✅ All registry entries configured
```

### Recent Commits (Last 5)
1. `aa22e39` — chore: log auto-integration run (sw.js fix)
2. `515c7cb` — fix: add missing history chapter files to sw.js STATIC_ASSETS
3. `a0ffb92` — chore: log auto-integration run (no new files)
4. `861dbc8` — chore: log auto-integration executions (no files detected)
5. `e4f291f` — chore: log auto-integration execution (no files detected)

---

## Folder Structure

```
study-dashboard/
├── index.html                 ← Main dashboard
├── manifest.json             ← PWA manifest
├── sw.js                     ← Service worker (caches STATIC_ASSETS)
├── CLAUDE.md                 ← Project rules
├── package.json              ← npm config
│
├── js/                       ← Core JavaScript
│   ├── subject.js            ← Master subject data (14 subjects)
│   ├── subject-registry.js   ← Subject → Firestore mapping
│   ├── dashboard.js          ← Dashboard logic
│   ├── firebase.js           ← Firebase setup
│   ├── auth.js               ← PIN authentication (SHA-256)
│   └── ...
│
├── subjects/                 ← 14 subject pages
│   ├── maths.html
│   ├── science.html
│   ├── english.html
│   ├── chemistry.html
│   ├── physics.html
│   ├── biology.html
│   ├── history.html
│   ├── geografi.html
│   ├── malay.html
│   ├── chinese.html
│   ├── moral.html
│   ├── addmaths.html
│   ├── rbt.html (Reka Bentuk)
│   └── seni.html
│
├── css/                      ← Stylesheets
├── [subject folders]/        ← Chapter notes (chemistry/, english/, etc.)
│   ├── t4_chapter1.html
│   └── ...
│
├── tools/                    ← Build & validation tools
│   └── validate-project.mjs  ← Project validator
│
├── FILES/                    ← Logs & output
│   └── auto_integration_log.txt
│
└── .claude/                  ← Claude Code local config
```

---

## 14 Subjects (14 Subjects)

| # | Subject | Folder | Status |
|----|---------|--------|--------|
| 1 | Maths | — | ✅ Active |
| 2 | Add Maths | — | ✅ Active |
| 3 | Science | — | ✅ Active |
| 4 | Physics | physics/ | ✅ Active + chapters |
| 5 | Chemistry | chemistry/ | ✅ Active + chapters |
| 6 | Biology | — | ✅ Active |
| 7 | English | english/ | ✅ Active + chapters |
| 8 | Chinese | — | ✅ Active |
| 9 | Malay | — | ✅ Active |
| 10 | Moral | — | ✅ Active |
| 11 | History | history/ | ✅ Active + chapters |
| 12 | Geografi | — | ✅ Active |
| 13 | Reka Bentuk (RBT) | rbt/ | ✅ Active + chapters |
| 14 | Seni | — | ✅ Active |

---

## Key Files & Their Purpose

### Core Configuration
- **js/subject.js** — Master data: 14 subjects with chapters (form, status, confidence, last_updated, optional resourceUrl)
- **js/subject-registry.js** — Maps subjects to Firestore keys, progress bar IDs, hrefs, loadSeed flag
- **sw.js** — Service worker that caches STATIC_ASSETS (paths to chapter notes); Firestore bypasses cache

### Pages
- **index.html** — Main dashboard (subject cards + progress bars)
- **subjects/*.html** — Individual subject pages (14 files)
- **[subject]/*.html** — Chapter notes pages (in physics/, chemistry/, english/, history/, rbt/ folders)

### Backend
- **js/firebase.js** — Firebase Firestore init, anonymous auth, exports `db`
- **js/dashboard.js** — onSnapshot listeners, auto-seed Firestore, Export Progress button
- **js/auth.js** — PIN authentication using SHA-256 hash

### Validation & Build
- **tools/validate-project.mjs** — Cross-checks subject.js, subject-registry.js, index.html, subject pages

---

## Running the Project

### Local Development Server
```powershell
cd C:\development\paul\study-dashboard
npx serve .
# Opens http://localhost:5000
```

### Validate Project
```powershell
npm run validate
# Checks subject data consistency
```

### Commit & Push Changes
```powershell
git add .
git commit -m "message"
git push origin main
# Updates GitHub Pages: https://pp-nextgen-dba.github.io/study-dashboard/
```

---

## Chapter Notes Integration

### Adding a Chapter Notes Page

1. **Create HTML file** in subject folder (e.g., `chemistry/t4_chapter1.html`)
   - Must include "Back to Dashboard" button
   - Must be added to sw.js STATIC_ASSETS

2. **Update subject.js**
   ```javascript
   resourceUrl: "../chemistry/t4_chapter1.html"  // Relative from subjects/
   ```

3. **Update sw.js**
   ```javascript
   '/chemistry/t4_chapter1.html',  // In STATIC_ASSETS (leading slash)
   ```

4. **Validate & commit**
   ```powershell
   npm run validate
   git add .
   git commit -m "add: chemistry chapter 1 notes"
   git push origin main
   ```

---

## Current Issues/Logs

Check `FILES/auto_integration_log.txt` for automation logs:
- Auto-integration routine runs every 4 hours (GMT+8)
- Scans subject folders for new chapter HTML files
- Auto-wires missing resourceUrl + sw.js + subject page components
- 246 chapters tracked

---

## Firebase Backend

- **Anonymous Auth:** Enabled (signInAnonymously)
- **Firestore DB:** Connected via Firebase config in js/firebase.js
- **Data Sync:** Firestore reads bypass service worker cache (always fresh)
- **Auto-Seeding:** loadSeed: true in subject-registry.js pre-populates Firestore

---

## Commands Ready to Use

### Validation
```bash
npm run validate        # Verify all subject data is consistent
```

### Local Server
```bash
npx serve .             # Run dashboard locally (http://localhost:5000)
```

### Git Workflow
```bash
git status              # See pending changes
git diff                # View changes
git add .               # Stage all
git commit -m "msg"     # Commit
git push origin main    # Push to GitHub (updates GitHub Pages)
git log --oneline       # View commit history
```

---

## Next Steps (for Multi-PC Setup)

When Khailer starts on a different PC:

1. Clone study-chapters repo (his chapters)
2. Paul runs `/check-chapters` to scan both repos
3. Claude links Khailer's chapters to Paul's dashboard
4. Everything automated via chapter-metadata.json

See `MULTI_PC_DESIGN.docx` and `SETUP_BOTH_PCS.docx` for full details.

---

## Quick Reference

| Task | Command |
|------|---------|
| Validate project | `npm run validate` |
| Run locally | `npx serve .` |
| Check status | `git status` |
| View changes | `git diff` |
| Commit & push | `git add . && git commit -m "msg" && git push` |
| View history | `git log --oneline -10` |

---

## Architecture Notes

- **No build step:** HTML/CSS/JS served as-is
- **Firebase Firestore:** Backend for progress tracking
- **Service Worker:** Caches dashboard assets, Firestore bypasses cache
- **Responsive:** Mobile-first design
- **PIN Protection:** Optional PIN auth via SHA-256 hash
- **GitHub Pages:** Published at pp-nextgen-dba.github.io/study-dashboard/

---

**Status:** ✅ Ready for development + multi-PC integration planning
