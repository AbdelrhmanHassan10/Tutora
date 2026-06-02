const fs = require('fs');

let content = fs.readFileSync('global-lang.js', 'utf8');

// First, fix the syntax error lines:
content = content.replace(/"edit_profile\.title": "ملف توتورا الشخصي \\|"edit_profile\.title": "ملف توتورا الشخصي \\| تعديل الملف الشخصي",/g, '');
content = content.replace(/"edit_profile\.title": "TUTORA Profile \\|"edit_profile\.title": "TUTORA Profile \\| Edit Profile",/g, '');

// Also remove any existing contact translations that might have been misplaced
const lines = content.split('\n');
const cleanedLines = lines.filter(line => !line.includes('"contact.'));

// Now we need to insert the correct edit_profile.title and contact translations.
// We have `en: {` and `ar: {`.
const enIndex = cleanedLines.findIndex(l => l.includes('en: {'));
const arIndex = cleanedLines.findIndex(l => l.includes('ar: {'));

// We will insert English strings after en: {
const enStrings = [
    '        "edit_profile.title": "TUTORA Profile | Edit Profile",',
    '        "contact.title": "TUTORA Get in Touch | Contact Tutora Team",',
    '        "contact.communication": "Communication",',
    '        "contact.get_in_touch": "Get in Touch with GEM",',
    '        "contact.hero_desc": "Experience the timeless majesty of Egypt. Our team is here to help you plan your journey through history.",',
    '        "contact.our_location": "Our Location",',
    '        "contact.giza_plateau": "Giza Plateau, Cairo, Egypt",',
    '        "contact.near_pyramids": "Near the Great Pyramids",',
    '        "contact.phone_support": "Phone Support",',
    '        "contact.phone_intl": "+20 2 123 4567 (International)",',
    '        "contact.phone_local": "19000 (Local Hotline)",',
    '        "contact.email_inquiries": "Email Inquiries",',
    '        "contact.full_name": "Full Name",',
    '        "contact.full_name_ph": "Full Name",',
    '        "contact.email_address": "Email Address",',
    '        "contact.email_address_ph": "Email Address",',
    '        "contact.inquiry_type": "Inquiry Type",',
    '        "contact.general_info": "General Information",',
    '        "contact.ticketing_support": "Ticketing Support",',
    '        "contact.guided_tours": "Guided Tours",',
    '        "contact.school_visits": "School Visits",',
    '        "contact.message": "Message",',
    '        "contact.message_ph": "Message",',
    '        "contact.send_message": "Send Message",',
    '        "contact.response_time": "Response time is typically within 24 hours.",',
    '        "contact.dept_directory": "Department Directory",',
    '        "contact.specialized_assistance": "Specialized Assistance",',
    '        "contact.private_events": "Private Events",',
    '        "contact.private_events_desc": "Enquire about hosting weddings, corporate galas, or private ceremonies at GEM.",',
    '        "contact.educational_tours": "Educational Tours",',
    '        "contact.educational_desc": "Group bookings for schools, universities, and research institutions.",',
    '        "contact.media_press": "Media & Press",',
    '        "contact.media_desc": "Filming permits, press kits, and official media inquiries.",',
    '        "contact.quick_answers": "Quick Answers",',
    '        "contact.faq": "Frequently Asked Questions",',
    '        "contact.q1": "Can I change my ticket date?",',
    '        "contact.a1": "Yes, date changes are possible up to 48 hours before your visit, subject to availability. Please contact ticketing@gem.gov.eg with your order number.",',
    '        "contact.q2": "Is there a dress code for the museum?",',
    '        "contact.a2": "We recommend comfortable walking shoes and respectful attire. As a cultural site, modest clothing is appreciated.",',
    '        "contact.q3": "Are there lockers for large bags?",',
    '        "contact.a3": "Yes, secure lockers are available at the Visitor Center for a small fee. Large backpacks and suitcases are not allowed inside the galleries.",',
    '        "contact.visit_horizon": "Visit the Horizon of Khufu",',
    '        "contact.map_giza": "Map of Giza Plateau",',
    '        "contact.gem_complex": "GEM COMPLEX",',
    '        "contact.subscribe_eternity": "Subscribe to Eternity",',
    '        "contact.subscribe_desc": "Join our exclusive circle to receive updates on new discoveries and upcoming events at the Grand Egyptian Museum.",',
    '        "contact.subscribe_now": "Subscribe Now",'
];

// Insert Arabic strings after ar: { (which shifts index, so we find it again)
const arStrings = [
    '        "edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",',
    '        "contact.title": "توتورا تواصل معنا | فريق عمل توتورا",',
    '        "contact.communication": "تواصل",',
    '        "contact.get_in_touch": "تواصل مع المتحف المصري الكبير",',
    '        "contact.hero_desc": "استمتع بعظمة مصر الخالدة. فريقنا هنا لمساعدتك في التخطيط لرحلتك عبر التاريخ.",',
    '        "contact.our_location": "موقعنا",',
    '        "contact.giza_plateau": "هضبة الجيزة، القاهرة، مصر",',
    '        "contact.near_pyramids": "بالقرب من أهرامات الجيزة",',
    '        "contact.phone_support": "دعم الهاتف",',
    '        "contact.phone_intl": "+20 2 123 4567 (دولي)",',
    '        "contact.phone_local": "19000 (الخط الساخن المحلي)",',
    '        "contact.email_inquiries": "استفسارات البريد الإلكتروني",',
    '        "contact.full_name": "الاسم الكامل",',
    '        "contact.full_name_ph": "الاسم الكامل",',
    '        "contact.email_address": "البريد الإلكتروني",',
    '        "contact.email_address_ph": "البريد الإلكتروني",',
    '        "contact.inquiry_type": "نوع الاستفسار",',
    '        "contact.general_info": "معلومات عامة",',
    '        "contact.ticketing_support": "دعم التذاكر",',
    '        "contact.guided_tours": "جولات إرشادية",',
    '        "contact.school_visits": "زيارات مدرسية",',
    '        "contact.message": "الرسالة",',
    '        "contact.message_ph": "الرسالة",',
    '        "contact.send_message": "إرسال الرسالة",',
    '        "contact.response_time": "وقت الرد عادة في غضون 24 ساعة.",',
    '        "contact.dept_directory": "دليل الأقسام",',
    '        "contact.specialized_assistance": "مساعدة متخصصة",',
    '        "contact.private_events": "فعاليات خاصة",',
    '        "contact.private_events_desc": "استفسر عن استضافة حفلات الزفاف أو الحفلات الخيرية للشركات أو الاحتفالات الخاصة في المتحف.",',
    '        "contact.educational_tours": "جولات تعليمية",',
    '        "contact.educational_desc": "حجوزات جماعية للمدارس والجامعات والمؤسسات البحثية.",',
    '        "contact.media_press": "الإعلام والصحافة",',
    '        "contact.media_desc": "تصاريح التصوير والمواد الصحفية والاستفسارات الإعلامية الرسمية.",',
    '        "contact.quick_answers": "إجابات سريعة",',
    '        "contact.faq": "الأسئلة الشائعة",',
    '        "contact.q1": "هل يمكنني تغيير تاريخ التذكرة؟",',
    '        "contact.a1": "نعم، يمكن تغيير التاريخ قبل 48 ساعة من زيارتك، حسب التوافر. يرجى الاتصال على ticketing@gem.gov.eg مع رقم طلبك.",',
    '        "contact.q2": "هل هناك قواعد لباس للمتحف؟",',
    '        "contact.a2": "نوصي بأحذية مشي مريحة وملابس محتشمة. كموقع ثقافي، نقدر الملابس المحتشمة.",',
    '        "contact.q3": "هل تتوفر خزائن للحقائب الكبيرة؟",',
    '        "contact.a3": "نعم، تتوفر خزائن آمنة في مركز الزوار مقابل رسوم رمزية. لا يُسمح بإدخال حقائب الظهر الكبيرة وحقائب السفر داخل المعارض.",',
    '        "contact.visit_horizon": "زيارة أفق خوفو",',
    '        "contact.map_giza": "خريطة هضبة الجيزة",',
    '        "contact.gem_complex": "مجمع المتحف المصري الكبير",',
    '        "contact.subscribe_eternity": "اشترك في الخلود",',
    '        "contact.subscribe_desc": "انضم إلى دائرتنا الحصرية لتلقي تحديثات عن الاكتشافات الجديدة والفعاليات القادمة في المتحف المصري الكبير.",',
    '        "contact.subscribe_now": "اشترك الآن",'
];

cleanedLines.splice(enIndex + 1, 0, ...enStrings);
const newArIndex = cleanedLines.findIndex(l => l.includes('ar: {'));
cleanedLines.splice(newArIndex + 1, 0, ...arStrings);

// But wait, what if there's already an "edit_profile.title" line? Let's make sure we removed it fully.
// The filter already removed contact, but edit_profile.title was only removed if it matched the bad string.
// Let's remove ALL edit_profile.title lines just to be safe.
const finalLines = cleanedLines.filter(l => !l.includes('"edit_profile.title"'));

const finalEnIndex = finalLines.findIndex(l => l.includes('en: {'));
finalLines.splice(finalEnIndex + 1, 0, ...enStrings);
const finalArIndex = finalLines.findIndex(l => l.includes('ar: {'));
finalLines.splice(finalArIndex + 1, 0, ...arStrings);


fs.writeFileSync('global-lang.js', finalLines.join('\n'), 'utf8');
console.log('Successfully repaired global-lang.js');
