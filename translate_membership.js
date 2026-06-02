const fs = require('fs');

const map = {
    'TUTORA | Membership': { k: 'membership.title', ar: 'توتورا | العضوية' },
    'Membership': { k: 'membership.membership', ar: 'العضوية' },
    'The Official Gateway': { k: 'membership.official_gateway', ar: 'البوابة الرسمية' },
    'LEGACY': { k: 'membership.legacy', ar: 'الإرث' },
    'PATRONAGE': { k: 'membership.patronage', ar: 'الرعاية' },
    'Explore Tiers': { k: 'membership.explore_tiers', ar: 'استكشف الفئات' },
    'Young Explorer': { k: 'membership.young_explorer', ar: 'المستكشف الشاب' },
    'Student & Youth': { k: 'membership.student_youth', ar: 'الطلاب والشباب' },
    '/ Year': { k: 'membership.per_year', ar: '/ سنة' },
    '20% Discount on Educational Workshops.': { k: 'membership.benefit_1', ar: 'خصم 20% على ورش العمل التعليمية.' },
    'Digital Membership Card & Interactive Site Map.': { k: 'membership.benefit_2', ar: 'بطاقة عضوية رقمية وخريطة موقع تفاعلية.' },
    'Join Now': { k: 'membership.join_now', ar: 'انضم الآن' },
    'Preferred Choice': { k: 'membership.preferred_choice', ar: 'الخيار المفضل' },
    'Heritage Resident': { k: 'membership.heritage_resident', ar: 'مقيم التراث' },
    'Individual Patron': { k: 'membership.individual_patron', ar: 'الراعي الفردي' },
    '2 Guest Passes per year for family/friends.': { k: 'membership.benefit_3', ar: 'تصريحان للضيوف سنوياً للعائلة/الأصدقاء.' },
    '15% discount at Museums Shop & Dining.': { k: 'membership.benefit_4', ar: 'خصم 15% في متجر ومطاعم المتحف.' },
    'Priority booking for Curatorial tours.': { k: 'membership.benefit_5', ar: 'أولوية الحجز لجولات القيّمين.' },
    'Become a Resident': { k: 'membership.become_resident', ar: 'كن مقيماً' },
    'Legacy Founder': { k: 'membership.legacy_founder', ar: 'مؤسس الإرث' },
    'Philanthropic Member': { k: 'membership.philanthropic_member', ar: 'عضو خيري' },
    'VIP Gala invites & exclusive donor events.': { k: 'membership.benefit_6', ar: 'دعوات لحفلات كبار الشخصيات وفعاليات حصرية للمتبرعين.' },
    'Behind-the-scenes access to Restoration Labs.': { k: 'membership.benefit_7', ar: 'دخول حصري إلى مختبرات الترميم.' },
    'Name recognition on the Digital Patron Wall.': { k: 'membership.benefit_8', ar: 'الاعتراف بالاسم على جدار الرعاة الرقمي.' },
    'Personal Museum Concierge for all visits.': { k: 'membership.benefit_9', ar: 'دليل متحف شخصي لجميع الزيارات.' },
    'Join Foundation': { k: 'membership.join_foundation', ar: 'انضم للمؤسسة' },
    'Why Become a': { k: 'membership.why_become', ar: 'لماذا تصبح' },
    'Member?': { k: 'membership.member_q', ar: 'عضواً؟' },
    'Skip the Line': { k: 'membership.skip_line', ar: 'تخطي الطابور' },
    'Exclusive Events': { k: 'membership.exclusive_events', ar: 'فعاليات حصرية' },
    'Dining Privileges': { k: 'membership.dining_privileges', ar: 'امتيازات تناول الطعام' },
    'Gift Shop Perks': { k: 'membership.gift_shop_perks', ar: 'مزايا متجر الهدايا' },
    'Voices from the': { k: 'membership.voices_from', ar: 'أصوات من' },
    'Circle': { k: 'membership.circle', ar: 'الدائرة' },
    'Guardian Member &middot; 3 Years': { k: 'membership.guardian_member', ar: 'عضو الوصي &middot; 3 سنوات' },
    'High Priest Member &middot; 2 Years': { k: 'membership.high_priest_member', ar: 'عضو كاهن كبير &middot; سنتان' },
    'Scribe Member &middot; 1 Year': { k: 'membership.scribe_member', ar: 'عضو كاتب &middot; سنة واحدة' },
    'FAQ': { k: 'membership.faq', ar: 'الأسئلة الشائعة' },
    'Can I upgrade my membership tier mid-year?': { k: 'membership.faq_q1', ar: 'هل يمكنني ترقية فئة عضويتي في منتصف العام؟' },
    'Are memberships transferable or refundable?': { k: 'membership.faq_q2', ar: 'هل العضويات قابلة للتحويل أو الاسترداد؟' },
    'Do children need their own membership?': { k: 'membership.faq_q3', ar: 'هل يحتاج الأطفال إلى عضوية خاصة بهم؟' },
    'What happens when my membership expires?': { k: 'membership.faq_q4', ar: 'ماذا يحدث عندما تنتهي عضويتي؟' }
};

let htmlContent = fs.readFileSync('-membership/code.html', 'utf8');

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
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="membership.title">TUTORA | Membership</title>');

// Add language button to header if missing
if (!htmlContent.includes('id="langBtn"')) {
    const target = `<button class="theme-toggle" id="themeToggle">
                <span class="material-symbols-outlined">dark_mode</span>
            </button>`;

    const replacement = `<button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 10px;">
                                                    <span class="material-symbols-outlined">language</span>
                                                </button>
                                                <button class="theme-toggle" id="themeToggle">
                <span class="material-symbols-outlined">dark_mode</span>
            </button>`;
    htmlContent = htmlContent.replace(target, replacement);
}

// Cache bust global-lang.js
htmlContent = htmlContent.replace(/global-lang\.js(\?v=\d+)?/, 'global-lang.js?v=' + Date.now());

fs.writeFileSync('-membership/code.html', htmlContent, 'utf8');
console.log('-membership/code.html updated');

// Update global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = Object.keys(map).reduce((acc, key) => {
    if (!langContent.includes('"' + map[key].k + '"')) {
        acc[map[key].k] = key === 'TUTORA | Membership' ? key : key.replace(/&middot;/g, '·');
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
console.log('global-lang.js updated');
