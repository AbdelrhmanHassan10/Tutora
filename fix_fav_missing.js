const fs = require('fs');

// 1. Fix favourite.html directly
let htmlContent = fs.readFileSync('fav/favourite.html', 'utf8');

// Subtitle
htmlContent = htmlContent.replace(
    /Your curated space for Egyptian wonders and your personal journey through the Grand Egyptian Museum's history\./g,
    '<span data-i18n="fav.subtitle">Your curated space for Egyptian wonders and your personal journey through the Grand Egyptian Museum\'s history.</span>'
);

// Welcome back text
htmlContent = htmlContent.replace(
    /Welcome back/g,
    '<span data-i18n="fav.welcome_back">Welcome back</span>'
);

// Tab buttons
htmlContent = htmlContent.replace(
    />\\s*SAVED FUN FACTS\\s*</g,
    '>SAVED FUN FACTS<span data-i18n="fav.saved_facts">SAVED FUN FACTS</span><'
);
// Above regex is broken, let's just replace the raw text
htmlContent = htmlContent.replace(
    /SAVED FUN FACTS/g,
    '<span data-i18n="fav.saved_facts_tab">SAVED FUN FACTS</span>'
);
htmlContent = htmlContent.replace(
    /MY JOURNEY/g,
    '<span data-i18n="fav.my_journey_tab">MY JOURNEY</span>'
);
htmlContent = htmlContent.replace(
    /SAVED TREASURES/g,
    '<span data-i18n="fav.saved_treasures_tab">SAVED TREASURES</span>'
);

// Write HTML
fs.writeFileSync('fav/favourite.html', htmlContent, 'utf8');
console.log('favourite.html fixed');

// 2. Fix script.js dynamic texts
let jsContent = fs.readFileSync('fav/script.js', 'utf8');

// We need to inject tFav() around the artifact titles if possible, or we just translate the static strings:
// NEW KINGDOM, Untitled, Artifact Detail
jsContent = jsContent.replace(/NEW KINGDOM/g, '\\${tFav("new_kingdom", "NEW KINGDOM")}');
jsContent = jsContent.replace(/Untitled/g, '\\${tFav("untitled", "Untitled")}');
jsContent = jsContent.replace(/Artifact Detail/g, '\\${tFav("artifact_detail", "Artifact Detail")}');

fs.writeFileSync('fav/script.js', jsContent, 'utf8');
console.log('script.js fixed');

// 3. Add to global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = {
    "fav.subtitle": "Your curated space for Egyptian wonders and your personal journey through the Grand Egyptian Museum's history.",
    "fav.saved_facts_tab": "SAVED FUN FACTS",
    "fav.my_journey_tab": "MY JOURNEY",
    "fav.saved_treasures_tab": "SAVED TREASURES",
    "fav.new_kingdom": "NEW KINGDOM",
    "fav.untitled": "Untitled",
    "fav.artifact_detail": "Artifact Detail"
};

const newAr = {
    "fav.subtitle": "مساحتك المنسقة للعجائب المصرية ورحلتك الشخصية عبر تاريخ المتحف المصري الكبير.",
    "fav.saved_facts_tab": "معلومات ممتعة محفوظة",
    "fav.my_journey_tab": "رحلتي",
    "fav.saved_treasures_tab": "الكنوز المحفوظة",
    "fav.new_kingdom": "الدولة الحديثة",
    "fav.untitled": "بدون عنوان",
    "fav.artifact_detail": "تفاصيل القطعة الأثرية"
};

const enEntries = Object.entries(newEn).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');
const arEntries = Object.entries(newAr).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');
