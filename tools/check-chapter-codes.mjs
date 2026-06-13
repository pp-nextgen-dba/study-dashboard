import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subjectFilePath = path.join(__dirname, '../js/subject.js');

const subjectCode = fs.readFileSync(subjectFilePath, 'utf-8');

const codes = {
    en: [],
    my: [],
    zh: []
};

const codeRegex = /chapterCode:"(en|my|zh)_(\d{3})"/g;
let match;

while ((match = codeRegex.exec(subjectCode)) !== null) {
    const prefix = match[1];
    const number = parseInt(match[2], 10);
    codes[prefix].push(number);
}

console.log('\n📊 Chapter Code Status\n');
console.log('Language | Highest Code | Next Code');
console.log('---------|--------------|----------');

Object.entries(codes).forEach(([prefix, numbers]) => {
    if (numbers.length === 0) {
        console.log(`${prefix}     | none         | ${prefix}_001`);
    } else {
        const max = Math.max(...numbers);
        const next = String(max + 1).padStart(3, '0');
        const highest = String(max).padStart(3, '0');
        console.log(`${prefix}     | ${prefix}_${highest}    | ${prefix}_${next}`);
    }
});

console.log('\n💡 When adding a new chapter:');
console.log('1. Use the "Next Code" above for chapterCode in subject.js');
console.log('2. Name the HTML file to match: <prefix>_<code>.html (e.g. en_058.html)');
console.log('3. The auto-integration workflow will wire it up automatically\n');
