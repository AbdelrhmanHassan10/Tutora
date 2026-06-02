const fs = require('fs');
let html = fs.readFileSync('booking/booking.html', 'utf8');

// 1. FAQ Title: "Frequently Asked Questions"
html = html.replace(
    /Frequently Asked Questions/,
    '<span data-i18n="booking.faq_title">Frequently Asked Questions</span>'
);

// 2. FAQ Answer 1
html = html.replace(
    'Yes! You can reschedule your booking up to 24 hours before your visit at no extra cost. Simply visit your booking confirmation page or contact our support team.',
    '<span data-i18n="booking.faq_ans_1">Yes! You can reschedule your booking up to 24 hours before your visit at no extra cost. Simply visit your booking confirmation page or contact our support team.</span>'
);

// 3. FAQ Answer 2
html = html.replace(
    'Yes, children under the age of 6 enter free of charge. They do not need a ticket but must be accompanied by a ticketed adult.',
    '<span data-i18n="booking.faq_ans_2">Yes, children under the age of 6 enter free of charge. They do not need a ticket but must be accompanied by a ticketed adult.</span>'
);

// 4. FAQ Answer 3
html = html.replace(
    /Yes, the Grand Egyptian Museum has a large parking area available for visitors\. Parking fees may apply\. The museum is also accessible by public transportation\./,
    '<span data-i18n="booking.faq_ans_3">Yes, the Grand Egyptian Museum has a large parking area available for visitors. Parking fees may apply. The museum is also accessible by public transportation.</span>'
);

// 5. FAQ Answer 4
html = html.replace(
    /We accept all major credit and debit cards \(Visa, Mastercard, American Express\), as well as mobile payments\. Cash payments are available at[^<]*/,
    '<span data-i18n="booking.faq_ans_4">We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as mobile payments. Cash payments are available at the museum ticket counters.</span>'
);

fs.writeFileSync('booking/booking.html', html, 'utf8');
console.log('FAQ HTML updated');

// Now add flat keys to global-lang.js
let lang = fs.readFileSync('global-lang.js', 'utf8');

const faqEn = {
    "booking.faq_title": "Frequently Asked Questions",
    "booking.faq_ans_1": "Yes! You can reschedule your booking up to 24 hours before your visit at no extra cost. Simply visit your booking confirmation page or contact our support team.",
    "booking.faq_ans_2": "Yes, children under the age of 6 enter free of charge. They do not need a ticket but must be accompanied by a ticketed adult.",
    "booking.faq_ans_3": "Yes, the Grand Egyptian Museum has a large parking area available for visitors. Parking fees may apply. The museum is also accessible by public transportation.",
    "booking.faq_ans_4": "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as mobile payments. Cash payments are available at the museum ticket counters."
};

const faqAr = {
    "booking.faq_title": "الأسئلة الشائعة",
    "booking.faq_ans_1": "نعم! يمكنك إعادة جدولة حجزك قبل 24 ساعة من زيارتك بدون أي تكلفة إضافية. قم بزيارة صفحة تأكيد الحجز أو تواصل مع فريق الدعم.",
    "booking.faq_ans_2": "نعم، الأطفال دون سن السادسة يدخلون مجاناً. لا يحتاجون إلى تذكرة ولكن يجب أن يكونوا برفقة شخص بالغ يحمل تذكرة.",
    "booking.faq_ans_3": "نعم، يتوفر في المتحف المصري الكبير موقف سيارات كبير للزوار. قد تُطبق رسوم على مواقف السيارات. يمكن أيضاً الوصول للمتحف بوسائل النقل العام.",
    "booking.faq_ans_4": "نقبل جميع بطاقات الائتمان والخصم الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس)، بالإضافة إلى الدفع عبر الهاتف المحمول. الدفع النقدي متاح في شبابيك التذاكر بالمتحف."
};

const enEntries = Object.entries(faqEn)
    .filter(([k]) => !lang.includes(`"${k}"`))
    .map(([k,v]) => `"${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(', ');

const arEntries = Object.entries(faqAr)
    .filter(([k]) => !lang.includes(`"${k}"`))
    .map(([k,v]) => `"${k}": "${v.replace(/"/g, '\\"')}"`)
    .join(', ');

if (enEntries) lang = lang.replace('en: {', 'en: { ' + enEntries + ',');
if (arEntries) lang = lang.replace('ar: {', 'ar: { ' + arEntries + ',');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated with FAQ translations');
