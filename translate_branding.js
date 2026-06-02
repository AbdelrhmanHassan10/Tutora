const fs = require('fs');

const map = {
    'TUTORA | Branding & Identity': { k: 'branding.title', ar: 'توتورا | العلامة التجارية والهوية' },
    'SOVEREIGN': { k: 'branding.sovereign', ar: 'سيادي' },
    'IDENTITY': { k: 'branding.identity', ar: 'هوية' },
    'The Fusion of Ancient Soul & Modern Intelligence': { k: 'branding.fusion', ar: 'اندماج الروح القديمة والذكاء الحديث' },
    'TU - TO - RA': { k: 'branding.tu_to_ra', ar: 'تو - تو - را' },
    'The Etymology': { k: 'branding.etymology', ar: 'أصل الكلمة' },
    'The': { k: 'branding.the', ar: 'الـ' },
    'Smart': { k: 'branding.smart', ar: 'ذكي' },
    'Guide': { k: 'branding.guide', ar: 'دليل' },
    'The name': { k: 'branding.the_name', ar: 'الاسم' },
    'is a linguistic bridge. Conceptually derived from the idea of mentorship and guidance, it represents': { k: 'branding.ling_bridge', ar: 'هو جسر لغوي. مشتق من الناحية المفاهيمية من فكرة التوجيه والإرشاد، وهو يمثل' },
    'the intelligent guide': { k: 'branding.intel_guide', ar: 'الدليل الذكي' },
    'It is a tribute to the ancient scribes who recorded history, now reborn as a digital sovereign to guide modern explorers through the halls of the Pharaohs.': { k: 'branding.tribute', ar: 'إنه تكريم للكتبة القدامى الذين سجلوا التاريخ، والذين ولدوا من جديد الآن كسيادة رقمية لتوجيه المستكشفين المعاصرين عبر قاعات الفراعنة.' },
    'Intellect': { k: 'branding.intellect', ar: 'فكر' },
    'Digital Wisdom': { k: 'branding.digital_wisdom', ar: 'الحكمة الرقمية' },
    'Legacy': { k: 'branding.legacy', ar: 'إرث' },
    'Ancient Roots': { k: 'branding.ancient_roots', ar: 'جذور قديمة' },
    'Visual Symbolism': { k: 'branding.visual_symbolism', ar: 'الرمزية البصرية' },
    'Breaking Down The': { k: 'branding.breaking_down', ar: 'تحليل' },
    'Mark': { k: 'branding.mark', ar: 'العلامة' },
    'Our icon is not merely a shape; it is a synthesis of geometry and mythology.': { k: 'branding.icon_desc', ar: 'أيقونتنا ليست مجرد شكل؛ إنها تركيب من الهندسة والميثولوجيا.' },
    'The Modern "T"': { k: 'branding.modern_t', ar: '"T" الحديثة' },
    'The foundation of our name. The letter "T" represents Tutora\'s structural clarity and its role as a technological framework for heritage.': { k: 'branding.t_desc', ar: 'أساس اسمنا. يمثل الحرف "T" الوضوح الهيكلي لتوتورا ودورها كإطار تكنولوجي للتراث.' },
    'The Falcon of Horus': { k: 'branding.falcon', ar: 'صقر حورس' },
    'Inspired by Horus, the deity of the sky and kingship. The sharp, observant profile of the falcon symbolizes Tutora\'s keen eye for artifacts and history.': { k: 'branding.falcon_desc', ar: 'مستوحى من حورس، إله السماء والملكية. يرمز المظهر الجانبي الحاد والمراقب للصقر إلى عين توتورا الثاقبة للقطع الأثرية والتاريخ.' },
    'The Sovereign Fusion': { k: 'branding.sov_fusion', ar: 'الاندماج السيادي' },
    'The final monogram merges the protective wings of Horus with the modern "T", creating a mark that guards the past while guiding the future.': { k: 'branding.fusion_desc', ar: 'يدمج المونوغرام النهائي الأجنحة الواقية لحورس مع "T" الحديثة، مما يخلق علامة تحرس الماضي بينما توجه المستقبل.' },
    'The Chromatic Legacy': { k: 'branding.chromatic', ar: 'الإرث اللوني' },
    'Inspired by': { k: 'branding.inspired_by', ar: 'مستوحى من' },
    'History': { k: 'branding.history', ar: 'التاريخ' },
    'The Tutora palette is meticulously sampled from the materials that built the Giza plateau and the treasures found within.': { k: 'branding.palette_desc', ar: 'تم أخذ عينات من لوحة توتورا بدقة من المواد التي بنت هضبة الجيزة والكنوز الموجودة بداخلها.' },
    'Nile Obsidian': { k: 'branding.nile_obsidian', ar: 'سبج النيل' },
    'Representing the black soil of the Nile and the mysteries of the afterlife.': { k: 'branding.obsidian_desc', ar: 'يمثل التربة السوداء للنيل وأسرار الحياة الآخرة.' },
    'Royal Gold': { k: 'branding.royal_gold', ar: 'الذهب الملكي' },
    'The eternal skin of the Gods. Used for accents and divine guidance.': { k: 'branding.gold_desc', ar: 'البشرة الأبدية للآلهة. تستخدم للإبراز والتوجيه الإلهي.' },
    'Alabaster White': { k: 'branding.alabaster_white', ar: 'الألباستر الأبيض' },
    'The pure stone of monuments. Used for Light Mode clarity and contrast.': { k: 'branding.alabaster_desc', ar: 'الحجر النقي للمعالم الأثرية. يستخدم لوضوح الوضع الفاتح والتباين.' },
    'Desert Sandstone': { k: 'branding.desert_sandstone', ar: 'الحجر الرملي الصحراوي' },
    'The organic warmth of the plateau, grounding the brand in its physical site.': { k: 'branding.sandstone_desc', ar: 'الدفء العضوي للهضبة، مما يرسخ العلامة التجارية في موقعها المادي.' },
    'Communication Standard': { k: 'branding.comm_standard', ar: 'معيار الاتصال' },
    'The Tutora': { k: 'branding.the_tutora', ar: 'الـ توتورا' },
    'Voice': { k: 'branding.voice', ar: 'صوت' },
    'Our brand speaks with the authority of millennia and the clarity of modern scholarship. Every word should evoke reverence for the past while embracing innovation.': { k: 'branding.voice_desc', ar: 'علامتنا التجارية تتحدث بسلطة آلاف السنين ووضوح المنح الدراسية الحديثة. يجب أن تثير كل كلمة تقديسًا للماضي مع احتضان الابتكار.' },
    '"Ancient stone, Digital soul."': { k: 'branding.motto', ar: '"حجر قديم، روح رقمية."' }
};

let htmlContent = fs.readFileSync('-branding/code.html', 'utf8');
let langContent = fs.readFileSync('global-lang.js', 'utf8');

for (const [enText, data] of Object.entries(map)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regexLoose = new RegExp(`(>\\s*)(${escapedText})(\\s*<)`, 'g');
    htmlContent = htmlContent.replace(regexLoose, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });

    if (!htmlContent.includes(`data-i18n="${data.k}"`)) {
        htmlContent = htmlContent.replace(`placeholder="${enText}"`, `placeholder="${enText}" data-i18n-placeholder="${data.k}"`);
    }
}

// Special case title
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="branding.title">TUTORA | Branding & Identity</title>');

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

// Common nav placeholders fix
htmlContent = htmlContent.replace(/>Home</g, '><span data-i18n=\"nav.home\">Home</span><');
htmlContent = htmlContent.replace(/>Plan Your Visit</g, '><span data-i18n=\"nav.plan_visit\">Plan Your Visit</span><');
htmlContent = htmlContent.replace(/>Event</g, '><span data-i18n=\"nav.event\">Event</span><');
htmlContent = htmlContent.replace(/>Shop</g, '><span data-i18n=\"nav.shop\">Shop</span><');

// Ensure global-lang.js is cache busted
htmlContent = htmlContent.replace(/global-lang\.js(\?v=\d+)?/, 'global-lang.js?v=' + Date.now());
fs.writeFileSync('-branding/code.html', htmlContent, 'utf8');
console.log('-branding/code.html updated');

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

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');
