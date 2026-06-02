const fs = require('fs');

const map = {
    "Support the Grand Egyptian Museum's mission to preserve 5,000 years of history. join our community of supporters and enjoy unique access to the world's largest archaeological institution.": { k: 'membership.support_desc', ar: 'ادعم رسالة المتحف المصري الكبير في الحفاظ على 5000 عام من التاريخ. انضم إلى مجتمع داعمينا واستمتع بوصول فريد لأكبر مؤسسة أثرية في العالم.' },
    "Unlimited Entry to GEM Complex and Grand Staircase.": { k: 'membership.unlimited_entry', ar: 'دخول غير محدود لمجمع المتحف والدرج العظيم.' },
    "All Access (Main Galleries + Tutankhamun Gallery)": { k: 'membership.all_access', ar: 'دخول كامل (القاعات الرئيسية + قاعة توت عنخ آمون)' },
    "Member?": { k: 'membership.member_q2', ar: 'عضواً؟' },
    "MEMBER?": { k: 'membership.member_q3', ar: 'عضواً؟' },
    "Members enjoy priority entrance at all times â€” no queues, no waiting. Walk straight into 5,000 years of history.": { k: 'membership.priority_entrance', ar: 'يتمتع الأعضاء بأولوية الدخول في جميع الأوقات — لا طوابير، لا انتظار. ادخل مباشرة إلى 5000 عام من التاريخ.' },
    "Attend members-only exhibition openings, curator-led tours, and seasonal galas set among the artifacts.": { k: 'membership.exhibition_openings', ar: 'احضر افتتاحات المعارض للأعضاء فقط، والجولات بقيادة القيمين، والحفلات الموسمية بين القطع الأثرية.' },
    "Enjoy 15% off at Pharaoh's Feast and priority reservations at all museum dining venues.": { k: 'membership.pharaoh_feast', ar: 'استمتع بخصم 15% في مطعم وليمة الفرعون وأولوية الحجز في جميع مطاعم المتحف.' },
    "Receive 10-25% discounts on all museum merchandise, publications, and limited-edition collectibles.": { k: 'membership.shop_discount', ar: 'احصل على خصومات 10-25٪ على جميع منتجات المتحف والمنشورات والمقتنيات ذات الإصدار المحدود.' },
    '"Being a Guardian member has transformed my relationship with Egyptian art. The private previews feel like stepping into history before anyone else."': { k: 'membership.testim_1', ar: '"كوني عضو وصي قد غيّر علاقتي بالفن المصري. المعاينات الخاصة تبدو وكأنها خطوة في التاريخ قبل أي شخص آخر."' },
    '"The conservation lab tours alone are worth the High Priest membership. Watching restorers work on 3,000-year-old artifacts is absolutely mesmerizing."': { k: 'membership.testim_2', ar: '"جولات مختبر الترميم وحدها تستحق عضوية كاهن كبير. مشاهدة المرممين يعملون على قطع أثرية عمرها 3000 عام أمر ساحر للغاية."' },
    '"As a Scribe member, unlimited visits have made the GEM my second home. My children now know the pharaohs by name!"': { k: 'membership.testim_3', ar: '"كعضو كاتب، جعلت الزيارات غير المحدودة المتحف بيتي الثاني. أطفالي الآن يعرفون الفراعنة بأسمائهم!"' },
    "Yes! You can upgrade at any time. The remaining balance of your current tier will be applied toward the higher tier's annual fee.": { k: 'membership.ans_1', ar: 'نعم! يمكنك الترقية في أي وقت. سيتم تطبيق الرصيد المتبقي من فئتك الحالية على الرسوم السنوية للفئة الأعلى.' },
    "Memberships are non-transferable but may be refunded within 30 days of purchase if no benefits have been used.": { k: 'membership.ans_2', ar: 'العضويات غير قابلة للتحويل ولكن يمكن استرداد قيمتها خلال 30 يومًا من الشراء إذا لم يتم استخدام أي مزايا.' },
    "You'll receive renewal reminders 30 and 7 days before expiration. Early renewal within 60 days of expiry preserves your membership anniversary date.": { k: 'membership.ans_3', ar: 'ستتلقى تذكيرات بالتجديد قبل 30 و 7 أيام من انتهاء الصلاحية. التجديد المبكر في غضون 60 يومًا من انتهاء الصلاحية يحافظ على تاريخ الذكرى السنوية لعضويتك.' },
    "Children under 12 are included in Family and Guardian memberships. Individual and Student members must purchase separate tickets for children.": { k: 'membership.ans_4', ar: 'يتم تضمين الأطفال دون سن 12 عامًا في عضويات العائلة والوصي. يجب على الأعضاء الأفراد والطلاب شراء تذاكر منفصلة للأطفال.' }
};

let htmlContent = fs.readFileSync('-membership/code.html', 'utf8');
let langContent = fs.readFileSync('global-lang.js', 'utf8');

for (const [enText, data] of Object.entries(map)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regexLoose = new RegExp(`(>\\s*)(${escapedText})(\\s*<)`, 'g');
    htmlContent = htmlContent.replace(regexLoose, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });
    
    // Also try without capturing groups if it's deeply nested or not just between > and <
    if (!htmlContent.includes(`data-i18n="${data.k}"`)) {
        htmlContent = htmlContent.replace(enText, `<span data-i18n="${data.k}">${enText}</span>`);
    }
}

// Ensure global-lang.js is cache busted
htmlContent = htmlContent.replace(/global-lang\.js(\?v=\d+)?/, 'global-lang.js?v=' + Date.now());
fs.writeFileSync('-membership/code.html', htmlContent, 'utf8');
console.log('-membership/code.html descriptions updated');

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
console.log('global-lang.js descriptions updated');
