# Single PC Design: Shared Development Environment

**Setup:** Both Khailer and Paul work on same Windows 11 PC  
**Location:** `C:\development\`  
**Date:** June 12, 2026

---

## Architecture

```
Single PC (C:\development\)
│
├── paul\
│   └── study-dashboard\        ← Paul's main project (cloned from GitHub)
│       ├── index.html
│       ├── js/
│       │   ├── subject.js       ← Chapter data + resourceUrl
│       │   └── ...
│       ├── sw.js               ← Caches chapters
│       ├── subjects/            ← 14 subject pages
│       ├── CLAUDE.md
│       └── package.json
│
├── khailer\
│   └── study-chapters\         ← Khailer's chapters (cloned from GitHub)
│       ├── maths/
│       │   ├── chapter1/
│       │   │   ├── index.html
│       │   │   ├── styles.css
│       │   │   ├── script.js
│       │   │   └── chapter-metadata.json
│       │   └── chapter2/ ...
│       ├── chemistry/ ...
│       └── english/ ...
│
└── [chapter notes folders]/    ← Linked from dashboard
    ├── chemistry/
    ├── english/
    ├── history/
    ├── physics/
    └── rbt/
```

---

## Advantages Over Multi-PC

✅ **Simpler:**
- No GitHub synchronization needed
- Both repos local on same machine
- Direct file access
- No polling or webhooks

✅ **Faster:**
- No git clone/push delays
- Changes visible immediately
- Real-time collaboration

✅ **No External Dependencies:**
- No Google Sheets
- No pending-chapters.md file
- No metadata complexity
- Everything local

---

## Workflow: Single PC (Direct)

### Khailer's Workflow

1. **Create chapter folder:**
   ```powershell
   cd C:\development\khailer\study-chapters\maths
   mkdir chapter1
   cd chapter1
   ```

2. **Create files:** `index.html`, `styles.css`, `script.js`

3. **Test locally:**
   ```powershell
   npx serve .
   # Open http://localhost:5000
   ```

4. **When ready, commit & push:**
   ```powershell
   cd C:\development\khailer\study-chapters
   git add maths/chapter1/
   git commit -m "feat: add maths chapter1"
   git push origin main
   ```

5. **Tell Paul:** "Chapter ready for linking"

### Paul's Workflow

1. **See Khailer's new chapter** (direct access to `C:\development\khailer\study-chapters\`)

2. **Run `/link-chapter` command** (or Paul manually edits):
   - Add `resourceUrl` to `js/subject.js`
   - Add path to `sw.js` STATIC_ASSETS
   - Update `subjects/maths.html`

3. **Test locally:**
   ```powershell
   cd C:\development\paul\study-dashboard
   npx serve .
   ```

4. **Validate & push:**
   ```powershell
   npm run validate
   git add .
   git commit -m "link: add maths chapter1"
   git push origin main
   ```

5. **Dashboard updates** on GitHub Pages

---

## Coordination Methods (Pick One)

### Option A: Direct Talk (Simplest)
- Khailer finishes chapter, tells Paul in person/message
- Paul links it manually or via Claude command
- Pros: Simple, no files to manage
- Cons: Requires communication

### Option B: Simple Notification File (Local)
- Create `C:\development\_shared\ready-chapters.txt`
- Khailer adds: `Maths Chapter 1 - Functions & Graphs - 2026-06-12`
- Paul reads it when checking
- Delete line when linked
- Pros: Simple file tracking
- Cons: Manual file management

### Option C: Claude Automation (No File)
- Khailer pushes chapter
- Claude detects new chapter (by scanning folder dates or file size)
- Claude shows list: "Maths Ch1 - Ready to link?"
- Paul approves: "yes"
- Claude links automatically
- Pros: Automated, no file management
- Cons: Requires Claude polling

**Recommended: Option C (Claude Automation)** — Simplest workflow for single PC.

---

## Claude's Role (Single PC)

### Command: `/link-chapters`

```
Paul runs: /link-chapters
Claude:
  1. Scans C:\development\khailer\study-chapters\
  2. Finds new chapters (folders not yet in subject.js)
  3. Shows list with chapter details
  4. Waits for Paul's approval
  5. Links to study-dashboard:
     - Updates js/subject.js (add resourceUrl)
     - Updates sw.js (add to STATIC_ASSETS)
     - Updates subjects/maths.html (add chapter link)
  6. Validates: npm run validate
  7. Commits & pushes
  8. Done ✅
```

### How Claude Detects New Chapters

**Method 1: Folder Comparison (Recommended)**
```javascript
// Scan C:\development\khailer\study-chapters\
// For each subject folder (maths/, science/, english/)
//   For each chapter folder (chapter1/, chapter2/)
//     Check if resourceUrl exists in js/subject.js
//     If NOT, mark as "ready to link"
```

**Method 2: Modification Time**
```javascript
// Check folder timestamps
// If folder modified after last deployment, it's new
```

**Method 3: Metadata File (Optional)**
```javascript
// Khailer creates chapter-metadata.json (optional)
// Claude reads it: status = "ready"
// Simpler for Khailer, more explicit
```

**Recommended: Method 1** — Compare chapters in repo vs in subject.js

---

## Setup Steps (Single PC)

### Prerequisites (Both Users)
- Windows 11 ✅
- Git ✅
- Node.js v24+ ✅
- Same user account or shared access

### Step 1: Paul's Repo (Already Done)
```powershell
cd C:\development\paul\study-dashboard
git status  # Should be clean
npm run validate  # Should pass
```

### Step 2: Khailer's Repo (New)
```powershell
# Clone study-chapters to khailer folder
cd C:\development\khailer
git clone https://github.com/khailer/study-chapters.git

# Configure git identity
cd study-chapters
git config user.name "Khailer"
git config user.email "khailer@example.com"

# Create subject folders if missing
mkdir maths, science, english, chemistry, physics, biology, history, geografi, malay, chinese, moral, addmaths, rbt, seni

# Verify
git status
```

### Step 3: Optional - Create _shared Folder
```powershell
mkdir C:\development\_shared
# Not strictly necessary, but useful for notes/logs
```

### Step 4: Test Communication

**Khailer:**
```powershell
cd C:\development\khailer\study-chapters\maths
mkdir chapter_test
cd chapter_test

# Create test files
@"
<!DOCTYPE html>
<html><head><title>Test</title></head><body><h1>Test</h1></body></html>
"@ | Set-Content index.html

"" | Set-Content styles.css
"" | Set-Content script.js

# Commit
git add .
git commit -m "test: add test chapter"
git push origin main
```

**Paul:**
```powershell
# Run linking command (once Claude command is set up)
/link-chapters

# Or manually:
# 1. Open C:\development\khailer\study-chapters\maths\chapter_test\index.html
# 2. Add to js/subject.js: resourceUrl: "../../khailer/study-chapters/maths/chapter_test/index.html"
# 3. Add to sw.js STATIC_ASSETS
# 4. Test locally: npx serve .
# 5. Validate: npm run validate
# 6. Commit & push
```

---

## File Paths (Single PC)

### Chapter Location (Khailer's Repo)
```
C:\development\khailer\study-chapters\maths\chapter1\index.html
```

### Link Path in subject.js (From subjects/ folder)
```javascript
// File: js/subject.js
// From: C:\development\paul\study-dashboard\subjects\
// To: C:\development\khailer\study-chapters\maths\chapter1\index.html

resourceUrl: "../../khailer/study-chapters/maths/chapter1/index.html"
// Relative path goes up 2 levels from subjects/ → study-dashboard root → C:\development\
// Then down to khailer/study-chapters/maths/chapter1/
```

### Link Path in sw.js (From root)
```javascript
// File: sw.js
// From: C:\development\paul\study-dashboard\
// To: C:\development\khailer\study-chapters\maths\chapter1\index.html

const STATIC_ASSETS = [
  '/subjects/maths.html',
  '/khailer/study-chapters/maths/chapter1/index.html',  // Absolute path from root
  // ... other assets
];
```

---

## Folder Structure (Final)

```
C:\development\
├── paul\
│   └── study-dashboard\           ← Paul's main project
│       ├── index.html
│       ├── js/
│       │   ├── subject.js
│       │   ├── subject-registry.js
│       │   ├── dashboard.js
│       │   └── firebase.js
│       ├── sw.js
│       ├── subjects/
│       │   ├── maths.html
│       │   ├── science.html
│       │   └── ... (14 subjects)
│       ├── package.json
│       └── CLAUDE.md
│
├── khailer\
│   └── study-chapters\            ← Khailer's chapters
│       ├── maths/
│       │   ├── chapter1/
│       │   │   ├── index.html
│       │   │   ├── styles.css
│       │   │   ├── script.js
│       │   │   └── chapter-metadata.json (optional)
│       │   └── chapter2/ ...
│       ├── chemistry/ ...
│       ├── english/ ...
│       ├── history/ ...
│       └── physics/ ...
│
└── _shared/ (optional)
    └── collaboration-notes.md
```

---

## Workflow Examples

### Example 1: Khailer Adds Maths Chapter 1

**Khailer's Steps:**
```powershell
cd C:\development\khailer\study-chapters\maths
mkdir chapter1 && cd chapter1

# Create files
# (index.html with chapter content, styles.css, script.js)

# Test locally
npx serve .

# Commit
git add .
git commit -m "feat: add maths chapter 1 - functions and graphs"
git push origin main

# Tell Paul: "Maths chapter 1 ready for linking"
```

**Paul's Steps (Option 1 - Claude):**
```powershell
# In Claude Code:
/link-chapters

# Claude shows:
# "Ready to link:
#  - Maths Chapter 1: Functions & Graphs
#  
#  Paul: approve? (yes/no)"

# Paul responds: "yes"

# Claude:
# 1. Adds resourceUrl to maths chapter in subject.js
# 2. Adds path to sw.js
# 3. Updates subjects/maths.html
# 4. Validates
# 5. Commits & pushes
# Done!
```

**Paul's Steps (Option 2 - Manual):**
```powershell
cd C:\development\paul\study-dashboard

# Open js/subject.js, find maths chapters, add:
# resourceUrl: "../../khailer/study-chapters/maths/chapter1/index.html"

# Open sw.js, add to STATIC_ASSETS:
# '/khailer/study-chapters/maths/chapter1/index.html'

# Open subjects/maths.html, add chapter link HTML

# Test
npx serve .

# Validate
npm run validate

# Commit
git add .
git commit -m "link: add maths chapter 1"
git push origin main
```

**Result:** Dashboard shows "Chapter 1 - Functions & Graphs" link in Maths subject ✅

---

## Daily Workflow Checklist

### Khailer (Every Time Finishing Chapter)
- [ ] Create chapter folder: `study-chapters/[subject]/chapter[N]/`
- [ ] Create files: `index.html`, `styles.css`, `script.js`
- [ ] Test locally: `npx serve .`
- [ ] Commit: `git add . && git commit -m "feat: add ..."`
- [ ] Push: `git push origin main`
- [ ] Tell Paul chapter is ready (message or /link-chapters auto-detects)

### Paul (After Khailer's Chapter Ready)
- [ ] Run `/link-chapters` (Claude auto-links)
  OR manually:
- [ ] Edit `js/subject.js` (add resourceUrl)
- [ ] Edit `sw.js` (add to STATIC_ASSETS)
- [ ] Edit `subjects/[subject].html` (add chapter link)
- [ ] Validate: `npm run validate`
- [ ] Test: `npx serve .`
- [ ] Commit & push: `git add . && git commit -m "link: ..." && git push`
- [ ] Verify on GitHub Pages

---

## Advantages of Single PC

| Aspect | Multi-PC | **Single PC** |
|--------|----------|--------------|
| Complexity | High | **Low** |
| Setup Time | 2-3 hours | **30 min** |
| Synchronization | GitHub (polling) | **Direct access** |
| External Dependencies | Google Sheet / GitHub API | **None** |
| Real-time Updates | ~1 hour delay | **Instant** |
| Offline Support | No | **Yes (local)** |
| Collaboration | Asynchronous | **Real-time** |
| Cost | Low | **No cost** |

---

## File Paths Quick Reference

| Context | Path | Example |
|---------|------|---------|
| **Khailer creates** | `C:\development\khailer\study-chapters\maths\chapter1\` | Local folder |
| **In subject.js** | Relative from `subjects/` | `../../khailer/study-chapters/maths/chapter1/index.html` |
| **In sw.js** | Absolute from root | `/khailer/study-chapters/maths/chapter1/index.html` |
| **GitHub Pages** | URL | `https://khailer.github.io/study-chapters/maths/chapter1/` |

---

## Troubleshooting

### "Cannot find chapter folder"
- Verify Khailer has cloned study-chapters to `C:\development\khailer\`
- Run: `ls C:\development\khailer\study-chapters\` to confirm

### "Path errors in subject.js"
- Use relative paths from `subjects/` folder: `../../khailer/...`
- Count folder levels: `subjects/` → `study-dashboard/` (1 up) → `development/` (2 ups)

### "Service worker not caching chapter"
- Add path to STATIC_ASSETS in `sw.js`
- Path must start with `/` (absolute from root)

### "Validation fails"
- Run: `npm run validate` from study-dashboard
- Check subject name spelling (case-sensitive)
- Verify resourceUrl path is correct

---

## Commands Summary

**Khailer:**
```bash
cd C:\development\khailer\study-chapters
mkdir maths/chapter1 && cd maths/chapter1
npx serve .
git add . && git commit -m "feat: add chapter" && git push
```

**Paul:**
```bash
cd C:\development\paul\study-dashboard
npx serve .                    # Test locally
npm run validate               # Validate
git add . && git commit && git push
```

**Claude:**
```bash
/link-chapters                 # Detect new chapters and link them
```

---

## Implementation Steps (Single PC)

### Day 1: Setup
- [ ] Verify Paul's study-dashboard is cloned (✅ already done)
- [ ] Clone Khailer's study-chapters to `C:\development\khailer\`
- [ ] Create subject folders (maths, chemistry, etc.)
- [ ] Configure git identities (paul and khailer users)

### Day 2: Test
- [ ] Khailer creates test chapter
- [ ] Paul links it manually
- [ ] Verify on local server
- [ ] Commit & push both repos

### Day 3+: Workflow
- [ ] Khailer adds chapters
- [ ] Paul links via Claude `/link-chapters` or manually
- [ ] GitHub Pages updates
- [ ] Repeat

---

## Success Criteria

- [ ] Khailer can create chapters in `study-chapters\maths\`
- [ ] Paul can link chapters to `study-dashboard`
- [ ] Dashboard shows chapter links correctly
- [ ] GitHub Pages updates when pushed
- [ ] All 14 subjects still validate
- [ ] Both repos in sync

---

## Next Steps

1. **Clone study-chapters** to `C:\development\khailer\`
2. **Create subject folders** (maths, chemistry, english, etc.)
3. **Test with 3 chapters** (manual linking)
4. **Set up Claude `/link-chapters` command** (automation)
5. **Document any issues** in collaboration notes

**Much simpler than multi-PC!** Ready to start?
