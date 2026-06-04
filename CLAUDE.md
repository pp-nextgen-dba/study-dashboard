# CLAUDE.md

Static PWA — Malaysian school study progress tracker. No build step. Firebase Firestore backend (CDN).

## Commands

```bash
npm run validate        # after editing subject.js, subject-registry.js, or index.html
npx serve .             # run locally
```

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

## Chapter HTML File Locations

Chapter notes pages live in **root-level subject folders**, not inside `subjects/`:

```
chemistry/     t4_chapter1.html
english/       T4_T5_english_grammar.html
history/       t2_chapter4.html, t2_chapter8.html ...
physics/       t4_force_motion.html
rbt/           t2_akuaponik.html, t2_elektrik.html ...
```

No `archive/` subdirectories — all files sit directly in `<subject>/`.

## Adding a Chapter Notes Page

**First:** confirm the HTML file exists on disk — do not create it.

1. Check/add **Back to Dashboard** button (first element after `<body>`):
   ```css
   .top-nav{background:#fff;padding:10px 16px;border-bottom:2px solid #e5e7eb;position:sticky;top:0;z-index:120}
   .dashboard-link{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;background:#1d4ed8;color:#fff;font-size:13px;font-weight:800;text-decoration:none}
   .dashboard-link:hover{background:#1e40af}
   ```
   ```html
   <div class="top-nav"><a class="dashboard-link" href="../index.html">&larr; Back to Dashboard</a></div>
   ```
   *(RBT pages use a dark sticky nav — verify the button is there instead.)*
2. Add `resourceUrl: "../<subject>/<file>.html"` to the matching chapter in `js/subject.js`
3. Add `'/<subject>/<file>.html'` to `STATIC_ASSETS` in `sw.js`
4. Run `npm run validate`
5. Commit

## Auto-Integration Workflow

When triggered, the workflow:
1. Pulls latest from GitHub (`git pull`)
2. Scans all root-level subject folders: `chemistry/`, `english/`, `history/`, `physics/`, `rbt/`, etc. (no subdirectories)
3. For each HTML file matching `t<form(s)>_chapter<num>.html`:
   - Checks if `resourceUrl` is already set in `js/subject.js`
   - If missing: adds Back to Dashboard button (if absent), adds `resourceUrl`, updates `sw.js`
4. Runs `npm run validate`, commits and pushes if changes were made
5. Appends result to `FILES/auto_integration_log.txt` (GMT+8 timestamps)

**Paths used:**
- `resourceUrl`: `"../chemistry/t4_chapter1.html"` (relative from `subjects/`)
- `STATIC_ASSETS`: `'/chemistry/t4_chapter1.html'` (leading slash, from root)

## Adding a New Subject

1. Add chapter data export to `js/subject.js`
2. Add entry to `js/subject-registry.js` (`loadSeed: true` to auto-seed Firestore)
3. Create `subjects/<name>.html` following existing subject page pattern — include the Back to Dashboard button (same CSS/HTML as the chapter notes pattern above)
4. Add subject card to `index.html` with matching progress bar IDs
5. Add page path to `STATIC_ASSETS` in `sw.js`
6. Run `npm run validate`

## Changing the PIN

Replace `CORRECT_PIN_HASH` in `js/auth.js` with SHA-256 of the new PIN:
```js
// run in browser DevTools, convert ArrayBuffer result to hex
await crypto.subtle.digest("SHA-256", new TextEncoder().encode("NEWPIN"))
```
