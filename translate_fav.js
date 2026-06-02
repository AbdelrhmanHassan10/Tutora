const fs = require('fs');

const htmlMap = {
    'Guardian Dashboard': { k: 'fav.guardian_dash', ar: 'لوحة تحكم الوصي' },
    'Welcome back': { k: 'fav.welcome_back', ar: 'مرحباً بعودتك' },
    'Member Level': { k: 'fav.member_level', ar: 'مستوى العضوية' },
    'Gold Patron': { k: 'fav.gold_patron', ar: 'راعي ذهبي' },
    'Saved Treasures': { k: 'fav.saved_treasures', ar: 'الكنوز المحفوظة' },
    'My Journey': { k: 'fav.my_journey', ar: 'رحلتي' },
    'Saved Fun Facts': { k: 'fav.saved_facts', ar: 'معلومات ممتعة محفوظة' },
    'Your Collection': { k: 'fav.your_collection', ar: 'مجموعتك' },
    'EXPLORE MORE': { k: 'fav.explore_more', ar: 'اكتشف المزيد' },
    'Loading your treasures...': { k: 'fav.loading_treasures', ar: 'جاري تحميل كنوزك...' },
    'Journey History': { k: 'fav.journey_history', ar: 'سجل الرحلة' },
    "It's empty! You haven't created a journey yet.": { k: 'fav.empty_journey', ar: 'إنها فارغة! لم تقم بإنشاء رحلة بعد.' },
    'Create My Journey': { k: 'fav.create_journey', ar: 'إنشاء رحلتي' },
    'Collected Ancient Wisdom': { k: 'fav.collected_wisdom', ar: 'الحكمة القديمة المجمعة' },
    'LEARN MORE FACTS': { k: 'fav.learn_more_facts', ar: 'تعلم المزيد من الحقائق' },
    "You haven't saved any fun facts yet.": { k: 'fav.empty_facts', ar: 'لم تقم بحفظ أي حقائق ممتعة بعد.' },
    'Your Saved Items': { k: 'fav.saved_items_title', ar: 'عناصرك المحفوظة' },
    'TUTORA Favorites | Your Saved Items': { k: 'fav.page_title', ar: 'مفضلات TUTORA | عناصرك المحفوظة' },
    'Explore': { k: 'fav.explore', ar: 'استكشف' }
};

let htmlContent = fs.readFileSync('fav/favourite.html', 'utf8');

for (const [enText, data] of Object.entries(htmlMap)) {
    const regex = new RegExp(`>(\\s*)${enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}(\\s*)<`, 'g');
    htmlContent = htmlContent.replace(regex, ` data-i18n="${data.k}">$1${enText}$2<`);
}

htmlContent = htmlContent.replace(/<title>(.*?)<\/title>/, '<title data-i18n="fav.page_title">$1</title>');

fs.writeFileSync('fav/favourite.html', htmlContent, 'utf8');

let jsContent = fs.readFileSync('fav/script.js', 'utf8');

const transCode = `
function tFav(key, defaultText) {
    if (window.TutoraLang && typeof window.TutoraLang.getCurrentLang === 'function') {
        const lang = window.TutoraLang.getCurrentLang();
        if (lang === 'ar' && window.FAV_AR && window.FAV_AR[key]) {
            return window.FAV_AR[key];
        }
    }
    return defaultText;
}

window.FAV_AR = {
`;
const jsMapArr = Object.entries(htmlMap).map(([en, d]) => `    "${d.k.replace('fav.', '')}": "${d.ar}"`);
jsMapArr.push(`    "read_more": "اقرأ المزيد"`);
jsMapArr.push(`    "remove": "إزالة"`);
jsMapArr.push(`    "view_details": "عرض التفاصيل"`);
jsMapArr.push(`    "no_treasures": "لم تحفظ أي كنوز بعد."`);

const jsInjection = transCode + jsMapArr.join(',\n') + '\n};\n\n';

if (!jsContent.includes('tFav(')) {
    jsContent = jsInjection + jsContent;
    
    jsContent = jsContent.replace(/No treasures saved yet\./g, '${tFav("no_treasures", "No treasures saved yet.")}');
    jsContent = jsContent.replace(/>View Details</g, '>${tFav("view_details", "View Details")}<');
    jsContent = jsContent.replace(/>Read More</g, '>${tFav("read_more", "Read More")}<');
    jsContent = jsContent.replace(/>Remove</g, '>${tFav("remove", "Remove")}<');
    
    jsContent += "\nwindow.addEventListener('languageChanged', () => { if(typeof renderArtifacts === 'function') renderArtifacts(); if(typeof updateDashboardStats === 'function') updateDashboardStats(); });\n";
    
    fs.writeFileSync('fav/script.js', jsContent, 'utf8');
}

let langContent = fs.readFileSync('global-lang.js', 'utf8');

const enFav = {};
const arFav = {};
for (const [enText, data] of Object.entries(htmlMap)) {
    enFav[data.k] = enText;
    arFav[data.k] = data.ar;
}
enFav['fav.read_more'] = 'Read More';
arFav['fav.read_more'] = 'اقرأ المزيد';
enFav['fav.remove'] = 'Remove';
arFav['fav.remove'] = 'إزالة';
enFav['fav.view_details'] = 'View Details';
arFav['fav.view_details'] = 'عرض التفاصيل';
enFav['fav.no_treasures'] = 'No treasures saved yet.';
arFav['fav.no_treasures'] = 'لم تحفظ أي كنوز بعد.';

const enEntries = Object.entries(enFav).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(arFav).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');

let cssContent = fs.readFileSync('fav/style.css', 'utf8');
if (!cssContent.includes('[dir="rtl"] .dashboard-header')) {
    cssContent += `
/* RTL Favourites */
[dir="rtl"] body { text-align: right; }
[dir="rtl"] .dashboard-header { flex-direction: row-reverse; }
[dir="rtl"] .user-info { text-align: right; margin-right: 1.5rem; margin-left: 0; }
[dir="rtl"] .dashboard-stats { flex-direction: row-reverse; }
[dir="rtl"] .stat-card { flex-direction: row-reverse; border-left: none; border-right: 3px solid rgba(212, 175, 55, 0.5); }
[dir="rtl"] .section-header { flex-direction: row-reverse; }
[dir="rtl"] .section-header h2 i { margin-left: 0.5rem; margin-right: 0; }
[dir="rtl"] .artifact-card { text-align: right; }
[dir="rtl"] .card-actions { flex-direction: row-reverse; }
[dir="rtl"] .remove-btn { margin-right: auto; margin-left: 0; }
[dir="rtl"] .fact-card { border-left: none; border-right: 4px solid var(--primary-gold); padding-right: 1.5rem; padding-left: 1rem; }
[dir="rtl"] .fact-header { flex-direction: row-reverse; }
`;
    fs.writeFileSync('fav/style.css', cssContent, 'utf8');
}
console.log('Favourites translated successfully!');
