#!/usr/bin/env node
/**
 * Add chapterNum field to chapters in subject.js
 * Numbers each chapter sequentially within its form (T2, T3, T4, T5)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subjectJsPath = path.join(__dirname, '../js/subject.js');

let content = fs.readFileSync(subjectJsPath, 'utf-8');
let addedCount = 0;

// Process each chapter object that doesn't already have chapterNum
// Pattern: { form: "Tx", ... } and add chapterNum after form
content = content.replace(
    /(\{\s*form:\s*"(T\d)")([^}]*?)(?=,\s*(?:chapter|resourceUrl|chinese|status))/g,
    (match, opening, form, rest) => {
        // Only add if not already present
        if (rest.includes('chapterNum')) {
            return match;
        }
        addedCount++;
        return `${opening}",\n            chapterNum: 0${rest}`;
    }
);

// Now number them sequentially within each form
const lines = content.split('\n');
const formCounters = new Map();

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const chapterNumMatch = line.match(/chapterNum:\s*0([,\s])/);
    const formMatch = lines.slice(Math.max(0, i - 5), i)
        .join('\n')
        .match(/form:\s*"(T\d+)"/);

    if (chapterNumMatch && formMatch) {
        const form = formMatch[1];
        if (!formCounters.has(form)) {
            formCounters.set(form, 1);
        } else {
            formCounters.set(form, formCounters.get(form) + 1);
        }

        const num = formCounters.get(form);
        lines[i] = line.replace(/chapterNum:\s*0/, `chapterNum: ${num}`);
    }
}

fs.writeFileSync(subjectJsPath, lines.join('\n'), 'utf-8');
console.log(`✓ Added chapterNum to ${addedCount} chapters`);
