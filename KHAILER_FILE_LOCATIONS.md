# Where Khailer's HTML Files Live

## File Locations (3 Places)

### 1. **Local PC** (Where Khailer Creates)
```
C:\development\khailer\study-chapters\
├── maths\
│   ├── chapter1\
│   │   ├── index.html           ← Khailer creates here
│   │   ├── styles.css
│   │   └── script.js
│   └── chapter2\ ...
├── chemistry\
│   ├── chapter1\
│   │   └── index.html           ← Creates here
│   └── chapter2\ ...
├── english\
│   ├── chapter1\
│   │   └── index.html           ← Creates here
│   └── chapter2\ ...
└── ... (other subjects)
```

**Windows Path:** `C:\development\khailer\study-chapters\[subject]\[chapter]\index.html`

**Example:**
- `C:\development\khailer\study-chapters\maths\chapter1\index.html`
- `C:\development\khailer\study-chapters\chemistry\chapter1\index.html`
- `C:\development\khailer\study-chapters\english\chapter1\index.html`

---

### 2. **GitHub Repository** (After Push)
```
github.com/khailer/study-chapters
├── maths/
│   ├── chapter1/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   └── chapter2/ ...
├── chemistry/ ...
└── english/ ...
```

**GitHub URL:** `https://github.com/khailer/study-chapters/tree/main/[subject]/[chapter]/`

**Example:**
- `https://github.com/khailer/study-chapters/tree/main/maths/chapter1/`
- `https://github.com/khailer/study-chapters/tree/main/chemistry/chapter1/`

---

### 3. **GitHub Pages** (Live Website)
```
khailer.github.io/study-chapters/
├── maths/
│   ├── chapter1/
│   │   └── index.html          ← Live on web
│   └── chapter2/ ...
├── chemistry/ ...
└── english/ ...
```

**GitHub Pages URL:** `https://khailer.github.io/study-chapters/[subject]/[chapter]/`

**Example (Live):**
- `https://khailer.github.io/study-chapters/maths/chapter1/`
- `https://khailer.github.io/study-chapters/chemistry/chapter1/`
- `https://khailer.github.io/study-chapters/english/chapter1/`

---

## How Files Flow

```
1. LOCAL PC                          2. GITHUB                        3. GITHUB PAGES (Live)
─────────────────────────────────────────────────────────────────────────────────

Khailer creates:
C:\development\khailer\
  study-chapters\
    maths\chapter1\index.html
                 ↓
              (git add)
                 ↓
              (git commit)
                 ↓
              (git push)
                 ↓
                            github.com/khailer/           khailer.github.io/
                            study-chapters/               study-chapters/
                            maths/chapter1/               maths/chapter1/
                            index.html                    index.html
                                                         (Accessible on web)
```

---

## Folder Structure by Subject

### Maths Chapters
```
C:\development\khailer\study-chapters\maths\
├── chapter1\
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── chapter-metadata.json (optional)
├── chapter2\
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── chapter3\ ...
└── chapter4\ ...
```

### Chemistry Chapters
```
C:\development\khailer\study-chapters\chemistry\
├── chapter1\
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── chapter2\ ...
└── chapter3\ ...
```

### English Chapters
```
C:\development\khailer\study-chapters\english\
├── chapter1\
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── chapter2\ ...
└── chapter3\ ...
```

**Pattern:** `C:\development\khailer\study-chapters\[subject]\[chapter]\index.html`

---

## Where Paul Links Them

After Khailer creates a chapter, Paul references it in two places:

### In `js/subject.js` (Relative Path)
```javascript
// File: C:\development\paul\study-dashboard\js\subject.js

const mathsChapters = [
  {
    form: "T4",
    chapterNum: 1,
    title: "Functions & Graphs",
    resourceUrl: "../../khailer/study-chapters/maths/chapter1/index.html"
    // Goes up 2 levels from js/ to study-dashboard/
    // Then down to khailer/study-chapters/maths/chapter1/
  }
];
```

**Path explained:**
- Current location: `paul\study-dashboard\js\`
- Target location: `khailer\study-chapters\maths\chapter1\index.html`
- `../../` = up to `C:\development\`
- `khailer/study-chapters/maths/chapter1/index.html` = down to file

### In `sw.js` (Absolute Path)
```javascript
// File: C:\development\paul\study-dashboard\sw.js

const STATIC_ASSETS = [
  '/subjects/maths.html',
  '/khailer/study-chapters/maths/chapter1/index.html',
  // Absolute path from C:\development\ root
  '/khailer/study-chapters/chemistry/chapter1/index.html',
  '/khailer/study-chapters/english/chapter1/index.html',
];
```

**Path explained:**
- Root: `C:\development\`
- Path from root: `khailer\study-chapters\maths\chapter1\index.html`
- Written as: `/khailer/study-chapters/maths/chapter1/index.html`

---

## Creation Workflow

### Step 1: Khailer Creates Locally
```powershell
cd C:\development\khailer\study-chapters\maths
mkdir chapter1
cd chapter1

# Create index.html with content
@"
<!DOCTYPE html>
<html>
<head>
  <title>Maths Chapter 1 - Functions & Graphs</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Functions & Graphs</h1>
  <p>Chapter content here...</p>
  <script src="script.js"></script>
</body>
</html>
"@ | Set-Content index.html

# Create styles.css
# Create script.js

# Test locally
npx serve .
# Opens http://localhost:5000/maths/chapter1/
```

### Step 2: Push to GitHub
```powershell
cd C:\development\khailer\study-chapters

git add maths/chapter1/
git commit -m "feat: add maths chapter 1 - functions and graphs"
git push origin main
```

### Step 3: Verify Live on GitHub Pages
```
https://khailer.github.io/study-chapters/maths/chapter1/
(Should show the chapter)
```

### Step 4: Paul Links It
```powershell
cd C:\development\paul\study-dashboard

# Edit js/subject.js
# Add: resourceUrl: "../../khailer/study-chapters/maths/chapter1/index.html"

# Edit sw.js
# Add: '/khailer/study-chapters/maths/chapter1/index.html'

# Test locally
npx serve .

# Validate
npm run validate

# Push
git add . && git commit -m "link: add maths chapter 1" && git push
```

### Step 5: Verify Dashboard Updates
```
https://pp-nextgen-dba.github.io/study-dashboard/
(Maths subject should show "Chapter 1 - Functions & Graphs" link)
```

---

## File Size Estimate

Each chapter typically:
- `index.html`: 10-50 KB
- `styles.css`: 5-20 KB
- `script.js`: 5-20 KB
- **Total per chapter:** ~20-90 KB

With 246 chapters expected: ~5-22 MB total

---

## Summary: Where Things Live

| Item | Location | Who Creates | Status |
|------|----------|---|---|
| **Chapter HTML** | `C:\development\khailer\study-chapters\[subject]\[chapter]\` | Khailer | Local |
| **Chapter on GitHub** | `github.com/khailer/study-chapters\[subject]\[chapter]\` | Auto (after git push) | Public repo |
| **Chapter Live** | `https://khailer.github.io/study-chapters/[subject]/[chapter]/` | Auto (GitHub Pages) | Live web |
| **Dashboard Link** | `C:\development\paul\study-dashboard\js\subject.js` | Paul | Local → GitHub |
| **SW Cache Path** | `C:\development\paul\study-dashboard\sw.js` | Paul | Local → GitHub |
| **Dashboard Live** | `https://pp-nextgen-dba.github.io/study-dashboard/` | Auto (after push) | Live web |

---

## Key Folder Paths (Copy-Paste Ready)

**Khailer creates chapters here:**
```
C:\development\khailer\study-chapters\maths\chapter1\
C:\development\khailer\study-chapters\chemistry\chapter1\
C:\development\khailer\study-chapters\english\chapter1\
```

**Paul edits these files to link chapters:**
```
C:\development\paul\study-dashboard\js\subject.js
C:\development\paul\study-dashboard\sw.js
C:\development\paul\study-dashboard\subjects\maths.html
```

**Push these to GitHub when done:**
```
C:\development\khailer\study-chapters\  → github.com/khailer/study-chapters
C:\development\paul\study-dashboard\    → github.com/pp-nextgen-dba/study-dashboard
```

---

**Ready to create first chapter?**
