# Proposal: Google Sheet Notification Bridge (Multi-PC Setup)

For Paul and Khailer working on different PCs.

---

## 1. Google Sheet Structure

**Sheet name:** `Pending Chapters` (shared between Paul and Khailer)

**Columns (A–H):**

| Column | Header | Type | Example | Notes |
|--------|--------|------|---------|-------|
| A | Date Ready | Date | 2026-06-11 | When Khailer marked it ready |
| B | Status | Text | NEW / LINKED / DONE | Workflow state |
| C | Subject | Text | Maths | From subject.js |
| D | Chapter | Text | 1 or en_001 | Chapter number or code |
| E | Title | Text | Functions & Graphs | From chapter data |
| F | GitHub Pages URL | URL | https://khailer.github.io/study-chapters/maths/chapter1/ | Live link |
| G | Paul's Notes | Text | (optional) | Review feedback |
| H | Last Updated | Timestamp | Auto-filled | When row was last modified |

**Sheet permissions:**
- Owner: Paul (psi9999@gmail.com)
- Editor: Khailer
- View only: Claude (via API service account)

**Row lifecycle:**
```
NEW (Khailer adds)
  ↓
LINKED (Claude updates after wiring dashboard)
  ↓
DONE (Claude updates after git push succeeds)
```

---

## 2. Khailer's Workflow (Different PC)

1. **Finishes chapter** → Creates `subjects/maths/chapter1/` folder on Khailer's PC
2. **Tests locally** → Checks in browser
3. **Git push to study-chapters** → Pushes to GitHub
4. **Opens Google Sheet** → Manually adds row:
   - **Date Ready:** Today's date
   - **Status:** NEW
   - **Subject:** Maths
   - **Chapter:** 1
   - **Title:** Functions & Graphs
   - **GitHub Pages URL:** https://khailer.github.io/study-chapters/maths/chapter1/
   - **Paul's Notes:** (leave blank)
5. **Google Sheets notification** → Paul gets email notification of new row

---

## 3. Paul's Workflow (Different PC)

1. **Receives notification** → Email from Google Sheets (new row added)
2. **Opens Sheet** → Reviews all rows with `Status = NEW`
   - Clicks links to verify they're live
   - Can add notes in "Paul's Notes" column if issues found
3. **Commands Claude** → `/check-chapters` (or `/link-chapters`)
   - **Option A:** "Link all NEW entries"
   - **Option B:** "Link one by one and ask for confirmation"
4. **Claude reads Sheet** → Fetches all NEW rows via Google Sheets API
5. **Claude updates dashboard** → For each NEW row:
   - Add `resourceUrl` to matching chapter in `js/subject.js`
   - Add path to `STATIC_ASSETS` in `sw.js`
   - Optionally add to subject page (e.g., `subjects/maths.html`)
6. **Claude marks as LINKED** → Updates Status column to "LINKED" in Sheet
7. **Claude commits & pushes** → To study-dashboard repo
8. **Claude marks as DONE** → Updates Status column to "DONE" in Sheet
9. **Dashboard goes live** → https://pp-nextgen-dba.github.io/study-dashboard/

---

## 4. Claude's Role (API Integration)

Claude needs two capabilities:

### A. Read the Sheet
```
GET /google-sheets-api/v4/spreadsheets/{SHEET_ID}/values/Pending Chapters
```
- Filters rows where `Status = "NEW"`
- Extracts: Subject, Chapter, Title, URL
- Returns structured list to Paul

### B. Update the Sheet
```
PUT /google-sheets-api/v4/spreadsheets/{SHEET_ID}/values/Pending Chapters!B{ROW}
```
- Updates `Status` column: NEW → LINKED → DONE
- Updates `Last Updated` timestamp
- Optionally adds timestamps to "Paul's Notes"

### Setup Required
- Create **Google Cloud Project**
- Create **Service Account** with Sheets API enabled
- Share Google Sheet with service account email
- Store credentials in `js/sheets-config.json` (`.gitignore` it)
- Pass credentials to Claude at runtime

---

## 5. Comparison: Before (Same PC) vs After (Different PC)

| Aspect | Same PC (`pending-chapters.md`) | Different PC (Google Sheet) |
|--------|--------------------------------|---------------------------|
| File location | `C:\development\_shared\pending-chapters.md` | Google Sheets (cloud) |
| Notification | Automatic (local file watcher) | Email + Sheets notifications |
| Sync | Instant (same filesystem) | ~1 sec (API) |
| Offline support | Yes (local file) | No (cloud only) |
| Collaboration | Manual (both edit .md) | Structured (columns, formulas) |
| Audit trail | Git history | Google Sheets version history |
| Setup complexity | None | Google Cloud Project + API creds |

---

## 6. Implementation Steps

### Phase 1: Manual (Week 1)
- Create Google Sheet manually
- Khailer manually adds rows after each chapter
- Paul manually triggers `/check-chapters` + `/link-chapters`
- Claude reads Sheet via API (no updates yet)

### Phase 2: Auto-Update (Week 2)
- Claude auto-updates Status column after linking
- Claude auto-timestamps rows
- Test with 5–10 chapters

### Phase 3: Khailer Auto-Append (Week 3)
- `/new-khailer` slash command auto-appends row to Sheet
- Remove manual row-adding step

---

## 7. Google Sheet API Setup Checklist

- [ ] Create Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Create Service Account
- [ ] Download service account JSON key
- [ ] Share Sheet with service account email
- [ ] Store JSON in `js/sheets-config.json`
- [ ] Add `js/sheets-config.json` to `.gitignore`
- [ ] Test read/write via Claude with sample data

---

## 8. Fallback: No API (Manual Workflow)

If API setup is too complex:
1. Paul exports Sheet as CSV to `_shared/pending-chapters.csv`
2. Claude reads CSV instead of API
3. Paul manually updates Status column after Claude finishes
4. No real-time sync, but simpler setup

---

## Example Sheet Row

| Date Ready | Status | Subject | Chapter | Title | GitHub Pages URL | Paul's Notes | Last Updated |
|---|---|---|---|---|---|---|---|
| 2026-06-11 | NEW | Maths | 1 | Functions & Graphs | https://khailer.github.io/study-chapters/maths/chapter1/ | — | 2026-06-11 10:30 |
| 2026-06-11 | LINKED | Science | 2 | Cells & Mitosis | https://khailer.github.io/study-chapters/science/chapter2/ | — | 2026-06-11 11:15 |
| 2026-06-10 | DONE | English | 3 | Shakespeare & Macbeth | https://khailer.github.io/study-chapters/english/chapter3/ | Looks good! | 2026-06-11 09:00 |

---

## Questions for Alignment

1. **Google Sheets permissions:** Does Khailer have a Google account? (Or can use Paul's?)
2. **API setup:** Comfortable with Google Cloud Project + service account credentials?
3. **Automation level:** Start manual (Phase 1) or jump to auto-updates (Phase 2)?
4. **Notification preference:** Email from Google Sheets, or Slack notification to Paul?
