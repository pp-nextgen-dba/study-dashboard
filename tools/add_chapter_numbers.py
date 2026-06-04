#!/usr/bin/env python3
"""Add chapterNum field to chapters in subject.js, numbered sequentially within each form."""

import re

subject_js_path = "../js/subject.js"

with open(subject_js_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

output = []
form_counters = {}
i = 0

while i < len(lines):
    line = lines[i]

    # Detect form field: form:"T2", form:"T3", or form:"T4/T5" etc.
    form_match = re.search(r'form:\s*["\']([T]\d(?:/[T]\d)?)["\']', line)
    if form_match:
        form = form_match.group(1)
        # Initialize counter for this form if needed
        if form not in form_counters:
            form_counters[form] = 1

        output.append(line)

        # Check if next meaningful line has chapterNum already
        j = i + 1
        found_chapter_num = False
        while j < len(lines) and j < i + 10:
            if re.search(r'chapterNum\s*:', lines[j]):
                found_chapter_num = True
                break
            if re.search(r'chapter\s*:|resourceUrl\s*:|status\s*:', lines[j]):
                break
            j += 1

        # If no chapterNum, add it on next line
        if not found_chapter_num:
            # Insert chapterNum line after form
            indent = "            "  # Match existing indentation
            output.append(f'{indent}chapterNum: {form_counters[form]},\n')
            form_counters[form] += 1
        else:
            form_counters[form] += 1
    else:
        output.append(line)

    i += 1

with open(subject_js_path, "w", encoding="utf-8") as f:
    f.writelines(output)

print("Added chapterNum to all chapters")
print(f"Form counters: {form_counters}")
