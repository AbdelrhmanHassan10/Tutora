const fs = require('fs');
const path = require('path');

const projectPath = 'd:\\Testing\\Project';
const globalLangPath = path.join(projectPath, 'global-lang.js');

// 1. UPDATE GLOBAL-LANG.JS
let langContent = fs.readFileSync(globalLangPath, 'utf8');

const englishAuthKeys = `
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
            "login.hero_subtitle": "The wisdom of ancestors is ready. <span class=\\"brand-namee\\">Tutora</span> awaits your return.",
            "login.form_title": "Enter the Sanctuary",
            "login.form_subtitle": "Re-awaken your journey through the royal history.",
            "login.new_member": "New to the museum?",

            "register.hero_title": "Awaken Your<br>Pharaonic Legacy",
            "register.hero_subtitle": "Step into eternity. <span class=\\"brand-namee\\">Tutora</span> awaits to guide you through the wisdom of ancestors.",
            "register.form_title": "Join the Dynasty",
            "register.form_subtitle": "Your royal journey through history begins here.",
            "register.already_member": "Already a member?",
            "register.terms": "By signing up, you agree to our <a href=\\"../Terms-of-Service/term-of-service.html\\" class=\\"signup-link\\"> <br> Terms of Service</a> <br> and <a href=\\"../Privacy-policy/Privacy-Policy.html\\" class=\\"signup-link\\">Privacy Policy</a>.",
`;

const arabicAuthKeys = `
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
            "login.hero_subtitle": "حكمة الأجداد جاهزة. <span class=\\"brand-namee\\">توتورا</span> في انتظار عودتك.",
            "login.form_title": "ادخل إلى الحرم",
            "login.form_subtitle": "أيقظ رحلتك عبر التاريخ الملكي من جديد.",
            "login.new_member": "جديد في المتحف؟",

            "register.hero_title": "أيقظ إرثك<br>الفرعوني",
            "register.hero_subtitle": "اخطُ نحو الخلود. <span class=\\"brand-namee\\">توتورا</span> تنتظر إرشادك عبر حكمة الأجداد.",
            "register.form_title": "انضم إلى السلالة",
            "register.form_subtitle": "رحلتك الملكية عبر التاريخ تبدأ من هنا.",
            "register.already_member": "عضو بالفعل؟",
            "register.terms": "بتسجيلك، فإنك توافق على <a href=\\"../Terms-of-Service/term-of-service.html\\" class=\\"signup-link\\"> <br> شروط الخدمة</a> <br> و <a href=\\"../Privacy-policy/Privacy-Policy.html\\" class=\\"signup-link\\">سياسة الخصوصية</a> الخاصة بنا.",
`;

// Insert into English dictionary
if (!langContent.includes('"auth.login"')) {
    langContent = langContent.replace(
        /"common\.loading": "Loading...",/g,
        '"common.loading": "Loading...",' + '\\n' + englishAuthKeys
    );
    // Insert into Arabic dictionary
    langContent = langContent.replace(
        /"common\.loading": "جاري التحميل...",/g,
        '"common.loading": "جاري التحميل...",' + '\\n' + arabicAuthKeys
    );
    fs.writeFileSync(globalLangPath, langContent);
    console.log("global-lang.js updated.");
}

// 2. PATCH LANDING PAGE
const landingPath = path.join(projectPath, '1.landing page', 'index.html');
let landingHtml = fs.readFileSync(landingPath, 'utf8');

landingHtml = landingHtml.replace(/<span>Login<\/span>/g, '<span data-i18n="auth.login">Login</span>');
landingHtml = landingHtml.replace(/<span class="meet-text">Meet<\/span>/g, '<span class="meet-text" data-i18n="landing.meet">Meet</span>');
landingHtml = landingHtml.replace(/<span class="subtitle">Your Personal AI Guide to Antiquity<\/span>/g, '<span class="subtitle" data-i18n="landing.subtitle">Your Personal AI Guide to Antiquity</span>');
landingHtml = landingHtml.replace(/<p class="hero-description">\s*Experience the Grand Egyptian Museum like never before.*?<\/p>/s, '<p class="hero-description" data-i18n="landing.desc">\\n                            Experience the Grand Egyptian Museum like never before. Our advanced neural engine brings history to life, answering every curiosity through the lens of time.\\n                        </p>');
landingHtml = landingHtml.replace(/<span>Start Your Experience<\/span>/g, '<span data-i18n="landing.start_exp">Start Your Experience</span>');
fs.writeFileSync(landingPath, landingHtml);
console.log("Landing page patched.");

// 3. PATCH LOGIN PAGE
const loginPath = path.join(projectPath, '2.login', 'code.html');
let loginHtml = fs.readFileSync(loginPath, 'utf8');

loginHtml = loginHtml.replace(/>Sign Up<\/a>/g, ' data-i18n="auth.signup">Sign Up</a>');
loginHtml = loginHtml.replace(/<h1 class="hero-title">Welcome Back to<br>Eternity<\/h1>/g, '<h1 class="hero-title" data-i18n="login.hero_title">Welcome Back to<br>Eternity</h1>');
loginHtml = loginHtml.replace(/<p class="hero-subtitle" style="color: rgb\(243, 224, 190\);">The wisdom of ancestors is ready. <span class="brand-namee">Tutora<\/span> awaits your return.<\/p>/g, '<p class="hero-subtitle" style="color: rgb(243, 224, 190);" data-i18n="login.hero_subtitle">The wisdom of ancestors is ready. <span class="brand-namee">Tutora</span> awaits your return.</p>');
loginHtml = loginHtml.replace(/<h1 class="form-title">Enter the Sanctuary<\/h1>/g, '<h1 class="form-title" data-i18n="login.form_title">Enter the Sanctuary</h1>');
loginHtml = loginHtml.replace(/<p class="form-subtitle">Re-awaken your journey through the royal history.<\/p>/g, '<p class="form-subtitle" data-i18n="login.form_subtitle">Re-awaken your journey through the royal history.</p>');
loginHtml = loginHtml.replace(/<span>Google<\/span>/g, '<span data-i18n="auth.google">Google</span>');
loginHtml = loginHtml.replace(/<span>Apple<\/span>/g, '<span data-i18n="auth.apple">Apple</span>');
loginHtml = loginHtml.replace(/<span class="divider-text">Or<\/span>/g, '<span class="divider-text" data-i18n="auth.or">Or</span>');
loginHtml = loginHtml.replace(/<p class="field-label">Email Address<\/p>/g, '<p class="field-label" data-i18n="auth.email_label">Email Address</p>');
loginHtml = loginHtml.replace(/placeholder="Enter your email"/g, 'placeholder="Enter your email" data-i18n-placeholder="auth.email_placeholder"');
loginHtml = loginHtml.replace(/<p class="field-label" style="margin-bottom: 0;">Password<\/p>/g, '<p class="field-label" style="margin-bottom: 0;" data-i18n="auth.password_label">Password</p>');
loginHtml = loginHtml.replace(/>Forgot\?<\/a>/g, ' data-i18n="auth.forgot_password">Forgot?</a>');
loginHtml = loginHtml.replace(/placeholder="Enter your password"/g, 'placeholder="Enter your password" data-i18n-placeholder="auth.password_placeholder"');
loginHtml = loginHtml.replace(/<span>Log In<\/span>/g, '<span data-i18n="auth.login">Log In</span>');
loginHtml = loginHtml.replace(/<span>New to the museum\?<\/span>/g, '<span data-i18n="login.new_member">New to the museum?</span>');

fs.writeFileSync(loginPath, loginHtml);
console.log("Login page patched.");

// 4. PATCH REGISTER PAGE
const registerPath = path.join(projectPath, '3.register', 'code.html');
let registerHtml = fs.readFileSync(registerPath, 'utf8');

registerHtml = registerHtml.replace(/>Log In<\/a>/g, ' data-i18n="auth.login">Log In</a>');
registerHtml = registerHtml.replace(/<h1 class="hero-title">Awaken Your<br>Pharaonic Legacy<\/h1>/g, '<h1 class="hero-title" data-i18n="register.hero_title">Awaken Your<br>Pharaonic Legacy</h1>');
registerHtml = registerHtml.replace(/<p class="hero-subtitle">Step into eternity. <span class="brand-namee">Tutora<\/span> awaits to guide you through the wisdom of ancestors.<\/p>/g, '<p class="hero-subtitle" data-i18n="register.hero_subtitle">Step into eternity. <span class="brand-namee">Tutora</span> awaits to guide you through the wisdom of ancestors.</p>');
registerHtml = registerHtml.replace(/<h1 class="form-title">Join the Dynasty<\/h1>/g, '<h1 class="form-title" data-i18n="register.form_title">Join the Dynasty</h1>');
registerHtml = registerHtml.replace(/<p class="form-subtitle">Your royal journey through history begins here.<\/p>/g, '<p class="form-subtitle" data-i18n="register.form_subtitle">Your royal journey through history begins here.</p>');
registerHtml = registerHtml.replace(/<p class="field-label">Full Name<\/p>/g, '<p class="field-label" data-i18n="auth.fullname_label">Full Name</p>');
registerHtml = registerHtml.replace(/placeholder="Enter your full name"/g, 'placeholder="Enter your full name" data-i18n-placeholder="auth.fullname_placeholder"');
registerHtml = registerHtml.replace(/<p class="field-label">Confirm Password<\/p>/g, '<p class="field-label" data-i18n="auth.confirm_password_label">Confirm Password</p>');
registerHtml = registerHtml.replace(/placeholder="Confirm your password"/g, 'placeholder="Confirm your password" data-i18n-placeholder="auth.confirm_password_placeholder"');
registerHtml = registerHtml.replace(/<span>Create Account<\/span>/g, '<span data-i18n="auth.create_account">Create Account</span>');
registerHtml = registerHtml.replace(/<span>Already a member\?<\/span>/g, '<span data-i18n="register.already_member">Already a member?</span>');
registerHtml = registerHtml.replace(/<p class="footer-text">\s*By signing up, you agree to our.*?<\/p>/s, '<p class="footer-text" data-i18n="register.terms">\\n                                    By signing up, you agree to our <a href="../Terms-of-Service/term-of-service.html" class="signup-link"> <br> Terms of Service</a> <br> and <a href="../Privacy-policy/Privacy-Policy.html" class="signup-link">Privacy Policy</a>.\\n                                </p>');

// also need to handle register having email and password same as login
registerHtml = registerHtml.replace(/<span>Google<\/span>/g, '<span data-i18n="auth.google">Google</span>');
registerHtml = registerHtml.replace(/<span>Apple<\/span>/g, '<span data-i18n="auth.apple">Apple</span>');
registerHtml = registerHtml.replace(/<span class="divider-text">Or<\/span>/g, '<span class="divider-text" data-i18n="auth.or">Or</span>');
registerHtml = registerHtml.replace(/<p class="field-label">Email Address<\/p>/g, '<p class="field-label" data-i18n="auth.email_label">Email Address</p>');
registerHtml = registerHtml.replace(/placeholder="Enter your email"/g, 'placeholder="Enter your email" data-i18n-placeholder="auth.email_placeholder"');
registerHtml = registerHtml.replace(/<p class="field-label">Password<\/p>/g, '<p class="field-label" data-i18n="auth.password_label">Password</p>');
registerHtml = registerHtml.replace(/placeholder="Create a password"/g, 'placeholder="Create a password" data-i18n-placeholder="auth.password_placeholder"');


fs.writeFileSync(registerPath, registerHtml);
console.log("Register page patched.");
