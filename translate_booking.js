const fs = require('fs');

const fileMap = {
  'Book Your Visit': { k: 'book_visit', ar: 'احجز زيارتك' },
  'Instant Confirmation': { k: 'instant_confirm', ar: 'تأكيد فوري' },
  'Mobile Tickets': { k: 'mobile_tickets', ar: 'تذاكر المحمول' },
  'Free Cancellation': { k: 'free_cancel', ar: 'إلغاء مجاني' },
  'Date & Time': { k: 'date_time', ar: 'التاريخ والوقت' },
  'Tickets': { k: 'tickets', ar: 'التذاكر' },
  'Add-ons': { k: 'addons', ar: 'الإضافات' },
  'Checkout': { k: 'checkout', ar: 'الدفع' },
  'Select Date & Time': { k: 'select_date_time', ar: 'اختر التاريخ والوقت' },
  'Choose your preferred visit date and time slot': { k: 'choose_date_time', ar: 'اختر تاريخ ووقت زيارتك المفضل' },
  'Available Time Slots': { k: 'available_slots', ar: 'الأوقات المتاحة' },
  'Morning': { k: 'morning', ar: 'صباحاً' },
  'Late Morning': { k: 'late_morning', ar: 'قبل الظهر' },
  'Afternoon': { k: 'afternoon', ar: 'بعد الظهر' },
  'Late Afternoon': { k: 'late_afternoon', ar: 'عصراً' },
  'Sold Out': { k: 'sold_out', ar: 'نفدت التذاكر' },
  'Select Tickets': { k: 'select_tickets', ar: 'اختر التذاكر' },
  'Choose your admission type and variations': { k: 'choose_admission', ar: 'اختر نوع الدخول الخاص بك' },
  'International': { k: 'international', ar: 'دولي' },
  'Egyptian / Arab': { k: 'egyptian_arab', ar: 'مصري / عربي' },
  'General Admission': { k: 'general_admission', ar: 'الدخول العام' },
  'Adult': { k: 'adult', ar: 'بالغ' },
  'Standard entry for visitors aged 12-60': { k: 'adult_desc', ar: 'دخول عادي للزوار من 12 إلى 60 عاماً' },
  'Student / Child': { k: 'student_child', ar: 'طالب / طفل' },
  'Ages 4-12 or Valid Student ID': { k: 'student_desc', ar: 'الأعمار من 4-12 أو هوية طالب صالحة' },
  'Guided Experience': { k: 'guided_experience', ar: 'جولة إرشادية' },
  'Expert human guide + Includes General Admission': { k: 'guided_desc1', ar: 'مرشد بشري خبير + يشمل الدخول العام' },
  '2-hour expert-led guided journey': { k: 'guided_desc2', ar: 'جولة لمدة ساعتين بقيادة مرشد خبير' },
  'The ultimate immersion + Immersive Gallery access': { k: 'ultimate_desc1', ar: 'الاندماج التام + دخول معرض الانغماس' },
  'Full access to all museum areas': { k: 'ultimate_desc2', ar: 'دخول كامل لجميع مناطق المتحف' },
  'Kids Museum': { k: 'kids_museum', ar: 'متحف الأطفال' },
  'Interactive Zones, Junior Lab & Digital Sandpit': { k: 'kids_desc1', ar: 'مناطق تفاعلية، معمل صغير، وحوض رمل رقمي' },
  'Explorer (Child)': { k: 'explorer_child', ar: 'مستكشف (طفل)' },
  'Ages 4-12. Full interactive access': { k: 'explorer_desc', ar: 'الأعمار 4-12. دخول تفاعلي كامل' },
  'Guardian (Adult)': { k: 'guardian_adult', ar: 'مرافق (بالغ)' },
  'Companion for kids museum only': { k: 'guardian_desc', ar: 'مرافق لمتحف الأطفال فقط' },
  'Enhance Your Visit': { k: 'enhance_visit', ar: 'عزز زيارتك' },
  'Add extras to make your experience unforgettable': { k: 'enhance_desc', ar: 'أضف إضافات لجعل تجربتك لا تُنسى' },
  'Audio Guide': { k: 'audio_guide', ar: 'دليل صوتي' },
  'Available in 8 languages. Expert narration.': { k: 'audio_desc', ar: 'متوفر بـ 8 لغات. سرد خبير.' },
  'Special Exhibition: Ramses II': { k: 'ramses_exhibition', ar: 'معرض خاص: رمسيس الثاني' },
  'Limited time access to the royal collection.': { k: 'ramses_desc', ar: 'وصول لفترة محدودة للمجموعة الملكية.' },
  'Photography Pass': { k: 'photo_pass', ar: 'تصريح تصوير' },
  'Professional photography allowed in all halls.': { k: 'photo_desc', ar: 'يسمح بالتصوير الاحترافي في جميع القاعات.' },
  'VIP Fast-Track Entry': { k: 'vip_entry', ar: 'دخول VIP السريع' },
  'Skip the queue with priority access.': { k: 'vip_desc', ar: 'تخطى الطابور مع الدخول ذو الأولوية.' },
  'Order Summary': { k: 'order_summary', ar: 'ملخص الطلب' },
  'Select a date': { k: 'select_date', ar: 'اختر تاريخاً' },
  'Select a time': { k: 'select_time', ar: 'اختر وقتاً' },
  'No tickets selected yet': { k: 'no_tickets', ar: 'لم يتم اختيار تذاكر بعد' },
  'Subtotal': { k: 'subtotal', ar: 'المجموع الفرعي' },
  'Taxes & Fees (7%)': { k: 'taxes', ar: 'الضرائب والرسوم (7%)' },
  'Total': { k: 'total', ar: 'الإجمالي' },
  'Secure Payment': { k: 'secure_payment', ar: 'دفع آمن' },
  'Opening Hours': { k: 'opening_hours', ar: 'ساعات العمل' },
  'Getting Here': { k: 'getting_here', ar: 'كيفية الوصول' },
  'Museum Rules': { k: 'museum_rules', ar: 'قواعد المتحف' },
  'Accessibility': { k: 'accessibility', ar: 'إمكانية الوصول' },
  'Can I reschedule my booking?': { k: 'faq_1', ar: 'هل يمكنني إعادة جدولة حجزى؟' },
  'Are children under 6 allowed free entry?': { k: 'faq_2', ar: 'هل يُسمح للأطفال دون سن السادسة بالدخول مجانًا؟' },
  'Is parking available at the museum?': { k: 'faq_3', ar: 'هل يتوفر موقف للسيارات في المتحف؟' },
  'What payment methods are accepted?': { k: 'faq_4', ar: 'ما هي طرق الدفع المقبولة؟' },
  'Add': { k: 'add', ar: 'إضافة' }
};

let htmlContent = fs.readFileSync('booking/booking.html', 'utf8');

for (const [enText, data] of Object.entries(fileMap)) {
  const regex = new RegExp(`>(\\s*)${enText.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')}(\\s*)<`, 'g');
  htmlContent = htmlContent.replace(regex, ` data-i18n="booking.${data.k}">$1${enText}$2<`);
}
// Add explicit spans for texts that might not have surrounding tags perfectly
for (const [enText, data] of Object.entries(fileMap)) {
  // If we couldn't replace via > text <, find the text directly
  if (!htmlContent.includes(`data-i18n="booking.${data.k}"`)) {
     htmlContent = htmlContent.replace(new RegExp(enText.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `<span data-i18n="booking.${data.k}">${enText}</span>`);
  }
}

fs.writeFileSync('booking/booking.html', htmlContent, 'utf8');

// Also update main.js if there are hardcoded strings there
let jsContent = fs.readFileSync('booking/main.js', 'utf8');
// Provide an inline translation function for JS
const transCode = `
function tBook(key, defaultText) {
    if (window.TutoraLang && typeof window.TutoraLang.getCurrentLang === 'function') {
        const lang = window.TutoraLang.getCurrentLang();
        if (lang === 'ar' && window.BOOKING_AR && window.BOOKING_AR[key]) {
            return window.BOOKING_AR[key];
        }
    }
    return defaultText;
}

window.BOOKING_AR = {
`;
const jsMapArr = Object.values(fileMap).map(d => `    "${d.k}": "${d.ar}"`);
const jsInjection = transCode + jsMapArr.join(',\n') + '\n};\n\n';

jsContent = jsContent.replace('document.addEventListener("DOMContentLoaded", () => {', jsInjection + 'document.addEventListener("DOMContentLoaded", () => {');

// Just some key replaces in JS
jsContent = jsContent.replace(/Subtotal/g, '${tBook("subtotal", "Subtotal")}');
jsContent = jsContent.replace(/Taxes & Fees \(7%\)/g, '${tBook("taxes", "Taxes & Fees (7%)")}');
jsContent = jsContent.replace(/Total/g, '${tBook("total", "Total")}');
jsContent = jsContent.replace(/Select a date/g, '${tBook("select_date", "Select a date")}');
jsContent = jsContent.replace(/Select a time/g, '${tBook("select_time", "Select a time")}');
jsContent = jsContent.replace(/No tickets selected yet/g, '${tBook("no_tickets", "No tickets selected yet")}');

// Also we need to listen for language changes to update the booking summary!
jsContent = jsContent.replace('function updateSummary() {', 'window.addEventListener("languageChanged", updateSummary);\nfunction updateSummary() {');

fs.writeFileSync('booking/main.js', jsContent, 'utf8');


// Add to global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const enBooking = Object.fromEntries(Object.entries(fileMap).map(([en, d]) => [d.k, en]));
const arBooking = Object.fromEntries(Object.entries(fileMap).map(([en, d]) => [d.k, d.ar]));

const enInject = '        booking: ' + JSON.stringify(enBooking, null, 10) + ',\n';
const arInject = '        booking: ' + JSON.stringify(arBooking, null, 10) + ',\n';

langContent = langContent.replace('en: {\n', 'en: {\n' + enInject);
langContent = langContent.replace('ar: {\n', 'ar: {\n' + arInject);

fs.writeFileSync('global-lang.js', langContent, 'utf8');

// RTL support for booking
let cssContent = fs.readFileSync('booking/style.css', 'utf8');
if (!cssContent.includes('[dir="rtl"] .booking-hero')) {
    cssContent += `
/* RTL Booking */
[dir="rtl"] body { text-align: right; }
[dir="rtl"] .booking-hero-content { align-items: flex-end; text-align: right; }
[dir="rtl"] .progress-step { flex-direction: row-reverse; }
[dir="rtl"] .step-info { text-align: right; margin-right: 1rem; margin-left: 0; }
[dir="rtl"] .booking-main { flex-direction: row-reverse; }
[dir="rtl"] .summary-row, [dir="rtl"] .summary-total { flex-direction: row-reverse; }
[dir="rtl"] .ticket-controls { flex-direction: row-reverse; }
[dir="rtl"] .feature-item { flex-direction: row-reverse; }
[dir="rtl"] .feature-item i { margin-left: 1rem; margin-right: 0; }
[dir="rtl"] .radio-custom { margin-left: 1rem; margin-right: 0; }
[dir="rtl"] .calendar-header { flex-direction: row-reverse; }
[dir="rtl"] .time-slots { justify-content: flex-end; }
[dir="rtl"] .addon-card { text-align: right; }
[dir="rtl"] .ticket-card { text-align: right; }
[dir="rtl"] .ticket-info { margin-right: 1rem; margin-left: 0; }
[dir="rtl"] .checkout-section { text-align: right; }
[dir="rtl"] .input-group input, [dir="rtl"] .input-group select { text-align: right; padding-right: 1rem; padding-left: 3rem; }
[dir="rtl"] .input-icon { right: 1rem; left: auto; }
[dir="rtl"] .faq-question { flex-direction: row-reverse; }
`;
    fs.writeFileSync('booking/style.css', cssContent, 'utf8');
}
console.log('Booking translated successfully!');
