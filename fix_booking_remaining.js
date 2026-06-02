const fs = require('fs');

// ============================================================
// STEP 1: Add missing data-i18n attributes to booking.html
// ============================================================
let html = fs.readFileSync('booking/booking.html', 'utf8');

// --- Hero subtitle (the description paragraph) ---
html = html.replace(
    '<p class="hero-subtitle">\r\n                                            Experience the wonders of ancient Egypt. Select a date to begin your journey through millennia of history.\r\n                                        </p>',
    '<p class="hero-subtitle" data-i18n="booking.hero_subtitle">Experience the wonders of ancient Egypt. Select a date to begin your journey through millennia of history.</p>'
);
// fallback without \r\n
html = html.replace(
    /(<p class="hero-subtitle">)\s*Experience the wonders of ancient Egypt\. Select a date to begin your journey through millennia of history\.\s*(<\/p>)/,
    '$1<span data-i18n="booking.hero_subtitle">Experience the wonders of ancient Egypt. Select a date to begin your journey through millennia of history.</span>$2'
);

// --- Online Booking badge ---
html = html.replace(
    />(\s*)Online Booking(\s*)</,
    ' data-i18n="booking.online_booking">$1Online Booking$2<'
);
// If already has data-i18n but wrong, skip

// --- Calendar day names (Sun, Mon, Tue...) ---
const days = [
    { en: 'Sun', ar: 'أحد', k: 'booking.day_sun' },
    { en: 'Mon', ar: 'اثنين', k: 'booking.day_mon' },
    { en: 'Tue', ar: 'ثلاثاء', k: 'booking.day_tue' },
    { en: 'Wed', ar: 'أربعاء', k: 'booking.day_wed' },
    { en: 'Thu', ar: 'خميس', k: 'booking.day_thu' },
    { en: 'Fri', ar: 'جمعة', k: 'booking.day_fri' },
    { en: 'Sat', ar: 'سبت', k: 'booking.day_sat' },
];

days.forEach(d => {
    // Match day header cells like >Sun< 
    const regex = new RegExp(`(<th[^>]*>)\\s*${d.en}\\s*(</th>)`, 'g');
    html = html.replace(regex, `$1<span data-i18n="${d.k}">${d.en}</span>$2`);
});

// --- Info section descriptions ---
const infoTexts = [
    {
        en: 'Daily: 9:00 AM - 7:00 PM',
        find: /Daily: 9:00 AM - 7:00 PM[^<]*/,
        k: 'booking.hours_text',
        ar: 'يومياً: 9:00 صباحاً - 7:00 مساءً'
    },
    {
        en: 'Last entry at 5:30 PM',
        k: 'booking.hours_text2',
        ar: 'آخر دخول الساعة 5:30 مساءً'
    },
    {
        en: 'El Remaya Square, Giza, Egypt',
        k: 'booking.location_text',
        ar: 'ميدان الرماية، الجيزة، مصر'
    },
    {
        en: 'Accessible by car, bus, and metro',
        k: 'booking.location_text2',
        ar: 'يمكن الوصول بالسيارة أو الحافلة أو المترو'
    },
    {
        en: 'No flash photography. No large bags',
        k: 'booking.rules_text',
        ar: 'ممنوع التصوير بالفلاش. ممنوع الحقائب الكبيرة'
    },
    {
        en: 'Food and drink in designated areas only',
        k: 'booking.rules_text2',
        ar: 'الطعام والشراب في المناطق المخصصة فقط'
    },
    {
        en: 'Wheelchair & stroller accessible',
        k: 'booking.access_text',
        ar: 'مهيأ للكراسي المتحركة وعربات الأطفال'
    },
    {
        en: 'Elevators and ramps available',
        k: 'booking.access_text2',
        ar: 'مصاعد ومنحدرات متوفرة'
    }
];

// Replace info-text paragraphs with data-i18n spans
// Opening Hours block
html = html.replace(
    /Daily: 9:00 AM - 7:00 PM\.\s*<br>\s*Last entry at 5:30 PM\./,
    '<span data-i18n="booking.hours_text">Daily: 9:00 AM - 7:00 PM.</span><br> <span data-i18n="booking.hours_text2">Last entry at 5:30 PM.</span>'
);

// Getting Here block
html = html.replace(
    /El Remaya Square, Giza, Egypt\.\s*<br>\s*Accessible by car, bus, and metro\./,
    '<span data-i18n="booking.location_text">El Remaya Square, Giza, Egypt.</span><br> <span data-i18n="booking.location_text2">Accessible by car, bus, and metro.</span>'
);

// Museum Rules block
html = html.replace(
    /No flash photography\. No large bags\.\s*<br>\s*Food and drink in designated areas only\./,
    '<span data-i18n="booking.rules_text">No flash photography. No large bags.</span><br> <span data-i18n="booking.rules_text2">Food and drink in designated areas only.</span>'
);

// Accessibility block
html = html.replace(
    /Wheelchair & stroller accessible\.\s*<br>\s*Elevators and ramps available\./,
    '<span data-i18n="booking.access_text">Wheelchair & stroller accessible.</span><br> <span data-i18n="booking.access_text2">Elevators and ramps available.</span>'
);

// --- Tutankhamun Pass ---
html = html.replace(
    />\s*Tutankhamun Pass\s*<\/h4>/,
    '><span data-i18n="booking.tut_pass">Tutankhamun Pass</span></h4>'
);

// --- Proceed to Checkout ---
html = html.replace(
    /Proceed to Checkout/,
    '<span data-i18n="booking.proceed_checkout">Proceed to Checkout</span>'
);

// --- Explorer (Child) / Guardian (Adult) labels that may not have data-i18n ---
html = html.replace(/>(\s*)Explorer \(Child\)(\s*)</g, ' data-i18n="booking.explorer_child">$1Explorer (Child)$2<');
html = html.replace(/>(\s*)Guardian \(Adult\)(\s*)</g, ' data-i18n="booking.guardian_adult">$1Guardian (Adult)$2<');

// --- Visitor Information section ---
html = html.replace(
    />\s*Visitor Information\s*</,
    ' data-i18n="booking.visitor_info">Visitor Information<'
);

fs.writeFileSync('booking/booking.html', html, 'utf8');
console.log('HTML updated with data-i18n attributes');

// ============================================================
// STEP 2: Add all missing flat keys to global-lang.js
// ============================================================
let lang = fs.readFileSync('global-lang.js', 'utf8');

const newKeysEn = {
    "booking.hero_subtitle": "Experience the wonders of ancient Egypt. Select a date to begin your journey through millennia of history.",
    "booking.online_booking": "Online Booking",
    "booking.day_sun": "Sun",
    "booking.day_mon": "Mon",
    "booking.day_tue": "Tue",
    "booking.day_wed": "Wed",
    "booking.day_thu": "Thu",
    "booking.day_fri": "Fri",
    "booking.day_sat": "Sat",
    "booking.hours_text": "Daily: 9:00 AM - 7:00 PM.",
    "booking.hours_text2": "Last entry at 5:30 PM.",
    "booking.location_text": "El Remaya Square, Giza, Egypt.",
    "booking.location_text2": "Accessible by car, bus, and metro.",
    "booking.rules_text": "No flash photography. No large bags.",
    "booking.rules_text2": "Food and drink in designated areas only.",
    "booking.access_text": "Wheelchair & stroller accessible.",
    "booking.access_text2": "Elevators and ramps available.",
    "booking.tut_pass": "Tutankhamun Pass",
    "booking.proceed_checkout": "Proceed to Checkout",
    "booking.visitor_info": "Visitor Information"
};

const newKeysAr = {
    "booking.hero_subtitle": "اكتشف عجائب مصر القديمة. اختر تاريخاً لتبدأ رحلتك عبر آلاف السنين من التاريخ.",
    "booking.online_booking": "حجز عبر الإنترنت",
    "booking.day_sun": "أحد",
    "booking.day_mon": "اثنين",
    "booking.day_tue": "ثلاثاء",
    "booking.day_wed": "أربعاء",
    "booking.day_thu": "خميس",
    "booking.day_fri": "جمعة",
    "booking.day_sat": "سبت",
    "booking.hours_text": "يومياً: 9:00 صباحاً - 7:00 مساءً.",
    "booking.hours_text2": "آخر دخول الساعة 5:30 مساءً.",
    "booking.location_text": "ميدان الرماية، الجيزة، مصر.",
    "booking.location_text2": "يمكن الوصول بالسيارة أو الحافلة أو المترو.",
    "booking.rules_text": "ممنوع التصوير بالفلاش. ممنوع الحقائب الكبيرة.",
    "booking.rules_text2": "الطعام والشراب في المناطق المخصصة فقط.",
    "booking.access_text": "مهيأ للكراسي المتحركة وعربات الأطفال.",
    "booking.access_text2": "مصاعد ومنحدرات متوفرة.",
    "booking.tut_pass": "بطاقة توت عنخ آمون",
    "booking.proceed_checkout": "الانتقال للدفع",
    "booking.visitor_info": "معلومات الزائر"
};

// Only inject keys that don't already exist
const enEntries = Object.entries(newKeysEn)
    .filter(([k]) => !lang.includes(`"${k}"`))
    .map(([k,v]) => `"${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(', ');

const arEntries = Object.entries(newKeysAr)
    .filter(([k]) => !lang.includes(`"${k}"`))
    .map(([k,v]) => `"${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(', ');

if (enEntries) {
    lang = lang.replace('en: {', 'en: { ' + enEntries + ',');
}
if (arEntries) {
    lang = lang.replace('ar: {', 'ar: { ' + arEntries + ',');
}

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated with new flat keys');

// ============================================================
// STEP 3: Handle calendar month name in main.js
// ============================================================
let js = fs.readFileSync('booking/main.js', 'utf8');

// Check if there's a months array or month rendering in JS
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const monthNamesAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

// Find months array in main.js
const monthsIdx = js.indexOf('January');
if (monthsIdx > -1) {
    console.log('Found month names in main.js at index', monthsIdx);
    console.log(js.substring(Math.max(0, monthsIdx - 50), monthsIdx + 200));
}

// Add Arabic month names helper if not present
if (!js.includes('MONTHS_AR')) {
    const monthHelper = `
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
function getMonthName(idx) {
    const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if (window.TutoraLang && window.TutoraLang.getCurrentLang() === 'ar') return MONTHS_AR[idx];
    return MONTHS_EN[idx];
}
`;
    js = js.replace('document.addEventListener("DOMContentLoaded"', monthHelper + '\ndocument.addEventListener("DOMContentLoaded"');
    // Also try the single-quote variant
    js = js.replace("document.addEventListener('DOMContentLoaded'", monthHelper + "\ndocument.addEventListener('DOMContentLoaded'");
}

fs.writeFileSync('booking/main.js', js, 'utf8');
console.log('main.js updated');
console.log('\nAll done!');
