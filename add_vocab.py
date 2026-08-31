#!/usr/bin/env python3
"""
add_vocab.py — Append a word to the Vocab Ledger's SEED list in vocab-ledger.html.

Usage:
    python add_vocab.py "word" "中文释义" "Example sentence." ["Category"]

Category is optional and must be one of: Business, Technology, Academic,
Daily Life, Emotion, Science, Other (matches CATEGORIES in vocab-ledger.html).

Run this from inside your study-dashboard repo (where vocab-ledger.html lives).
After running, commit and push as usual:
    git add vocab-ledger.html
    git commit -m "Add vocab: <word>"
    git push
"""

import sys
import re
from pathlib import Path

LEDGER_FILE = Path("vocab-ledger.html")


def escape_js_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


CATEGORIES = {"Business", "Technology", "Academic", "Daily Life", "Emotion", "Science", "Other"}


def main():
    if len(sys.argv) not in (4, 5):
        print('Usage: python add_vocab.py "word" "中文释义" "Example sentence." ["Category"]')
        sys.exit(1)

    word, zh, example = sys.argv[1], sys.argv[2], sys.argv[3]
    category = sys.argv[4] if len(sys.argv) == 5 else ""

    if category and category not in CATEGORIES:
        print(f"Error: category must be one of {sorted(CATEGORIES)}, got \"{category}\".")
        sys.exit(1)

    if not LEDGER_FILE.exists():
        print(f"Error: {LEDGER_FILE} not found in the current directory.")
        sys.exit(1)

    content = LEDGER_FILE.read_text(encoding="utf-8")

    category_field = f', category: "{escape_js_string(category)}"' if category else ""
    new_entry = (
        f'  {{ word: "{escape_js_string(word)}", '
        f'zh: "{escape_js_string(zh)}", '
        f'example: "{escape_js_string(example)}"{category_field} }}'
    )

    # Find the closing "];" of the SEED array and insert before it.
    pattern = re.compile(r"(const SEED = \[\n(?:.*\n)*?)(\];)")
    match = pattern.search(content)
    if not match:
        print("Error: could not find the SEED array in vocab-ledger.html.")
        sys.exit(1)

    body = match.group(1)
    # Ensure the previous last line ends with a comma
    body = body.rstrip("\n")
    if not body.rstrip().endswith(","):
        body = body + ","
    updated_seed = body + "\n" + new_entry + "\n"

    new_content = content[: match.start()] + updated_seed + match.group(2) + content[match.end():]

    LEDGER_FILE.write_text(new_content, encoding="utf-8")
    print(f'Added "{word}" to {LEDGER_FILE}. Now commit and push:')
    print(f'  git add {LEDGER_FILE}')
    print(f'  git commit -m "Add vocab: {word}"')
    print(f'  git push')


if __name__ == "__main__":
    main()
