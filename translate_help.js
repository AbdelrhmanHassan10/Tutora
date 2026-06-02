const fs = require('fs');

const map = {
    "TUTORA Visitor Help | Support & Assistance": { k: 'help.title', ar: 'مساعدة زوار توتورا | الدعم والمساعدة' },
    "Help Center": { k: 'help.help_center_bc', ar: 'مركز المساعدة' },
    "Visitor Help & FAQ": { k: 'help.visitor_help_title', ar: 'مساعدة الزوار والأسئلة الشائعة' },
    "All Topics": { k: 'help.all_topics', ar: 'جميع المواضيع' },
    "Tickets": { k: 'help.tickets_topic', ar: 'التذاكر' },
    "Visit": { k: 'help.visit_topic', ar: 'الزيارة' },
    "Policies": { k: 'help.policies_topic', ar: 'السياسات' },
    "General": { k: 'help.general_topic', ar: 'عام' },
    "How do I book tickets?": { k: 'help.q1', ar: 'كيف أحجز التذاكر؟' },
    "Tickets can be booked directly through our official website or at the museum's visitor center. We highly recommend booking in advance, especially for the Tutankhamun gallery.": { k: 'help.a1', ar: 'يمكن حجز التذاكر مباشرة من خلال موقعنا الرسمي أو في مركز زوار المتحف. نوصي بشدة بالحجز المسبق، خاصة لمعرض توت عنخ آمون.' },
    "Book Now": { k: 'help.book_now', ar: 'احجز الآن' },
    "Can I gift a ticket to someone else?": { k: 'help.q2', ar: 'هل يمكنني إهداء تذكرة لشخص آخر؟' },
    "Yes, tickets are not tied to a specific name. You can forward the QR code to a friend or family member, and it will be valid for a single entry on the specified date.": { k: 'help.a2', ar: 'نعم، التذاكر غير مرتبطة باسم محدد. يمكنك إعادة توجيه رمز الاستجابة السريعة (QR) إلى صديق أو أحد أفراد العائلة، وسيكون صالحًا لدخول واحد في التاريخ المحدد.' },
    "What are the opening hours?": { k: 'help.q3', ar: 'ما هي ساعات العمل؟' },
    "The Grand Egyptian Museum is open daily from 9:00 AM to 10:00 PM. Last entry is at 8:30 PM. Some special exhibitions may have slightly different hours.": { k: 'help.a3', ar: 'المتحف المصري الكبير مفتوح يوميًا من 9:00 صباحًا إلى 10:00 مساءً. آخر دخول الساعة 8:30 مساءً. قد يكون لبعض المعارض الخاصة ساعات مختلفة قليلاً.' },
    "Are there guided tours in multiple languages?": { k: 'help.q4', ar: 'هل تتوفر جولات إرشادية بلغات متعددة؟' },
    "Yes, we offer professional guided tours in English, Arabic, French, German, Spanish, and Mandarin. You can also use our **AI Tour Guide** app for a self-paced experience.": { k: 'help.a4', ar: 'نعم، نحن نقدم جولات إرشادية احترافية باللغات الإنجليزية والعربية والفرنسية والألمانية والإسبانية والصينية الماندرين. يمكنك أيضًا استخدام تطبيق **المرشد السياحي بالذكاء الاصطناعي** للحصول على تجربة بالسرعة التي تناسبك.' },
    "Is there a caf&eacute; or restaurant on site?": { k: 'help.q5', ar: 'هل يوجد مقهى أو مطعم في الموقع؟' },
    "GEM features multiple dining options, ranging from quick snacks to fine dining with views of the Pyramids. Visit our ": { k: 'help.a5_1', ar: 'يتميز المتحف المصري الكبير بخيارات متعددة لتناول الطعام، بدءًا من الوجبات الخفيفة السريعة إلى المطاعم الفاخرة مع إطلالات على الأهرامات. قم بزيارة صفحة ' },
    "Dining": { k: 'help.a5_2', ar: 'المطاعم' },
    " page for details.": { k: 'help.a5_3', ar: ' الخاصة بنا لمزيد من التفاصيل.' },
    "Is photography allowed?": { k: 'help.q6', ar: 'هل يُسمح بالتصوير؟' },
    "Personal photography (no flash) is allowed in most areas. Tripods and professional equipment require a special permit obtained at the Media Office.": { k: 'help.a6', ar: 'يُسمح بالتصوير الشخصي (بدون فلاش) في معظم المناطق. تتطلب الحوامل الثلاثية والمعدات الاحترافية تصريحًا خاصًا يتم الحصول عليه من المكتب الإعلامي.' },
    "Can I bring liquids or food inside?": { k: 'help.q7', ar: 'هل يمكنني إحضار سوائل أو طعام إلى الداخل؟' },
    "For the preservation of our artifacts, food and open drink containers are not allowed in the gallery spaces. You may enjoy them in the courtyard or at our restaurants.": { k: 'help.a7', ar: 'من أجل الحفاظ على القطع الأثرية لدينا، لا يُسمح بتناول الطعام وأوعية المشروبات المفتوحة في مساحات المعرض. يمكنك الاستمتاع بها في الفناء أو في مطاعمنا.' },
    "Are there accessibility facilities?": { k: 'help.q8', ar: 'هل تتوفر مرافق إمكانية الوصول؟' },
    "Yes, GEM is fully accessible with ramps, elevators, and assistive technologies. We also offer complimentary wheelchairs at the Visitor Center.": { k: 'help.a8', ar: 'نعم، يمكن الوصول إلى المتحف المصري الكبير بالكامل من خلال المنحدرات والمصاعد والتقنيات المساعدة. كما نقدم كراسي متحركة مجانية في مركز الزوار.' },
    "Where is the Lost & Found?": { k: 'help.q9', ar: 'أين قسم المفقودات؟' },
    "The Lost & Found office is located near the main Information Desk in the Great Hall. Our staff will be happy to assist you in locating missing items.": { k: 'help.a9', ar: 'يقع مكتب المفقودات بالقرب من مكتب المعلومات الرئيسي في القاعة الكبرى. يسعد موظفونا بمساعدتك في تحديد مكان العناصر المفقودة.' },
    "Still Need Help?": { k: 'help.still_need', ar: 'هل مازلت بحاجة للمساعدة؟' },
    "Our dedicated support team is ready to assist you with any specific inquiries.": { k: 'help.dedicated_support', ar: 'فريق الدعم المخصص لدينا مستعد لمساعدتك في أي استفسارات محددة.' },
    "Get In Touch": { k: 'help.get_in_touch_btn', ar: 'ابقى على تواصل' },
    "Chat with Tutora": { k: 'help.chat_with_tutora', ar: 'الدردشة مع توتورا' }
};

let html = fs.readFileSync('visitor help/help.html', 'utf8');

for (const [engText, data] of Object.entries(map)) {
    // try direct replacement
    if (engText.includes('TUTORA Visitor Help')) {
        html = html.replace(`<title>${engText}</title>`, `<title data-i18n="${data.k}">${engText}</title>`);
    } else {
        const escaped = engText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match only >text< or text inside tags
        let regex = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
        if (html.match(regex)) {
            html = html.replace(regex, `>$1<span data-i18n="${data.k}">${engText}</span>$2<`);
        }
    }
}

// Ensure proper tag injection for dining link
html = html.replace(
    `GEM features multiple dining options, ranging from quick snacks to fine dining with views of the Pyramids. Visit our <a href="../-museum_dining/code.html">Dining</a> page for details.`,
    `<span data-i18n="help.a5_1">GEM features multiple dining options, ranging from quick snacks to fine dining with views of the Pyramids. Visit our </span><a href="../-museum_dining/code.html" data-i18n="help.a5_2">Dining</a><span data-i18n="help.a5_3"> page for details.</span>`
);

const texts = [
    'Help Center', 'Visitor Help & FAQ', 'All Topics', 'Visit', 'Policies', 'General',
    'How do I book tickets?', "Tickets can be booked directly through our official website or at the museum's visitor center. We highly recommend booking in advance, especially for the Tutankhamun gallery.",
    'Book Now', 'Can I gift a ticket to someone else?', 'Yes, tickets are not tied to a specific name. You can forward the QR code to a friend or family member, and it will be valid for a single entry on the specified date.',
    'What are the opening hours?', 'The Grand Egyptian Museum is open daily from 9:00 AM to 10:00 PM. Last entry is at 8:30 PM. Some special exhibitions may have slightly different hours.',
    'Are there guided tours in multiple languages?', 'Yes, we offer professional guided tours in English, Arabic, French, German, Spanish, and Mandarin. You can also use our **AI Tour Guide** app for a self-paced experience.',
    'Is there a caf&eacute; or restaurant on site?', 'Is photography allowed?', 'Personal photography (no flash) is allowed in most areas. Tripods and professional equipment require a special permit obtained at the Media Office.',
    'Can I bring liquids or food inside?', 'For the preservation of our artifacts, food and open drink containers are not allowed in the gallery spaces. You may enjoy them in the courtyard or at our restaurants.',
    'Are there accessibility facilities?', 'Yes, GEM is fully accessible with ramps, elevators, and assistive technologies. We also offer complimentary wheelchairs at the Visitor Center.',
    'Where is the Lost & Found?', 'The Lost & Found office is located near the main Information Desk in the Great Hall. Our staff will be happy to assist you in locating missing items.',
    'Still Need Help?', 'Our dedicated support team is ready to assist you with any specific inquiries.', 'Get In Touch', 'Chat with Tutora'
];

for (const t of texts) {
    const d = map[t] || map[t.replace(/&eacute;/g, 'é')];
    if (d && html.includes(`>${t}<`)) {
        html = html.replace(`>${t}<`, `><span data-i18n="${d.k}">${t}</span><`);
    } else if (d) {
        let escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let regex = new RegExp(`>\\s*${escaped}\\s*<`, 'g');
        html = html.replace(regex, (match) => match.replace(t, `<span data-i18n="${d.k}">${t}</span>`));
    }
}
// Special handle Tickets (might be next to icon)
html = html.replace(/Tickets\s*<\/span>/, '<span data-i18n="help.tickets_topic">Tickets</span></span>');

// Inject the core scripts and common layout fixes if missing
if (!html.includes('global-core.js')) {
    html = html.replace('</body>', '    <script src="../global-core.js"></script>\n</body>');
}
// check for translation of headers and footers
html = html.replace(/<span class="material-symbols-outlined theme-icon">language<\/span>\s*Language/g, '<span class="material-symbols-outlined theme-icon">language</span>\n                                    <span data-i18n="nav.language">Language</span>');

fs.writeFileSync('visitor help/help.html', html, 'utf8');

// Also update global-lang.js
let langJs = fs.readFileSync('global-lang.js', 'utf8');
let enStrings = [];
let arStrings = [];

for (const [engText, data] of Object.entries(map)) {
    enStrings.push(`        "${data.k}": "${engText.replace(/"/g, '\\"')}",`);
    arStrings.push(`        "${data.k}": "${data.ar.replace(/"/g, '\\"')}",`);
}

langJs = langJs.replace(
    /"edit_profile\.title": "TUTORA Profile \\| Edit Profile",/,
    '"edit_profile.title": "TUTORA Profile | Edit Profile",\n' + enStrings.join('\n')
);

langJs = langJs.replace(
    /"edit_profile\.title": "ملف توتورا الشخصي \\| تعديل الملف الشخصي",/,
    '"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",\n' + arStrings.join('\n')
);

fs.writeFileSync('global-lang.js', langJs, 'utf8');
console.log('Visitor Help translated');
