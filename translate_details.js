const fs = require('fs');
let code = fs.readFileSync('Artifact-show/code.html', 'utf8');

// Add translation function to code.html script block
const transCode = `
    function getTranslated(key, defaultVal) {
        if (window.TutoraLang && typeof window.TutoraLang.translate === 'function') {
            const currentLang = window.TutoraLang.getCurrentLang();
            if (currentLang === 'ar') {
                if (window.ARABIC_DB && window.ARABIC_DB[ARTIFACT_ID] && window.ARABIC_DB[ARTIFACT_ID][key]) {
                    return window.ARABIC_DB[ARTIFACT_ID][key];
                }
                if (window.ARABIC_STATIC && window.ARABIC_STATIC[defaultVal]) {
                    return window.ARABIC_STATIC[defaultVal];
                }
            }
        }
        return defaultVal;
    }

    // Static translations for UI
    window.ARABIC_STATIC = {
        "Overview": "نظرة عامة",
        "Details": "التفاصيل",
        "Stats": "الإحصائيات",
        "Back": "العودة",
        "View in AR": "عرض بالواقع المعزز",
        "Material": "المادة",
        "God": "الإله",
        "Weight": "الوزن",
        "Discovered": "تاريخ الاكتشاف",
        "Height": "الارتفاع",
        "Width": "العرض",
        "Period": "الفترة",
        "Dynasty": "الأسرة",
        "Location": "الموقع"
    };

    window.ARABIC_DB = {
        "tut-mask": { title: "قناع توت عنخ آمون", introHeading: "الذهب واللازورد", introText: "قناع الموت الشهير للفرعون الشاب.", detailsHeading: "تحفة فنية", detailsText: "يعد هذا القناع من أعظم كنوز العالم القديم." },
        "senet-board": { title: "لوحة لعبة السنت", introHeading: "لعبة العبور", introText: "لعبة مصرية قديمة تعكس رحلة الروح." },
        "tut-chariot": { title: "عجلة توت عنخ آمون", introHeading: "عجلة حربية", introText: "عجلة حربية مزخرفة استخدمت في الصيد والاحتفالات." },
        "tut-throne": { title: "عرش توت عنخ آمون", introHeading: "العرش الذهبي", introText: "عرش مذهب يصور الملك مع زوجته عنخ إسن أمون." },
        "tut-shrine": { title: "مقصورة توت عنخ آمون", introHeading: "المقصورة المذهبة", introText: "مقصورة خشبية مغطاة بالذهب لحفظ التماثيل." },
        "anubis-shrine": { title: "مقصورة أنوبيس", introHeading: "إله التحنيط", introText: "تمثال لأنوبيس على شكل ابن آوى لحماية المقبرة." },
        "tut-pectoral": { title: "صدرية توت عنخ آمون", introHeading: "حلي ملكية", introText: "قلادة صدرية مرصعة بالأحجار الكريمة." },
        "ramses-colossus": { title: "تمثال رمسيس الثاني", introHeading: "الملك العظيم", introText: "تمثال ضخم يمثل القوة الملكية." },
        "tut-fan": { title: "مروحة توت عنخ آمون", introHeading: "مروحة النعام", introText: "مروحة مزخرفة بريش النعام الذهبي." },
        "victory-stele": { title: "لوحة انتصار مرنبتاح", introHeading: "لوحة الانتصار", introText: "تسجل انتصارات الملك." },
        "makeup-kit": { title: "أدوات تجميل", introHeading: "العناية والجمال", introText: "مجموعة من أدوات الزينة والمكياج القديمة." },
        "khafre-statue": { title: "تمثال خفرع", introHeading: "باني الهرم الثاني", introText: "تمثال من الديوريت يصور الملك." },
        "menkaure-statue": { title: "تمثال منقرع", introHeading: "باني الهرم الثالث", introText: "تمثال يجمع بين الملك والإلهة." },
        "scribe-palette": { title: "لوحة الكاتب", introHeading: "أدوات الكتابة", introText: "لوحة تحتوي على ألوان للكتابة." },
        "cosmetic-palette": { title: "صلاية نعرمر", introHeading: "توحيد القطرين", introText: "لوحة تاريخية تصور توحيد مصر." },
        "mummy-mask": { title: "قناع مومياء", introHeading: "حماية الوجه", introText: "قناع جنائزي مذهب." },
        "ancient-sandals": { title: "صندل قديم", introHeading: "أحذية ملكية", introText: "صندل مصنوع من أوراق البردي والذهب." },
        "column-merneptah": { title: "عمود مرنبتاح", introHeading: "عمود أثري", introText: "عمود حجري يحمل نقوش الملك." },
        "ptolemaic-king": { title: "ملك بطلمي", introHeading: "حاكم بطلمي", introText: "تمثال من العصر اليوناني الروماني." },
        "ptolemaic-queen": { title: "ملكة بطلمية", introHeading: "ملكة بطلمية", introText: "تمثال لملكة من العصر اليوناني الروماني." },
        "sarcophagus-seti": { title: "تابوت سيتي الأول", introHeading: "تابوت ملكي", introText: "تابوت رائع من الألباستر." },
        "canopic-hetepheres": { title: "أواني حتب حرس", introHeading: "أواني كانوبية", introText: "للاحتفاظ بأحشاء الملكة." },
        "mask-psusennes": { title: "قناع بسوسنس الأول", introHeading: "قناع فضي", introText: "قناع جنائزي من الفضة والذهب." },
        "statue-1": { title: "تمثال أثري", introHeading: "تمثال قديم", introText: "تمثال يمثل شخصية مصرية قديمة." },
        "narmer-palette": { title: "صلاية نعرمر", introHeading: "توحيد مصر", introText: "لوحة تسجل انتصار الملك نعرمر." },
        "predynastic-vessel": { title: "إناء ما قبل الأسرات", introHeading: "فخار قديم", introText: "إناء مزخرف من فترة مبكرة." },
        "flint-knife": { title: "سكين صوان", introHeading: "أداة حادة", introText: "سكين مزخرف من عصور ما قبل التاريخ." },
        "featured-tut-mask": { title: "قناع توت عنخ آمون", introHeading: "تحفة فنية", introText: "قناع الموت الشهير." },
        "featured-ramses": { title: "تمثال رمسيس", introHeading: "الملك العظيم", introText: "تمثال ضخم يمثل القوة المطلقة." },
        "featured-sphinx": { title: "أبو الهول", introHeading: "حارس الأهرامات", introText: "تمثال ضخم برأس إنسان وجسم أسد." },
        "featured-nefertari": { title: "نفرتاري", introHeading: "الزوجة الملكية", introText: "الملكة نفرتاري، زوجة رمسيس الثاني." },
        "featured-blue-hippo": { title: "فرس النهر الأزرق", introHeading: "تمثال خزفي", introText: "فرس نهر من الفخار الأزرق." },
        "featured-anubis": { title: "أنوبيس", introHeading: "حامي المقابر", introText: "إله التحنيط." },
        "featured-bastet": { title: "باستيت", introHeading: "إلهة القطة", introText: "إلهة المنزل والقطط." },
        "featured-hatshepsut": { title: "حتشبسوت", introHeading: "الملكة الفرعون", introText: "المرأة التي حكمت مصر كملك." },
        "featured-khufu": { title: "خوفو", introHeading: "باني الهرم الأكبر", introText: "تمثال صغير للملك خوفو." },
        "featured-thutmose": { title: "تحتمس الثالث", introHeading: "القائد العسكري", introText: "أعظم قائد عسكري في مصر." },
        "anubis-statue": { title: "تمثال أنوبيس", introHeading: "الحارس", introText: "تمثال لأنوبيس لحماية المقبرة." },
        "6643b109558a239478145f0c": { title: "قطعة من كتاب الموتى", introHeading: "رحلة الروح", introText: "بردية تحتوي على نصوص سحرية." },
        "shabti-tut": { title: "أوشابتي توت عنخ آمون", introHeading: "الخدم في العالم الآخر", introText: "تماثيل صغيرة لخدمة الملك." },
        "6643b109558a239478145f0a": { title: "تمثال خشبي", introHeading: "تمثال قديم", introText: "قطعة خشبية أثرية." },
        "fayum-portrait": { title: "بورتريه الفيوم", introHeading: "فن الوجوه", introText: "لوحة وجه ملونة للمتوفى." },
        "sarapis-statue": { title: "تمثال سيرابيس", introHeading: "الإله المندمج", introText: "إله يجمع بين الصفات المصرية واليونانية." },
        "terracotta-figure": { title: "تمثال طيني", introHeading: "فن شعبي", introText: "تمثال صغير من الطين." },
        "alexander-statue": { title: "تمثال الإسكندر", introHeading: "الفاتح العظيم", introText: "تمثال للإسكندر الأكبر." },
        "djoser-statue": { title: "تمثال زوسر", introHeading: "باني الهرم المدرج", introText: "تمثال للملك زوسر." },
        "6643b109558a239478145f08": { title: "قطعة أثرية", introHeading: "مقتنيات", introText: "قطعة أثرية غير محددة." },
        "6643b109558a239478145f0b": { title: "تمثال صغير", introHeading: "فن النحت", introText: "تمثال من الحجر." },
        "6643b109558a239478145f0d": { title: "تميمة جنائزية", introHeading: "سحر للحماية", introText: "تميمة جنائزية." },
        "6643b109558a239478145f0e": { title: "تمثال صغير", introHeading: "أوشابتي", introText: "خادم جنائزي." },
        "daily-1": { title: "قطعة يومية", introHeading: "فنون معتادة", introText: "قطعة من الاستخدام اليومي." },
        "ptah-sokar-osiris": { title: "بتاح سوكر أوزوريس", introHeading: "الإله الجنائزي", introText: "إله مركب للموت والبعث." },
        "shabti-box": { title: "صندوق أوشابتي", introHeading: "صندوق الخدم", introText: "صندوق خشبي مزخرف." },
        "papyrus-ani": { title: "بردية آني", introHeading: "كتاب الموتى", introText: "بردية شهيرة لكتاب الموتى." },
        "senusret-statue": { title: "تمثال سنوسرت الأول", introHeading: "ملك الدولة الوسطى", introText: "تمثال ضخم ومحفوظ." },
        "thutmose-statue": { title: "تمثال تحتمس الثالث", introHeading: "فرعون محارب", introText: "قائد عظيم." },
        "memnon-fragment": { title: "قطعة ممنون", introHeading: "بقايا تمثال", introText: "قطعة ضخمة من الحجر." },
        "weighing-heart-afterlife": { title: "وزن القلب", introHeading: "المحاكمة", introText: "مشهد محاكمة المتوفى." },
        "seqenenre-mummy": { title: "مومياء سقنن رع", introHeading: "الملك الشهيد", introText: "مومياء تظهر آثار معركة." },
        "seti-mummy": { title: "مومياء سيتي الأول", introHeading: "مومياء محفوظة", introText: "من أفضل المومياوات حفظاً." },
        "tiye-mummy": { title: "مومياء تي", introHeading: "الملكة العظيمة", introText: "مومياء بشعر طويل." },
        "rosetta-replica-gr": { title: "حجر رشيد", introHeading: "مفتاح اللغات", introText: "نسخة طبق الأصل." },
        "fayum-portrait-gr": { title: "بورتريه فيوم", introHeading: "فن الوجوه", introText: "لوحة ملونة." },
        "sarapis-statue-gr": { title: "سيرابيس", introHeading: "إله يجمع بين الحضارتين", introText: "إله هلنستي." },
        "pompeys-pillar": { title: "عمود السواري", introHeading: "عمود تذكاري", introText: "نصب تذكاري في الإسكندرية." },
        "crocodile-mummy": { title: "مومياء تمساح", introHeading: "إله سوبك", introText: "مومياء مقدسة." },
        "roman-emperor-pharaoh": { title: "إمبراطور روماني كفرعون", introHeading: "استمرار التقاليد", introText: "تمثال لإمبراطور روماني." },
        "mummy-cartonnage": { title: "كارتوناج المومياء", introHeading: "غلاف مومياء", introText: "غلاف مزخرف وملون للمومياء." }
    };
`;

// Inject into script
code = code.replace("function updateUI(art) {", transCode + "\n    function updateUI(art) {");

// Update UI assignments to use getTranslated
code = code.replace('document.querySelector(".artifact-title").textContent = art.title;', 'document.querySelector(".artifact-title").textContent = getTranslated("title", art.title);');
code = code.replace('document.querySelector(".intro-heading").textContent = art.introHeading;', 'document.querySelector(".intro-heading").textContent = getTranslated("introHeading", art.introHeading);');
code = code.replace('document.querySelector(".intro-text").textContent = art.introText;', 'document.querySelector(".intro-text").textContent = getTranslated("introText", art.introText);');
code = code.replace('document.querySelector(".details-heading").textContent = art.detailsHeading;', 'document.querySelector(".details-heading").textContent = getTranslated("detailsHeading", art.detailsHeading);');
code = code.replace('document.querySelector(".details-text").textContent = art.detailsText;', 'document.querySelector(".details-text").textContent = getTranslated("detailsText", art.detailsText);');

// For stats
code = code.replace('statsHTML += `<div class="stat-card">', 'statsHTML += `<div class="stat-card">');
code = code.replace('`<div class="stat-card">\\n                  <h4 class="stat-label">${stat.label}</h4>\\n                  <p class="stat-value">${stat.value}</p>\\n                </div>`', '`<div class="stat-card">\\n                  <h4 class="stat-label">${getTranslated(stat.label, stat.label)}</h4>\\n                  <p class="stat-value">${getTranslated(stat.value, stat.value)}</p>\\n                </div>`');

// Hardcoded HTML translations
code = code.replace('<h2>Overview</h2>', '<h2 data-i18n="overview">Overview</h2>');
code = code.replace('<h2>Details</h2>', '<h2 data-i18n="details">Details</h2>');
code = code.replace('<h3>Specifications</h3>', '<h3 data-i18n="specifications">Specifications</h3>');
code = code.replace('<span id="backBtnText">Back</span>', '<span id="backBtnText" data-i18n="backBtnText">Back</span>');
code = code.replace('View in AR', '<span data-i18n="view_ar">View in AR</span>');

// Adding language change listener to re-trigger updateUI
code = code.replace("updateUI(artifact);", "updateUI(artifact); window.addEventListener('languageChanged', () => updateUI(artifact));");

fs.writeFileSync('Artifact-show/code.html', code, 'utf8');
console.log('Successfully modified code.html for translations!');
