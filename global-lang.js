// ============================================
// GLOBAL LANGUAGE & TRANSLATION SYSTEM - TUTORA
// ============================================
// API Endpoints:
//   GET /api/lang/all/translations  → all translations at once
//   GET /api/lang/ar  or /api/lang/en → specific language
//   GET /api/lang    → based on Accept-Language header
// ============================================

(function () {
    'use strict';

    const API_BASE = (typeof API_BASE_URL !== 'undefined')
        ? API_BASE_URL
        : 'https://gem-backend-production-cb6d.up.railway.app/api';

    // ─── LOCAL FALLBACK TRANSLATIONS ──────────────────────────────
    const LOCAL_TRANSLATIONS = {
        en: {
            // ── Navigation ──
            "nav.home": "Home",
            "nav.plan": "Plan Your Visit",
            "nav.kids": "Kids-Museum",
            "nav.event": "Event",
            "nav.ai_experience": "AI Experience",
            "nav.ai_guide": "AI Tour Guide",
            "nav.ai_chatbot": "AI Chatbot",
            "nav.ai_identifier": "AI Artifact Identifier",
            "nav.ai_voice": "AI Voice Storytelling (3D)",
            "nav.ai_lab": "Tutora Laboratory",
            "nav.shop": "Shop",
            "nav.about": "About",
            "nav.collection": "Collection",
            "nav.main_gallery": "Main Gallery",
            "nav.exhibition": "Exhibition Halls",
            "nav.booking": "Booking",
            "nav.favorites": "Favorites",
            "nav.language": "Language",
            "nav.search": "Search...",

            // ── Hero ──
            "hero.discover": "Discover",
            "hero.museum_name": "The Grand Egyptian Museum",
            "hero.subtitle": "Explore the world's largest collection of ancient Egyptian artifacts with your personal AI guide.",
            "hero.explore_tours": "Explore Tours",
            "hero.buy_tickets": "Buy Tickets",

            // ── Quick Info ──
            "info.hours_title": "Today's Hours",
            "info.hours_value": "9:00 AM - 5:00 PM",
            "info.tickets_title": "Get Tickets",
            "info.tickets_value": "Buy online & skip the line",
            "info.directions_title": "Directions",
            "info.directions_value": "View museum map & parking",
            "info.access_title": "Accessibility",
            "info.access_value": "Wheelchair & stroller access",

            // ── Sections ──
            "section.featured": "Featured Experiences",
            "section.whats_happening": "What's Happening",
            "section.view_all": "View All Events",
            "section.identify": "Identify Artifacts with",
            "section.identify_desc": "Use our AI guide to learn more about the ancient wonders around you. Just take a photo or upload an image to start your discovery.",
            "section.take_photo": "Take a Photo",
            "section.upload_photo": "Upload a Photo",
            "section.gem_title": "The Grand Egyptian Museum",
            "section.gem_desc": "The Grand Egyptian Museum, also known as the Giza Museum, is a new archaeological museum in Giza, Egypt, that is set to become the largest archaeological museum in the world.",
            "section.learn_more": "Learn More",
            "section.dine_shop": "Dine & Shop",
            "section.dine_subtitle": "Complete your experience with world-class facilities",
            "section.curators_choice": "Curator's Choice",

            // ── Tour Cards ──
            "tour.ai_guide_name": "AI Tour Guide",
            "tour.ai_guide_desc": "Your personal interactive curator. Experience the museum with an AI that knows every secret of the pharaohs.",
            "tour.ai_guide_btn": "Start Tour",
            "tour.pharaoh_name": "Pharaoh Transformer",
            "tour.pharaoh_desc": "Ever wondered how you'd look as a King or Queen? Transform your image into an ancient Egyptian masterpiece.",
            "tour.pharaoh_btn": "Transform Me",
            "tour.chatbot_name": "Knowledge Chatbot",
            "tour.chatbot_desc": "Have a specific question? Our AI chatbot is available 24/7 to provide in-depth answers about the GEM.",
            "tour.chatbot_btn": "Ask Tutora",
            "tour.imagination_name": "AI Art Imagination",
            "tour.imagination_desc": "Manifest your own ancient visions. Generate stunning artwork inspired by Egyptian mythology and aesthetics.",
            "tour.imagination_btn": "Manifest Art",
            "tour.lab_name": "Tutora Laboratory",
            "tour.lab_desc": "Step into our digital lab. Use advanced AI tools to analyze, restore, and study ancient artworks in detail.",
            "tour.lab_btn": "Enter Lab",

            // ── Membership ──
            "membership.title": "Become a GEM Member",
            "membership.desc": "Join a community of history enthusiasts. Enjoy unlimited free admission, exclusive previews of new exhibitions, and discounts at our shops and restaurants.",
            "membership.btn": "Join Today",
            "membership.perk1": "Unlimited yearly access",
            "membership.perk2": "VIP fast-track entry",
            "membership.perk3": "20% discount on dining & shop",

            // ── Newsletter ──
            "newsletter.title": "Join the Royal Legacy",
            "newsletter.desc": "Subscribe to our newsletter and be the first to receive exclusive insights, world-class exhibition previews, and royal updates from the Grand Egyptian Museum.",
            "newsletter.placeholder": "Enter your email address",
            "newsletter.btn": "Subscribe",

            // ── Location ──
            "location.title": "Visit the GEM",
            "location.subtitle": "Experience the dawn of history at the foot of the Giza Pyramids.",
            "location.plan_route": "Plan Your Route",
            "location.visitor_info": "Visitor Info",
            "location.our_location": "Our Location",
            "location.address": "Alexandria Desert Road, Giza Plateau, Cairo, Egypt",
            "location.visiting_hours": "Visiting Hours",
            "location.hours_value": "Open Daily: 9:00 AM – 6:00 PM",

            // ── Footer ──
            "footer.explore": "Explore",
            "footer.tickets": "Tickets",
            "footer.collection": "Collection",
            "footer.exhibition": "Exhibition-Halls",
            "footer.membership": "Membership",
            "footer.dining": "Museum Dining",
            "footer.about": "About",
            "footer.history": "History",
            "footer.events": "Events",
            "footer.news": "News & Press",
            "footer.branding": "Branding",
            "footer.support": "Support",
            "footer.help": "Help",
            "footer.contact": "Get In Touch",
            "footer.feedback": "Feedback",
            "footer.accessibility": "Accessibility",
            "footer.connect": "Connect",
            "footer.social_desc": "Follow us on social media for updates and behind-the-scenes content.",
            "footer.privacy": "Privacy Policy",
            "footer.terms": "Terms of Service",
            "footer.cookies": "Cookie Settings",
            "footer.copyright": "© 2026 Tutora. All rights reserved.",

            // ── Amenities ──
            "amenity.restaurant": "Pyramid View Restaurant",
            "amenity.restaurant_desc": "Enjoy a premium dining experience with an unobstructed view of the Giza Pyramids.",
            "amenity.cafe": "The Grand Cafe",
            "amenity.cafe_desc": "Relax with freshly brewed coffee and pastries beside the Ramses II statue.",
            "amenity.gift": "Official Gift Shop",
            "amenity.gift_desc": "Take home a piece of history with our exclusive replicas and authentic souvenirs.",

            // ── Common ──
            "common.login": "Login",
            "common.loading": "Loading...",

            // ── Plan Your Visit ──
            "plan.hero_title": "Your Journey Through Time Begins Here.",
            "plan.hero_btn": "Book Your Ticket Now",
            "plan.tickets_title": "Purchase Your Tickets",
            "plan.intl_visitors": "International Visitors",
            "plan.local_nationals": "Egyptian / Arab Nationals",
            "plan.ticket_general": "General Admission",
            "plan.ticket_general_desc": "Access to Grand Staircase & Main Galleries",
            "plan.ticket_guided": "Guided Experience",
            "plan.ticket_guided_desc": "Expert-led journey through the ages",
            "plan.ticket_tut": "Tutankhamun Pass",
            "plan.ticket_tut_desc": "The ultimate historical immersion",
            "plan.buy_tickets": "Buy Tickets",
            "plan.per_adult": "per adult",
            "plan.itineraries_title": "Recommended Itineraries",
            "plan.itineraries_subtitle": "Make the most of your time with our curated guides.",
            "plan.planner_title": "AI-Powered Route Planner",
            "plan.planner_desc": "Tell us what you're interested in, and our AI will craft the perfect route through the museum for you. Discover hidden gems and make the most of your visit.",
            "plan.planner_placeholder": "e.g., Pharaohs, Mummies, Jewelry",
            "plan.planner_btn": "Generate My Route",
            "plan.visitor_info": "Visitor Information",
            "plan.opening_hours": "Opening Hours",
            "plan.location": "Location",
            "plan.getting_here": "Getting Here & Parking",
            "plan.public_transit": "Public Transit",
            "plan.transit_desc": "Take Metro Line 3 to the GEM station. Direct shuttle buses available from Tahrir Square.",
            "plan.taxi": "Taxi & Ride Share",
            "plan.taxi_desc": "Uber and taxis have a dedicated drop-off point at the Main Entrance.",
            "plan.parking": "Parking",
            "plan.parking_desc": "Secure underground parking available. $5 for half-day, $10 for full day. EV charging included.",
            "plan.before_arrive": "Before You Arrive",
            "plan.no_flash": "No Flash Photography",
            "plan.no_bags": "No Large Bags",
            "plan.food_cafes": "Food in Cafes Only",
            "plan.strollers": "Strollers Allowed",
            "plan.faq_title": "Frequently Asked Questions",

            // ── Kids Museum ──
            "kids.hero_badge": "The Oracle's Greeting",
            "kids.hero_title": "Welcome, Young Explorers!",
            "kids.hero_join": "Join the Explorer Club",
            "kids.hero_map": "View Map",
            "kids.lab_tag": "Interactive Challenges",
            "kids.lab_title": "Junior Laboratory",
            "kids.mission_time": "MINS",
            "kids.mission_1_name": "Turn your picture into a pharaoh",
            "kids.mission_1_type": "Quiz Adventure",
            "kids.mission_2_name": "Create from your imagination",
            "kids.mission_2_type": "Hidden Objects",
            "kids.mission_3_name": "Write your name in hieroglyphics",
            "kids.mission_3_type": "Secret Language",
            "kids.try_now": "Try it now",
            "kids.artifacts_title": "Kid-Friendly Artifacts",
            "kids.facts_title": "Ancient Fun Facts",
            "kids.quiz_title": "Pharaoh's Quiz",
            "kids.quiz_desc": "Hover over the cards to reveal the ancient answers!",
            "kids.sandpit_title": "Virtual Sandpit",
            "kids.sandpit_desc": "Hover over the sand to 'dig' and uncover hidden artifacts!",
            "kids.board_title": "Today's Awesome Activities!",
            "kids.cta_title": "Ready to earn your Golden Sarcophagus badge?",
            "kids.cta_desc": "Create your explorer profile today and track your progress.",
            "kids.cta_btn": "Sign Up Now",

            // ── About Page ──
            "about.hero_title": "About the Grand Egyptian Museum",
            "about.history_title": "A Journey Through Time: The Story of the GEM",
            "about.history_desc": "The Grand Egyptian Museum (GEM) is the culmination of a vision to create a world-class institution dedicated to the preservation and display of Egypt's rich Pharaonic heritage.",
            "about.vision_title": "The Vision",
            "about.vision_text": "The idea for a new, modern museum to house Egypt's vast collection of ancient artifacts was born, aiming to provide a worthy home for treasures like those of Tutankhamun.",
            "about.foundation_title": "Foundation Stone",
            "about.foundation_text": "The foundation stone of the Grand Egyptian Museum was officially laid by President Hosni Mubarak, marking the dawn of the most ambitious cultural project of the 21st century.",
            "about.architecture_title": "A Modern Marvel: The Architectural Splendor of the GEM",
            "about.architecture_desc": "The museum's design is a testament to architectural innovation, blending seamlessly with its historic surroundings while making a bold contemporary statement.",
            "about.staircase_title": "The Grand Staircase",
            "about.staircase_desc": "Ascend through the history of ancient Egypt on our monumental Grand Staircase. Spanning four levels, this architectural centerpiece showcases the chronological progression of Pharaonic art, leading you towards the breathtaking view of the Pyramids.",
            "about.guardians_title": "The Guardians of Heritage",
            "about.guardians_desc": "Meet the experts dedicated to preserving Egypt's legacy.",
            "about.future_title": "The Future is Tutora",
            "about.future_desc": "We are redefining the museum experience through digital innovation. Our AI-driven ecosystem bridges the gap between ancient history and modern audiences.",
            "about.sustainability_title": "Sustainability & Future-Proofing",
            "about.sustainability_desc": "The Grand Egyptian Museum is built to last centuries, not just for its monumental architecture, but through our commitment to environmental stewardship and digital preservation.",
            "about.partners_title": "Our Global Partners",
            "about.journey_title": "Ready to Journey Through Time?",
            "about.mission_title": "Our Commitment to Heritage and Humanity",
            "about.mission_desc": "The GEM's mission extends beyond exhibition. It is a global hub for conservation, research, and education, dedicated to safeguarding Egypt's legacy for future generations."
        },
        ar: {
            // ── التنقل ──
            "nav.home": "الرئيسية",
            "nav.plan": "خطط لزيارتك",
            "nav.kids": "متحف الأطفال",
            "nav.event": "الفعاليات",
            "nav.ai_experience": "تجربة الذكاء الاصطناعي",
            "nav.ai_guide": "المرشد السياحي الذكي",
            "nav.ai_chatbot": "روبوت المحادثة الذكي",
            "nav.ai_identifier": "محدد القطع الأثرية",
            "nav.ai_voice": "رواية صوتية ثلاثية الأبعاد",
            "nav.ai_lab": "مختبر توتورا",
            "nav.shop": "المتجر",
            "nav.about": "عن المتحف",
            "nav.collection": "المجموعة",
            "nav.main_gallery": "المعرض الرئيسي",
            "nav.exhibition": "قاعات العرض",
            "nav.booking": "الحجز",
            "nav.favorites": "المفضلة",
            "nav.language": "اللغة",
            "nav.search": "بحث...",

            // ── البطل ──
            "hero.discover": "اكتشف",
            "hero.museum_name": "المتحف المصري الكبير",
            "hero.subtitle": "استكشف أكبر مجموعة في العالم من الآثار المصرية القديمة مع مرشدك الشخصي بالذكاء الاصطناعي.",
            "hero.explore_tours": "استكشف الجولات",
            "hero.buy_tickets": "اشترِ التذاكر",

            // ── معلومات سريعة ──
            "info.hours_title": "ساعات العمل اليوم",
            "info.hours_value": "٩:٠٠ صباحاً - ٥:٠٠ مساءً",
            "info.tickets_title": "احصل على التذاكر",
            "info.tickets_value": "اشترِ عبر الإنترنت وتخطَّ الطابور",
            "info.directions_title": "الاتجاهات",
            "info.directions_value": "عرض خريطة المتحف ومواقف السيارات",
            "info.access_title": "إمكانية الوصول",
            "info.access_value": "وصول الكراسي المتحركة وعربات الأطفال",

            // ── الأقسام ──
            "section.featured": "تجارب مميزة",
            "section.whats_happening": "ما الجديد",
            "section.view_all": "عرض جميع الفعاليات",
            "section.identify": "تعرّف على القطع الأثرية مع",
            "section.identify_desc": "استخدم مرشدنا الذكي لمعرفة المزيد عن العجائب القديمة من حولك. التقط صورة أو ارفع صورة لبدء اكتشافك.",
            "section.take_photo": "التقط صورة",
            "section.upload_photo": "ارفع صورة",
            "section.gem_title": "المتحف المصري الكبير",
            "section.gem_desc": "المتحف المصري الكبير، المعروف أيضاً بمتحف الجيزة، هو متحف أثري جديد في الجيزة بمصر، من المقرر أن يصبح أكبر متحف أثري في العالم.",
            "section.learn_more": "اعرف المزيد",
            "section.dine_shop": "تناول الطعام وتسوّق",
            "section.dine_subtitle": "أكمل تجربتك مع مرافق عالمية المستوى",
            "section.curators_choice": "اختيار القيّم",

            // ── بطاقات الجولات ──
            "tour.ai_guide_name": "المرشد السياحي الذكي",
            "tour.ai_guide_desc": "مرشدك الشخصي التفاعلي. عش تجربة المتحف مع ذكاء اصطناعي يعرف كل أسرار الفراعنة.",
            "tour.ai_guide_btn": "ابدأ الجولة",
            "tour.pharaoh_name": "محول الفرعون",
            "tour.pharaoh_desc": "هل تساءلت كيف ستبدو كملك أو ملكة؟ حوّل صورتك إلى تحفة مصرية قديمة.",
            "tour.pharaoh_btn": "حوّلني",
            "tour.chatbot_name": "روبوت المعرفة",
            "tour.chatbot_desc": "لديك سؤال محدد؟ روبوت المحادثة الذكي متاح على مدار الساعة لتقديم إجابات معمقة عن المتحف.",
            "tour.chatbot_btn": "اسأل توتورا",
            "tour.imagination_name": "خيال الفن الذكي",
            "tour.imagination_desc": "اصنع رؤيتك القديمة. أنشئ أعمالاً فنية مذهلة مستوحاة من الأساطير والجماليات المصرية.",
            "tour.imagination_btn": "أنشئ فناً",
            "tour.lab_name": "مختبر توتورا",
            "tour.lab_desc": "ادخل مختبرنا الرقمي. استخدم أدوات الذكاء الاصطناعي المتقدمة لتحليل وترميم ودراسة الأعمال الفنية القديمة.",
            "tour.lab_btn": "ادخل المختبر",

            // ── العضوية ──
            "membership.title": "انضم لعضوية المتحف الكبير",
            "membership.desc": "انضم إلى مجتمع عشاق التاريخ. استمتع بدخول مجاني غير محدود ومعاينات حصرية للمعارض الجديدة وخصومات في متاجرنا ومطاعمنا.",
            "membership.btn": "انضم اليوم",
            "membership.perk1": "دخول سنوي غير محدود",
            "membership.perk2": "دخول سريع VIP",
            "membership.perk3": "خصم ٢٠٪ على الطعام والتسوق",

            // ── النشرة الإخبارية ──
            "newsletter.title": "انضم إلى الإرث الملكي",
            "newsletter.desc": "اشترك في نشرتنا الإخبارية وكن أول من يحصل على رؤى حصرية ومعاينات معارض عالمية وتحديثات ملكية من المتحف المصري الكبير.",
            "newsletter.placeholder": "أدخل بريدك الإلكتروني",
            "newsletter.btn": "اشترك",

            // ── الموقع ──
            "location.title": "زُر المتحف الكبير",
            "location.subtitle": "عش فجر التاريخ عند سفح أهرامات الجيزة.",
            "location.plan_route": "خطط لمسارك",
            "location.visitor_info": "معلومات الزائر",
            "location.our_location": "موقعنا",
            "location.address": "طريق إسكندرية الصحراوي، هضبة الجيزة، القاهرة، مصر",
            "location.visiting_hours": "ساعات الزيارة",
            "location.hours_value": "مفتوح يومياً: ٩:٠٠ صباحاً – ٦:٠٠ مساءً",

            // ── التذييل ──
            "footer.explore": "استكشف",
            "footer.tickets": "التذاكر",
            "footer.collection": "المجموعة",
            "footer.exhibition": "قاعات العرض",
            "footer.membership": "العضوية",
            "footer.dining": "مطاعم المتحف",
            "footer.about": "عن المتحف",
            "footer.history": "التاريخ",
            "footer.events": "الفعاليات",
            "footer.news": "الأخبار والصحافة",
            "footer.branding": "الهوية البصرية",
            "footer.support": "الدعم",
            "footer.help": "المساعدة",
            "footer.contact": "تواصل معنا",
            "footer.feedback": "الملاحظات",
            "footer.accessibility": "إمكانية الوصول",
            "footer.connect": "تواصل",
            "footer.social_desc": "تابعنا على وسائل التواصل الاجتماعي للحصول على التحديثات والمحتوى الحصري.",
            "footer.privacy": "سياسة الخصوصية",
            "footer.terms": "شروط الخدمة",
            "footer.cookies": "إعدادات ملفات تعريف الارتباط",
            "footer.copyright": "© ٢٠٢٦ توتورا. جميع الحقوق محفوظة.",

            // ── المرافق ──
            "amenity.restaurant": "مطعم إطلالة الأهرام",
            "amenity.restaurant_desc": "استمتع بتجربة طعام فاخرة مع إطلالة بلا عوائق على أهرامات الجيزة.",
            "amenity.cafe": "المقهى الكبير",
            "amenity.cafe_desc": "استرخِ مع قهوة طازجة ومعجنات بجانب تمثال رمسيس الثاني.",
            "amenity.gift": "متجر الهدايا الرسمي",
            "amenity.gift_desc": "خذ معك قطعة من التاريخ مع نسخنا الحصرية والتذكارات الأصلية.",

            // ── عام ──
            "common.login": "تسجيل الدخول",
            "common.loading": "جارٍ التحميل...",

            // ── خطط لزيارتك ──
            "plan.hero_title": "رحلتك عبر الزمن تبدأ من هنا.",
            "plan.hero_btn": "احجز تذكرتك الآن",
            "plan.tickets_title": "اشترِ تذاكرك",
            "plan.intl_visitors": "الزوار الأجانب",
            "plan.local_nationals": "المصريون / العرب",
            "plan.ticket_general": "دخول عام",
            "plan.ticket_general_desc": "دخول الدرج العظيم والقاعات الرئيسية",
            "plan.ticket_guided": "تجربة مع مرشد",
            "plan.ticket_guided_desc": "رحلة يقودها خبراء عبر العصور",
            "plan.ticket_tut": "بطاقة توت عنخ آمون",
            "plan.ticket_tut_desc": "الانغماس التاريخي الأمثل",
            "plan.buy_tickets": "شراء التذاكر",
            "plan.per_adult": "للبالغ الواحد",
            "plan.itineraries_title": "مسارات مقترحة",
            "plan.itineraries_subtitle": "حقق أقصى استفادة من وقتك مع أدلتنا المنسقة.",
            "plan.planner_title": "مخطط المسار بالذكاء الاصطناعي",
            "plan.planner_desc": "أخبرنا بما يهمك، وسيقوم ذكاؤنا الاصطناعي بتصميم المسار المثالي لك عبر المتحف. اكتشف الجواهر الخفية وحقق أقصى استفادة من زيارتك.",
            "plan.planner_placeholder": "مثلاً: الفراعنة، المومياوات، المجوهرات",
            "plan.planner_btn": "أنشئ مساري",
            "plan.visitor_info": "معلومات الزائر",
            "plan.opening_hours": "ساعات العمل",
            "plan.location": "الموقع",
            "plan.getting_here": "الوصول والمواقف",
            "plan.public_transit": "النقل العام",
            "plan.transit_desc": "استقل الخط الثالث للمترو إلى محطة المتحف المصري الكبير. تتوفر حافلات نقل مباشرة من ميدان التحرير.",
            "plan.taxi": "التاكسي والنقل الذكي",
            "plan.taxi_desc": "أوبر والتاكسي لديهم نقطة إنزال مخصصة عند المدخل الرئيسي.",
            "plan.parking": "مواقف السيارات",
            "plan.parking_desc": "تتوفر مواقف سيارات آمنة تحت الأرض. ٥ دولارات لنصف يوم، ١٠ دولارات ليوم كامل. شحن السيارات الكهربائية مشمول.",
            "plan.before_arrive": "قبل وصولك",
            "plan.no_flash": "ممنوع التصوير بالفلاش",
            "plan.no_bags": "ممنوع الحقائب الكبيرة",
            "plan.food_cafes": "الطعام في المقاهي فقط",
            "plan.strollers": "يسمح بعربات الأطفال",
            "plan.faq_title": "الأسئلة الشائعة",

            // ── متحف الأطفال ──
            "kids.hero_badge": "تحية الكاهن",
            "kids.hero_title": "مرحباً بكم، أيها المستكشفون الصغار!",
            "kids.hero_join": "انضم إلى نادي المستكشفين",
            "kids.hero_map": "عرض الخريطة",
            "kids.lab_tag": "تحديات تفاعلية",
            "kids.lab_title": "المختبر الصغير",
            "kids.mission_time": "دقائق",
            "kids.mission_1_name": "حول صورتك إلى فرعون",
            "kids.mission_1_type": "مغامرة الاختبار",
            "kids.mission_2_name": "ابتكر من خيالك",
            "kids.mission_2_type": "الأشياء المخفية",
            "kids.mission_3_name": "اكتب اسمك بالهيروغليفية",
            "kids.mission_3_type": "اللغة السرية",
            "kids.try_now": "جربها الآن",
            "kids.artifacts_title": "قطع أثرية للأطفال",
            "kids.facts_title": "حقائق ممتعة قديمة",
            "kids.quiz_title": "اختبار الفرعون",
            "kids.quiz_desc": "مرر الماوس فوق البطاقات للكشف عن الإجابات القديمة!",
            "kids.sandpit_title": "حفرة الرمل الافتراضية",
            "kids.sandpit_desc": "مرر فوق الرمل لـ 'الحفر' والكشف عن القطع الأثرية المخفية!",
            "kids.board_title": "أنشطة اليوم الرائعة!",
            "kids.cta_title": "هل أنت مستعد للحصول على شارة التابوت الذهبي؟",
            "kids.cta_desc": "أنشئ ملف المستكشف الخاص بك اليوم وتتبع تقدمك.",
            "kids.cta_btn": "سجل الآن",

            // ── صفحة عن المتحف ──
            "about.hero_title": "عن المتحف المصري الكبير",
            "about.history_title": "رحلة عبر الزمن: قصة المتحف المصري الكبير",
            "about.history_desc": "المتحف المصري الكبير هو نتاج رؤية لإنشاء مؤسسة عالمية مخصصة للحفاظ على التراث الفرعوني الغني لمصر وعرضه.",
            "about.vision_title": "الرؤية",
            "about.vision_text": "ولدت فكرة إنشاء متحف جديد وحديث لاستيعاب مجموعة مصر الهائلة من القطع الأثرية القديمة، بهدف توفير موطن يليق بكنوز مثل كنوز توت عنخ آمون.",
            "about.foundation_title": "حجر الأساس",
            "about.foundation_text": "وضع الرئيس حسني مبارك حجر الأساس للمتحف المصري الكبير رسمياً، إيذاناً بفجر أكثر المشاريع الثقافية طموحاً في القرن الحادي والعشرين.",
            "about.architecture_title": "معجزة حديثة: الروعة المعمارية للمتحف المصري الكبير",
            "about.architecture_desc": "تصميم المتحف هو شهادة على الابتكار المعماري، حيث يمتزج بسلاسة مع محيطه التاريخي مع تقديم لمسة معاصرة جريئة.",
            "about.staircase_title": "الدرج العظيم",
            "about.staircase_desc": "ارتقِ عبر تاريخ مصر القديمة على درجنا العظيم التذكاري. يمتد هذا المركز المعماري على أربعة مستويات، ويعرض التطور الزمني للفن الفرعوني، مما يقودك نحو الإطلالة الخلابة على الأهرامات.",
            "about.guardians_title": "حراس التراث",
            "about.guardians_desc": "تعرف على الخبراء المكرسين للحفاظ على إرث مصر.",
            "about.future_title": "المستقبل هو توتورا",
            "about.future_desc": "نحن نعيد تعريف تجربة المتحف من خلال الابتكار الرقمي. يجسد نظامنا البيئي المدعوم بالذكاء الاصطناعي الفجوة بين التاريخ القديم والجمهور الحديث.",
            "about.sustainability_title": "الاستدامة والمستقبل",
            "about.sustainability_desc": "تم بناء المتحف المصري الكبير ليدوم لقرون، ليس فقط من خلال هندسته المعمارية الضخمة، ولكن من خلال التزامنا بالإشراف البيئي والحفاظ الرقمي.",
            "about.partners_title": "شركاؤنا العالميون",
            "about.journey_title": "هل أنت مستعد لرحلة عبر الزمن؟",
            "about.mission_title": "التزامنا بالتراث والإنسانية",
            "about.mission_desc": "تمتد مهمة المتحف إلى ما هو أبعد من العرض. إنه مركز عالمي للحفاظ والبحث والتعليم، مكرس لحماية إرث مصر للأجيال القادمة."
        }
    };

    // ─── TRANSLATION CACHE ─────────────────────────────────────
    let translationsCache = {};
    let currentLang = localStorage.getItem('language') || 'en';

    // ─── API: Get all translations at once ─────────────────────
    async function fetchAllTranslations() {
        try {
            const res = await fetch(`${API_BASE}/lang/all/translations`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // Expecting { en: {...}, ar: {...} } or { translations: { en: {...}, ar: {...} } }
            translationsCache = data.translations || data;
            console.log('✓ Translations loaded from API (all)');
            return translationsCache;
        } catch (err) {
            console.warn('⚠ /api/lang/all/translations failed, using local fallback:', err.message);
            translationsCache = LOCAL_TRANSLATIONS;
            return translationsCache;
        }
    }

    // ─── API: Get translations for a specific language ─────────
    async function fetchLangTranslations(langCode) {
        try {
            const res = await fetch(`${API_BASE}/lang/${langCode}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // Expecting { key: value, ... } or { translations: { key: value } } or { lang: "en", data: {...} }
            const translations = data.translations || data.data || data;
            translationsCache[langCode] = translations;
            console.log(`✓ Translations loaded from API for: ${langCode}`);
            return translations;
        } catch (err) {
            console.warn(`⚠ /api/lang/${langCode} failed, using local fallback:`, err.message);
            translationsCache[langCode] = LOCAL_TRANSLATIONS[langCode] || LOCAL_TRANSLATIONS.en;
            return translationsCache[langCode];
        }
    }

    // ─── API: Get translations based on Accept-Language header ──
    async function fetchHeaderBasedTranslations() {
        try {
            const res = await fetch(`${API_BASE}/lang`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': currentLang
                }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const translations = data.translations || data.data || data;
            const detectedLang = data.lang || data.language || currentLang;
            translationsCache[detectedLang] = translations;
            console.log(`✓ Translations loaded from API (header-based): ${detectedLang}`);
            return translations;
        } catch (err) {
            console.warn('⚠ /api/lang (header) failed, using local fallback:', err.message);
            return LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS.en;
        }
    }

    // ─── GET TRANSLATION ───────────────────────────────────────
    function t(key) {
        const langData = translationsCache[currentLang] || LOCAL_TRANSLATIONS[currentLang] || LOCAL_TRANSLATIONS.en;
        return langData[key] || LOCAL_TRANSLATIONS.en[key] || key;
    }

    // ─── APPLY TRANSLATIONS TO DOM ─────────────────────────────
    function applyTranslations() {
        // 1. Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key);
            
            // Handle input placeholders
            if (el.tagName === 'INPUT' && el.type !== 'submit') {
                el.placeholder = translated;
            } else {
                el.textContent = translated;
            }
        });

        // 2. Update data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        // 3. Update data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = t(key);
        });

        // 4. Update data-i18n-html (for elements with inner HTML including icons)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translated = t(key);
            // Preserve child elements (like icons), only update text nodes
            const childElements = Array.from(el.children);
            el.textContent = translated;
            childElements.forEach(child => el.prepend(child));
        });

        // 5. Set document direction and lang attribute
        const htmlEl = document.documentElement;
        htmlEl.setAttribute('lang', currentLang);
        htmlEl.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', currentLang === 'ar');
        document.body.classList.toggle('ltr', currentLang !== 'ar');

        // 6. Update active state and indicators on language buttons
        document.querySelectorAll('.language-toggle button').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', lang === currentLang);
        });

        // Update indicators on toggle buttons
        const allLangBtns = document.querySelectorAll('#langBtn, #menuLangBtn');
        allLangBtns.forEach(btn => {
            btn.setAttribute('data-current-lang', currentLang);
            btn.title = currentLang === 'ar' ? 'English' : 'العربية';
        });

        // 7. Dispatch event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: currentLang, translations: translationsCache[currentLang] }
        }));

        console.log(`✓ UI translated to: ${currentLang}`);
    }

    // ─── SWITCH LANGUAGE ───────────────────────────────────────
    async function switchLanguage(langCode) {
        if (!langCode || langCode === currentLang) return;
        
        currentLang = langCode;
        localStorage.setItem('language', langCode);

        // Try API first, then fallback
        if (!translationsCache[langCode]) {
            await fetchLangTranslations(langCode);
        }

        applyTranslations();
    }

    // ─── TOGGLE LANGUAGE (EN ↔ AR) ────────────────────────────
    function toggleLanguage() {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        switchLanguage(newLang);
    }

    // ─── INITIALIZE ────────────────────────────────────────────
    async function initLanguageSystem() {
        // 1. Load translations (try all-at-once first, then specific)
        const allData = await fetchAllTranslations();
        
        // If all-at-once didn't work well, try specific language
        if (!allData[currentLang] || Object.keys(allData[currentLang] || {}).length === 0) {
            await fetchLangTranslations(currentLang);
        }

        // 2. Apply to current page
        applyTranslations();

        // 3. Bind language toggle buttons in footer
        document.querySelectorAll('.language-toggle button[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });

        // 4. Bind header langBtn (toggle EN ↔ AR)
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            langBtn.setAttribute('data-current-lang', currentLang);
            langBtn.title = currentLang === 'ar' ? 'English' : 'العربية';
            
            langBtn.onclick = (e) => {
                e.preventDefault();
                toggleLanguage();
            };
        }

        // 5. Bind mobile menu langBtn
        const menuLangBtn = document.getElementById('menuLangBtn');
        if (menuLangBtn) {
            menuLangBtn.setAttribute('data-current-lang', currentLang);
            menuLangBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLanguage();
            });
        }

        console.log(`✓ Language System initialized: ${currentLang}`);
    }

    // ─── EXPOSE GLOBALLY ───────────────────────────────────────
    window.TutoraLang = {
        init: initLanguageSystem,
        switchTo: switchLanguage,
        toggle: toggleLanguage,
        translate: t,
        getCurrentLang: () => currentLang,
        fetchAll: fetchAllTranslations,
        fetchLang: fetchLangTranslations,
        fetchByHeader: fetchHeaderBasedTranslations,
        applyTranslations: applyTranslations,
        LOCAL_TRANSLATIONS: LOCAL_TRANSLATIONS
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSystem);
    } else {
        initLanguageSystem();
    }

})();
