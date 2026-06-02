const fs = require('fs');

const map = {
    'Can I upgrade my membership tier mid-year?': { k: 'membership.faq_q1', ar: 'هل يمكنني ترقية فئة عضويتي في منتصف العام؟' },
    'Are memberships transferable or refundable?': { k: 'membership.faq_q2', ar: 'هل العضويات قابلة للتحويل أو الاسترداد؟' },
    'Do children need their own membership?': { k: 'membership.faq_q3', ar: 'هل يحتاج الأطفال إلى عضوية خاصة بهم؟' },
    'What happens when my membership expires?': { k: 'membership.faq_q4', ar: 'ماذا يحدث عندما تنتهي عضويتي؟' },
    'Children under 12 are admitted free with any active member. A Family Add-On ($75/year) covers up to 3 children aged 12-17.': { k: 'membership.ans_4', ar: 'يُسمح للأطفال دون سن 12 عاماً بالدخول مجاناً مع أي عضو نشط. تغطي إضافة العائلة (75 دولار/سنة) ما يصل إلى 3 أطفال تتراوح أعمارهم بين 12 و 17 عاماً.' }
};

let htmlContent = fs.readFileSync('-membership/code.html', 'utf8');
let langContent = fs.readFileSync('global-lang.js', 'utf8');

for (const [enText, data] of Object.entries(map)) {
    // Replace in HTML
    if (htmlContent.includes(`<span>${enText}</span>`)) {
        htmlContent = htmlContent.replace(`<span>${enText}</span>`, `<span data-i18n="${data.k}">${enText}</span>`);
    } else if (htmlContent.includes(`<p>${enText}</p>`)) {
        htmlContent = htmlContent.replace(`<p>${enText}</p>`, `<p><span data-i18n="${data.k}">${enText}</span></p>`);
    } else if (!htmlContent.includes(`data-i18n="${data.k}"`)) {
        htmlContent = htmlContent.replace(enText, `<span data-i18n="${data.k}">${enText}</span>`);
    }
}

// Update global-lang.js
const newEn = {};
const newAr = {};

for (const [enText, data] of Object.entries(map)) {
    if (!langContent.includes('"' + data.k + '"')) {
        newEn[data.k] = enText;
        newAr[data.k] = data.ar;
    }
}

const enEntries = Object.entries(newEn).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(newAr).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('-membership/code.html', htmlContent, 'utf8');
fs.writeFileSync('global-lang.js', langContent, 'utf8');

console.log('Fixed FAQ translations');
