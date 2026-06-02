const fs = require('fs');

const map = {
    'Account Management': { k: 'edit_profile.account_management', ar: 'إدارة الحساب' },
    'Edit Profile': { k: 'edit_profile.edit_profile', ar: 'تعديل الملف الشخصي' },
    'Recommended: 400x400px': { k: 'edit_profile.recommended_size', ar: 'موصى به: 400x400 بكسل' },
    'Upload New Photo': { k: 'edit_profile.upload_photo', ar: 'رفع صورة جديدة' },
    'Adjust Current': { k: 'edit_profile.adjust_current', ar: 'تعديل الحالي' },
    'First Name': { k: 'edit_profile.first_name', ar: 'الاسم الأول' },
    'Last Name': { k: 'edit_profile.last_name', ar: 'الاسم الأخير' },
    'Email Address': { k: 'edit_profile.email_address', ar: 'البريد الإلكتروني' },
    'Professional Bio': { k: 'edit_profile.professional_bio', ar: 'نبذة مهنية' },
    'Discard Changes': { k: 'edit_profile.discard_changes', ar: 'تجاهل التغييرات' },
    'Save Changes': { k: 'edit_profile.save_changes', ar: 'حفظ التغييرات' },
    'Membership Status': { k: 'edit_profile.membership_status', ar: 'حالة العضوية' },
    'Review Membership Details': { k: 'edit_profile.review_membership', ar: 'مراجعة تفاصيل العضوية' },
    'Customize Artifact': { k: 'edit_profile.customize_artifact', ar: 'تخصيص القطعة الأثرية' },
    'Cancel': { k: 'edit_profile.cancel', ar: 'إلغاء' },
    'Apply Selection': { k: 'edit_profile.apply_selection', ar: 'تطبيق الاختيار' }
};

let htmlContent = fs.readFileSync('Edit-profile/code.html', 'utf8');

for (const [enText, data] of Object.entries(map)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const flexText = escapedText.replace(/\\s+/g, '\\s+');
    
    const regex = new RegExp(`(<[^>]+>\\s*)(${flexText})(\\s*<\\/[^>]+>)`, 'g');
    htmlContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        let lastTagIndex = p1.lastIndexOf('<');
        let beforeTag = p1.substring(0, lastTagIndex);
        let tag = p1.substring(lastTagIndex);
        return beforeTag + tag.replace('>', ` data-i18n="${data.k}">`) + p2 + p3;
    });

    const regexLoose = new RegExp(`(>\\s*)(${flexText})(\\s*<)`, 'g');
    htmlContent = htmlContent.replace(regexLoose, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });
}

// Special case title
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="edit_profile.title">TUTORA Profile | Edit Profile</title>');

// Add language button to header if missing
if (!htmlContent.includes('id="langBtn"')) {
    const target = `<button class="theme-toggle" id="themeToggle">
                                                    <span class="material-symbols-outlined">light_mode</span>
                                                </button>`;

    const replacement = `<button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 10px;">
                                                    <span class="material-symbols-outlined">language</span>
                                                </button>
                                                <button class="theme-toggle" id="themeToggle">
                                                    <span class="material-symbols-outlined">light_mode</span>
                                                </button>`;
    htmlContent = htmlContent.replace(target, replacement);
}

// Cache bust global-lang.js
htmlContent = htmlContent.replace(/global-lang\.js(\?v=\d+)?/, 'global-lang.js?v=' + Date.now());

fs.writeFileSync('Edit-profile/code.html', htmlContent, 'utf8');
console.log('Edit-profile/code.html updated');

// Update global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = Object.keys(map).reduce((acc, key) => {
    if (!langContent.includes('"' + map[key].k + '"')) {
        acc[map[key].k] = key;
    }
    return acc;
}, {});
newEn["edit_profile.title"] = "TUTORA Profile | Edit Profile";

const newAr = Object.keys(map).reduce((acc, key) => {
    if (!langContent.includes('"' + map[key].k + '"')) {
        acc[map[key].k] = map[key].ar;
    }
    return acc;
}, {});
newAr["edit_profile.title"] = "ملف توتورا الشخصي | تعديل الملف الشخصي";

const enEntries = Object.entries(newEn).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(newAr).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');
