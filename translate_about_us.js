const fs = require('fs');

const map = {
    'About Us | The Story Behind Tutora': { k: 'about.title', ar: 'معلومات عنا | القصة وراء توتورا' },
    'The Grand Egyptian Museum:': { k: 'about.hero_h1_1', ar: 'المتحف المصري الكبير:' },
    'A Legacy': { k: 'about.hero_h1_2', ar: 'إرث' },
    'Reborn': { k: 'about.hero_h1_3', ar: 'ولد من جديد' },
    "A monumental tribute to 7,000 years of history, rising from the sands of Giza. The world's largest archaeological institution, bridging ancient wonders and modern innovation.": { k: 'about.hero_desc', ar: 'إشادة أثرية بـ 7000 عام من التاريخ، تنهض من رمال الجيزة. أكبر مؤسسة أثرية في العالم، تسد الفجوة بين العجائب القديمة والابتكار الحديث.' },
    'The Vision of the Century': { k: 'about.vision_title', ar: 'رؤية القرن' },
    'Designed by the renowned': { k: 'about.designed_by', ar: 'تم تصميمه بواسطة' },
    'Heneghan Peng Architects': { k: 'about.architects', ar: 'هينيغان بينغ أركيتكتس' },
    ", the GEM stands as a beacon of cultural preservation. Located on the edge of the": { k: 'about.gem_stands', ar: '، يقف المتحف كمنارة للحفاظ على الثقافة. يقع على حافة' },
    'Giza Plateau': { k: 'about.giza_plateau', ar: 'هضبة الجيزة' },
    ", the museum's architecture is a dialogue with the Great Pyramids themselves.": { k: 'about.arch_dialogue', ar: '، فإن هندسة المتحف هي حوار مع الأهرامات العظيمة نفسها.' },
    'The site covers approximately': { k: 'about.site_covers', ar: 'يغطي الموقع حوالي' },
    '500,000 square meters': { k: 'about.500k_sqm', ar: '500 ألف متر مربع' },
    ", making it the largest museum in the world dedicated to a single civilization. It serves not only as a vault for the treasures of": { k: 'about.largest_museum', ar: '، مما يجعله أكبر متحف في العالم مخصص لحضارة واحدة. لا يخدم فقط كقبو لكنوز' },
    'King Tutankhamun': { k: 'about.king_tut', ar: 'الملك توت عنخ آمون' },
    'but as a state-of-the-art research center and conservation laboratory.': { k: 'about.but_as_research', ar: 'ولكن كمركز أبحاث متطور ومختبر ترميم.' },
    'Architectural Equilibrium': { k: 'about.arch_equil', ar: 'توازن معماري' },
    "The museum's design is dictated by a set of": { k: 'about.design_dictated', ar: 'يُملى تصميم المتحف بواسطة مجموعة من' },
    'visual axes': { k: 'about.visual_axes', ar: 'المحاور البصرية' },
    "from the site to the three pyramids of Giza. This mathematical precision creates a physical link between the ancient monuments and the modern museum.": { k: 'about.from_site', ar: 'من الموقع إلى أهرامات الجيزة الثلاثة. يخلق هذا الدقة الرياضية صلة مادية بين المعالم القديمة والمتحف الحديث.' },
    'The building is not a mere container; it is a landscape, a monumental fold in the desert.': { k: 'about.building_landscape', ar: 'المبنى ليس مجرد حاوية؛ إنه منظر طبيعي، طية ضخمة في الصحراء.' },
    'Utilizing translucent alabaster for the main facade, the building transforms at night, glowing with a warmth that symbols the eternal spirit of Egypt.': { k: 'about.alabaster_desc', ar: 'باستخدام المرمر الشفاف للواجهة الرئيسية، يتحول المبنى في الليل، متوهجًا بدفء يرمز إلى روح مصر الأبدية.' },
    'The Future is Tutora': { k: 'about.future_tutora', ar: 'المستقبل هو توتورا' },
    'We are redefining the heritage experience through digital innovation. Our AI-driven ecosystem bridges the gap between ancient history and modern audiences.': { k: 'about.redefine_heritage', ar: 'نحن نعيد تعريف تجربة التراث من خلال الابتكار الرقمي. يسد نظامنا البيئي المدعوم بالذكاء الاصطناعي الفجوة بين التاريخ القديم والجماهير الحديثة.' },
    'A 24/7 personal guide that answers any historical question in real-time.': { k: 'about.personal_guide', ar: 'دليل شخصي يعمل على مدار الساعة طوال أيام الأسبوع يجيب على أي سؤال تاريخي في الوقت الفعلي.' },
    'Scan any artifact with your phone to unlock deep-dive historical context.': { k: 'about.scan_artifact', ar: 'امسح أي قطعة أثرية بهاتفك لفتح سياق تاريخي عميق.' },
    '3D Voice Storytelling': { k: 'about.3d_voice', ar: 'رواية قصص صوتية ثلاثية الأبعاد' },
    'Immersive audio-visual journeys through photorealistic ancient reconstructions.': { k: 'about.immersive_audio', ar: 'رحلات سمعية وبصرية غامرة من خلال إعادة بناء قديمة واقعية.' },
    'Global Impact': { k: 'about.global_impact', ar: 'تأثير عالمي' },
    'Square Meters': { k: 'about.square_meters', ar: 'أمتار مربعة' },
    'The total gallery space housing over 100,000 artifacts from across the ages.': { k: 'about.total_gallery', ar: 'إجمالي مساحة المعرض التي تضم أكثر من 100000 قطعة أثرية من جميع العصور.' },
    'Years of History': { k: 'about.years_history', ar: 'سنوات من التاريخ' },
    'A comprehensive journey through Predynastic times to the Greco-Roman period.': { k: 'about.comprehensive_journey', ar: 'رحلة شاملة عبر عصور ما قبل الأسرات إلى العصر اليوناني الروماني.' },
    'Annual Visitors': { k: 'about.annual_visitors', ar: 'الزوار السنويون' },
    'Welcoming a global audience to experience the heart of human civilization.': { k: 'about.welcoming_audience', ar: 'نرحب بجمهور عالمي لتجربة قلب الحضارة الإنسانية.' },
    'Sustainability & Future-Proofing': { k: 'about.sustainability', ar: 'الاستدامة والمستقبل' },
    'The Grand Egyptian Museum is a leader in environmental stewardship, integrating ancient wisdom with modern technology to ensure a lasting legacy.': { k: 'about.gem_leader', ar: 'المتحف المصري الكبير هو رائد في الإشراف البيئي، حيث يدمج الحكمة القديمة مع التكنولوجيا الحديثة لضمان إرث دائم.' },
    'Solar Energy Integration': { k: 'about.solar_energy', ar: 'تكامل الطاقة الشمسية' },
    'Our expansive roof utilizes photovoltaic panels to generate clean energy for climate control.': { k: 'about.expansive_roof', ar: 'يستخدم سقفنا الواسع الألواح الكهروضوئية لتوليد طاقة نظيفة للتحكم في المناخ.' },
    'Water Conservation': { k: 'about.water_conservation', ar: 'الحفاظ على المياه' },
    'Innovative recycling systems manage resources in the arid Giza landscape.': { k: 'about.innovative_recycling', ar: 'تدير أنظمة إعادة التدوير المبتكرة الموارد في المناظر الطبيعية القاحلة في الجيزة.' },
    'Institutional Network': { k: 'about.institutional_network', ar: 'شبكة مؤسسية' },
    'UNESCO': { k: 'about.unesco', ar: 'اليونسكو' },
    'British Museum': { k: 'about.british_museum', ar: 'المتحف البريطاني' },
    'Louvre': { k: 'about.louvre', ar: 'متحف اللوفر' },
    'Met Museum': { k: 'about.met_museum', ar: 'متحف المتروبوليتان' },
    'Cairo University': { k: 'about.cairo_university', ar: 'جامعة القاهرة' },
    'Experience the Dawn of History': { k: 'about.exp_dawn', ar: 'جرب فجر التاريخ' },
    'Giza Plateau, Cairo, Egypt. A timeless dialogue between ancient and modern.': { k: 'about.giza_plateau_desc', ar: 'هضبة الجيزة، القاهرة، مصر. حوار خالد بين القديم والحديث.' },
    'Get Directions': { k: 'about.get_directions', ar: 'احصل على الاتجاهات' },
    'Ready to': { k: 'about.ready_to', ar: 'مستعد لـ' },
    'Journey': { k: 'about.journey', ar: 'رحلة' },
    'Through Time?': { k: 'about.through_time', ar: 'عبر الزمن؟' },
    "Step into the world's largest museum and witness the resurrection of a civilization.": { k: 'about.step_into', ar: 'ادخل أكبر متحف في العالم وشاهد قيامة حضارة.' },
    'Book Your Experience Now': { k: 'about.book_experience_now', ar: 'احجز تجربتك الآن' },
    'History': { k: 'about.history', ar: 'التاريخ' },
    'Events': { k: 'about.events', ar: 'الأحداث' },
    'News & Press': { k: 'about.news_press', ar: 'الأخبار والصحافة' },
    'Branding': { k: 'about.branding', ar: 'العلامة التجارية' },
    'Support': { k: 'about.support', ar: 'الدعم' },
    'Help': { k: 'about.help', ar: 'مساعدة' },
    'Get In Touch': { k: 'about.get_in_touch', ar: 'ابقى على تواصل' },
    'Feedback': { k: 'about.feedback', ar: 'ملاحظات' },
    'Accessibility': { k: 'about.accessibility', ar: 'إمكانية الوصول' },
    'Connect': { k: 'about.connect', ar: 'يتصل' },
    'Follow us on social media for updates and behind-the-scenes content.': { k: 'about.follow_us', ar: 'تابعنا على وسائل التواصل الاجتماعي للحصول على التحديثات والمحتوى من وراء الكواليس.' },
    'English': { k: 'about.english', ar: 'إنجليزي' },
    'Privacy Policy': { k: 'about.privacy_policy', ar: 'سياسة الخصوصية' },
    'Terms of Service': { k: 'about.terms_service', ar: 'شروط الخدمة' },
    'Cookie Settings': { k: 'about.cookie_settings', ar: 'إعدادات ملفات تعريف الارتباط' },
    '&copy; 2026 Tutora. All rights reserved.': { k: 'about.copyright', ar: '&copy; 2026 توتورا. جميع الحقوق محفوظة.' },
    '© 2026 Tutora. All rights reserved.': { k: 'about.copyright', ar: '&copy; 2026 توتورا. جميع الحقوق محفوظة.' }
};

let htmlContent = fs.readFileSync('About us/About-us.html', 'utf8');
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
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="about.title">About Us | The Story Behind Tutora</title>');

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
fs.writeFileSync('About us/About-us.html', htmlContent, 'utf8');
console.log('About us/About-us.html updated');

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
