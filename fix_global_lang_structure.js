const fs = require('fs');

let langJs = fs.readFileSync('global-lang.js', 'utf8');

// Fix English bad line
langJs = langJs.replace(/"edit_profile\.title": "ملف توتورا الشخصي \\|"[^\n]*/g, '"edit_profile.title": "TUTORA Profile | Edit Profile",');
langJs = langJs.replace(/"edit_profile\.title": "TUTORA Profile \\|"[^\n]*/g, '"edit_profile.title": "TUTORA Profile | Edit Profile",');
// Fix Arabic bad line
// Since the first replace might have hit the Arabic one if it had the Arabic text, let's just make sure both are correct.
// We know that in the `en: {` block we want English, and `ar: {` block we want Arabic.

// A safer way: find `en: {` and `ar: {` blocks.
const enIndex = langJs.indexOf('en: {');
const arIndex = langJs.indexOf('ar: {');

let enBlock = langJs.substring(enIndex, arIndex);
let arBlock = langJs.substring(arIndex);

enBlock = enBlock.replace(/"edit_profile\.title":[^\n]*/g, '"edit_profile.title": "TUTORA Profile | Edit Profile",');
arBlock = arBlock.replace(/"edit_profile\.title":[^\n]*/g, '"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",');

// Wait, the profile strings were on the same line as edit_profile.title in the original!
// If I replace the whole line to `\n`, I lose all the profile strings if they are on the same line!
