---
name: update-pin
description: Change the study dashboard PIN code. Generates the SHA-256 hash of the new PIN and updates js/auth.js.
---

The user wants to change the PIN code for the study dashboard.

## Step 1 — Ask for the new PIN

Ask the user for the new PIN. It should be numeric and at least 4 digits.

Do NOT log or display the PIN again after this step.

---

## Step 2 — Generate the SHA-256 hash

Use Node.js to hash the PIN:

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('NEWPIN')).then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))"
```

Replace `NEWPIN` with the PIN the user provided.

---

## Step 3 — Update `js/auth.js`

Replace the value of `CORRECT_PIN_HASH` in `js/auth.js` with the new hash from Step 2.

The line to update looks like:
```js
const CORRECT_PIN_HASH = "...current hash...";
```

Also update the comment above it to note the new PIN was set (without revealing the PIN value):
```js
// SHA-256 hash of the PIN. To change, replace this hash with SHA-256 of the new PIN.
```

---

## Step 4 — Verify

Read back `js/auth.js` and confirm `CORRECT_PIN_HASH` contains the new hash value.

---

## Step 5 — Commit and push

```bash
git add js/auth.js
git commit -m "Update PIN hash"
git push
```
