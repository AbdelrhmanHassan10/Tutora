const fs = require('fs');

const en = {};
const ar = {};

const halls = [
    {
        id: 'grand-hall', name: 'Grand Hall (Atrium)', era: 'New Kingdom',
        short: 'Stand beneath the towering presence of Ramses II in this colossal architectural masterpiece.',
        long: 'The Grand Hall is the majestic entrance to the GEM, dominated by the 82-ton, 11-meter-high statue of King Ramses II. This hall serves as a gateway to the museum’s chronological journey, surrounded by colossal architectural elements from various dynasties.',
        arName: 'البهو العظيم', arEra: 'الدولة الحديثة',
        arShort: 'قف تحت الحضور الشاهق لرمسيس الثاني في هذه التحفة المعمارية الضخمة.',
        arLong: 'البهو العظيم هو المدخل المهيب للمتحف المصري الكبير، والذي يهيمن عليه تمثال الملك رمسيس الثاني الذي يبلغ وزنه 82 طنًا وارتفاعه 11 مترًا. تعمل هذه القاعة كبوابة لرحلة المتحف الزمنية، وتحيط بها عناصر معمارية ضخمة من سلالات مختلفة.'
    },
    {
        id: 'predynastic', name: 'Gallery 01: Pre-Dynastic & Early Dynastic', era: 'Old Kingdom',
        short: 'The dawn of civilization. Explore the earliest artifacts that paved the way for the Pharaohs.',
        long: 'Before the pyramids were built, early Egyptians were already creating exquisite pottery, weapons, and ceremonial palettes. This gallery showcases the foundational era of Egyptian civilization before the unification of the Two Lands.',
        arName: 'القاعة 01: عصر ما قبل الأسرات والأسرات المبكرة', arEra: 'عصر ما قبل الأسرات',
        arShort: 'فجر الحضارة. استكشف أقدم القطع الأثرية التي مهدت الطريق للفراعنة.',
        arLong: 'قبل بناء الأهرامات، كان المصريون الأوائل يصنعون بالفعل أواني فخارية وأسلحة ولوحات احتفالية رائعة. يعرض هذا المعرض العصر التأسيسي للحضارة المصرية قبل توحيد القطرين.'
    },
    {
        id: 'sculpture', name: 'Gallery 02: Old Kingdom Sculpture', era: 'Old Kingdom',
        short: 'Marvel at the lifelike masterpieces that immortalized the builders of the pyramids.',
        long: 'The Old Kingdom is renowned for its breathtaking statuary. This gallery features masterpieces of royal and private sculpture, demonstrating the Egyptians\' early mastery over hard stones and their quest for eternal life.',
        arName: 'القاعة 02: منحوتات الدولة القديمة', arEra: 'الدولة القديمة',
        arShort: 'تعجب من الروائع النابضة بالحياة التي خلدت بناة الأهرامات.',
        arLong: 'تشتهر الدولة القديمة بتماثيلها المذهلة. يضم هذا المعرض روائع المنحوتات الملكية والخاصة، مما يدل على براعة المصريين المبكرة في التعامل مع الأحجار الصلبة وسعيهم للحياة الأبدية.'
    },
    {
        id: 'old-kingdom-beliefs', name: 'Gallery 03: Old Kingdom Beliefs', era: 'Old Kingdom',
        short: 'Uncover the religious foundation and early funerary practices of ancient Egypt.',
        long: 'Beliefs in the afterlife took physical form during the Old Kingdom. This gallery displays the earliest funerary texts, reserve heads, and magical objects intended to ensure the deceased\'s survival in the next world.',
        arName: 'القاعة 03: معتقدات الدولة القديمة', arEra: 'الدولة القديمة',
        arShort: 'اكتشف الأساس الديني والممارسات الجنائزية المبكرة لمصر القديمة.',
        arLong: 'اتخذت معتقدات الحياة الآخرة شكلاً ماديًا خلال الدولة القديمة. يعرض هذا المعرض أقدم النصوص الجنائزية، والرؤوس البديلة، والأشياء السحرية التي تهدف إلى ضمان بقاء المتوفى في العالم الآخر.'
    },
    {
        id: 'daily-life', name: 'Gallery 04: Middle Kingdom Society', era: 'Middle Kingdom',
        short: 'A golden age of literature, arts, and the lives of ordinary citizens.',
        long: 'The Middle Kingdom is considered the classical age of Egyptian culture. Step into the daily lives of ancient Egyptians through their intricate jewelry, tools, cosmetics, and fascinating recreational games.',
        arName: 'القاعة 04: مجتمع الدولة الوسطى', arEra: 'الدولة الوسطى',
        arShort: 'العصر الذهبي للأدب والفنون وحياة المواطنين العاديين.',
        arLong: 'تعتبر الدولة الوسطى العصر الكلاسيكي للثقافة المصرية. ادخل في الحياة اليومية للمصريين القدماء من خلال مجوهراتهم المعقدة وأدواتهم ومستحضرات التجميل والألعاب الترفيهية الرائعة.'
    },
    {
        id: 'middle-kingdom-kingship', name: 'Gallery 05: Middle Kingdom Kingship', era: 'Middle Kingdom',
        short: 'See the humanized, somber faces of the Middle Kingdom Pharaohs.',
        long: 'Unlike the divine, idealized statues of the Old Kingdom, Middle Kingdom royal portraits display unprecedented realism. Look into the tired, burdened faces of kings who ruled during an era of profound political change.',
        arName: 'القاعة 05: ملوك الدولة الوسطى', arEra: 'الدولة الوسطى',
        arShort: 'شاهد الوجوه البشرية الكئيبة لفراعنة الدولة الوسطى.',
        arLong: 'على عكس التماثيل الإلهية المثالية في الدولة القديمة، تُظهر الصور الملكية في الدولة الوسطى واقعية غير مسبوقة. انظر إلى الوجوه المتعبة والمثقلة بالهموم للملوك الذين حكموا خلال عصر من التغيير السياسي العميق.'
    },
    {
        id: 'new-kingdom-society', name: 'Gallery 07: New Kingdom Society', era: 'New Kingdom',
        short: 'Experience the wealth, cosmopolitan life, and vivid culture of the Empire.',
        long: 'During the New Kingdom, Egypt became a global empire. This gallery showcases the unprecedented wealth, luxurious lifestyles, vibrant fashion, and advanced tools used by the society that thrived along the Nile.',
        arName: 'القاعة 07: مجتمع الدولة الحديثة', arEra: 'الدولة الحديثة',
        arShort: 'جرب الثروة والحياة العالمية والثقافة النابضة بالحياة للإمبراطورية.',
        arLong: 'خلال الدولة الحديثة، أصبحت مصر إمبراطورية عالمية. يعرض هذا المعرض الثروة غير المسبوقة، وأساليب الحياة الفاخرة، والأزياء النابضة بالحياة، والأدوات المتقدمة التي استخدمها المجتمع الذي ازدهر على طول نهر النيل.'
    },
    {
        id: 'imperial-kingship', name: 'Gallery 08: Imperial Kingship', era: 'New Kingdom',
        short: 'Behold the mighty warrior pharaohs and the revolutionary Amarna period.',
        long: 'This gallery focuses on the most famous pharaohs in history—from Thutmose III, the Napoleon of Egypt, to the controversial \'heretic king\' Akhenaten. Witness the evolution of imperial art and power.',
        arName: 'القاعة 08: الملوك الإمبراطوريون', arEra: 'الدولة الحديثة',
        arShort: 'شاهد الفراعنة المحاربين الأقوياء وفترة العمارنة الثورية.',
        arLong: 'يركز هذا المعرض على أشهر الفراعنة في التاريخ - من تحتمس الثالث، نابليون مصر، إلى المثير للجدل \'الملك المهرطق\' أخناتون. شاهد تطور الفن الإمبراطوري والقوة.'
    },
    {
        id: 'afterlife', name: 'Gallery 09: Beliefs in the Afterlife', era: 'New Kingdom',
        short: 'Journey through the perilous underworld as ancient Egyptians envisioned it.',
        long: 'To achieve eternal life, an Egyptian had to pass through the treacherous Duat. Here you will find the magical amulets, intricate sarcophagi, and the Books of the Netherworld designed to protect the soul.',
        arName: 'القاعة 09: معتقدات الحياة الآخرة', arEra: 'الدولة الحديثة',
        arShort: 'رحلة عبر العالم السفلي المحفوف بالمخاطر كما تخيله المصريون القدماء.',
        arLong: 'لتحقيق الحياة الأبدية، كان على المصري المرور عبر الدوات الغادرة. ستجد هنا التمائم السحرية والتوابيت المعقدة وكتب العالم السفلي المصممة لحماية الروح.'
    },
    {
        id: 'tutankhamun', name: 'Special: Tutankhamun Galleries', era: 'New Kingdom',
        short: 'The complete, unedited collection of the boy king’s legendary treasures.',
        long: '<p style="margin-bottom: 2rem;">For the first time since their discovery in 1922, over 5,000 artifacts from the tomb of King Tutankhamun are displayed together. Experience the gold, the mystery, and the legacy of the boy pharaoh.</p><div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 2rem;"><div class="staircase-feature"><div class="feature-icon-wrapper"><span class="material-symbols-outlined">diamond</span></div><span class="feature-text">The Complete Collection (5,000+ Pieces)</span></div><div class="staircase-feature"><div class="feature-icon-wrapper"><span class="material-symbols-outlined">history_edu</span></div><span class="feature-text">The Legacy of the Boy Pharaoh</span></div></div>',
        arName: 'خاص: معارض توت عنخ آمون', arEra: 'الدولة الحديثة',
        arShort: 'المجموعة الكاملة وغير المعدلة لكنوز الملك الشاب الأسطورية.',
        arLong: '<p style="margin-bottom: 2rem;">لأول مرة منذ اكتشافها في عام 1922، يتم عرض أكثر من 5000 قطعة أثرية من مقبرة الملك توت عنخ آمون معًا. اختبر الذهب والغموض وإرث الفرعون الشاب.</p><div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 2rem;"><div class="staircase-feature"><div class="feature-icon-wrapper"><span class="material-symbols-outlined">diamond</span></div><span class="feature-text">المجموعة الكاملة (أكثر من 5000 قطعة)</span></div><div class="staircase-feature"><div class="feature-icon-wrapper"><span class="material-symbols-outlined">history_edu</span></div><span class="feature-text">إرث الفرعون الشاب</span></div></div>'
    },
    {
        id: 'royal-mummies', name: 'Special: Royal Mummies Hall', era: 'New Kingdom',
        short: 'Stand face-to-face with the legendary rulers of the New Kingdom.',
        long: 'A solemn, respectful environment housing the preserved bodies of Egypt’s greatest pharaohs and queens. Discover the sophisticated mummification techniques that allowed them to survive millennia.',
        arName: 'خاص: قاعة المومياوات الملكية', arEra: 'الدولة الحديثة',
        arShort: 'قف وجهًا لوجه مع الحكام الأسطوريين للدولة الحديثة.',
        arLong: 'بيئة مهيبة ومحترمة تضم الأجساد المحفوظة لأعظم الفراعنة والملكات في مصر. اكتشف تقنيات التحنيط المعقدة التي سمحت لهم بالبقاء لآلاف السنين.'
    },
    {
        id: 'grecoroman', name: 'Gallery 12: Greco-Roman Period', era: 'Greco-Roman',
        short: 'The fusion of worlds. Witness the cultural blend of ancient Egypt with Greek and Roman influences.',
        long: 'After Alexander the Great’s conquest, Egypt became a crossroads of cultures. This gallery shows the fascinating hybrid art, where Pharaohs were depicted in Greek styles and Roman emperors adopted Egyptian titles.',
        arName: 'القاعة 12: العصر اليوناني الروماني', arEra: 'العصر اليوناني الروماني',
        arShort: 'اندماج العوالم. شاهد المزيج الثقافي لمصر القديمة مع التأثيرات اليونانية والرومانية.',
        arLong: 'بعد غزو الإسكندر الأكبر، أصبحت مصر مفترق طرق للثقافات. يُظهر هذا المعرض الفن الهجين الرائع، حيث تم تصوير الفراعنة بالأساليب اليونانية واتخذ الأباطرة الرومان ألقابًا مصرية.'
    }
];

halls.forEach(hall => {
    en['exhibition.halls.' + hall.id + '.name'] = hall.name;
    en['exhibition.halls.' + hall.id + '.era'] = hall.era;
    en['exhibition.halls.' + hall.id + '.shortDesc'] = hall.short;
    en['exhibition.halls.' + hall.id + '.longDesc'] = hall.long;

    ar['exhibition.halls.' + hall.id + '.name'] = hall.arName;
    ar['exhibition.halls.' + hall.id + '.era'] = hall.arEra;
    ar['exhibition.halls.' + hall.id + '.shortDesc'] = hall.arShort;
    ar['exhibition.halls.' + hall.id + '.longDesc'] = hall.arLong;
});

const enEntries = Object.entries(en).map(([k,v]) => `        "${k}": ${JSON.stringify(v)}`).join(',\n');
const arEntries = Object.entries(ar).map(([k,v]) => `        "${k}": ${JSON.stringify(v)}`).join(',\n');

let langContent = fs.readFileSync('global-lang.js', 'utf8');
langContent = langContent.replace(/(en:\s*\{)/, '$1\n' + enEntries + ',');
langContent = langContent.replace(/(ar:\s*\{)/, '$1\n' + arEntries + ',');
fs.writeFileSync('global-lang.js', langContent);
console.log('Injected translations into global-lang.js');
