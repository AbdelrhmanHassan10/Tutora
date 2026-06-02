const fs = require('fs');

const map = {
    'TUTORA Get in Touch | Contact Tutora Team': { k: 'contact.title', ar: 'توتورا تواصل معنا | فريق عمل توتورا' },
    'Communication': { k: 'contact.communication', ar: 'تواصل' },
    'Get in Touch with GEM': { k: 'contact.get_in_touch', ar: 'تواصل مع المتحف المصري الكبير' },
    'Experience the timeless majesty of Egypt. Our team is here to help you plan your journey through history.': { k: 'contact.hero_desc', ar: 'استمتع بعظمة مصر الخالدة. فريقنا هنا لمساعدتك في التخطيط لرحلتك عبر التاريخ.' },
    'Our Location': { k: 'contact.our_location', ar: 'موقعنا' },
    'Giza Plateau, Cairo, Egypt': { k: 'contact.giza_plateau', ar: 'هضبة الجيزة، القاهرة، مصر' },
    'Near the Great Pyramids': { k: 'contact.near_pyramids', ar: 'بالقرب من أهرامات الجيزة' },
    'Phone Support': { k: 'contact.phone_support', ar: 'دعم الهاتف' },
    '+20 2 123 4567 (International)': { k: 'contact.phone_intl', ar: '+20 2 123 4567 (دولي)' },
    '19000 (Local Hotline)': { k: 'contact.phone_local', ar: '19000 (الخط الساخن المحلي)' },
    'Email Inquiries': { k: 'contact.email_inquiries', ar: 'استفسارات البريد الإلكتروني' },
    'Full Name': { k: 'contact.full_name', ar: 'الاسم الكامل' },
    'Email Address': { k: 'contact.email_address', ar: 'البريد الإلكتروني' },
    'Inquiry Type': { k: 'contact.inquiry_type', ar: 'نوع الاستفسار' },
    'General Information': { k: 'contact.general_info', ar: 'معلومات عامة' },
    'Ticketing Support': { k: 'contact.ticketing_support', ar: 'دعم التذاكر' },
    'Guided Tours': { k: 'contact.guided_tours', ar: 'جولات إرشادية' },
    'School Visits': { k: 'contact.school_visits', ar: 'زيارات مدرسية' },
    'Message': { k: 'contact.message', ar: 'الرسالة' },
    'Send Message': { k: 'contact.send_message', ar: 'إرسال الرسالة' },
    'Response time is typically within 24 hours.': { k: 'contact.response_time', ar: 'وقت الرد عادة في غضون 24 ساعة.' },
    'Department Directory': { k: 'contact.dept_directory', ar: 'دليل الأقسام' },
    'Specialized Assistance': { k: 'contact.specialized_assistance', ar: 'مساعدة متخصصة' },
    'Private Events': { k: 'contact.private_events', ar: 'فعاليات خاصة' },
    'Enquire about hosting weddings, corporate galas, or private ceremonies at GEM.': { k: 'contact.private_events_desc', ar: 'استفسر عن استضافة حفلات الزفاف أو الحفلات الخيرية للشركات أو الاحتفالات الخاصة في المتحف.' },
    'Educational Tours': { k: 'contact.educational_tours', ar: 'جولات تعليمية' },
    'Group bookings for schools, universities, and research institutions.': { k: 'contact.educational_desc', ar: 'حجوزات جماعية للمدارس والجامعات والمؤسسات البحثية.' },
    'Media & Press': { k: 'contact.media_press', ar: 'الإعلام والصحافة' },
    'Filming permits, press kits, and official media inquiries.': { k: 'contact.media_desc', ar: 'تصاريح التصوير والمواد الصحفية والاستفسارات الإعلامية الرسمية.' },
    'Quick Answers': { k: 'contact.quick_answers', ar: 'إجابات سريعة' },
    'Frequently Asked Questions': { k: 'contact.faq', ar: 'الأسئلة الشائعة' },
    'Can I change my ticket date?': { k: 'contact.q1', ar: 'هل يمكنني تغيير تاريخ التذكرة؟' },
    'Yes, date changes are possible up to 48 hours before your visit, subject to availability. Please contact ticketing@gem.gov.eg with your order number.': { k: 'contact.a1', ar: 'نعم، يمكن تغيير التاريخ قبل 48 ساعة من زيارتك، حسب التوافر. يرجى الاتصال على ticketing@gem.gov.eg مع رقم طلبك.' },
    'Is there a dress code for the museum?': { k: 'contact.q2', ar: 'هل هناك قواعد لباس للمتحف؟' },
    'We recommend comfortable walking shoes and respectful attire. As a cultural site, modest clothing is appreciated.': { k: 'contact.a2', ar: 'نوصي بأحذية مشي مريحة وملابس محتشمة. كموقع ثقافي، نقدر الملابس المحتشمة.' },
    'Are there lockers for large bags?': { k: 'contact.q3', ar: 'هل تتوفر خزائن للحقائب الكبيرة؟' },
    'Yes, secure lockers are available at the Visitor Center for a small fee. Large backpacks and suitcases are not allowed inside the galleries.': { k: 'contact.a3', ar: 'نعم، تتوفر خزائن آمنة في مركز الزوار مقابل رسوم رمزية. لا يُسمح بإدخال حقائب الظهر الكبيرة وحقائب السفر داخل المعارض.' },
    'Visit the Horizon of Khufu': { k: 'contact.visit_horizon', ar: 'زيارة أفق خوفو' },
    'Map of Giza Plateau': { k: 'contact.map_giza', ar: 'خريطة هضبة الجيزة' },
    'GEM COMPLEX': { k: 'contact.gem_complex', ar: 'مجمع المتحف المصري الكبير' },
    'Subscribe to Eternity': { k: 'contact.subscribe_eternity', ar: 'اشترك في الخلود' },
    'Join our exclusive circle to receive updates on new discoveries and upcoming events at the Grand Egyptian Museum.': { k: 'contact.subscribe_desc', ar: 'انضم إلى دائرتنا الحصرية لتلقي تحديثات عن الاكتشافات الجديدة والفعاليات القادمة في المتحف المصري الكبير.' },
    'Subscribe Now': { k: 'contact.subscribe_now', ar: 'اشترك الآن' }
};

let html = fs.readFileSync('get in touch/get-in-touch.html', 'utf8');

for (const [engText, data] of Object.entries(map)) {
    if (engText === 'TUTORA Get in Touch | Contact Tutora Team') {
        html = html.replace(`<title>${engText}</title>`, `<title data-i18n="${data.k}">${engText}</title>`);
    } else {
        const escaped = engText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Placeholders in forms
        if (html.includes(`placeholder="${engText}"`)) {
            html = html.replace(new RegExp(`placeholder="${escaped}"`, 'g'), `placeholder="${engText}" data-i18n="${data.k}_ph"`);
            // we will need to add these ph versions to the dictionary
            map[engText].k_ph = `${data.k}_ph`;
        }
        
        let regex = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
        if (html.match(regex)) {
            html = html.replace(regex, `>$1<span data-i18n="${data.k}">${engText}</span>$2<`);
        }
    }
}

// Any missing direct matching replacements
const texts = [
    'Communication', 'Get in Touch with GEM', 'Our Location', 'Giza Plateau, Cairo, Egypt', 'Near the Great Pyramids',
    'Phone Support', '+20 2 123 4567 (International)', '19000 (Local Hotline)', 'Email Inquiries',
    'Full Name', 'Email Address', 'Inquiry Type', 'General Information', 'Ticketing Support', 'Guided Tours', 'School Visits',
    'Message', 'Send Message', 'Response time is typically within 24 hours.',
    'Department Directory', 'Specialized Assistance', 'Private Events', 'Educational Tours', 'Media & Press',
    'Quick Answers', 'Frequently Asked Questions',
    'Can I change my ticket date?', 'Is there a dress code for the museum?', 'Are there lockers for large bags?',
    'Visit the Horizon of Khufu', 'Map of Giza Plateau', 'GEM COMPLEX', 'Subscribe to Eternity', 'Subscribe Now'
];

for (const t of texts) {
    const d = map[t];
    if (d) {
        let escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let regex = new RegExp(`>\\s*${escaped}\\s*<`, 'g');
        html = html.replace(regex, (match) => match.replace(t, `<span data-i18n="${d.k}">${t}</span>`));
    }
}

// Inject standard scripts and fix Language item
if (!html.includes('global-core.js')) {
    html = html.replace('</body>', '    <script src="../global-core.js"></script>\n</body>');
}
html = html.replace(/<span class="material-symbols-outlined theme-icon">language<\/span>\s*Language/g, '<span class="material-symbols-outlined theme-icon">language</span>\n                                    <span data-i18n="nav.language">Language</span>');

fs.writeFileSync('get in touch/get-in-touch.html', html, 'utf8');

// Update global-lang.js
let langJs = fs.readFileSync('global-lang.js', 'utf8');
let enStrings = [];
let arStrings = [];

for (const [engText, data] of Object.entries(map)) {
    enStrings.push(`        "${data.k}": "${engText.replace(/"/g, '\\"')}",`);
    arStrings.push(`        "${data.k}": "${data.ar.replace(/"/g, '\\"')}",`);
    if (data.k_ph) {
        enStrings.push(`        "${data.k_ph}": "${engText.replace(/"/g, '\\"')}",`);
        arStrings.push(`        "${data.k_ph}": "${data.ar.replace(/"/g, '\\"')}",`);
    }
}

// Insert after edit_profile.title safely
langJs = langJs.replace(
    /"edit_profile\.title": "TUTORA Profile \\| Edit Profile",/,
    '"edit_profile.title": "TUTORA Profile | Edit Profile",\n' + enStrings.join('\n')
);

langJs = langJs.replace(
    /"edit_profile\.title": "ملف توتورا الشخصي \\| تعديل الملف الشخصي",/,
    '"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",\n' + arStrings.join('\n')
);

fs.writeFileSync('global-lang.js', langJs, 'utf8');
console.log('Get in Touch page translated');
