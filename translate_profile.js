const fs = require('fs');

const profileMap = {
    'Manage Your Account': { k: 'profile.manage_account', ar: 'إدارة حسابك' },
    'My Tickets': { k: 'profile.my_tickets', ar: 'تذاكري' },
    'Saved Treasures': { k: 'profile.saved_treasures', ar: 'الكنوز المحفوظة' },
    'AI History': { k: 'profile.ai_history', ar: 'سجل الذكاء الاصطناعي' },
    'Admin Dashboard': { k: 'profile.admin_dashboard', ar: 'لوحة تحكم المسؤول' },
    'Settings': { k: 'profile.settings', ar: 'الإعدادات' },
    'Logout': { k: 'profile.logout', ar: 'تسجيل الخروج' },
    'Verified': { k: 'profile.verified', ar: 'موثق' },
    'Pharaonic Historian': { k: 'profile.pharaonic_historian', ar: 'مؤرخ فرعوني' },
    'Joined December 2022': { k: 'profile.joined', ar: 'انضم في ديسمبر 2022' },
    'Edit Profile': { k: 'profile.edit_profile', ar: 'تعديل الملف الشخصي' },
    'Share Status': { k: 'profile.share_status', ar: 'مشاركة الحالة' },
    'Guardian Avatars': { k: 'profile.guardian_avatars', ar: 'شخصيات الوصي' },
    'Upcoming Visits': { k: 'profile.upcoming_visits', ar: 'الزيارات القادمة' },
    'View All History': { k: 'profile.view_all_history', ar: 'عرض كل السجل' },
    'General Admission': { k: 'profile.general_admission', ar: 'الدخول العام' },
    'Grand Egyptian Museum Entry': { k: 'profile.museum_entry', ar: 'دخول المتحف المصري الكبير' },
    'Main Hall &amp; Tutankhamun Gallery': { k: 'profile.main_hall', ar: 'القاعة الرئيسية ومعرض توت عنخ آمون' },
    'Main Hall & Tutankhamun Gallery': { k: 'profile.main_hall', ar: 'القاعة الرئيسية ومعرض توت عنخ آمون' },
    'Date': { k: 'profile.date', ar: 'التاريخ' },
    'Time': { k: 'profile.time', ar: 'الوقت' },
    'VIEW TICKET': { k: 'profile.view_ticket', ar: 'عرض التذكرة' },
    'Explorer Stats': { k: 'profile.explorer_stats', ar: 'إحصائيات المستكشف' },
    'Artifacts Viewed': { k: 'profile.artifacts_viewed', ar: 'القطع الأثرية التي تم عرضها' },
    'Exhibitions Toured': { k: 'profile.exhibitions_toured', ar: 'المعارض التي تم التجول بها' },
    'View Leaderboard': { k: 'profile.view_leaderboard', ar: 'عرض المتصدرين' },
    'Recently Viewed Artifacts': { k: 'profile.recently_viewed', ar: 'القطع الأثرية المعروضة مؤخراً' },
    'Explore All': { k: 'profile.explore_all', ar: 'استكشاف الكل' },
    'View More': { k: 'profile.view_more', ar: 'عرض المزيد' },
    'Your Full History': { k: 'profile.full_history', ar: 'سجلك الكامل' }
};

let htmlContent = fs.readFileSync('Profile/profile.html', 'utf8');

for (const [enText, data] of Object.entries(profileMap)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const flexText = escapedText.replace(/\\s+/g, '\\s+');
    
    // Replace where it is exactly text between tags
    const regex = new RegExp(`(<[^>]+>\\s*)(${flexText})(\\s*<\\/[^>]+>)`, 'g');
    htmlContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        // Inject data-i18n into the opening tag p1
        // We only want to inject if it's the last tag
        let lastTagIndex = p1.lastIndexOf('<');
        let beforeTag = p1.substring(0, lastTagIndex);
        let tag = p1.substring(lastTagIndex);
        return beforeTag + tag.replace('>', ` data-i18n="${data.k}">`) + p2 + p3;
    });

    // Also replace direct loose text not tightly bounded if necessary, using spans
    const regexLoose = new RegExp(`(>\\s*)(${flexText})(\\s*<)`, 'g');
    htmlContent = htmlContent.replace(regexLoose, (match, p1, p2, p3) => {
        // if already inside an element that got data-i18n, this won't trigger since it was caught above.
        // Wait, the above might not catch if the tags are nested strangely. 
        // We'll just wrap it in a span.
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });
}

// Special cases:
// Title: "TUTORA Profile | <span data-i18n="profile.manage_account">Manage Your Account</span>"
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="profile.title">TUTORA Profile | Manage Your Account</title>');

fs.writeFileSync('Profile/profile.html', htmlContent, 'utf8');
console.log('Profile/profile.html updated');

// Update global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = Object.keys(profileMap).reduce((acc, key) => {
    if (!langContent.includes('"' + profileMap[key].k + '"')) {
        acc[profileMap[key].k] = key;
    }
    return acc;
}, {});
newEn["profile.title"] = "TUTORA Profile | Manage Your Account";

const newAr = Object.keys(profileMap).reduce((acc, key) => {
    if (!langContent.includes('"' + profileMap[key].k + '"')) {
        acc[profileMap[key].k] = profileMap[key].ar;
    }
    return acc;
}, {});
newAr["profile.title"] = "ملف توتورا الشخصي | إدارة حسابك";

const enEntries = Object.entries(newEn).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');
const arEntries = Object.entries(newAr).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\\n        ' + arEntries + ',');

// Replace multiple newlines
langContent = langContent.split('\\\\n').join(String.fromCharCode(10));

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');

// Update script.js for RTL classes 
let jsContent = fs.readFileSync('Profile/script.js', 'utf8');
if (!jsContent.includes('lang === "ar" ? "rtl" : "ltr"')) {
    // Add logic if needed, but global-core usually handles body[dir="rtl"]
}
