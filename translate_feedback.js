const fs = require('fs');
const path = require('path');

const feedbackHtmlPath = path.join(__dirname, 'feedback/Feedback.html');
const langJsPath = path.join(__dirname, 'global-lang.js');

let html = fs.readFileSync(feedbackHtmlPath, 'utf8');

const map = {
    "Share Your Journey": "feedback.hero_title",
    "Your insights help us preserve and perfect the legacy of the Pharaohs. We value every detail of your experience at the Grand Egyptian Museum.": "feedback.hero_subtitle",
    "How would you rate your visit?": "feedback.step1_title",
    "Poor": "feedback.rating_poor",
    "Fair": "feedback.rating_fair",
    "Good": "feedback.rating_good",
    "Great": "feedback.rating_great",
    "Excellent": "feedback.rating_excellent",
    "Tell us more about your experience": "feedback.step2_title",
    "What stood out to you?": "feedback.step3_title",
    "Exhibitions": "feedback.cat_exhibitions",
    "Staff": "feedback.cat_staff",
    "Facilities": "feedback.cat_facilities",
    "AI Services": "feedback.cat_ai",
    "Submit Feedback": "feedback.submit_btn",
    "Your feedback is stored securely and processed anonymously to improve the museum experience.": "feedback.security_note",
    "Thank You, Traveler": "feedback.success_title",
    "Your insights have been woven into the legacy of the Grand Egyptian Museum.": "feedback.success_message",
    "Back to Home": "feedback.back_to_home"
};

for (const [text, key] of Object.entries(map)) {
    // Basic text replacement: replace >text< with ><span data-i18n="key">text</span><
    // Or if it's already inside a span without data-i18n
    // Let's use a simple regex for replacing the inner text of tags or wrapping them
    const regex = new RegExp(`>\\s*${text.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&')}\\s*<`, 'g');
    
    html = html.replace(regex, (match) => {
        // if it already has data-i18n, skip
        return `><span data-i18n="${key}">${text}</span><`;
    });
}

// Special case for placeholder
html = html.replace(/placeholder="Share the highlights of your journey or areas where we can improve..."/, 'placeholder="Share the highlights of your journey or areas where we can improve..." data-i18n-placeholder="feedback.textarea_ph"');

// Fix duplicate spans if they exist
html = html.replace(/<span data-i18n="([^"]+)">\s*<span data-i18n="\1">([^<]+)<\/span>\s*<\/span>/g, '<span data-i18n="$1">$2</span>');

fs.writeFileSync(feedbackHtmlPath, html, 'utf8');

// Update global-lang.js
const enStrings = [
    '        "feedback.hero_title": "Share Your Journey",',
    '        "feedback.hero_subtitle": "Your insights help us preserve and perfect the legacy of the Pharaohs. We value every detail of your experience at the Grand Egyptian Museum.",',
    '        "feedback.step1_title": "How would you rate your visit?",',
    '        "feedback.rating_poor": "Poor",',
    '        "feedback.rating_fair": "Fair",',
    '        "feedback.rating_good": "Good",',
    '        "feedback.rating_great": "Great",',
    '        "feedback.rating_excellent": "Excellent",',
    '        "feedback.step2_title": "Tell us more about your experience",',
    '        "feedback.textarea_ph": "Share the highlights of your journey or areas where we can improve...",',
    '        "feedback.step3_title": "What stood out to you?",',
    '        "feedback.cat_exhibitions": "Exhibitions",',
    '        "feedback.cat_staff": "Staff",',
    '        "feedback.cat_facilities": "Facilities",',
    '        "feedback.cat_ai": "AI Services",',
    '        "feedback.submit_btn": "Submit Feedback",',
    '        "feedback.security_note": "Your feedback is stored securely and processed anonymously to improve the museum experience.",',
    '        "feedback.success_title": "Thank You, Traveler",',
    '        "feedback.success_message": "Your insights have been woven into the legacy of the Grand Egyptian Museum.",',
    '        "feedback.back_to_home": "Back to Home",'
];

const arStrings = [
    '        "feedback.hero_title": "شاركنا رحلتك",',
    '        "feedback.hero_subtitle": "رؤيتك تساعدنا في الحفاظ على إرث الفراعنة وإتقانه. نحن نقدر كل تفاصيل تجربتك في المتحف المصري الكبير.",',
    '        "feedback.step1_title": "كيف تقيم زيارتك؟",',
    '        "feedback.rating_poor": "ضعيف",',
    '        "feedback.rating_fair": "مقبول",',
    '        "feedback.rating_good": "جيد",',
    '        "feedback.rating_great": "رائع",',
    '        "feedback.rating_excellent": "ممتاز",',
    '        "feedback.step2_title": "أخبرنا المزيد عن تجربتك",',
    '        "feedback.textarea_ph": "شاركنا أبرز محطات رحلتك أو المجالات التي يمكننا تحسينها...",',
    '        "feedback.step3_title": "ما الذي لفت انتباهك؟",',
    '        "feedback.cat_exhibitions": "المعارض",',
    '        "feedback.cat_staff": "الموظفون",',
    '        "feedback.cat_facilities": "المرافق",',
    '        "feedback.cat_ai": "خدمات الذكاء الاصطناعي",',
    '        "feedback.submit_btn": "إرسال التقييم",',
    '        "feedback.security_note": "يتم تخزين ملاحظاتك بشكل آمن ومعالجتها بأسلوب مجهول الهوية لتحسين تجربة المتحف.",',
    '        "feedback.success_title": "شكراً لك أيها المسافر",',
    '        "feedback.success_message": "لقد نُسجت رؤيتك في إرث المتحف المصري الكبير.",',
    '        "feedback.back_to_home": "العودة إلى الرئيسية",'
];

let langJs = fs.readFileSync(langJsPath, 'utf8');
const lines = langJs.split('\n');

const enIndex = lines.findIndex(l => l.includes('en: {'));
lines.splice(enIndex + 1, 0, ...enStrings);

const arIndex = lines.findIndex(l => l.includes('ar: {'));
lines.splice(arIndex + 1, 0, ...arStrings);

fs.writeFileSync(langJsPath, lines.join('\n'), 'utf8');

console.log("Feedback translated!");
