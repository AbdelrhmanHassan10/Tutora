const fs = require('fs');

// Read script.js to extract hallsData
const scriptContent = fs.readFileSync('Exhibition-Halls/script.js', 'utf8');

// Use regex to extract hallsData
const match = scriptContent.match(/const hallsData = (\[[\s\S]*?\]);\s*\/\//);
if (!match) {
    console.error('hallsData not found in script.js');
    process.exit(1);
}

let hallsData;
try {
    // Eval the array definition
    hallsData = eval(match[1]);
} catch (e) {
    console.error('Failed to eval hallsData:', e);
    process.exit(1);
}

// Prepare the JSON strings for 'en' and 'ar'
let enExhibition = {
    hero_accent: "The Gateway to Eternity",
    hero_title: "Exhibition <br>Halls",
    hero_desc: "Where the echoes of five millennia resonate through glass and stone. Experience the world's largest archaeological treasury.",
    hero_btn: "Begin Journey",
    stair_label: "Vertical History",
    stair_title: "The Grand <span style=\"color: var(--hall-gold);\">Staircase</span>",
    stair_desc: "Ascend through time on a monumental staircase featuring over 87 colossal statues, architectural remnants, and stelae. This vertical gallery tells the story of kingship and the divine in ancient Egypt, leading you to an unparalleled view of the Great Pyramids.",
    stair_feat1: "Royal Statues from the Old Kingdom",
    stair_feat2: "Chronological Ascension (4 Levels)",
    stair_badge: "87+ MONUMENTS",
    filter_all: "All Halls",
    filter_old: "Old Kingdom",
    filter_middle: "Middle Kingdom",
    filter_new: "New Kingdom",
    filter_greco: "Greco-Roman",
    search_placeholder: "Search treasures...",
    master_label: "Masterpiece Gallery",
    master_title: "Tutankhamun & <br><span style=\"color: var(--hall-gold);\">Royal Treasures</span>",
    master_desc: "Over 5,000 artifacts from the boy king's tomb are displayed in one immersive space for the first time in history.",
    no_results: "No treasures found matching your search. Please try a different period or keyword.",
    seq_label: "Sequential Discovery",
    seq_title: "The Main <span style=\"color: var(--hall-gold);\">Galleries</span>",
    halls: {},
    artifacts: {}
};

let arExhibition = {
    hero_accent: "بوابة الخلود",
    hero_title: "قاعات <br>العرض",
    hero_desc: "حيث يتردد صدى خمسة آلاف عام عبر الزجاج والحجر. استكشف أكبر كنز أثري في العالم.",
    hero_btn: "ابدأ الرحلة",
    stair_label: "التاريخ العمودي",
    stair_title: "الدرج <span style=\"color: var(--hall-gold);\">العظيم</span>",
    stair_desc: "اصعد عبر الزمن على درج أثري يضم أكثر من 87 تمثالًا ضخمًا وبقايا معمارية ولوحات. تروي هذه القاعة العمودية قصة الملكية والآلهة في مصر القديمة، وتقودك إلى إطلالة لا مثيل لها على أهرامات الجيزة.",
    stair_feat1: "تماثيل ملكية من الدولة القديمة",
    stair_feat2: "صعود زمني (4 مستويات)",
    stair_badge: "أكثر من 87 أثراً",
    filter_all: "جميع القاعات",
    filter_old: "الدولة القديمة",
    filter_middle: "الدولة الوسطى",
    filter_new: "الدولة الحديثة",
    filter_greco: "العصر اليوناني الروماني",
    search_placeholder: "ابحث عن الكنوز...",
    master_label: "معرض الروائع",
    master_title: "توت عنخ آمون و <br><span style=\"color: var(--hall-gold);\">الكنوز الملكية</span>",
    master_desc: "أكثر من 5000 قطعة أثرية من مقبرة الملك الشاب تُعرض في مساحة واحدة غامرة لأول مرة في التاريخ.",
    no_results: "لم يتم العثور على كنوز تطابق بحثك. يرجى تجربة فترة أو كلمة رئيسية مختلفة.",
    seq_label: "اكتشاف متسلسل",
    seq_title: "القاعات <span style=\"color: var(--hall-gold);\">الرئيسية</span>",
    halls: {},
    artifacts: {}
};

// Map names to Arabic
const arHallNames = {
    "Dawn & Old Kingdom": "عصر بداية الأسرات والدولة القديمة",
    "The Middle Kingdom": "الدولة الوسطى",
    "The New Kingdom": "الدولة الحديثة",
    "Late & Greco-Roman": "العصر المتأخر واليوناني الروماني",
    "Grand Hall (Atrium)": "البهو العظيم"
};
const arHallDescs = {
    "Dawn & Old Kingdom": "استكشف أصول المجتمع والمعتقدات.",
    "The Middle Kingdom": "فترة نهضة ثقافية.",
    "The New Kingdom": "العصر الذهبي للإمبراطورية.",
    "Late & Greco-Roman": "تحول مصر خلال عصر الانتقال الثالث.",
    "Grand Hall (Atrium)": "خلف تمثال رمسيس الضخم، يضم البهو العظيم كنوزًا."
};
const arHallLongDescs = {
    "Dawn & Old Kingdom": "استكشف أصول المجتمع والمعتقدات. شاهد الرأس البديلة الغامضة وتمثال بتاح سوكر أوزوريس الحامي من عصر بناة الأهرام.",
    "The Middle Kingdom": "فترة نهضة ثقافية. شاهد تمثال سنوسرت الأول المهيب واستكشف الحياة اليومية والقوة الملكية والروحانية لمصر الموحدة.",
    "The New Kingdom": "العصر الذهبي للإمبراطورية. شاهد لوحة الانتصار، وصندوق الأوشابتي الرائع، وبردية آني إلى جانب تماثيل المحارب تحتمس الثالث.",
    "Late & Greco-Roman": "تحول مصر خلال عصر الانتقال الثالث، وبلغ ذروته في التوليف الثقافي للعصر اليوناني الروماني وعمود بومبي.",
    "Grand Hall (Atrium)": "البهو العظيم هو المدخل المهيب للمتحف المصري الكبير، والذي يهيمن عليه تمثال الملك رمسيس الثاني الذي يبلغ وزنه 82 طنًا وارتفاعه 11 مترًا. تعمل هذه القاعة كبوابة لرحلة المتحف الزمنية، وتحيط بها عناصر معمارية ضخمة من سلالات مختلفة."
};
const arArtifactTranslations = {
    "Reserve Head": { name: "الرأس البديلة", desc: "نموذج من الحجر الجيري وضع في المقابر كمسكن بديل لروح المتوفى." },
    "Ptah-Sokar-Osiris": { name: "بتاح سوكر أوزوريس", desc: "إله جنائزي مركب يمثل الخلق والموت والبعث." },
    "Statue of Senusret I": { name: "تمثال سنوسرت الأول", desc: "تمثال ضخم جالس محفوظ جيدًا يظهر الأسلوب الفني الراقي للأسرة الثانية عشرة." },
    "Block Statue": { name: "تمثال الكتلة", desc: "شكل نحتي شهير من الدولة الوسطى يصور شخصًا جالسًا في وضع القرفصاء." },
    "Victory Stele of Merneptah": { name: "لوحة انتصار مرنبتاح", desc: "لوحة من الجرانيت الأسود تخلد ذكرى الانتصارات العسكرية للملك مرنبتاح وتتضمن أقدم ذكر معروف لـ 'إسرائيل'." },
    "Colossal Ramses II": { name: "رمسيس الثاني الضخم", desc: "التمثال الأساسي في البهو العظيم، يستقبل كل زائر بالسلطة الإلهية." },
    "Colossus of a Ptolemaic King": { name: "تمثال ضخم لملك بطلمي", desc: "تمثال ضخم تم انتشاله من البحر الأبيض المتوسط." },
    "Colossus of a Ptolemaic Queen": { name: "تمثال ضخم لملكة بطلمية", desc: "تمثال ضخم لملكة مصورة على الطراز المصري التقليدي." },
    "Granite Column of Merneptah": { name: "عمود مرنبتاح الجرانيتي", desc: "عمود ضخم من الجرانيت الأحمر منقوش عليه انتصارات." }
};

hallsData.forEach(hall => {
    enExhibition.halls[hall.id] = {
        name: hall.name,
        shortDesc: hall.shortDesc,
        longDesc: hall.longDesc
    };
    arExhibition.halls[hall.id] = {
        name: arHallNames[hall.name] || hall.name,
        shortDesc: arHallDescs[hall.name] || hall.shortDesc,
        longDesc: arHallLongDescs[hall.name] || hall.longDesc
    };

    hall.artifacts.forEach(art => {
        const artId = art.id || art.name.replace(/\\s+/g, '_');
        enExhibition.artifacts[artId] = {
            name: art.name,
            desc: art.desc
        };
        const arArt = arArtifactTranslations[art.name] || {};
        arExhibition.artifacts[artId] = {
            name: arArt.name || art.name,
            desc: arArt.desc || art.desc
        };
    });
});

// Now inject into global-lang.js
let globalLangContent = fs.readFileSync('global-lang.js', 'utf8');

// Inject enExhibition
const enExhibitionStr = "exhibition: " + JSON.stringify(enExhibition, null, 12) + ",\\n            // END EXHIBITION EN";
globalLangContent = globalLangContent.replace(/en:\s*\{/, "en: {\\n            " + enExhibitionStr);

// Inject arExhibition
const arExhibitionStr = "exhibition: " + JSON.stringify(arExhibition, null, 12) + ",\\n            // END EXHIBITION AR";
globalLangContent = globalLangContent.replace(/ar:\s*\{/, "ar: {\\n            " + arExhibitionStr);

fs.writeFileSync('global-lang.js', globalLangContent);
console.log("Successfully injected exhibition translations.");
