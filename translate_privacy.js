const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'Privacy-policy/Privacy-Policy.html');
const langJsPath = path.join(__dirname, 'global-lang.js');

let html = fs.readFileSync(htmlPath, 'utf8');

const replacements = {
    // Breadcrumbs
    '<span>Privacy Policy</span>': '<span data-i18n="privacy.title">Privacy Policy</span>',
    // Sidebar
    '<h3 class="sidebar-title">Legal Center</h3>': '<h3 class="sidebar-title" data-i18n="privacy.sidebar_title">Legal Center</h3>',
    '<p class="sidebar-subtitle">Documentation & Compliance</p>': '<p class="sidebar-subtitle" data-i18n="privacy.sidebar_subtitle">Documentation & Compliance</p>',
    '<span>Data Collection</span>': '<span data-i18n="privacy.nav_data_collection">Data Collection</span>',
    '<span>Your Rights</span>': '<span data-i18n="privacy.nav_your_rights">Your Rights</span>',
    '<span>Security Measures</span>': '<span data-i18n="privacy.nav_security_measures">Security Measures</span>',
    '<p>Have questions regarding your data?</p>': '<p data-i18n="privacy.sidebar_questions">Have questions regarding your data?</p>',
    '<button class="btn-outline">Contact DPO</button>': '<button class="btn-outline" data-i18n="privacy.sidebar_contact">Contact DPO</button>',
    
    // Main Content
    '<h1 class="article-title">Privacy Policy</h1>': '<h1 class="article-title" data-i18n="privacy.title">Privacy Policy</h1>',
    '<p class="last-updated">Last updated: October 8, 2025</p>': '<p class="last-updated" data-i18n="privacy.last_updated">Last updated: October 8, 2025</p>',
    
    // Section 1
    '<h2 class="section-title">Data Collection</h2>': '<h2 class="section-title" data-i18n="privacy.sec1_title">Data Collection</h2>',
    // Section 2
    '<h2 class="section-title">Your Rights</h2>': '<h2 class="section-title" data-i18n="privacy.sec2_title">Your Rights</h2>',
    '<h4>Right of Access</h4>': '<h4 data-i18n="privacy.right_access">Right of Access</h4>',
    '<h4>Right to Erasure</h4>': '<h4 data-i18n="privacy.right_erasure">Right to Erasure</h4>',
    '<h4>Data Portability</h4>': '<h4 data-i18n="privacy.right_portability">Data Portability</h4>',
    '<h4>Right to Object</h4>': '<h4 data-i18n="privacy.right_object">Right to Object</h4>',
    
    // Section 3
    '<h2 class="section-title">Security Measures</h2>': '<h2 class="section-title" data-i18n="privacy.sec3_title">Security Measures</h2>',
    '<h3>Enterprise-Grade Protection</h3>': '<h3 data-i18n="privacy.sec3_subtitle">Enterprise-Grade Protection</h3>'
};

for (const [search, replace] of Object.entries(replacements)) {
    html = html.replace(search, replace);
}

// Multiline replacements using regex
const multilineReplacements = [
    {
        regex: /<p>\s*The Grand Egyptian Museum \(GEM\) is committed to protecting\s*your personal information\. We collect data necessary to\s*provide a seamless visitor experience, including ticketing,\s*tour bookings, and personalized museum communications\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.sec1_p1">The Grand Egyptian Museum (GEM) is committed to protecting your personal information. We collect data necessary to provide a seamless visitor experience, including ticketing, tour bookings, and personalized museum communications.</p>'
    },
    {
        regex: /<p>\s*This includes identity data \(name, passport number\), contact\s*data \(email, phone\), and technical data \(IP address, browser\s*type\) used for site optimization\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.sec1_p2">This includes identity data (name, passport number), contact data (email, phone), and technical data (IP address, browser type) used for site optimization.</p>'
    },
    {
        regex: /Ticket purchases and reservation details\./,
        replace: '<span data-i18n="privacy.sec1_li1">Ticket purchases and reservation details.</span>'
    },
    {
        regex: /Newsletter subscriptions and promotional opt-ins\./,
        replace: '<span data-i18n="privacy.sec1_li2">Newsletter subscriptions and promotional opt-ins.</span>'
    },
    {
        regex: /Security footage while on museum premises for public safety\./,
        replace: '<span data-i18n="privacy.sec1_li3">Security footage while on museum premises for public safety.</span>'
    },
    {
        regex: /<p>\s*You have the right to request a copy of the personal\s*information we hold about you at any time\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.right_access_desc">You have the right to request a copy of the personal information we hold about you at any time.</p>'
    },
    {
        regex: /<p>\s*Also known as the 'right to be forgotten', you may request\s*that we delete your personal data from our systems\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.right_erasure_desc">Also known as the \'right to be forgotten\', you may request that we delete your personal data from our systems.</p>'
    },
    {
        regex: /<p>\s*You can request your data in a structured, commonly used\s*format for transfer to another service\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.right_portability_desc">You can request your data in a structured, commonly used format for transfer to another service.</p>'
    },
    {
        regex: /<p>\s*Object to the processing of your data for marketing or\s*profiling purposes\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.right_object_desc">Object to the processing of your data for marketing or profiling purposes.</p>'
    },
    {
        regex: /<p>\s*We implement state-of-the-art administrative, technical, and\s*physical safeguards to protect your personal data against\s*loss, theft, and unauthorized access\. All transaction data is\s*encrypted via SSL \(Secure Sockets Layer\)\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.sec3_p1">We implement state-of-the-art administrative, technical, and physical safeguards to protect your personal data against loss, theft, and unauthorized access. All transaction data is encrypted via SSL (Secure Sockets Layer).</p>'
    },
    {
        regex: /<p>\s*Our systems are regularly audited by third-party security\s*firms to ensure compliance with international data\s*protection standards \(GDPR and Egyptian Data Protection\s*Law\)\.\s*<\/p>/m,
        replace: '<p data-i18n="privacy.sec3_p2">Our systems are regularly audited by third-party security firms to ensure compliance with international data protection standards (GDPR and Egyptian Data Protection Law).</p>'
    }
];

for (const rep of multilineReplacements) {
    html = html.replace(rep.regex, rep.replace);
}

fs.writeFileSync(htmlPath, html, 'utf8');

let langJs = fs.readFileSync(langJsPath, 'utf8');

const enStrings = `
        "privacy.title": "Privacy Policy",
        "privacy.sidebar_title": "Legal Center",
        "privacy.sidebar_subtitle": "Documentation & Compliance",
        "privacy.nav_data_collection": "Data Collection",
        "privacy.nav_your_rights": "Your Rights",
        "privacy.nav_security_measures": "Security Measures",
        "privacy.sidebar_questions": "Have questions regarding your data?",
        "privacy.sidebar_contact": "Contact DPO",
        "privacy.last_updated": "Last updated: October 8, 2025",
        "privacy.sec1_title": "Data Collection",
        "privacy.sec1_p1": "The Grand Egyptian Museum (GEM) is committed to protecting your personal information. We collect data necessary to provide a seamless visitor experience, including ticketing, tour bookings, and personalized museum communications.",
        "privacy.sec1_p2": "This includes identity data (name, passport number), contact data (email, phone), and technical data (IP address, browser type) used for site optimization.",
        "privacy.sec1_li1": "Ticket purchases and reservation details.",
        "privacy.sec1_li2": "Newsletter subscriptions and promotional opt-ins.",
        "privacy.sec1_li3": "Security footage while on museum premises for public safety.",
        "privacy.sec2_title": "Your Rights",
        "privacy.right_access": "Right of Access",
        "privacy.right_access_desc": "You have the right to request a copy of the personal information we hold about you at any time.",
        "privacy.right_erasure": "Right to Erasure",
        "privacy.right_erasure_desc": "Also known as the 'right to be forgotten', you may request that we delete your personal data from our systems.",
        "privacy.right_portability": "Data Portability",
        "privacy.right_portability_desc": "You can request your data in a structured, commonly used format for transfer to another service.",
        "privacy.right_object": "Right to Object",
        "privacy.right_object_desc": "Object to the processing of your data for marketing or profiling purposes.",
        "privacy.sec3_title": "Security Measures",
        "privacy.sec3_p1": "We implement state-of-the-art administrative, technical, and physical safeguards to protect your personal data against loss, theft, and unauthorized access. All transaction data is encrypted via SSL (Secure Sockets Layer).",
        "privacy.sec3_subtitle": "Enterprise-Grade Protection",
        "privacy.sec3_p2": "Our systems are regularly audited by third-party security firms to ensure compliance with international data protection standards (GDPR and Egyptian Data Protection Law).",
`;

const arStrings = `
        "privacy.title": "سياسة الخصوصية",
        "privacy.sidebar_title": "المركز القانوني",
        "privacy.sidebar_subtitle": "التوثيق والامتثال",
        "privacy.nav_data_collection": "جمع البيانات",
        "privacy.nav_your_rights": "حقوقك",
        "privacy.nav_security_measures": "التدابير الأمنية",
        "privacy.sidebar_questions": "هل لديك أسئلة بخصوص بياناتك؟",
        "privacy.sidebar_contact": "تواصل مع مسؤول البيانات",
        "privacy.last_updated": "آخر تحديث: 8 أكتوبر 2025",
        "privacy.sec1_title": "جمع البيانات",
        "privacy.sec1_p1": "يلتزم المتحف المصري الكبير بحماية معلوماتك الشخصية. نجمع البيانات اللازمة لتوفير تجربة سلسة للزوار، بما في ذلك حجز التذاكر وحجوزات الجولات والمراسلات المخصصة للمتحف.",
        "privacy.sec1_p2": "يشمل ذلك بيانات الهوية (الاسم ورقم جواز السفر)، وبيانات الاتصال (البريد الإلكتروني ورقم الهاتف)، والبيانات التقنية (عنوان IP ونوع المتصفح) المستخدمة لتحسين الموقع.",
        "privacy.sec1_li1": "مشتريات التذاكر وتفاصيل الحجز.",
        "privacy.sec1_li2": "الاشتراك في النشرة الإخبارية وخيارات الترويج.",
        "privacy.sec1_li3": "لقطات المراقبة الأمنية أثناء التواجد في مبنى المتحف من أجل السلامة العامة.",
        "privacy.sec2_title": "حقوقك",
        "privacy.right_access": "حق الوصول",
        "privacy.right_access_desc": "لديك الحق في طلب نسخة من المعلومات الشخصية التي نحتفظ بها عنك في أي وقت.",
        "privacy.right_erasure": "حق المحو",
        "privacy.right_erasure_desc": "يُعرف أيضًا باسم 'الحق في النسيان'، حيث يمكنك طلب حذف بياناتك الشخصية من أنظمتنا.",
        "privacy.right_portability": "نقل البيانات",
        "privacy.right_portability_desc": "يمكنك طلب بياناتك بتنسيق منظم وشائع الاستخدام لنقلها إلى خدمة أخرى.",
        "privacy.right_object": "حق الاعتراض",
        "privacy.right_object_desc": "يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق أو التصنيف.",
        "privacy.sec3_title": "التدابير الأمنية",
        "privacy.sec3_p1": "نحن نطبق أحدث التدابير الإدارية والتقنية والمادية لحماية بياناتك الشخصية ضد الفقد أو السرقة أو الوصول غير المصرح به. يتم تشفير جميع بيانات المعاملات عبر SSL (طبقة مآخذ التوصيل الآمنة).",
        "privacy.sec3_subtitle": "حماية بمستوى المؤسسات",
        "privacy.sec3_p2": "تتم مراجعة أنظمتنا بانتظام من قبل شركات أمنية خارجية لضمان الامتثال لمعايير حماية البيانات الدولية (GDPR وقانون حماية البيانات المصري).",
`;

langJs = langJs.replace(/(const\s+enStrings\s*=\s*{)/, '$1\n' + enStrings);
langJs = langJs.replace(/(const\s+arStrings\s*=\s*{)/, '$1\n' + arStrings);

fs.writeFileSync(langJsPath, langJs, 'utf8');

console.log('Privacy policy translated');
