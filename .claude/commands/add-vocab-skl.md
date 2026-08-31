---
description: Add a new word to SKL's Vocab Ledger and push it to GitHub Pages
---

Add a vocabulary word to SKL's ledger using the arguments provided: $ARGUMENTS

The arguments are up to three pipe-separated values, in this order: English word (or Chinese word), Chinese meaning (or English gloss), example sentence. Anything missing or left blank between separators is yours to fill in — the user only has to supply what they already know.

Example invocations:
- `/add-vocab-skl diligent | 勤奋的 | A diligent student checks their homework every evening.` (all three given — use as-is)
- `/add-vocab-skl diligent` (word only — you supply the meaning and example)
- `/add-vocab-skl diligent | 勤奋的` (word + meaning — you write the example)

Steps to perform:

1. Parse $ARGUMENTS by splitting on `|` into up to three parts: word, zh, example. Trim whitespace from each. A trailing part that wasn't given, or a part left blank between two `|`, counts as "not given."
2. If `word` itself is missing or blank, stop and ask the user for at least the word — don't invent one to add.
3. Fill in anything not given:
   - If `zh` is missing: if `word` is English, translate it to Chinese; if `word` is itself Chinese, write the English gloss instead (this field is "Chinese meaning (or English gloss)").
   - If `example` is missing: write one natural, general-purpose sentence that uses the word correctly. This ledger is separate from Paul's (which leans DBA/tech-flavored) — keep examples ordinary and broadly applicable unless later usage in this ledger suggests a different consistent theme to match.
4. Assign a category for this word from this fixed list: `Business`, `Technology`, `Academic`, `Daily Life`, `Emotion`, `Science`, `Other`. Base it on the word's meaning and the example sentence's content. Use `Other` only when nothing else genuinely fits.
5. Run: `python add_vocab_skl.py "<word>" "<zh>" "<example>" "<category>"` in the current directory (this repo root, where vocab-ledger-skl.html lives).
6. If the script reports success, run:
   - `git add vocab-ledger-skl.html`
   - `git commit -m "Add vocab: <word>"`
   - `git push`
7. Report back concisely: the word added, which fields (if any) you filled in yourself, the assigned category, and confirm it was pushed. Do not show the raw git output unless something failed.
8. If the script fails (e.g. vocab-ledger-skl.html or add_vocab_skl.py not found in the current directory), tell the user clearly what's missing rather than guessing a fix.
