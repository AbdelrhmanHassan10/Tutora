const fs = require('fs');
let htmlContent = fs.readFileSync('Edit-profile/code.html', 'utf8');

const navMap = {
    'Profile': { k: 'nav.profile', ar: 'الملف الشخصي' },
    'My Tickets': { k: 'profile.my_tickets', ar: 'تذاكري' },
    'Saved Treasures': { k: 'profile.saved_treasures', ar: 'الكنوز المحفوظة' },
    'AI History': { k: 'profile.ai_history', ar: 'سجل الذكاء الاصطناعي' },
    'Settings': { k: 'profile.settings', ar: 'الإعدادات' },
    'Logout': { k: 'profile.logout', ar: 'تسجيل الخروج' }
};

for (const [enText, data] of Object.entries(navMap)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regex = new RegExp(`(>\\s*)(${escapedText})(\\s*<\\/)`, 'g');
    htmlContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
        if (match.includes('data-i18n')) return match;
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });
}

fs.writeFileSync('Edit-profile/code.html', htmlContent, 'utf8');
console.log('Sidebar translated in Edit-profile/code.html');

// Fix dynamic translation in Profile/script.js
let pScript = fs.readFileSync('Profile/script.js', 'utf8');
// To avoid global-lang.js overriding the dynamic date, we remove data-i18n from the span
pScript = pScript.replace(
    /heroJoinDate\.innerHTML = `(?:<span data-i18n="profile\.joined">)?(.*?)<\/span>?`;/,
    `heroJoinDate.removeAttribute('data-i18n');
                heroJoinDate.innerHTML = \`\${prefix}\${formattedDate}\`;
                
                // Add listener to update date dynamically when language changes
                document.addEventListener('languageChanged', (e) => {
                    const newLang = e.detail.language || localStorage.getItem('preferredLanguage') || 'en';
                    const newFormattedDate = new Date(user.createdAt).toLocaleDateString(newLang === 'ar' ? 'ar-EG' : 'en-US', dateOpts);
                    const newPrefix = newLang === 'ar' ? 'انضم في ' : 'Joined ';
                    heroJoinDate.innerHTML = \`\${newPrefix}\${newFormattedDate}\`;
                });`
);
fs.writeFileSync('Profile/script.js', pScript, 'utf8');
console.log('Fixed dynamic translation in Profile/script.js');
