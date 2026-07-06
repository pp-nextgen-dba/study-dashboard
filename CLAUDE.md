# CLAUDE.md

Static PWA — Malaysian school study progress tracker. No build step. Firebase Firestore backend (CDN).

## Commands

```bash
npm run validate        # after editing subject.js, subject-registry.js, or index.html
npm run check-codes     # show next available 3-digit codes for en_/my_/zh_ chapters
npx serve .             # run locally
```

## Firestore Rules (Important)

Default Firebase security rules expire after 30 days. **Check expiration date before it passes:**

**Current rules:** Valid until **June 30, 2026**

When rules expire, all Firestore reads/writes fail with `Missing or insufficient permissions` error. To extend:

1. Firebase Console → Your project → Firestore Database → Rules
2. Find the line: `allow read, write: if request.time < timestamp.date(YYYY, M, D);`
3. Update the date to a future date (e.g., `2026, 7, 30`)
4. Click **Publish**

Reload the app — it should work again.

**Note:** Rules are set to expire intentionally (security best practice). For permanent access, use `allow read, write: if true;` instead.

## Key Files

| File | Purpose |
|---|---|
| `js/subject.js` | Master data (14 subjects, chapters with form/status/confidence/last_updated) |
| `js/subject-registry.js` | Maps subjects → Firestore key, progress bar IDs, href, loadSeed flag |
| `js/dashboard.js` | onSnapshot listeners, Firestore auto-seed, Export Progress button |
| `js/firebase.js` | Firebase init, exports `db`, calls `signInAnonymously()` |
| `js/auth.js` | PIN auth (SHA-256 hash). Exports `requireAuth()`, `isAuthenticated()` |
| `sw.js` | Service worker — caches STATIC_ASSETS; Firestore bypasses cache |
| `tools/validate-project.mjs` | Cross-checks subject.js, subject-registry.js, index.html, subject pages |

**Subjects (14):** Maths, Add Maths, Science, Physics, Chemistry, Biology, English, Chinese, Malay, Moral, History, Geografi, Reka Bentuk, Seni (T2–T3).

**Daily Progress tracker** (`daily-progress.html` / `js/daily-progress.js`) is separate from the chapter dashboard — it logs which subjects were studied on which calendar day, stored in its own Firestore doc (`studyProgress/daily`), with month-grid and yearly summary views. Not part of the per-chapter `resourceUrl`/`STATIC_ASSETS` workflow below.

## Chapter HTML File Locations

Chapter notes pages live in **root-level subject folders**, not inside `subjects/`:

```
chemistry/     t4_chapter1.html
chinese/       zh_030.html
english/       T4_T5_english_grammar.html
history/       t2_chapter4.html, t2_chapter8.html ...
physics/       t4_force_motion.html
rbt/           t2_akuaponik.html, t2_elektrik.html ...
```

No `archive/` subdirectories — all files sit directly in `<subject>/`.

**Chinese chapters (3-digit code):**
- `zh_030` — 独中中文 (T3) — Independent Chinese curriculum & reading comprehension

## Adding a Chapter Notes Page

**First:** confirm the HTML file exists on disk — do not create it.

1. Check/add **Back to Dashboard** button:
   - **Standard pages:** Add as first element after `<body>`:
     ```html
     <div class="top-nav" style="background:#fff;padding:10px 16px;border-bottom:2px solid #e5e7eb;position:sticky;top:0;z-index:120">
       <a class="dashboard-link" href="../index.html" style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;background:#1d4ed8;color:#fff;font-size:13px;font-weight:800;text-decoration:none">&larr; Back to Dashboard</a>
     </div>
     ```
   - **RBT pages** (dark header with custom styling): Position absolutely inside `<header>` to avoid being hidden:
     ```html
     <header class="hdr">
       <div style="position:absolute;top:10px;left:16px"><a href="../index.html" style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.2);color:#fff;font-size:13px;font-weight:800;text-decoration:none;border:1px solid rgba(255,255,255,0.3)">&larr; Dashboard</a></div>
       <!-- header content -->
     </header>
     ```
2. Add `resourceUrl: "../<subject>/<file>.html"` to the matching chapter in `js/subject.js`
3. Add `'/<subject>/<file>.html'` to `STATIC_ASSETS` in `sw.js`
4. **Update subject page** — if the subject page doesn't have the `.chapter-link` CSS, `chapterResource` variable, and `addMissingChineseLabels()` sync function, add them (see Auto-Integration Workflow step 4 for templates)
5. **Bump cache versions** — increment `?v=N` on the subject page's CSS and module imports
6. Run `npm run validate`
7. Commit & push
8. **Browser cache clearing:** After pushing, users should clear site data (DevTools → Application → Storage → Clear site data) to load the updated Firestore document with the new `resourceUrl`

## Auto-Integration Workflow

**Before adding a chapter with 3-digit code**, run `npm run check-codes` to see the next available code for that language.

When triggered, the workflow:
1. Pulls latest from GitHub (`git pull`)
2. Scans all root-level subject folders: `chemistry/`, `english/`, `history/`, `physics/`, `rbt/`, etc. (**no subdirectories, no archive/**)
3. For each HTML file, two filename patterns are supported:
   - **Standard:** `t<form(s)>_chapter<num>.html` — for Maths, Science, Physics, Chemistry, Biology, History, Geografi, RBT, Seni, Add Maths, Moral
   - **3-digit code:** `en_<NNN>.html`, `my_<NNN>.html`, `zh_<NNN>.html` — for English, Malay, Chinese (matched via `chapterCode` field in subject.js)
   - Checks if `resourceUrl` is already set in `js/subject.js`
   - If missing:
     a. Add Back to Dashboard button to the HTML file (if absent)
     b. Add `resourceUrl` to matching chapter in `js/subject.js`
        - Standard: match by form + chapterNum (direct), or form + position (nth chapter of that form)
        - 3-digit code: match by `chapterCode` field (e.g. `en_001` matches chapter with `chapterCode:"en_001"`)
     c. Add path to `STATIC_ASSETS` in `sw.js`
4. For each subject whose chapter now has a `resourceUrl`, check `subjects/<subject>.html` for all four required components — add any that are missing:
   - **`.chapter-link` CSS** in `<style>`:
     ```css
     .chapter-link{display:inline-block;margin-top:10px;color:#1d4ed8;font-size:14px;text-decoration:none}
     .chapter-link:hover{text-decoration:underline}
     ```
   - **`chapterResource` variable** before `card.innerHTML`:
     ```js
     const chapterResource = chapter.resourceUrl
         ? `<a class="chapter-link" href="${chapter.resourceUrl}">Open notes</a>`
         : "";
     ```
   - **`${chapterResource}`** included inside `card.innerHTML`
   - **Click guard** in the card click handler:
     ```js
     if(e.target.closest(".chapter-link")){ return; }
     ```
   - **`addMissingChineseLabels()`** function that syncs `resourceUrl` (and `chinese`) from seed data into Firestore on load — called inside `loadData()` when `snap.exists()`:
     ```js
     async function addMissingChineseLabels(){
         data.chapters.forEach((ch, idx)=>{
             const seed = biologyData.chapters[idx];
             if(seed.resourceUrl && !ch.resourceUrl){
                 ch.resourceUrl = seed.resourceUrl;
             }
             if(seed.chinese && !ch.chinese){
                 ch.chinese = seed.chinese;
             }
         });
     }
     // Then call it in loadData(): if(snap.exists()){ data = snap.data(); await addMissingChineseLabels(); }
     ```
   - **Cache versions bumped** — increment `?v=N` on CSS and module imports to force fresh load
5. Runs `npm run validate`, commits and pushes if changes were made
6. Appends result to `FILES/auto_integration_log.txt` (GMT+8 timestamps)

**Paths used:**
- `resourceUrl`: `"../chemistry/t4_chapter1.html"` (relative from `subjects/`)
- `STATIC_ASSETS`: `'/chemistry/t4_chapter1.html'` (leading slash, from root)

**Why `addMissingChineseLabels` is needed:** Subject pages load from Firestore. The function:
   - Syncs missing fields (`resourceUrl`, `chinese`, `chapterCode`) from seed data into Firestore
   - Adds completely new chapters from `subject.js` that don't exist in Firestore yet
   - Called on page load, automatically saves changes back to Firestore
   - Allows new chapters to appear immediately without manual Firestore updates

## Adding a New Subject

1. Add chapter data export to `js/subject.js`
2. Add entry to `js/subject-registry.js` (`loadSeed: true` to auto-seed Firestore)
3. Create `subjects/<name>.html` following existing subject page pattern — include the Back to Dashboard button (same CSS/HTML as the chapter notes pattern above)
4. Add subject card to `index.html` with matching progress bar IDs
5. Add page path to `STATIC_ASSETS` in `sw.js`
6. **Bump `CACHE` in `sw.js`** (e.g. `study-dashboard-v2` → `study-dashboard-v3`) — required, not optional. The service worker is cache-first (`sw.js` fetch handler checks `caches.match` before network), so returning visitors with an already-installed service worker will keep seeing the old cached `index.html` (missing the new subject card) until the cache name changes and forces a refresh.
7. Run `npm run validate`
8. Commit & push
9. Tell users to hard-refresh (or clear site data) once on the live site to pick up the new service worker

### Completion % showing wrong for a new/placeholder subject

The dashboard's percent is always `Mastered chapters / total chapters` computed live from Firestore (`js/dashboard.js` → `updateSubjectProgress`), not from `js/subject.js` seed data once the Firestore doc exists. If a new subject shows an unexpected % (e.g. 100% on placeholder chapters), it's almost always because someone clicked the chapter cards on that subject's page — each click cycles `Not Started → In Progress → Mastered → Not Started` and saves immediately via `setDoc`. It's not a bug: check/reset the actual chapter statuses by clicking through the cards on `subjects/<name>.html`, or verify current state directly:
```bash
curl -s "https://firestore.googleapis.com/v1/projects/study-dashboard-7ca48/databases/(default)/documents/subjects/<id>"
```

### "I pushed but the live site still shows the old version"

Don't assume browser cache is the cause — a pushed commit can fail to actually deploy. GitHub Pages runs a `pages build and deployment` workflow on every push to `main`; the deploy step occasionally fails on GitHub's side even though the build step succeeds. Verify before troubleshooting the browser:

```bash
# Check the live files directly (bypasses your browser entirely)
curl -s "https://pp-nextgen-dba.github.io/study-dashboard/sw.js" | head -1
curl -s "https://api.github.com/repos/pp-nextgen-dba/study-dashboard/actions/runs?per_page=1" | grep -o '"conclusion": "[^"]*"'
```

If the live `sw.js` `CACHE` value or a recently-changed file doesn't match what's in the repo, and/or the latest Actions run shows `"conclusion": "failure"`, the deploy failed — it's not a cache problem. Fix: re-run the failed job from the GitHub Actions tab, or push a new commit (`git commit --allow-empty -m "chore: retrigger pages deploy"`) to trigger a fresh deployment. Only tell users to hard-refresh/clear site data *after* confirming the live files actually updated.

## Changing the PIN

Replace `CORRECT_PIN_HASH` in `js/auth.js` with SHA-256 of the new PIN:
```js
// run in browser DevTools, convert ArrayBuffer result to hex
await crypto.subtle.digest("SHA-256", new TextEncoder().encode("NEWPIN"))
```
