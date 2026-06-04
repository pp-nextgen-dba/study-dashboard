---
name: validate-study
description: Run the study dashboard project validator and report any errors or warnings. Checks subject data, registry, dashboard cards, and subject pages for consistency.
---

Run the project validator and report the results.

## Step 1 — Run validation

```bash
cd C:\development\paul\study-dashboard && node tools/validate-project.mjs
```

## Step 2 — Report results

- If validation passes with no errors: confirm everything is clean and list how many subjects were checked.
- If there are warnings: list each warning and explain what it means.
- If there are errors: list each error clearly and offer to fix them.

## Common errors and fixes

| Error | Fix |
|---|---|
| Missing export in subject.js | Add the missing named export to `js/subject.js` |
| Subject page not found | Create `subjects/<id>.html` or check the `href` in `subject-registry.js` |
| Progress bar ID mismatch | Ensure `progressBarId` in `subject-registry.js` matches the `id` attribute in `index.html` |
| Duplicate chapters | Remove duplicate chapter entries in `js/subject.js` |
| Missing required field | Add the missing field (`form`, `chapter`, `status`, `confidence`, or `last_updated`) to the chapter in `js/subject.js` |

## Step 3 — Fix and re-validate

If the user agrees to fix errors, make the necessary changes and re-run validation to confirm clean.
