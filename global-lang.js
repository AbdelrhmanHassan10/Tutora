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
        : 'https://gem-backend-production-1ea2.up.railway.app/api';

    // ─── LOCAL FALLBACK TRANSLATIONS ──────────────────────────────
    const LOCAL_TRANSLATIONS = {
        en: {
            "cb.hero_badge": "AI-Powered Museum Guide",
            "cb.hero_title": "Chat with",
            "cb.hero_title_span": "TUTORA",
            "cb.hero_sub": "Ask anything about ancient Egypt, explore the Grand Egyptian Museum, and uncover 7,000 years of history — all through a conversation.",
            "cb.hero_cta": "Start Chatting",
            "cb.new_chat": "New Chat",
            "cb.recent_conv": "Recent Conversations",
            "cb.no_past_chats": "No past chats yet",
            "cb.ai_name": "TUTORA AI",
            "cb.ai_status": "Online — Ready to explore",
            "cb.welcome_msg": "Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.",
            "cb.just_now": "Just now",
            "cb.sug_1": "Mask of Tutankhamun",
            "cb.sug_2": "Pyramid Construction",
            "cb.sug_3": "Rosetta Stone",
            "cb.sug_4": "Plan My Visit",
            "cb.input_placeholder": "Ask Tutora anything about ancient Egypt...",
            "cb.disclaimer": "Tutora AI may produce inaccurate information. Verify important facts.",
            "cb.meet_title": "Meet",
            "cb.pers_1_title": "The Historian",
            "cb.pers_1_desc": "Expert on every dynasty, pharaoh, and artifact — from the Old Kingdom to the Ptolemaic era. Ask complex historical questions confidently.",
            "cb.pers_2_title": "The Navigator",
            "cb.pers_2_desc": "Knows every gallery, exhibit, and hidden corner of the Grand Egyptian Museum. Get turn-by-turn guidance to any artifact.",
            "cb.pers_3_title": "The Quiz Master",
            "cb.pers_3_desc": "Challenge yourself with AI-generated quizzes on Egyptian mythology, archaeology, and the museum's 100,000+ artifacts.",
            "cb.pers_4_title": "The Kids Guide",
            "cb.pers_4_desc": "Simplified, fun explanations with emoji, animations, and games designed for young explorers aged 6–14.",
            "cb.cap_title": "What I Can",
            "cb.cap_title_span": "Do",
            "cb.cap_1_title": "Historical Deep Dives",
            "cb.cap_1_desc": "Ask about any dynasty, pharaoh, or artifact — from the Old Kingdom to the Ptolemaic period — and receive rich, sourced answers.",
            "cb.cap_2_title": "Image Recognition",
            "cb.cap_2_desc": "Upload any photo of an artifact, hieroglyph, or site, and I'll identify it and share its historical context instantly.",
            "cb.cap_3_title": "Interactive Quizzes",
            "cb.cap_3_desc": "Test your knowledge with AI-generated quizzes about Egyptian mythology, archaeology, and the GEM collection.",
            "cb.cap_4_title": "Educational Summaries",
            "cb.cap_4_desc": "Get age-appropriate explanations for students, researchers, or casual visitors with adjustable complexity levels.",
            "cb.cap_5_title": "Trip Planning",
            "cb.cap_5_desc": "Let me help you plan your visit — from must-see galleries to dining recommendations based on your interests.",
            "cb.cap_6_title": "Multilingual Support",
            "cb.cap_6_desc": "Chat in Arabic, English, French, Spanish, German, or Japanese — I adapt to your preferred language in real time.",
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
            
            // ── Events ──
            "event.month_oct": "Oct",
            "event.month_nov": "Nov",
            "event.e1_title": "New Kingdom Exhibition Opens",
            "event.e1_desc": "Explore newly uncovered artifacts from the Valley of the Kings.",
            "event.e2_title": "Kids Workshop: Papyrus Making",
            "event.e2_desc": "A hands-on experience for children to learn ancient Egyptian crafts.",
            "event.e3_title": "Curator Talk: Life of Ramses II",
            "event.e3_desc": "Join Dr. Zahi Hawass for an exclusive evening discussing Ramses the Great.",

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
            "footer.title": "Grand Egyptian Museum",
            "aig.hero_title": "\"I am Tutora. How shall we explore the secrets of the Nile today?\"",
            "aig.hero_sub": "Your digital guide to the wonders of the Grand Egyptian Museum.",
            "aig.hud_link": "Neural Link",
            "aig.hud_active": "Active 100%",
            "aig.hud_core": "Core Status",
            "aig.hud_opt": "Optimal",
            "aig.btn_talk": "Talk to me",
            "aig.btn_stop": "Stop Sound",
            "aig.qa_1": "Who built the Great Pyramids?",
            "aig.qa_2": "Tell me about Tutankhamun's gold mask",
            "aig.qa_3": "Where is the Grand Staircase?",
            "aig.qa_4": "How can I see artifacts in 3D?",
            "aig.qa_5": "Tell me about the Rosetta Stone",
            "aig.trans_title": "Recent Context",
            "aig.trans_user": "User",
            "aig.trans_q": "\"Where is the Rossetta Stone located?\"",
            "aig.trans_ai": "Tutora",
            "aig.trans_a": "\"It's currently in the British Museum, but I can show you a high-fidelity holographic projection of it right here in the Digital Gallery.\"",
            "aig.how_title": "How It",
            "aig.how_title_span": "Works",
            "aig.how_1_title": "Speak or Type",
            "aig.how_1_desc": "Ask Tutora anything — from \"Where is Tutankhamun's mask?\" to \"Tell me about the Book of the Dead\" — in Arabic or English.",
            "aig.how_2_title": "AI Understands Context",
            "aig.how_2_desc": "Our neural model processes your question using 15,000+ curated Egyptological data points and real-time museum mapping.",
            "aig.how_3_title": "Guided Response",
            "aig.how_3_desc": "Receive a spoken response with navigation overlay, historical context, and links to related 3D artifacts in our digital collection.",
            "aig.cap_title": "Tutora's",
            "aig.cap_title_span": "Capabilities",
            "aig.cap_1_title": "Multilingual",
            "aig.cap_1_desc": "Fluent in Arabic, English, French, Spanish, German, Japanese, and Mandarin with real-time translation.",
            "aig.cap_2_title": "Navigation",
            "aig.cap_2_desc": "Turn-by-turn indoor directions to any gallery, artifact, restroom, or dining venue within the museum.",
            "aig.cap_3_title": "Deep History",
            "aig.cap_3_desc": "Every response draws from peer-reviewed Egyptological research, updated quarterly by our curatorial team.",
            "aig.cap_4_title": "AR Overlays",
            "aig.cap_4_desc": "Point your camera at any artifact and Tutora overlays hieroglyphic translations, dates, and dynasty context.",
            "aig.cap_5_title": "Kids Mode",
            "aig.cap_5_desc": "A special interactive mode with simplified language, fun quizzes, and animated pharaoh characters for young explorers.",
            "aig.cap_6_title": "Accessible",
            "aig.cap_6_desc": "Full screen-reader support, sign language video responses, and adjustable speech speed for all visitors.",
            "aig.stat_1": "Guided Tours Completed",
            "aig.stat_2": "Visitor Satisfaction",
            "aig.stat_3": "Data Points in Knowledge Base",
            "aig.stat_4": "Languages Supported",
            "evt.hero_badge": "Featured Exhibition",
            "evt.hero_title": "The Majesty of Tutankhamun",
            "evt.hero_desc": "Experience the golden age of the pharaohs in our newest immersive exhibition. Discover over 5,000 treasures from the Boy King's tomb.",
            "evt.hero_btn_book": "Book Tickets Now",
            "evt.hero_btn_learn": "Learn More",
            "evt.filter_all": "All Events",
            "evt.filter_exhibitions": "Exhibitions",
            "evt.filter_workshops": "Workshops",
            "evt.filter_cultural": "Cultural Nights",
            "evt.c1_badge": "Selling Fast",
            "evt.c1_date": "Oct 12 - Dec 20, 2023",
            "evt.c1_title": "The Golden King: Artifacts of a Legend",
            "evt.c1_desc": "A rare collection of personal jewelry and protective amulets recovered from the royal valley.",
            "evt.c1_loc": "Gallery 4 • Premium",
            "evt.btn_view_details": "View Details",
            
            "evt.c2_badge": "Selling Fast",
            "evt.c3_badge": "Selling Fast",
            "evt.c5_badge": "Selling Fast",
            "evt.c6_badge": "Selling Fast",
            "evt.c2_date": "Every Saturday",
            "evt.c2_title": "Papyrus Making Workshop",
            "evt.c2_desc": "Learn the ancient art of paper production using Nile River reeds under expert guidance.",
            "evt.c2_loc": "Education Center",
            "evt.c3_date": "Nightly • 8:00 PM",
            "evt.c3_title": "Sphinx Sound & Light Show",
            "evt.c3_desc": "A spectacular journey through 5,000 years of history projected onto the ancient monuments.",
            "evt.c3_loc": "Main Plaza • Outdoor",
            "evt.c4_badge": "Permanent Collection",
            "evt.c4_title": "Ramses the Great: Life & Legacy",
            "evt.c4_desc": "Dedicated to Egypt's longest-reigning pharaoh, featuring the colossal statue from Memphis.",
            "evt.c4_loc": "Atrium • Historic",
            "evt.c5_date": "Nov 05 • 2:00 PM",
            "evt.c5_title": "Egyptian Hieroglyphs 101",
            "evt.c5_desc": "An introductory lecture on deciphering the sacred carvings of the Old Kingdom.",
            "evt.c5_loc": "Library Wing",
            "evt.c6_date": "Nov 10 • 6:30 PM",
            "evt.c6_title": "Nile Sunset Jazz Sessions",
            "evt.c6_desc": "Enjoy contemporary jazz fusion as the sun sets over the pyramids from our garden terrace.",
            "evt.c6_loc": "Museum Gardens",
            "evt.c7_badge": "Exclusive",
            "evt.c7_date": "Every Friday",
            "evt.c7_title": "The Grand Discovery Tour",
            "evt.c7_desc": "Join our expert archaeologists on an exclusive behind-the-scenes look at newly excavated pharaonic treasures.",
            "evt.c7_loc": "The Grand Hall",
            "evt.c8_date": "Dec 01 • 9:00 AM",
            "evt.c8_title": "Ancient Board Games Tournament",
            "evt.c8_desc": "Challenge yourself and learn the rules of Senet and Mehen in this interactive historical gaming event.",
            "evt.c8_loc": "Children's Museum",
            "evt.c9_badge": "Limited Sizes",
            "evt.c9_date": "Sunday • 5:30 AM",
            "evt.c9_title": "Sunrise Yoga by the Pyramids",
            "evt.c9_desc": "Find inner peace with a guided yoga session facing the Great Pyramids at dawn.",
            "evt.c9_loc": "Outdoor Terrace",
            "evt.exp_tag": "Expert Voices",
            "evt.exp_title": "Meet Our Curators & Speakers",
            "evt.dr1_name": "Dr. Zahi Hawass",
            "evt.dr1_role": "Lead Archaeologist",
            "evt.dr1_desc": "Renowned archaeologist and the former Minister of State for Antiquities Affairs.",
            "evt.dr1_quote": "The Grand Egyptian Museum is the most important cultural project in the world in the 21st century. It is Egypt's gift to humanity.",
            "evt.dr2_name": "Dr. Hussein Kamal",
            "evt.dr2_role": "Head of Conservation",
            "evt.dr2_desc": "Directing the world's most advanced archaeological conservation center at GEM.",
            "evt.dr2_quote": "Our conservation center is a lighthouse of science, ensuring that every artifact is preserved with the highest standards known to man.",
            "evt.dr3_name": "Dr. Ahmed Ghoneim",
            "evt.dr3_role": "CEO of GEM",
            "evt.dr3_desc": "Leading the GEM's mission as a global cultural hub and educational institution.",
            "evt.dr3_quote": "\"We are not just a museum; we are a symbol of global cooperation and a bridge between ancient legacy and future innovation.\"",
            "evt.news_title": "Join Our Community",
            "evt.news_desc": "Stay updated with the latest event announcements, exclusive curator talks, and exhibition openings delivered directly to your inbox.",
            "evt.news_btn": "Subscribe Now",
            "evt.news_policy": "By subscribing, you agree to our Privacy Policy and Terms of Service.",

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
            // ── Auth & Landing ──
            "auth.login": "Log In",
            "auth.signup": "Sign Up",
            "auth.google": "Google",
            "auth.apple": "Apple",
            "auth.or": "Or",
            "auth.email_label": "Email Address",
            "auth.email_placeholder": "Enter your email",
            "auth.password_label": "Password",
            "auth.password_placeholder": "Enter your password",
            "auth.forgot_password": "Forgot?",
            "auth.fullname_label": "Full Name",
            "auth.fullname_placeholder": "Enter your full name",
            "auth.confirm_password_label": "Confirm Password",
            "auth.confirm_password_placeholder": "Confirm your password",
            "auth.create_account": "Create Account",
            
            "landing.meet": "Meet",
            "landing.subtitle": "Your Personal AI Guide to Antiquity",
            "landing.desc": "Experience the Grand Egyptian Museum like never before. Our advanced neural engine brings history to life, answering every curiosity through the lens of time.",
            "landing.start_exp": "Start Your Experience",

            "login.hero_title": "Welcome Back to<br>Eternity",
            "login.hero_subtitle": "The wisdom of ancestors is ready. <span class=\"brand-namee\">Tutora</span> awaits your return.",
            "login.form_title": "Enter the Sanctuary",
            "login.form_subtitle": "Re-awaken your journey through the royal history.",
            "login.new_member": "New to the museum?",

            "register.hero_title": "Awaken Your<br>Pharaonic Legacy",
            "register.hero_subtitle": "Step into eternity. <span class=\"brand-namee\">Tutora</span> awaits to guide you through the wisdom of ancestors.",
            "register.form_title": "Join the Dynasty",
            "register.form_subtitle": "Your royal journey through history begins here.",
            "register.already_member": "Already a member?",
            "register.terms": "By signing up, you agree to our <a href=\"../Terms-of-Service/term-of-service.html\" class=\"signup-link\"> <br> Terms of Service</a> <br> and <a href=\"../Privacy-policy/Privacy-Policy.html\" class=\"signup-link\">Privacy Policy</a>.",


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
            "plan.recommended_badge": "Recommended for Explorers",
            "plan.feat_staircase": "Grand Staircase & Statues",
            "plan.feat_halls": "Main Exhibition Halls",
            "plan.feat_valid": "Valid for one full day",
            "plan.feat_guide": "2-hour expert human guide",
            "plan.feat_priority": "Priority Access to Galleries",
            "plan.feat_includes": "Includes General Admission",
            "plan.feat_tut_gallery": "Tutankhamun Immersive Gallery",
            "plan.feat_all_halls": "All Main Halls & Staircase",
            "plan.feat_kids": "Access to Kids Museum",
            "info.access_title": "Accessibility",
            "info.access_value": "Fully accessible for all visitors",
            "plan.address": "Giza, Egypt",
            "plan.itineraries_title": "Recommended Itineraries",
            "plan.itineraries_subtitle": "Make the most of your time with our curated guides.",
            "plan.itin1_time": "2 Hours",
            "plan.itin1_title": "The Highlights Tour",
            "plan.itin1_desc": "Perfect for those on a tight schedule. See the essential masterpieces.",
            "plan.itin_start": "Start:",
            "plan.itin1_start": "The Grand Staircase",
            "plan.itin_middle": "Middle:",
            "plan.itin1_mid": "Tutankhamun's Mask",
            "plan.itin_end": "End:",
            "plan.itin1_end": "Royal Mummies Hall",
            "plan.itin1_btn": "Choose General Admission",
            "plan.itin_popular": "Most Popular",
            "plan.itin2_time": "Half Day (4-5 Hours)",
            "plan.itin2_title": "The Explorer Experience",
            "plan.itin2_desc": "Dive deeper into the history with time for relaxation.",
            "plan.itin_morning": "Morning:",
            "plan.itin2_morn": "Main Exhibition Galleries",
            "plan.itin_lunch": "Lunch:",
            "plan.itin2_lunch": "Pyramid View Restaurant",
            "plan.itin_afternoon": "Afternoon:",
            "plan.itin2_aft": "Pharaoh Transformer Exhibit",
            "plan.itin2_btn": "Choose Guided Experience",
            "plan.itin3_time": "Full Day",
            "plan.itin3_title": "The Complete GEM",
            "plan.itin3_desc": "Immerse yourself completely. Includes all special exhibitions.",
            "plan.itin3_morn": "All Main Galleries",
            "plan.itin3_lunch": "Grand Cafe & Gift Shop",
            "plan.itin3_aft": "Kids Museum & Interactive 3D Voice",
            "plan.itin3_btn": "Choose Tutankhamun Pass",
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
            "plan.faq_q1": "Can I buy tickets at the door?",
            "plan.faq_a1": "Yes, but we highly recommend purchasing online to skip the line. General admission tickets are subject to availability.",
            "plan.faq_q2": "Are guided tours available?",
            "plan.faq_a2": "Yes! Our expert human guides and AI guides support over 12 languages including English and Arabic.",
            "plan.faq_q3": "Are there discounts for students?",
            "plan.faq_a3": "Yes, students with a valid ISIC or local ID enjoy a 50% discount on general admission.",
            "plan.faq_q4": "Do children need tickets?",
            "plan.faq_a4": "Children under 6 enter free. Those aged 6-12 require a discounted child ticket.",
            "plan.faq_q5": "What is the policy on photography?",
            "plan.faq_a5": "Personal non-flash mobile photography is free. Professional cameras and tripods require a permit.",
            
            // ── Footer Links ──
            "footer.link_tickets": "Tickets",
            "footer.link_collection": "Collection",
            "footer.link_exhibition": "Exhibition-Halls",
            "footer.link_membership": "Membership",
            "footer.link_dining": "Museum Dining",
            "footer.link_history": "History",
            "footer.link_events": "Events",
            "footer.link_news": "News & Press",
            "footer.link_branding": "Branding",
            "footer.link_help": "Help",
            "footer.link_get_in_touch": "Get In Touch",
            "footer.link_feedback": "Feedback",
            "footer.link_accessibility": "Accessibility",

            // ── Kids Museum ──
            "kids.hero_badge": "The Oracle's Greeting",
            "kids.hero_title": "Welcome, Young <span style=\"color: #ecb613;\">Explorers!</span>",
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
            "kids.cta_title": "Ready to earn your <span style=\"color: #ecb613;\">Golden Sarcophagus</span> badge?",
            "kids.cta_desc": "Create your explorer profile today and track your progress.",
            "kids.cta_btn": "Sign Up Now",
            "kids.art1_name": "Golden Tut Mask",
            "kids.art1_desc": "The most famous mask in the world, now with a friendly smile for young explorers!",
            "kids.art2_name": "Ramses the Great",
            "kids.art2_desc": "Meet the mightiest Pharaoh! He built giant statues and was a great leader of Egypt.",
            "kids.art3_name": "The Smiling Sphinx",
            "kids.art3_desc": "A lion with a human head! He guards the pyramids and loves solving riddles with kids.",
            "kids.art4_name": "Queen Nefertari",
            "kids.art4_desc": "The most beautiful queen! She was very kind and lived in a palace full of magic and art.",
            "kids.art5_name": "Magical Blue Hippo",
            "kids.art5_desc": "This little blue hippo is named William. He loves swimming in the Nile and hiding in flowers!",
            "kids.art6_name": "Anubis the Puppy",
            "kids.art6_desc": "The guardian of secrets! He looks like a friendly puppy but he's actually a powerful protector.",
            "kids.art7_name": "Bastet the Cat",
            "kids.art7_desc": "Meet the goddess of joy and protection! She's a very fast and smart cat who loves to play.",
            "kids.art8_name": "Queen Hatshepsut",
            "kids.art8_desc": "One of the most powerful female Pharaohs! She built the most beautiful temple and led a peaceful time of building and trading.",
            "kids.art9_name": "King Khufu",
            "kids.art9_desc": "The builder of the Great Pyramid! He was a very wise king who built the tallest building in the ancient world. It's made of millions of stones!",
            "kids.art10_name": "Thutmose the Brave",
            "kids.art10_desc": "The Napoleon of Ancient Egypt! He was a brave warrior king who won 17 battles and never lost once. He was super smart!",
            "kids.badge_explorer": "Explorer's Pick",
            "kids.badge_ancient": "Ancient Treasure",
            "kids.btn_discover": "Discover More",
            "kids.desc_default": "An ancient wonder waiting for you to discover its magical story!...",
            "kids.start_adventure": "Start Adventure",
            "kids.loading_treasures": "Loading ancient treasures...",
            "kids.topic_science": "Science",
            "kids.topic_language": "Language",
            "kids.topic_history": "History",
            "kids.topic_food": "Food",
            "kids.topic_medicine": "Medicine",
            "kids.topic_games": "Games",
            "kids.topic_society": "Society",
            "kids.topic_culture": "Culture",
            "kids.topic_religion": "Religion",
            "kids.topic_architecture": "Architecture",
            "kids.fact1_title": "Mummification 101",
            "kids.fact1_desc": "They believed the heart was the most important organ, while the brain was often thrown away!",
            "kids.fact2_title": "Hieroglyph Power",
            "kids.fact2_desc": "There are over 700 symbols. Some represent sounds, others represent whole words!",
            "kids.fact3_title": "Pyramids Mystery",
            "kids.fact3_desc": "The pyramids were built as tombs for pharaohs and remain architectural wonders!",
            "kids.fact4_title": "Ancient Honey",
            "kids.fact4_desc": "Archaeologists found honey in tombs that is 3,000 years old and STILL perfectly edible!",
            "kids.fact5_title": "365-Day Year",
            "kids.fact5_desc": "Egyptians invented the 365-day calendar to predict when the Nile River would flood!",
            "kids.fact6_title": "Bread Medicine",
            "kids.fact6_desc": "They used moldy bread to treat infections—the earliest form of penicillin!",
            "kids.fact7_title": "Senet Game",
            "kids.fact7_desc": "Ancient Egyptians loved board games! Senet was their favorite, played for over 3,000 years.",
            "kids.fact8_title": "Women's Rights",
            "kids.fact8_desc": "Egyptian women could own property, sign legal contracts, and even become Pharaohs!",
            "kids.fact9_title": "Paid Builders",
            "kids.fact9_desc": "The pyramids weren't built by slaves, but by respected workers who were paid in bread and beer!",
            "kids.fact10_title": "First Police",
            "kids.fact10_desc": "Egyptians had the first police force! They used trained dogs and even monkeys to catch criminals.",
            "kids.fact11_title": "Hair Secrets",
            "kids.fact11_desc": "To stay cool, children often shaved their heads except for one long 'lock of youth' on the side!",
            "kids.fact12_title": "Sacred Animals",
            "kids.fact12_desc": "It wasn't just cats! Crocodiles, ibises, and even baboons were considered sacred and respected.",
            "kids.fact13_title": "First Dentists",
            "kids.fact13_desc": "Ancient Egyptians were the first to have dentists. They even used gold wire to fix loose teeth!",
            "kids.fact14_title": "Cleopatra's Secret",
            "kids.fact14_desc": "Cleopatra VII, the most famous Queen of Egypt, was actually Greek, from a family named Ptolemy.",
            "kids.fact15_title": "Giant Sphinx",
            "kids.fact15_desc": "The Sphinx is carved from a single giant piece of limestone. It guards the pyramids with a lion's body!",
            "kids.fact16_title": "Peace Treaty",
            "kids.fact16_desc": "Ramses II signed the first peace treaty in history with the Hittite Empire 3,000 years ago.",
            "kids.fact17_title": "Makeup Power",
            "kids.fact17_desc": "Both men and women wore eye makeup! It protected their eyes from the sun's glare and biting flies.",
            "kids.fact18_title": "Surgical Tools",
            "kids.fact18_desc": "Ancient doctors used copper scalpels and needles to perform surgeries, much like today!",
            "kids.fact19_title": "Golden Ratio",
            "kids.fact19_desc": "Architects used advanced math to build the Great Pyramid, which is perfectly aligned with the stars.",
            "kids.fact20_title": "First Toothpaste",
            "kids.fact20_desc": "Egyptians invented toothpaste! They used a mix of rock salt, pepper, mint, and dried iris flowers.",
            "kids.quiz1_q": "Which animal was sacred?",
            "kids.quiz1_a": "The Cat!",
            "kids.quiz1_desc": "Cats were deeply respected and even mummified like humans!",
            "kids.quiz2_q": "Who was the boy king?",
            "kids.quiz2_a": "Tutankhamun!",
            "kids.quiz2_desc": "He became Pharaoh at age 9 and is famous for his golden mask.",
            "kids.quiz3_q": "What did they write on?",
            "kids.quiz3_a": "Papyrus!",
            "kids.quiz3_desc": "A plant-based paper made from the reeds growing along the Nile.",
            "kids.quiz4_q": "Biggest pyramid?",
            "kids.quiz4_a": "Great Pyramid of Giza",
            "kids.quiz4_desc": "It was the tallest man-made structure for over 3,800 years!",
            "kids.quiz5_q": "Which river?",
            "kids.quiz5_a": "The Nile River",
            "kids.quiz5_desc": "It's the longest river in the world, stretching over 6,600 kilometers!",
            "kids.quiz6_q": "What is a Sarcophagus?",
            "kids.quiz6_a": "A Stone Coffin!",
            "kids.quiz6_desc": "Often decorated with beautiful paintings and magical spells.",
            "kids.board_activity1": "Lego Pyramids",
            "kids.board_activity2": "Papyrus Art",
            "kids.board_activity3": "Mummy Wrapping",

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
            "cb.hero_badge": "مرشد المتحف المدعوم بالذكاء الاصطناعي",
            "cb.hero_title": "تحدث مع",
            "cb.hero_title_span": "توتورا",
            "cb.hero_sub": "اسأل عن أي شيء يخص مصر القديمة، واستكشف المتحف المصري الكبير، واكتشف 7000 عام من التاريخ — كل ذلك من خلال محادثة.",
            "cb.hero_cta": "ابدأ الدردشة",
            "cb.new_chat": "محادثة جديدة",
            "cb.recent_conv": "المحادثات الأخيرة",
            "cb.no_past_chats": "لا توجد محادثات سابقة حتى الآن",
            "cb.ai_name": "ذكاء توتورا الاصطناعي",
            "cb.ai_status": "متصل — جاهز للاستكشاف",
            "cb.welcome_msg": "مرحبًا بك في المتحف المصري الكبير! 🏛️ أنا توتورا، مرشدك الذكي. اسألني عن الفراعنة، أو القطع الأثرية، أو السلالات الحاكمة، أو خطط لزيارتك.",
            "cb.just_now": "الآن",
            "cb.sug_1": "قناع توت عنخ آمون",
            "cb.sug_2": "بناء الأهرامات",
            "cb.sug_3": "حجر رشيد",
            "cb.sug_4": "خطط لزيارتي",
            "cb.input_placeholder": "اسأل توتورا أي شيء عن مصر القديمة...",
            "cb.disclaimer": "قد يقدم ذكاء توتورا الاصطناعي معلومات غير دقيقة. تحقق من الحقائق المهمة.",
            "cb.meet_title": "تعرف على",
            "cb.pers_1_title": "المؤرخ",
            "cb.pers_1_desc": "خبير في كل أسرة فرعونية وأثر — من المملكة القديمة حتى العصر البطلمي. اطرح أسئلة تاريخية معقدة بثقة.",
            "cb.pers_2_title": "الملاح",
            "cb.pers_2_desc": "يعرف كل قاعة عرض، ومعرض، وزاوية خفية في المتحف المصري الكبير. احصل على توجيهات خطوة بخطوة إلى أي قطعة أثرية.",
            "cb.pers_3_title": "سيد المسابقات",
            "cb.pers_3_desc": "تحدى نفسك باختبارات مولدة بالذكاء الاصطناعي حول الأساطير المصرية وعلم الآثار ومجموعة المتحف التي تضم أكثر من 100,000 قطعة.",
            "cb.pers_4_title": "مرشد الأطفال",
            "cb.pers_4_desc": "شروحات مبسطة وممتعة مع رموز تعبيرية ورسوم متحركة وألعاب مصممة للمستكشفين الصغار من سن 6 إلى 14 عامًا.",
            "cb.cap_title": "ماذا يمكنني أن",
            "cb.cap_title_span": "أفعل",
            "cb.cap_1_title": "التعمق التاريخي",
            "cb.cap_1_desc": "اسأل عن أي سلالة فرعونية، أو فرعون، أو قطعة أثرية — من المملكة القديمة إلى العصر البطلمي — واحصل على إجابات غنية وموثقة.",
            "cb.cap_2_title": "التعرف على الصور",
            "cb.cap_2_desc": "ارفع أي صورة لقطعة أثرية، أو كتابة هيروغليفية، أو موقع أثري، وسأقوم بالتعرف عليها ومشاركة سياقها التاريخي فورًا.",
            "cb.cap_3_title": "اختبارات تفاعلية",
            "cb.cap_3_desc": "اختبر معلوماتك من خلال اختبارات مولدة بالذكاء الاصطناعي حول الأساطير المصرية وعلم الآثار ومجموعة المتحف.",
            "cb.cap_4_title": "ملخصات تعليمية",
            "cb.cap_4_desc": "احصل على شروحات مناسبة للأعمار للطلاب والباحثين والزوار العاديين بمستويات تعقيد قابلة للتعديل.",
            "cb.cap_5_title": "تخطيط الرحلة",
            "cb.cap_5_desc": "دعني أساعدك في تخطيط زيارتك — من المعارض التي يجب رؤيتها إلى توصيات تناول الطعام بناءً على اهتماماتك.",
            "cb.cap_6_title": "دعم متعدد اللغات",
            "cb.cap_6_desc": "تحدث باللغات العربية والإنجليزية والفرنسية والإسبانية والألمانية واليابانية — أتكيف مع لغتك المفضلة في الوقت الفعلي.",
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

            // ── الفعاليات ──
            "event.month_oct": "أكتوبر",
            "event.month_nov": "نوفمبر",
            "event.e1_title": "افتتاح معرض الدولة الحديثة",
            "event.e1_desc": "استكشف أحدث القطع الأثرية المكتشفة حديثاً من وادي الملوك.",
            "event.e2_title": "ورشة أطفال: صناعة البردي",
            "event.e2_desc": "تجربة عملية للأطفال لتعلم الحرف المصرية القديمة.",
            "event.e3_title": "حديث القيّم: حياة رمسيس الثاني",
            "event.e3_desc": "انضم إلى الدكتور زاهي حواس في أمسية حصرية لمناقشة رمسيس العظيم.",

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
            "plan.recommended_badge": "موصى به للمستكشفين",
            "plan.feat_staircase": "الدرج العظيم والتماثيل",
            "plan.feat_halls": "قاعات العرض الرئيسية",
            "plan.feat_valid": "صالحة ليوم كامل",
            "plan.feat_guide": "مرشد بشري خبير لمدة ساعتين",
            "plan.feat_priority": "دخول أولوية للقاعات",
            "plan.feat_includes": "يشمل الدخول العام",
            "plan.feat_tut_gallery": "معرض توت عنخ آمون التفاعلي",
            "plan.feat_all_halls": "جميع القاعات الرئيسية والدرج",
            "plan.feat_kids": "الدخول لمتحف الأطفال",
            "info.access_title": "سهولة الوصول",
            "info.access_value": "متاح بالكامل لجميع الزوار",
            "plan.address": "الجيزة، مصر",
            "plan.itineraries_title": "مسارات مقترحة",
            "plan.itineraries_subtitle": "حقق أقصى استفادة من وقتك مع أدلتنا المنسقة.",
            "plan.itin1_time": "ساعتان",
            "plan.itin1_title": "جولة أبرز المعالم",
            "plan.itin1_desc": "مثالية لأصحاب الوقت الضيق. شاهد التحف الفنية الأساسية.",
            "plan.itin_start": "البداية:",
            "plan.itin1_start": "الدرج العظيم",
            "plan.itin_middle": "المنتصف:",
            "plan.itin1_mid": "قناع توت عنخ آمون",
            "plan.itin_end": "النهاية:",
            "plan.itin1_end": "قاعة المومياوات الملكية",
            "plan.itin1_btn": "اختر الدخول العام",
            "plan.itin_popular": "الأكثر شهرة",
            "plan.itin2_time": "نصف يوم (٤-٥ ساعات)",
            "plan.itin2_title": "تجربة المستكشف",
            "plan.itin2_desc": "تعمق أكثر في التاريخ مع وقت للاسترخاء.",
            "plan.itin_morning": "الصباح:",
            "plan.itin2_morn": "قاعات العرض الرئيسية",
            "plan.itin_lunch": "الغداء:",
            "plan.itin2_lunch": "مطعم إطلالة الأهرام",
            "plan.itin_afternoon": "بعد الظهر:",
            "plan.itin2_aft": "معرض محول الفرعون",
            "plan.itin2_btn": "اختر تجربة المرشد",
            "plan.itin3_time": "يوم كامل",
            "plan.itin3_title": "تجربة المتحف الكاملة",
            "plan.itin3_desc": "انغمس بالكامل. يشمل جميع المعارض الخاصة.",
            "plan.itin3_morn": "جميع القاعات الرئيسية",
            "plan.itin3_lunch": "المقهى الكبير ومتجر الهدايا",
            "plan.itin3_aft": "متحف الأطفال والرواية الصوتية ثلاثية الأبعاد",
            "plan.itin3_btn": "اختر بطاقة توت عنخ آمون",
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
            "plan.faq_q1": "هل يمكنني شراء التذاكر عند الباب؟",
            "plan.faq_a1": "نعم، ولكننا نوصي بشدة بالشراء عبر الإنترنت لتخطي الطابور. تذاكر الدخول العام تخضع للتوافر.",
            "plan.faq_q2": "هل تتوفر جولات إرشادية؟",
            "plan.faq_a2": "نعم! يدعم مرشدونا البشريون الخبراء ومرشدو الذكاء الاصطناعي أكثر من ١٢ لغة بما في ذلك الإنجليزية والعربية.",
            "plan.faq_q3": "هل هناك خصومات للطلاب؟",
            "plan.faq_a3": "نعم، يتمتع الطلاب الذين يحملون بطاقة ISIC أو هوية محلية صالحة بخصم ٥٠٪ على الدخول العام.",
            "plan.faq_q4": "هل يحتاج الأطفال إلى تذاكر؟",
            "plan.faq_a4": "الأطفال دون سن ٦ سنوات يدخلون مجانًا. يتطلب دخول الأطفال من ٦ إلى ١٢ عامًا تذكرة أطفال مخفضة.",
            "plan.faq_q5": "ما هي سياسة التصوير الفوتوغرافي؟",
            "plan.faq_a5": "التصوير الشخصي بالهاتف بدون فلاش مجاني. تتطلب الكاميرات الاحترافية والحوامل الثلاثية تصريحًا.",
            
            // ── Footer Links ──
            "footer.link_tickets": "التذاكر",
            "footer.link_collection": "المجموعات",
            "footer.link_exhibition": "قاعات العرض",
            "footer.link_membership": "العضوية",
            "footer.link_dining": "طعام المتحف",
            "footer.link_history": "التاريخ",
            "footer.link_events": "الفعاليات",
            "footer.link_news": "الأخبار والصحافة",
            "footer.link_branding": "الهوية المؤسسية",
            "footer.link_help": "المساعدة",
            "footer.link_get_in_touch": "تواصل معنا",
            "footer.link_feedback": "الآراء والملاحظات",
            "footer.link_accessibility": "سهولة الوصول",
            "footer.title": "المتحف المصري الكبير",
            "aig.hero_title": "\"أنا توتورا. كيف نستكشف أسرار النيل اليوم؟\"",
            "aig.hero_sub": "دليلك الرقمي لعجائب المتحف المصري الكبير.",
            "aig.hud_link": "الرابط العصبي",
            "aig.hud_active": "نشط 100%",
            "aig.hud_core": "حالة النواة",
            "aig.hud_opt": "مثالي",
            "aig.btn_talk": "تحدث معي",
            "aig.btn_stop": "إيقاف الصوت",
            "aig.qa_1": "من بنى الأهرامات الكبرى؟",
            "aig.qa_2": "حدثني عن قناع توت عنخ آمون الذهبي",
            "aig.qa_3": "أين يقع الدرج العظيم؟",
            "aig.qa_4": "كيف يمكنني رؤية القطع الأثرية ثلاثية الأبعاد؟",
            "aig.qa_5": "حدثني عن حجر رشيد",
            "aig.trans_title": "السياق الأخير",
            "aig.trans_user": "المستخدم",
            "aig.trans_q": "\"أين يقع حجر رشيد؟\"",
            "aig.trans_ai": "توتورا",
            "aig.trans_a": "\"يوجد حاليًا في المتحف البريطاني، لكن يمكنني أن أعرض لك إسقاطًا هولوغراميًا عالي الدقة له هنا في المعرض الرقمي.\"",
            "aig.how_title": "كيف",
            "aig.how_title_span": "تعمل",
            "aig.how_1_title": "تحدث أو اكتب",
            "aig.how_1_desc": "اسأل توتورا أي شيء — من \"أين قناع توت عنخ آمون؟\" إلى \"حدثني عن كتاب الموتى\" — بالعربية أو الإنجليزية.",
            "aig.how_2_title": "الذكاء الاصطناعي يفهم السياق",
            "aig.how_2_desc": "يعالج نموذجنا العصبي سؤالك باستخدام أكثر من 15,000 نقطة بيانات خاصة بعلم المصريات وخرائط المتحف في الوقت الفعلي.",
            "aig.how_3_title": "استجابة موجهة",
            "aig.how_3_desc": "تلقي استجابة منطوقة مع تراكب ملاحي، وسياق تاريخي، وروابط للقطع الأثرية ثلاثية الأبعاد ذات الصلة في مجموعتنا الرقمية.",
            "aig.cap_title": "قدرات",
            "aig.cap_title_span": "توتورا",
            "aig.cap_1_title": "متعدد اللغات",
            "aig.cap_1_desc": "يجيد العربية، والإنجليزية، والفرنسية، والإسبانية، والألمانية، واليابانية، والماندرين مع ترجمة في الوقت الفعلي.",
            "aig.cap_2_title": "الملاحة",
            "aig.cap_2_desc": "اتجاهات داخلية خطوة بخطوة إلى أي معرض، أو قطعة أثرية، أو دورة مياه، أو مكان لتناول الطعام داخل المتحف.",
            "aig.cap_3_title": "التاريخ العميق",
            "aig.cap_3_desc": "تُستمد كل إجابة من أبحاث في علم المصريات تمت مراجعتها من قبل نظراء، ويتم تحديثها ربع سنويًا بواسطة فريق الأمناء لدينا.",
            "aig.cap_4_title": "تراكبات الواقع المعزز",
            "aig.cap_4_desc": "وجه الكاميرا نحو أي قطعة أثرية وستقوم توتورا بتركيب ترجمات هيروغليفية، وتواريخ، وسياق السلالة.",
            "aig.cap_5_title": "وضع الأطفال",
            "aig.cap_5_desc": "وضع تفاعلي خاص بلغة مبسطة، واختبارات ممتعة، وشخصيات فرعونية متحركة للمستكشفين الصغار.",
            "aig.cap_6_title": "إمكانية الوصول",
            "aig.cap_6_desc": "دعم كامل لقارئ الشاشة، واستجابات فيديو بلغة الإشارة، وسرعة تحدث قابلة للتعديل لجميع الزوار.",
            "aig.stat_1": "جولة إرشادية مكتملة",
            "aig.stat_2": "رضا الزوار",
            "aig.stat_3": "نقطة بيانات في قاعدة المعرفة",
            "aig.stat_4": "لغات مدعومة",
            "evt.hero_badge": "المعرض المُميَّز",
            "evt.hero_title": "عظمة توت عنخ آمون",
            "evt.hero_desc": "عِش العصر الذهبي للفراعنة في أحدث معارضنا التفاعلية. اكتشف أكثر من 5,000 كنز من مقبرة الملك الصبي.",
            "evt.hero_btn_book": "احجز التذاكر الآن",
            "evt.hero_btn_learn": "اعرف المزيد",
            "evt.filter_all": "جميع الفعاليات",
            "evt.filter_exhibitions": "المعارض",
            "evt.filter_workshops": "ورش العمل",
            "evt.filter_cultural": "ليالي ثقافية",
            "evt.c1_badge": "يُباع بسرعة",
            "evt.c1_date": "12 أكتوبر - 20 ديسمبر، 2023",
            "evt.c1_title": "الملك الذهبي: قطع أثرية لأسطورة",
            "evt.c1_desc": "مجموعة نادرة من المجوهرات الشخصية والتمائم الواقية المستردة من الوادي الملكي.",
            "evt.c1_loc": "قاعة 4 • قسط",
            "evt.btn_view_details": "عرض التفاصيل",
            
            "evt.c2_badge": "يُباع بسرعة",
            "evt.c3_badge": "يُباع بسرعة",
            "evt.c5_badge": "يُباع بسرعة",
            "evt.c6_badge": "يُباع بسرعة",
            "evt.c2_date": "كل يوم سبت",
            "evt.c2_title": "ورشة صناعة ورق البردي",
            "evt.c2_desc": "تعلم الفن القديم لإنتاج الورق باستخدام قصب نهر النيل تحت توجيه الخبراء.",
            "evt.c2_loc": "المركز التعليمي",
            "evt.c3_date": "ليليًا • 8:00 مساءً",
            "evt.c3_title": "عرض الصوت والضوء لأبو الهول",
            "evt.c3_desc": "رحلة مذهلة عبر 5000 عام من التاريخ تُعرض على الآثار القديمة.",
            "evt.c3_loc": "الساحة الرئيسية • في الهواء الطلق",
            "evt.c4_badge": "مجموعة دائمة",
            "evt.c4_title": "رمسيس العظيم: حياته وإرثه",
            "evt.c4_desc": "مُكرس لأطول الفراعنة حكمًا في مصر، ويتميز بالتمثال الضخم من ممفيس.",
            "evt.c4_loc": "الردهة • تاريخي",
            "evt.c5_date": "5 نوفمبر • 2:00 مساءً",
            "evt.c5_title": "أساسيات الهيروغليفية المصرية",
            "evt.c5_desc": "محاضرة تمهيدية عن فك شفرة النقوش المقدسة للمملكة القديمة.",
            "evt.c5_loc": "جناح المكتبة",
            "evt.c6_date": "10 نوفمبر • 6:30 مساءً",
            "evt.c6_title": "جلسات جاز وقت غروب النيل",
            "evt.c6_desc": "استمتع بمزيج الجاز المعاصر مع غروب الشمس فوق الأهرامات من تراس الحديقة.",
            "evt.c6_loc": "حدائق المتحف",
            "evt.c7_badge": "حصري",
            "evt.c7_date": "كل يوم جمعة",
            "evt.c7_title": "جولة الاكتشاف الكبرى",
            "evt.c7_desc": "انضم إلى خبراء الآثار لدينا في نظرة حصرية خلف الكواليس للكنوز الفرعونية المكتشفة حديثًا.",
            "evt.c7_loc": "القاعة الكبرى",
            "evt.c8_date": "1 ديسمبر • 9:00 صباحًا",
            "evt.c8_title": "بطولة ألعاب الطاولة القديمة",
            "evt.c8_desc": "تحد نفسك وتعرف على قواعد ألعاب السنيت والميهين في هذه الفعالية التاريخية التفاعلية.",
            "evt.c8_loc": "متحف الأطفال",
            "evt.c9_badge": "أعداد محدودة",
            "evt.c9_date": "الأحد • 5:30 صباحًا",
            "evt.c9_title": "يوجا شروق الشمس عند الأهرامات",
            "evt.c9_desc": "جد السلام الداخلي مع جلسة يوجا موجهة تواجه الأهرامات الكبرى عند الفجر.",
            "evt.c9_loc": "تراس خارجي",
            "evt.exp_tag": "أصوات الخبراء",
            "evt.exp_title": "التقِ بأمناء المتحف والمتحدثين لدينا",
            "evt.dr1_name": "د. زاهي حواس",
            "evt.dr1_role": "كبير علماء الآثار",
            "evt.dr1_desc": "عالم آثار مشهور ووزير الدولة الأسبق لشؤون الآثار.",
            "evt.dr1_quote": "المتحف المصري الكبير هو أهم مشروع ثقافي في العالم في القرن الحادي والعشرين. إنه هدية مصر للإنسانية.",
            "evt.dr2_name": "د. حسين كمال",
            "evt.dr2_role": "رئيس الترميم",
            "evt.dr2_desc": "يدير أكثر مراكز الترميم الأثري تقدمًا في العالم في المتحف المصري الكبير.",
            "evt.dr2_quote": "مركز الترميم لدينا هو منارة للعلم، مما يضمن الحفاظ على كل قطعة أثرية بأعلى المعايير المعروفة للإنسان.",
            "evt.dr3_name": "د. أحمد غنيم",
            "evt.dr3_role": "الرئيس التنفيذي للمتحف المصري الكبير",
            "evt.dr3_desc": "يقود مهمة المتحف المصري الكبير كمركز ثقافي عالمي ومؤسسة تعليمية.",
            "evt.dr3_quote": "\"نحن لسنا مجرد متحف؛ نحن رمز للتعاون العالمي وجسر بين الإرث القديم والابتكار المستقبلي.\"",
            "evt.news_title": "انضم إلى مجتمعنا",
            "evt.news_desc": "ابق على اطلاع بأحدث إعلانات الفعاليات، ومحادثات الأمناء الحصرية، وافتتاحات المعارض التي تصل مباشرة إلى صندوق الوارد الخاص بك.",
            "evt.news_btn": "اشترك الآن",
            "evt.news_policy": "بالاشتراك، أنت توافق على سياسة الخصوصية وشروط الخدمة الخاصة بنا.",
            "footer.privacy": "سياسة الخصوصية",
            "footer.terms": "شروط الخدمة",
            "footer.cookies": "إعدادات ملفات تعريف الارتباط",
            "footer.copyright": "© 2026 توتورا. جميع الحقوق محفوظة.",
            
            // ── Auth & Landing ──
            "auth.login": "تسجيل الدخول",
            "auth.signup": "إنشاء حساب",
            "auth.google": "جوجل",
            "auth.apple": "أبل",
            "auth.or": "أو",
            "auth.email_label": "البريد الإلكتروني",
            "auth.email_placeholder": "أدخل بريدك الإلكتروني",
            "auth.password_label": "كلمة المرور",
            "auth.password_placeholder": "أدخل كلمة المرور",
            "auth.forgot_password": "نسيت؟",
            "auth.fullname_label": "الاسم الكامل",
            "auth.fullname_placeholder": "أدخل اسمك الكامل",
            "auth.confirm_password_label": "تأكيد كلمة المرور",
            "auth.confirm_password_placeholder": "قم بتأكيد كلمة المرور",
            "auth.create_account": "إنشاء الحساب",
            
            "landing.meet": "تعرف على",
            "landing.subtitle": "مرشدك الذكي الشخصي لعالم الآثار",
            "landing.desc": "عش تجربة المتحف المصري الكبير كما لم تعهدها من قبل. محركنا العصبي المتطور يعيد إحياء التاريخ، ويجيب على كل فضول عبر عدسة الزمن.",
            "landing.start_exp": "ابدأ تجربتك",

            "login.hero_title": "مرحباً بك مجدداً في<br>عالم الخلود",
            "login.hero_subtitle": "حكمة الأجداد جاهزة. <span class=\"brand-namee\">توتورا</span> في انتظار عودتك.",
            "login.form_title": "ادخل إلى الحرم",
            "login.form_subtitle": "أيقظ رحلتك عبر التاريخ الملكي من جديد.",
            "login.new_member": "جديد في المتحف؟",

            "register.hero_title": "أيقظ إرثك<br>الفرعوني",
            "register.hero_subtitle": "اخطُ نحو الخلود. <span class=\"brand-namee\">توتورا</span> تنتظر إرشادك عبر حكمة الأجداد.",
            "register.form_title": "انضم إلى السلالة",
            "register.form_subtitle": "رحلتك الملكية عبر التاريخ تبدأ من هنا.",
            "register.already_member": "عضو بالفعل؟",
            "register.terms": "بتسجيلك، فإنك توافق على <a href=\"../Terms-of-Service/term-of-service.html\" class=\"signup-link\"> <br> شروط الخدمة</a> <br> و <a href=\"../Privacy-policy/Privacy-Policy.html\" class=\"signup-link\">سياسة الخصوصية</a> الخاصة بنا.",

            // ── متحف الأطفال ──
            "kids.hero_badge": "تحية الكاهن",
            "kids.hero_title": "مرحباً بكم، أيها <span style=\"color: #ecb613;\">المستكشفون الصغار!</span>",
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
            "kids.art1_name": "قناع توت الذهبي",
            "kids.art1_desc": "القناع الأشهر في العالم، الآن بابتسامة ودودة للمستكشفين الصغار!",
            "kids.art2_name": "رمسيس العظيم",
            "kids.art2_desc": "تعرف على أقوى الفراعنة! بنى تماثيل عملاقة وكان قائدًا عظيمًا لمصر.",
            "kids.art3_name": "أبو الهول المبتسم",
            "kids.art3_desc": "أسد برأس إنسان! يحرس الأهرامات ويحب حل الألغاز مع الأطفال.",
            "kids.art4_name": "الملكة نفرتاري",
            "kids.art4_desc": "أجمل ملكة! كانت طيبة جداً وعاشت في قصر مليء بالسحر والفن.",
            "kids.art5_name": "فرس النهر الأزرق السحري",
            "kids.art5_desc": "فرس النهر الصغير هذا يُدعى ويليام. يحب السباحة في النيل والاختباء بين الزهور!",
            "kids.art6_name": "جرو أنوبيس",
            "kids.art6_desc": "حارس الأسرار! يبدو كجرو ودود ولكنه في الواقع حامي قوي.",
            "kids.art7_name": "القطة باستيت",
            "kids.art7_desc": "تعرف على إلهة الفرح والحماية! إنها قطة سريعة وذكية جداً تحب اللعب.",
            "kids.art8_name": "الملكة حتشبسوت",
            "kids.art8_desc": "واحدة من أقوى الفراعنة الإناث! بنت أجمل معبد وقادت فترة سلمية من البناء والتجارة.",
            "kids.art9_name": "الملك خوفو",
            "kids.art9_desc": "باني الهرم الأكبر! كان ملكًا حكيمًا جدًا بنى أطول مبنى في العالم القديم. يتكون من ملايين الأحجار!",
            "kids.art10_name": "تحتمس الشجاع",
            "kids.art10_desc": "نابليون مصر القديمة! كان ملكًا محاربًا شجاعًا فاز بـ 17 معركة ولم يخسر أبدًا. كان ذكياً جداً!",
            "kids.badge_explorer": "اختيار المستكشف",
            "kids.badge_ancient": "كنز قديم",
            "kids.btn_discover": "اكتشف المزيد",
            "kids.desc_default": "عجيبة قديمة تنتظرك لتكتشف قصتها السحرية!...",
            "kids.start_adventure": "ابدأ المغامرة",
            "kids.loading_treasures": "جاري تحميل الكنوز القديمة...",
            "kids.topic_science": "العلوم",
            "kids.topic_language": "اللغة",
            "kids.topic_history": "التاريخ",
            "kids.topic_food": "الطعام",
            "kids.topic_medicine": "الطب",
            "kids.topic_games": "الألعاب",
            "kids.topic_society": "المجتمع",
            "kids.topic_culture": "الثقافة",
            "kids.topic_religion": "الدين",
            "kids.topic_architecture": "العمارة",
            "kids.fact1_title": "أساسيات التحنيط",
            "kids.fact1_desc": "كانوا يعتقدون أن القلب هو أهم عضو، بينما كان يتم التخلص من الدماغ غالبًا!",
            "kids.fact2_title": "قوة الهيروغليفية",
            "kids.fact2_desc": "هناك أكثر من 700 رمز. بعضها يمثل أصواتًا، والبعض الآخر يمثل كلمات كاملة!",
            "kids.fact3_title": "لغز الأهرامات",
            "kids.fact3_desc": "بُنيت الأهرامات كمقابر للفراعنة ولا تزال عجائب معمارية!",
            "kids.fact4_title": "العسل القديم",
            "kids.fact4_desc": "وجد علماء الآثار عسلًا في مقابر يبلغ عمره 3000 عام ولا يزال صالحًا للأكل تمامًا!",
            "kids.fact5_title": "عام بـ 365 يومًا",
            "kids.fact5_desc": "ابتكر المصريون تقويم الـ 365 يومًا للتنبؤ بموعد فيضان نهر النيل!",
            "kids.fact6_title": "طب الخبز",
            "kids.fact6_desc": "استخدموا الخبز المتعفن لعلاج العدوى - وهو أقدم شكل من أشكال البنسلين!",
            "kids.fact7_title": "لعبة السنيت",
            "kids.fact7_desc": "أحب المصريون القدماء ألعاب الطاولة! كانت السنيت مفضلتهم، ولُعبت لأكثر من 3000 عام.",
            "kids.fact8_title": "حقوق المرأة",
            "kids.fact8_desc": "كان بإمكان النساء المصريات امتلاك الممتلكات وتوقيع العقود القانونية وحتى أن يصبحن فراعنة!",
            "kids.fact9_title": "البناة المأجورون",
            "kids.fact9_desc": "لم تُبنَ الأهرامات بواسطة العبيد، بل بواسطة عمال محترمين كانوا يُدفع لهم بالخبز والبيرة!",
            "kids.fact10_title": "أول شرطة",
            "kids.fact10_desc": "كان لدى المصريين أول قوة شرطة! استخدموا كلابًا مدربة وحتى قرودًا للقبض على المجرمين.",
            "kids.fact11_title": "أسرار الشعر",
            "kids.fact11_desc": "للبقاء منتعشين، كان الأطفال غالبًا يحلقون رؤوسهم باستثناء 'خصلة شباب' واحدة طويلة على الجانب!",
            "kids.fact12_title": "حيوانات مقدسة",
            "kids.fact12_desc": "لم يقتصر الأمر على القطط! كانت التماسيح وطيور أبو منجل وحتى قردة البابون تعتبر مقدسة ومحترمة.",
            "kids.fact13_title": "أوائل أطباء الأسنان",
            "kids.fact13_desc": "كان المصريون القدماء أول من امتلك أطباء أسنان. حتى أنهم استخدموا سلكًا ذهبيًا لتثبيت الأسنان المتخلخلة!",
            "kids.fact14_title": "سر كليوباترا",
            "kids.fact14_desc": "كليوباترا السابعة، أشهر ملكة في مصر، كانت في الواقع يونانية، من عائلة تسمى بطليموس.",
            "kids.fact15_title": "أبو الهول العملاق",
            "kids.fact15_desc": "تم نحت أبو الهول من قطعة واحدة عملاقة من الحجر الجيري. يحرس الأهرامات بجسد أسد!",
            "kids.fact16_title": "معاهدة السلام",
            "kids.fact16_desc": "وقع رمسيس الثاني أول معاهدة سلام في التاريخ مع الإمبراطورية الحثية قبل 3000 عام.",
            "kids.fact17_title": "قوة المكياج",
            "kids.fact17_desc": "وضع كل من الرجال والنساء مكياج العيون! لقد حمى عيونهم من وهج الشمس والذباب اللاسع.",
            "kids.fact18_title": "أدوات جراحية",
            "kids.fact18_desc": "استخدم الأطباء القدماء المشارط الإبر النحاسية لإجراء العمليات الجراحية، تمامًا مثل اليوم!",
            "kids.fact19_title": "النسبة الذهبية",
            "kids.fact19_desc": "استخدم المهندسون المعماريون رياضيات متقدمة لبناء الهرم الأكبر، والذي يتوافق تمامًا مع النجوم.",
            "kids.fact20_title": "أول معجون أسنان",
            "kids.fact20_desc": "اخترع المصريون معجون الأسنان! استخدموا مزيجًا من الملح الصخري والفلفل والنعناع وأزهار السوسن المجففة.",
            "kids.quiz1_q": "أي حيوان كان مقدسًا؟",
            "kids.quiz1_a": "القط!",
            "kids.quiz1_desc": "كانت القطط تُحترم بشدة وحتى يتم تحنيطها مثل البشر!",
            "kids.quiz2_q": "من كان الملك الصبي؟",
            "kids.quiz2_a": "توت عنخ آمون!",
            "kids.quiz2_desc": "أصبح فرعونًا في سن التاسعة واشتهر بقناعه الذهبي.",
            "kids.quiz3_q": "على ماذا كانوا يكتبون؟",
            "kids.quiz3_a": "ورق البردي!",
            "kids.quiz3_desc": "ورق نباتي مصنوع من القصب الذي ينمو على طول نهر النيل.",
            "kids.quiz4_q": "أكبر هرم؟",
            "kids.quiz4_a": "الهرم الأكبر بالجيزة",
            "kids.quiz4_desc": "كان أطول مبنى من صنع الإنسان لأكثر من 3800 عام!",
            "kids.quiz5_q": "أي نهر؟",
            "kids.quiz5_a": "نهر النيل",
            "kids.quiz5_desc": "إنه أطول نهر في العالم، ويمتد لأكثر من 6600 كيلومتر!",
            "kids.quiz6_q": "ما هو التابوت؟",
            "kids.quiz6_a": "تابوت حجري!",
            "kids.quiz6_desc": "غالبًا ما يُزين بلوحات جميلة وتعويذات سحرية.",
            "kids.board_activity1": "أهرامات الليجو",
            "kids.board_activity2": "فن البردي",
            "kids.board_activity3": "لف المومياوات",

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
        const localTarget = LOCAL_TRANSLATIONS[currentLang] ? LOCAL_TRANSLATIONS[currentLang][key] : null;
        return langData[key] || localTarget || LOCAL_TRANSLATIONS.en[key] || key;
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
                el.innerHTML = translated;
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
            el.innerHTML = translated;
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
