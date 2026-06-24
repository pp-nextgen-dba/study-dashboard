# Implementation Plan: GitHub Metadata Approach

**Approach:** GitHub Metadata (no external services, everything in Git)  
**Status:** Ready to implement  
**Start Date:** June 11, 2026

---

## Decision: Why GitHub Metadata

✅ **Advantages:**
- Zero external dependencies (no Google Sheets, no shared folders)
- Everything auditable in Git history
- Fully automated after Phase 1
- Works offline (once cloned)
- Metadata is version-controlled
- Simple setup: just add JSON files

---

## Architecture (GitHub Metadata)

```
Khailer's PC (study-chapters)
├── maths/
│   ├── chapter1/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── script.js
│   │   └── chapter-metadata.json ← Status indicator
│   └── chapter2/ ...
├── chemistry/ ...
└── english/ ...

Paul's PC (study-dashboard)
├── Polls study-chapters every hour (or on demand via /check-chapters)
├── Reads chapter-metadata.json files
├── Finds chapters with status: "ready"
├── Links to study-dashboard
└── Updates js/subject.js, sw.js, subjects/*.html
```

---

## Phase-by-Phase Implementation

### Phase 1: Manual Metadata (Week 1)

**Khailer's PC:**
1. Create chapter folder: `maths/chapter1/`
2. Create files: `index.html`, `styles.css`, `script.js`
3. Test locally: `npx serve .`
4. Commit: `git add . && git commit -m "feat: add maths chapter1"`
5. Push: `git push origin main`
6. **Manually create `chapter-metadata.json`:**
   ```json
   {
     "status": "ready",
     "subject": "Maths",
     "chapter": 1,
     "title": "Functions & Graphs",
     "url": "https://khailer.github.io/study-chapters/maths/chapter1/",
     "ready_date": "2026-06-11T10:30:00Z"
   }
   ```
7. Commit metadata: `git add chapter-metadata.json && git commit -m "docs: add metadata"` 
8. Push: `git push origin main`

**Paul's PC:**
1. Run: `/check-chapters`
2. Claude clones `study-chapters` repo
3. Scans for `chapter-metadata.json` with `status: "ready"`
4. Shows: "Maths Chapter 1 — Functions & Graphs — Ready for linking"
5. Paul approves: "yes, link all"
6. Claude:
   - Adds `resourceUrl` to `js/subject.js`
   - Adds path to `sw.js` STATIC_ASSETS
   - Updates `subjects/maths.html` with chapter link
   - Validates: `npm run validate`
   - Commits: `git add . && git commit -m "link: add maths chapter1"`
   - Pushes: `git push origin main`
7. Dashboard updates on GitHub Pages ✅

**Testing:**
- Verify 5-10 chapters this way
- Confirm workflow is solid
- Check GitHub Pages updates correctly

---

### Phase 2: Auto-Metadata Creation (Week 2)

**Goal:** Claude auto-creates `chapter-metadata.json` when Khailer pushes

**Implementation Options:**

**Option A: GitHub Webhook (Real-time)**
- Khailer pushes → GitHub webhook → Claude receives → auto-creates metadata
- Requires: Webhook URL on Paul's PC or server

**Option B: Polling (Scheduled)**
- Claude checks study-chapters repo every hour
- Detects new chapters (no metadata → create it)
- Commits metadata automatically
- Simpler, no server needed

**Recommended: Option B (Polling)**

**Changes:**
- Claude script runs: `git clone study-chapters`
- Scans all subject folders
- For new chapters without `chapter-metadata.json`:
  - Extract subject, chapter number from folder name
  - Query GitHub Pages to confirm chapter is live
  - Create metadata with `status: "ready"`
  - Commit & push automatically

**Khailer's new workflow:**
1. Create chapter folder
2. Create files (index.html, etc.)
3. Test locally
4. Commit & push ✅
5. Done! (Claude auto-creates metadata)

---

### Phase 3: Fully Automated (Week 3+)

**Goal:** Zero manual intervention

**Fully Automated Workflow:**
1. Khailer pushes chapter → automatic
2. Claude detects via polling → auto-creates metadata → automatic
3. Claude detects new metadata → auto-links to dashboard → automatic
4. Paul doesn't need to run `/check-chapters` manually (but can)

**Implementation:**
- Set Claude to run `/check-chapters` on a daily schedule
- Email Paul with summary of linked chapters
- Dashboard updates automatically

---

## Metadata Schema (Final)

**File:** `chapter-metadata.json` (in each chapter folder)

```json
{
  "status": "ready",
  "subject": "Maths",
  "chapter": 1,
  "title": "Functions & Graphs",
  "url": "https://khailer.github.io/study-chapters/maths/chapter1/",
  "ready_date": "2026-06-11T10:30:00Z"
}
```

**Fields:**
- **status:** `"ready"` — ready for dashboard linking
- **subject:** Subject name (matches subject.js: "Maths", "Science", etc.)
- **chapter:** Chapter number or code (1, 2, or "en_001")
- **title:** Display title for dashboard
- **url:** Live GitHub Pages URL
- **ready_date:** ISO 8601 timestamp when ready

---

## Implementation Timeline

| Week | Phase | What Happens | Effort |
|------|-------|---|--------|
| Week 1 | Manual Metadata | Khailer creates metadata manually, Claude links | 30 min per chapter |
| Week 2 | Auto-Metadata | Claude auto-creates metadata on push | Setup 2 hours, then 0 min per chapter |
| Week 3+ | Fully Automated | /check-chapters runs on schedule | 0 min per chapter |

---

## Key Files (No Changes Needed)

| File | Purpose | Status |
|------|---------|--------|
| `study-chapters/maths/chapter1/chapter-metadata.json` | New (add for each chapter) | ✅ Create when ready |
| `study-dashboard/js/subject.js` | Existing (add resourceUrl) | ✅ Claude updates |
| `study-dashboard/sw.js` | Existing (add to STATIC_ASSETS) | ✅ Claude updates |
| `study-dashboard/subjects/maths.html` | Existing (add chapter links) | ✅ Claude updates |

**No folder restructuring needed.** Current `C:\development\` structure is perfect.

---

## Folder Structure (Final - No Changes)

```
C:\development\
├── paul\
│   └── study-dashboard\        ← Paul's repo (linked chapters)
└── khailer\
    └── study-chapters\         ← Khailer's repo (chapter folders + metadata)
        ├── maths/
        │   └── chapter1/
        │       ├── index.html
        │       ├── styles.css
        │       ├── script.js
        │       └── chapter-metadata.json ← NEW FILE (you create)
        ├── chemistry/ ...
        └── english/ ...
```

---

## Getting Started: Phase 1 Setup

### Step 1: Khailer's PC - First Chapter Test

```powershell
cd C:\repos\study-chapters
mkdir maths\chapter_test
cd maths\chapter_test

# Create index.html
@"
<!DOCTYPE html>
<html>
<head><title>Test Chapter</title></head>
<body><h1>Test Chapter</h1><p>This is a test.</p></body>
</html>
"@ | Set-Content index.html

# Create empty styles.css
"" | Set-Content styles.css

# Create empty script.js
"" | Set-Content script.js

# Test locally
npx serve ..

# Commit
git add .
git commit -m "feat: add test chapter"
git push origin main
```

### Step 2: Verify on GitHub Pages

```
https://khailer.github.io/study-chapters/maths/chapter_test/
```

### Step 3: Create Metadata

```powershell
cd C:\repos\study-chapters\maths\chapter_test

@"
{
  "status": "ready",
  "subject": "Maths",
  "chapter": "test",
  "title": "Test Chapter",
  "url": "https://khailer.github.io/study-chapters/maths/chapter_test/",
  "ready_date": "2026-06-11T10:30:00Z"
}
"@ | Set-Content chapter-metadata.json

git add chapter-metadata.json
git commit -m "docs: add metadata"
git push origin main
```

### Step 4: Paul Tests Linking

```powershell
# On Paul's PC, run in Claude Code:
/check-chapters
```

**Claude should:**
- Clone study-chapters
- Find maths/chapter_test/chapter-metadata.json
- Show: "Maths Test — Test Chapter — Ready for linking"
- Wait for approval

Paul says: `"yes, link all"`

Claude should:
- Update js/subject.js with resourceUrl
- Update sw.js with STATIC_ASSETS
- Validate
- Commit & push
- Confirm dashboard updated

### Step 5: Verify

```
https://pp-nextgen-dba.github.io/study-dashboard/
```

Dashboard should show "Test Chapter" link in Maths section ✅

---

## Success Criteria (Phase 1)

- [ ] Khailer can create chapter folders on their PC
- [ ] Khailer can manually create chapter-metadata.json
- [ ] Paul can run /check-chapters and see ready chapters
- [ ] Claude can link chapters to dashboard
- [ ] Dashboard updates on GitHub Pages
- [ ] All 14 subjects still validate correctly
- [ ] 5-10 test chapters successfully linked

---

## Commands Reference

**Khailer (study-chapters):**
```bash
npx serve .                           # Test chapter locally
git add . && git commit -m "msg"      # Commit chapter
git push origin main                  # Push to GitHub
```

**Paul (study-dashboard):**
```bash
npm run validate                      # Validate project
npx serve .                           # Test locally
git add . && git commit -m "msg"      # Commit
git push origin main                  # Push to GitHub Pages
```

**Both:**
```bash
git status                            # Check status
git log --oneline -5                  # View history
git pull origin main                  # Pull latest
```

---

## Documents to Keep

1. **MULTI_PC_DESIGN.docx** — Architecture overview
2. **SETUP_BOTH_PCS.docx** — Setup instructions
3. **IMPLEMENTATION_PLAN.md** — This file (step-by-step)
4. **CURRENT_SETUP_STATUS.md** — Current single PC state
5. **FOLDER_STRUCTURE_ANALYSIS.md** — Structure verification

---

## Next Steps

1. ✅ Review this plan with Khailer
2. ✅ Confirm metadata schema
3. **Start Phase 1:** Test with 3-5 chapters
4. Document any issues or changes
5. Once solid, move to Phase 2 (auto-metadata)
6. Then Phase 3 (fully automated)

---

## Questions to Clarify

- [ ] Khailer's GitHub username/account (for study-chapters repo)
- [ ] Which subjects Khailer will start with?
- [ ] Timeline for first 5 test chapters?
- [ ] Who creates the metadata in Phase 1 (Khailer or Claude)?

**Recommended:** Khailer creates metadata in Phase 1 to learn the schema, then Claude auto-creates in Phase 2.

---

**Status:** Ready to implement Phase 1. Proceed when both PCs are set up per SETUP_BOTH_PCS.docx.
