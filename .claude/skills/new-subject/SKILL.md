---
name: new-subject
description: Add a new subject to the study dashboard. Guides through all required steps - data, registry, HTML page, dashboard card, service worker, and validation.
---

The user wants to add a new subject to the study dashboard. Follow these steps in order, completing each fully before moving to the next.

## Current subjects (for reference)
!`node -e "import('./js/subject-registry.js').then(m => console.log(m.subjectRegistry.map(s => s.id).join(', '))).catch(() => console.log('run from study-dashboard root'))"`

---

## Step 1 — Get subject details

Ask the user for:
- Subject name (e.g. "Sains Komputer")
- Subject ID — lowercase, no spaces (e.g. "sains-komputer") — used as the Firestore document key
- Icon emoji (e.g. 💻)
- Form levels covered (e.g. T4, T5)
- Chapter list — name and form level for each chapter

If the user doesn't provide chapters, ask whether to create placeholder chapters or wait.

---

## Step 2 — Add seed data to `js/subject.js`

Append a new export at the bottom of `js/subject.js` following this exact structure:

```js
export const <id>Data = {

    subject: "<Name>",

    chapters: [
        {
            form: "T4",
            chapter: "Chapter Name",
            status: "Not Started",
            confidence: 0,
            last_updated: "<today YYYY-MM-DD>"
        },
        // ... more chapters
    ]

};
```

Use camelCase for the export name (e.g. `sainsKomputerData`).

---

## Step 3 — Register in `js/subject-registry.js`

Add a new entry inside the `subjectRegistry` array in `js/subject-registry.js`:

```js
{
    id: "<id>",
    title: "<Name>",
    icon: "<emoji>",
    href: "subjects/<id>.html",
    progressBarId: "<id>ProgressBar",
    progressTextId: "<id>ProgressText",
    seedExport: "<id>Data",
    loadSeed: true
}
```

Set `loadSeed: true` so Firestore is auto-seeded on first visit.

---

## Step 4 — Create `subjects/<id>.html`

Copy `subjects/geografi.html` as the template. Change:
- `<title>` to `<Name> Dashboard`
- All references to `geografiData` → `<id>Data`
- All `doc(db,"subjects","geografi")` → `doc(db,"subjects","<id>")`
- The `structuredClone(geografiData)` → `structuredClone(<id>Data)`
- The `import { geografiData }` → `import { <id>Data }`
- The accent colour on `.form-header h2` and `.progress-fill` (pick a colour that differs from existing subjects)
- Import path version: `"../js/subject.js?v=12"`

---

## Step 5 — Add subject card to `index.html`

Find the subject grid and add a new card before the closing `</div>` of `.subject-grid`:

```html
<a class="subject-card"
href="subjects/<id>.html">

    <h3><emoji> <Name></h3>

    <div class="progress-bar">
        <div
            class="progress-fill"
            id="<id>ProgressBar"
        ></div>
    </div>

    <p id="<id>ProgressText">
        0% Completed
    </p>

</a>
```

---

## Step 6 — Add to service worker cache in `sw.js`

Add the new page to the `STATIC_ASSETS` array in `sw.js`:

```js
"/subjects/<id>.html",
```

---

## Step 7 — Validate

Run:
```bash
npm run validate
```

Fix any errors reported before finishing. Common issues:
- Export name mismatch between `subject.js` and `subject-registry.js`
- Missing or mismatched progress bar IDs between `index.html` and `subject-registry.js`
- Subject page file not found

---

## Step 8 — Commit

Stage and commit all changed files:
- `js/subject.js`
- `js/subject-registry.js`
- `subjects/<id>.html`
- `index.html`
- `sw.js`
