const fs = require('fs');
const path = require('path');

const accHtmlPath = path.join(__dirname, '-accessibility/code.html');
const langJsPath = path.join(__dirname, 'global-lang.js');

let html = fs.readFileSync(accHtmlPath, 'utf8');

// For plain text tags, we use data-i18n
const textMap = {
    "A Sanctuary of Heritage, Accessible to All Souls": "acc.hero_sub",
    "Seamless Elevation": "acc.badge_elevation",
    "Physical Ease": "acc.badge_physical",
    "24/7 Monitoring": "acc.feat_monitoring",
    "Wide-Step Design": "acc.feat_wide_step",
    "Anti-Slip Surface": "acc.feat_anti_slip",
    "Staff Assistance": "acc.feat_staff_assist",
    "High Contrast Mode": "acc.ctrl_high_contrast",
    "Enhanced legibility for artifact details.": "acc.ctrl_high_contrast_desc",
    "Reduce Motion": "acc.ctrl_reduce_motion",
    "Minimize UI animations and shifts.": "acc.ctrl_reduce_motion_desc",
    "Preferred Text Size": "acc.ctrl_text_size",
    "Audio Guides": "acc.ctrl_audio_guides",
    "Spatial audio descriptions.": "acc.ctrl_audio_desc",
    "The GEM is more than a museum; it is a supportive environment designed for the safety and comfort of every visitor.": "acc.service_desc",
    "Wheelchair Fleet": "acc.srv_wheelchair",
    "Complimentary manual and electric wheelchairs are available at every entrance for a seamless journey.": "acc.srv_wheelchair_desc",
    "Personal Guidance": "acc.srv_guidance",
    "Our dedicated accessibility officers are stationed at every level to assist with navigation and safety.": "acc.srv_guidance_desc",
    "Express Elevators": "acc.srv_elevators",
    "Strategic elevators provide direct access to the Tutankhamun galleries from the main atrium.": "acc.srv_elevators_desc",
    "Medical Sanctuary": "acc.srv_medical",
    "Full-service medical stations are available on-site, ensuring immediate care and peace of mind.": "acc.srv_medical_desc",
    "Induction Loops": "acc.srv_induction",
    "Enhanced audio support for hearing aids is integrated into all cinema and lecture halls.": "acc.srv_induction_desc",
    "Quiet Zones": "acc.srv_quiet",
    "Sensory-friendly rest areas with acoustic insulation and soft lighting for tranquility.": "acc.srv_quiet_desc"
};

// For HTML-containing tags, we use data-i18n-html
const htmlMap = {
    'INCLUSIVE <br><span class="gold-text">EXCELLENCE</span>': 'acc.hero_title',
    'Effortless <br><span class="gold-text">Ascension</span>': 'acc.ascension_title',
    'Scaling the heights of Egyptian history shouldn\'t be a challenge. Our **Grand Escalators** <em>(السلالم الكهربائية)</em> run alongside the famous Grand Staircase, offering a smooth, safe, and panoramic journey for those who prefer to avoid the stairs.': 'acc.ascension_desc',
    'Interface <span class="gold-text">Design</span>': 'acc.interface_title',
    'Reading &amp; <span class="gold-text">Sound</span>': 'acc.reading_title', // &amp; from HTML entity? Wait, original is `Reading & <span...`
    'Reading & <span class="gold-text">Sound</span>': 'acc.reading_title',
    'The Sanctuary <span class="gold-text">Service</span>': 'acc.sanctuary_title'
};

for (const [text, key] of Object.entries(textMap)) {
    // Simple regex for text map
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`>\\s*${escaped}\\s*<`, 'g');
    html = html.replace(regex, `><span data-i18n="${key}">${text}</span><`);
}

for (const [text, key] of Object.entries(htmlMap)) {
    // We add data-i18n-html attribute to the parent tag
    // For h1, h2, h3, p
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(<(h[1-6]|p)[^>]*)>\\s*${escaped}\\s*</\\2>`, 'g');
    html = html.replace(regex, `$1 data-i18n-html="${key}">${text}</$2>`);
}

// Write the fixed HTML
fs.writeFileSync(accHtmlPath, html, 'utf8');

// Update global-lang.js
const enStrings = [
    '        "acc.hero_title": "INCLUSIVE <br><span class=\\"gold-text\\">EXCELLENCE</span>",',
    '        "acc.hero_sub": "A Sanctuary of Heritage, Accessible to All Souls",',
    '        "acc.badge_elevation": "Seamless Elevation",',
    '        "acc.badge_physical": "Physical Ease",',
    '        "acc.ascension_title": "Effortless <br><span class=\\"gold-text\\">Ascension</span>",',
    '        "acc.ascension_desc": "Scaling the heights of Egyptian history shouldn\'t be a challenge. Our **Grand Escalators** <em>(السلالم الكهربائية)</em> run alongside the famous Grand Staircase, offering a smooth, safe, and panoramic journey for those who prefer to avoid the stairs.",',
    '        "acc.feat_monitoring": "24/7 Monitoring",',
    '        "acc.feat_wide_step": "Wide-Step Design",',
    '        "acc.feat_anti_slip": "Anti-Slip Surface",',
    '        "acc.feat_staff_assist": "Staff Assistance",',
    '        "acc.interface_title": "Interface <span class=\\"gold-text\\">Design</span>",',
    '        "acc.ctrl_high_contrast": "High Contrast Mode",',
    '        "acc.ctrl_high_contrast_desc": "Enhanced legibility for artifact details.",',
    '        "acc.ctrl_reduce_motion": "Reduce Motion",',
    '        "acc.ctrl_reduce_motion_desc": "Minimize UI animations and shifts.",',
    '        "acc.reading_title": "Reading & <span class=\\"gold-text\\">Sound</span>",',
    '        "acc.ctrl_text_size": "Preferred Text Size",',
    '        "acc.ctrl_audio_guides": "Audio Guides",',
    '        "acc.ctrl_audio_desc": "Spatial audio descriptions.",',
    '        "acc.sanctuary_title": "The Sanctuary <span class=\\"gold-text\\">Service</span>",',
    '        "acc.service_desc": "The GEM is more than a museum; it is a supportive environment designed for the safety and comfort of every visitor.",',
    '        "acc.srv_wheelchair": "Wheelchair Fleet",',
    '        "acc.srv_wheelchair_desc": "Complimentary manual and electric wheelchairs are available at every entrance for a seamless journey.",',
    '        "acc.srv_guidance": "Personal Guidance",',
    '        "acc.srv_guidance_desc": "Our dedicated accessibility officers are stationed at every level to assist with navigation and safety.",',
    '        "acc.srv_elevators": "Express Elevators",',
    '        "acc.srv_elevators_desc": "Strategic elevators provide direct access to the Tutankhamun galleries from the main atrium.",',
    '        "acc.srv_medical": "Medical Sanctuary",',
    '        "acc.srv_medical_desc": "Full-service medical stations are available on-site, ensuring immediate care and peace of mind.",',
    '        "acc.srv_induction": "Induction Loops",',
    '        "acc.srv_induction_desc": "Enhanced audio support for hearing aids is integrated into all cinema and lecture halls.",',
    '        "acc.srv_quiet": "Quiet Zones",',
    '        "acc.srv_quiet_desc": "Sensory-friendly rest areas with acoustic insulation and soft lighting for tranquility."'
];

const arStrings = [
    '        "acc.hero_title": "التميز <br><span class=\\"gold-text\\">الشامل</span>",',
    '        "acc.hero_sub": "ملاذ التراث، متاح لجميع الأرواح",',
    '        "acc.badge_elevation": "ارتقاء سلس",',
    '        "acc.badge_physical": "راحة جسدية",',
    '        "acc.ascension_title": "صعود <br><span class=\\"gold-text\\">بلا جهد</span>",',
    '        "acc.ascension_desc": "تسلق مرتفعات التاريخ المصري لا ينبغي أن يكون تحدياً. تعمل <strong>السلالم الكهربائية</strong> الخاصة بنا بجانب الدرج العظيم الشهير، لتوفر رحلة سلسة وآمنة وبانورامية لأولئك الذين يفضلون تجنب السلالم.",',
    '        "acc.feat_monitoring": "مراقبة على مدار الساعة",',
    '        "acc.feat_wide_step": "تصميم واسع الدرجات",',
    '        "acc.feat_anti_slip": "سطح مضاد للانزلاق",',
    '        "acc.feat_staff_assist": "مساعدة الموظفين",',
    '        "acc.interface_title": "تصميم <span class=\\"gold-text\\">الواجهة</span>",',
    '        "acc.ctrl_high_contrast": "وضع التباين العالي",',
    '        "acc.ctrl_high_contrast_desc": "وضوح محسن لتفاصيل القطع الأثرية.",',
    '        "acc.ctrl_reduce_motion": "تقليل الحركة",',
    '        "acc.ctrl_reduce_motion_desc": "تقليل الرسوم المتحركة في واجهة المستخدم.",',
    '        "acc.reading_title": "القراءة و<span class=\\"gold-text\\">الصوت</span>",',
    '        "acc.ctrl_text_size": "حجم النص المفضل",',
    '        "acc.ctrl_audio_guides": "الأدلة الصوتية",',
    '        "acc.ctrl_audio_desc": "أوصاف صوتية مكانية.",',
    '        "acc.sanctuary_title": "خدمات <span class=\\"gold-text\\">الملاذ</span>",',
    '        "acc.service_desc": "المتحف المصري الكبير هو أكثر من مجرد متحف؛ إنه بيئة داعمة مصممة لسلامة وراحة كل زائر.",',
    '        "acc.srv_wheelchair": "أسطول الكراسي المتحركة",',
    '        "acc.srv_wheelchair_desc": "تتوفر كراسي متحركة يدوية وكهربائية مجانية عند كل مدخل لرحلة سلسة.",',
    '        "acc.srv_guidance": "توجيه شخصي",',
    '        "acc.srv_guidance_desc": "يتمركز مسؤولو إمكانية الوصول المتخصصون لدينا في كل مستوى للمساعدة في التنقل والسلامة.",',
    '        "acc.srv_elevators": "مصاعد سريعة",',
    '        "acc.srv_elevators_desc": "توفر المصاعد الاستراتيجية وصولاً مباشراً إلى قاعات توت عنخ آمون من الردهة الرئيسية.",',
    '        "acc.srv_medical": "ملاذ طبي",',
    '        "acc.srv_medical_desc": "تتوفر محطات طبية متكاملة الخدمات في الموقع، مما يضمن الرعاية الفورية وراحة البال.",',
    '        "acc.srv_induction": "حلقات الحث",',
    '        "acc.srv_induction_desc": "تم دمج دعم صوتي محسن لأجهزة السمع في جميع قاعات السينما والمحاضرات.",',
    '        "acc.srv_quiet": "مناطق هادئة",',
    '        "acc.srv_quiet_desc": "مناطق استراحة ملائمة للحواس مع عزل صوتي وإضاءة خافتة للهدوء."'
];

let langJs = fs.readFileSync(langJsPath, 'utf8');
const lines = langJs.split('\n');

const enIndex = lines.findIndex(l => l.includes('en: {'));
lines.splice(enIndex + 1, 0, ...enStrings);

const arIndex = lines.findIndex(l => l.includes('ar: {'));
lines.splice(arIndex + 1, 0, ...arStrings);

fs.writeFileSync(langJsPath, lines.join('\n'), 'utf8');

console.log("Accessibility translated!");
