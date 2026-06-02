const fs = require('fs');

const map = {
    'TUTORA | News & Press': { k: 'news.title', ar: 'توتورا | الأخبار والصحافة' },
    'The Eternal Chronicle': { k: 'news.eternal_chronicle', ar: 'السجل الأبدي' },
    'HISTORY': { k: 'news.history', ar: 'تاريخ' },
    'UNFOLDING': { k: 'news.unfolding', ar: 'ينكشف' },
    'Documenting the ongoing legacy of Egyptian heritage and the modern evolution of the Grand Egyptian Museum through a digital lens.': { k: 'news.hero_desc', ar: 'توثيق الإرث المستمر للتراث المصري والتطور الحديث للمتحف المصري الكبير من خلال عدسة رقمية.' },
    'Latest News': { k: 'news.latest_news', ar: 'أحدث الأخبار' },
    'Dec 14, 2026': { k: 'news.date_1', ar: '14 ديسمبر 2026' },
    'Unveiling the Hidden Chambers of the Khufu Dynasty': { k: 'news.news_title_1', ar: 'الكشف عن الغرف الخفية لسلالة خوفو' },
    'Recent geophysical surveys have revealed previously undocumented structural anomalies beneath the Giza plateau, promising a new era of discovery.': { k: 'news.news_desc_1', ar: 'كشفت المسوحات الجيوفيزيائية الحديثة عن شذوذ هيكلي غير موثق سابقًا تحت هضبة الجيزة، مما يبشر بعصر جديد من الاكتشافات.' },
    'Read Full Release': { k: 'news.read_full', ar: 'اقرأ الإصدار الكامل' },
    'Nov 28, 2026': { k: 'news.date_2', ar: '28 نوفمبر 2026' },
    'Grand Egyptian Museum Wins International Architecture Award': { k: 'news.news_title_2', ar: 'المتحف المصري الكبير يفوز بجائزة العمارة الدولية' },
    "The GEM's innovative design has been recognized globally for its seamless integration of ancient stone motifs with modern glass engineering.": { k: 'news.news_desc_2', ar: 'تم الاعتراف بالتصميم المبتكر للمتحف المصري الكبير عالميًا لدمجه السلس للزخارف الحجرية القديمة مع هندسة الزجاج الحديثة.' },
    'Nov 10, 2026': { k: 'news.date_3', ar: '10 نوفمبر 2026' },
    'Pioneering Digital Restoration of the Tulli Papyrus': { k: 'news.news_title_3', ar: 'ريادة الترميم الرقمي لبرديات تولي' },
    'Utilizing multispectral imaging and AI-driven reconstruction, museum researchers have recovered lost inscriptions from the Third Intermediate Period.': { k: 'news.news_desc_3', ar: 'باستخدام التصوير متعدد الأطياف وإعادة البناء المدفوعة بالذكاء الاصطناعي، استعاد باحثو المتحف نقوشًا مفقودة من فترة الانتقال الثالثة.' },
    'Oct 22, 2026': { k: 'news.date_4', ar: '22 أكتوبر 2026' },
    'The Gastronomy Collection: A New Era of Museum Dining': { k: 'news.news_title_4', ar: 'مجموعة فن الطهو: عصر جديد لتناول الطعام في المتحف' },
    'Experience the silent majesty of the pyramids under the stars as the GEM launches its signature curatorial dining series across 10 global venues.': { k: 'news.news_desc_4', ar: 'جرب الجلالة الصامتة للأهرامات تحت النجوم حيث يطلق المتحف المصري الكبير سلسلته الخاصة بتناول الطعام في 10 أماكن عالمية.' },
    'Press Assets': { k: 'news.press_assets', ar: 'أصول الصحافة' },
    'Visual Archives 2026': { k: 'news.visual_archives', ar: 'الأرشيف المرئي 2026' },
    'Media Style Guide': { k: 'news.style_guide', ar: 'دليل نمط الوسائط' },
    'Official museum brand guidelines, iconography, and editorial standards.': { k: 'news.style_guide_desc', ar: 'إرشادات العلامة التجارية الرسمية للمتحف والأيقونات والمعايير التحريرية.' },
    'Request Accreditation': { k: 'news.request_accred', ar: 'طلب الاعتماد' },
    'Media Relations': { k: 'news.media_relations', ar: 'العلاقات الإعلامية' },
    'Comm Director': { k: 'news.comm_director', ar: 'مدير الاتصالات' },
    'Amara Vance': { k: 'news.amara_vance', ar: 'أمارا فانس' },
    'Archival Liaison': { k: 'news.archival_liaison', ar: 'منسق الأرشيف' },
    'Dr. Samir Kassab': { k: 'news.samir_kassab', ar: 'د. سمير كساب' },
    'Museum': { k: 'news.museum', ar: 'متحف' },
    'Milestones': { k: 'news.milestones', ar: 'المعالم' },
    'Vision Announced': { k: 'news.vision_announced', ar: 'إعلان الرؤية' },
    'The Egyptian government officially initiates the Grand Egyptian Museum mission to create a global monument for archaeology.': { k: 'news.vision_desc', ar: 'تطلق الحكومة المصرية رسميًا مهمة المتحف المصري الكبير لإنشاء نصب تذكاري عالمي لعلم الآثار.' },
    'Foundation Laid': { k: 'news.foundation_laid', ar: 'وضع حجر الأساس' },
    'Construction commences on the Giza plateau, marking the start of a multi-billion dollar masterplan for human heritage.': { k: 'news.foundation_desc', ar: 'يبدأ البناء على هضبة الجيزة، إيذانا ببدء مخطط رئيسي بمليارات الدولارات للتراث البشري.' },
    'The Golden Parade': { k: 'news.golden_parade', ar: 'الموكب الذهبي' },
    'Centerpiece galleries are completed, housing the full collection of King Tutankhamun for the first time in history.': { k: 'news.parade_desc', ar: 'تم الانتهاء من المعارض المركزية، والتي تضم المجموعة الكاملة للملك توت عنخ آمون لأول مرة في التاريخ.' },
    'Tutora AI Launch': { k: 'news.ai_launch', ar: 'إطلاق ذكاء توتورا الاصطناعي' },
    'The museum enters the digital frontier with the Tutora AI platform, bridging the gap between ancient stone and modern silicon.': { k: 'news.ai_launch_desc', ar: 'يدخل المتحف الحدود الرقمية مع منصة توتورا للذكاء الاصطناعي، مما يسد الفجوة بين الحجر القديم والسيليكون الحديث.' },
    'Awards &': { k: 'news.awards', ar: 'الجوائز و' },
    'Recognition': { k: 'news.recognition', ar: 'التقدير' },
    'UNESCO Heritage': { k: 'news.unesco_heritage', ar: 'تراث اليونسكو' },
    'Recognition for outstanding cultural preservation and research, 2025': { k: 'news.unesco_desc', ar: 'التقدير للحفظ الثقافي والبحث المتميز، 2025' },
    'Architectural Prize': { k: 'news.architectural_prize', ar: 'الجائزة المعمارية' },
    'Best Cultural Monument &mdash; International Design Grand Prix, 2024': { k: 'news.architectural_desc', ar: 'أفضل نصب ثقافي — جائزة التصميم الدولية الكبرى، 2024' },
    'Best Cultural Monument — International Design Grand Prix, 2024': { k: 'news.architectural_desc', ar: 'أفضل نصب ثقافي — جائزة التصميم الدولية الكبرى، 2024' },
    'AI Innovation': { k: 'news.ai_innovation', ar: 'ابتكار الذكاء الاصطناعي' },
    'Tutora AI named Tech Innovation of the Year â€” MuseHub Global, 2026': { k: 'news.ai_innovation_desc', ar: 'حاز ذكاء توتورا الاصطناعي على لقب ابتكار العام التكنولوجي — ميوز هاب جلوبال، 2026' },
    'Tutora AI named Tech Innovation of the Year — MuseHub Global, 2026': { k: 'news.ai_innovation_desc', ar: 'حاز ذكاء توتورا الاصطناعي على لقب ابتكار العام التكنولوجي — ميوز هاب جلوبال، 2026' },
    'Tourism Excellence': { k: 'news.tourism_excellence', ar: 'التميز السياحي' },
    "World's Leading Cultural Destination â€” World Travel Awards, 2025": { k: 'news.tourism_desc', ar: 'الوجهة الثقافية الرائدة في العالم — جوائز السفر العالمية، 2025' },
    "World's Leading Cultural Destination — World Travel Awards, 2025": { k: 'news.tourism_desc', ar: 'الوجهة الثقافية الرائدة في العالم — جوائز السفر العالمية، 2025' }
};

let htmlContent = fs.readFileSync('-news_press/code.html', 'utf8');
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
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="news.title">TUTORA | News & Press</title>');

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
fs.writeFileSync('-news_press/code.html', htmlContent, 'utf8');
console.log('-news_press/code.html updated');

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
