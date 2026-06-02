const fs = require('fs');

let htmlContent = fs.readFileSync('Edit-profile/code.html', 'utf8');

const map = {
    'Enter first name': { k: 'edit_profile.first_name_ph', ar: 'أدخل الاسم الأول' },
    'Enter last name': { k: 'edit_profile.last_name_ph', ar: 'أدخل الاسم الأخير' },
    'Specializing in Ptolemaic period artifacts...': { k: 'edit_profile.bio_ph', ar: 'متخصص في قطع العصر البطلمي...' }
};

for (const [enText, data] of Object.entries(map)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regex = new RegExp(`placeholder="${escapedText}"`, 'g');
    htmlContent = htmlContent.replace(regex, `placeholder="${enText}" data-i18n-placeholder="${data.k}"`);
}

fs.writeFileSync('Edit-profile/code.html', htmlContent, 'utf8');
console.log('Edit-profile/code.html updated placeholders');

let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = Object.keys(map).reduce((acc, key) => {
    if (!langContent.includes('"' + map[key].k + '"')) {
        acc[map[key].k] = key;
    }
    return acc;
}, {});

const newAr = Object.keys(map).reduce((acc, key) => {
    if (!langContent.includes('"' + map[key].k + '"')) {
        acc[map[key].k] = map[key].ar;
    }
    return acc;
}, {});


const enEntries = Object.entries(newEn).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(newAr).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated for placeholders');
