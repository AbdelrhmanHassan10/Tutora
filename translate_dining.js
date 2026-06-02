const fs = require('fs');

const map = {
    'TUTORA | Museum Dining': { k: 'dining.title', ar: 'توتورا | مطاعم المتحف' },
    'A Culinary Expedition': { k: 'dining.culinary_expedition', ar: 'رحلة استكشافية في الطهي' },
    'SAVOR THE': { k: 'dining.savor_the', ar: 'تذوق' },
    'LEGACY': { k: 'dining.legacy', ar: 'الإرث' },
    "From artisanal Egyptian street food to luxury French p&eacute;tisserie, experience the diverse flavors of the Nile within the world's most architectural dining destination.": { k: 'dining.hero_desc', ar: 'من أطعمة الشارع المصرية الحرفية إلى المعجنات الفرنسية الفاخرة، جرب نكهات النيل المتنوعة داخل وجهة تناول الطعام الأكثر معمارية في العالم.' },
    "From artisanal Egyptian street food to luxury French pâtisserie, experience the diverse flavors of the Nile within the world's most architectural dining destination.": { k: 'dining.hero_desc', ar: 'من أطعمة الشارع المصرية الحرفية إلى المعجنات الفرنسية الفاخرة، جرب نكهات النيل المتنوعة داخل وجهة تناول الطعام الأكثر معمارية في العالم.' },
    'Explore Venues': { k: 'dining.explore_venues', ar: 'استكشاف الأماكن' },
    'Reservations': { k: 'dining.reservations', ar: 'الحجوزات' },
    "The Chef's Selection": { k: 'dining.chef_selection', ar: 'اختيارات الشيف' },
    'Signature': { k: 'dining.signature', ar: 'الرئيسي' },
    'Masterpiece': { k: 'dining.masterpiece', ar: 'تحفة فنية' },
    "Our executive chefs have curated a menu that honors ancient Egyptian ingredientsâ€”date honey, emmer wheat, and Nilotic spicesâ€”transformed into modern culinary art.": { k: 'dining.chef_desc', ar: 'لقد قام طهاتنا التنفيذيون بتنظيم قائمة طعام تكرم المكونات المصرية القديمة - عسل التمر وقمح الإيمر والتوابل النيلية - وتحويلها إلى فن طهي حديث.' },
    "Our executive chefs have curated a menu that honors ancient Egyptian ingredients—date honey, emmer wheat, and Nilotic spices—transformed into modern culinary art.": { k: 'dining.chef_desc', ar: 'لقد قام طهاتنا التنفيذيون بتنظيم قائمة طعام تكرم المكونات المصرية القديمة - عسل التمر وقمح الإيمر والتوابل النيلية - وتحويلها إلى فن طهي حديث.' },
    'Private curatorial dining rooms': { k: 'dining.benefit_1', ar: 'غرف طعام خاصة للقيّمين' },
    'Pyramid-view terrace seating': { k: 'dining.benefit_2', ar: 'جلوس في التراس بإطلالة على الأهرامات' },
    'Bespoke historical tasting menus': { k: 'dining.benefit_3', ar: 'قوائم تذوق تاريخية مخصصة' },
    'Book an Experience': { k: 'dining.book_experience', ar: 'احجز تجربة' },
    'Culinary Excellence': { k: 'dining.culinary_excellence', ar: 'التميز في الطهي' },
    'Highlights': { k: 'dining.highlights', ar: 'يسلط الضوء' },
    'Modern Egyptian': { k: 'dining.modern_egyptian', ar: 'مصري حديث' },
    'Zooba Gourmet Mezze': { k: 'dining.zooba_mezze', ar: 'مقبلات زوبا الفاخرة' },
    'Experience the soul of Cairo with artisanal falafel, gourmet sliders, and our signature handcrafted hibiscus infusion.': { k: 'dining.zooba_desc', ar: 'جرب روح القاهرة مع الفلافل الحرفية والمتزلجون الذواقة ومشروب الكركديه المصنوع يدويًا.' },
    'Specialty Brew': { k: 'dining.specialty_brew', ar: 'مشروب متخصص' },
    'The Grand Nile Roast': { k: 'dining.grand_nile_roast', ar: 'تحميص النيل الكبير' },
    'Exceptional single-origin Ethiopian beans, precision-brewed while overlooking the majestic Giza Plateau.': { k: 'dining.coffee_desc', ar: 'حبوب إثيوبية استثنائية من أصل واحد، تم تحضيرها بدقة بينما تطل على هضبة الجيزة المهيبة.' },
    'Parisian Pâtisserie': { k: 'dining.parisian_patisserie', ar: 'باتيسري باريسية' },
    'Ladurée Ispahan': { k: 'dining.laduree_ispahan', ar: 'لادوريه أصفهان' },
    'A globally renowned Parisian masterpiece featuring delicate rose petals, fresh raspberries, and exotic lychee.': { k: 'dining.laduree_desc', ar: 'تحفة باريسية مشهورة عالميًا تتميز بتلات الورد الرقيقة وتوت العليق الطازج والليتشي الغريب.' },
    'The Gastronomy': { k: 'dining.gastronomy', ar: 'فن الطهو' },
    'Coming soon!': { k: 'dining.coming_soon', ar: 'قريباً!' },
    'The Pyramids Restaurant': { k: 'dining.pyramids_rest', ar: 'مطعم الأهرامات' },
    'Ignite your appetite with world-class signature dishes overlooking the Pyramids. A pinnacle of fine dining at the GEM.': { k: 'dining.pyramids_desc', ar: 'أشعل شهيتك بأطباق رئيسية عالمية تطل على الأهرامات. قمة تناول الطعام الفاخر في المتحف المصري الكبير.' },
    'Opening Soon': { k: 'dining.opening_soon', ar: 'يفتح قريباً' },
    'Signature Fine Dining': { k: 'dining.signature_fine', ar: 'تناول الطعام الفاخر المميز' },
    'Award Winning': { k: 'dining.award_winning', ar: 'حائز على جوائز' },
    "Egypt's first award-winning specialty coffee roastery. Experience artisanal brewing techniques and premium beans in a sophisticated urban setting.": { k: 'dining.30north_desc', ar: 'أول محمصة قهوة متخصصة حائزة على جوائز في مصر. جرب تقنيات التحضير الحرفية والفاصوليا الفاخرة في بيئة حضرية راقية.' },
    'Specialty Coffee & Brunch': { k: 'dining.specialty_coffee', ar: 'قهوة متخصصة وبرانش' },
    'GEM Exclusive Menu': { k: 'dining.gem_exclusive', ar: 'قائمة حصرية للمتحف' },
    "Authentic Egyptian street food reimagined. Famous for its vibrant Cairene atmosphere and contemporary takes on traditional staples like Koshary and Ta'ameya.": { k: 'dining.zooba_full_desc', ar: 'إعادة تصور أطعمة الشارع المصرية الأصيلة. يشتهر بجوه القاهري النابض بالحياة ولمساته المعاصرة على الأطباق التقليدية مثل الكشري والطعمية.' },
    'Contemporary Street Food': { k: 'dining.contemporary_street', ar: 'طعام الشارع المعاصر' },
    'Homegrown Favorite': { k: 'dining.homegrown_fav', ar: 'المفضل المحلي' },
    'Bitter Sweet': { k: 'dining.bitter_sweet', ar: 'بيتر سويت' },
    'A homegrown favorite offering a multisensory dining experience with a refined selection of international dishes, gourmet brunch, and artisanal desserts.': { k: 'dining.bitter_sweet_desc', ar: 'مفضل محلي يقدم تجربة تناول طعام متعددة الحواس مع مجموعة راقية من الأطباق العالمية والبرانش الذواقة والحلويات الحرفية.' },
    'International Bistro': { k: 'dining.intl_bistro', ar: 'بيسترو عالمي' },
    'Heritage Spirit': { k: 'dining.heritage_spirit', ar: 'روح التراث' },
    'Beano\'s Caf&eacute;': { k: 'dining.beanos', ar: 'مقهى بينوس' },
    'Beano\'s Café': { k: 'dining.beanos', ar: 'مقهى بينوس' },
    'Blends its cozy identity with the spirit of Egyptian civilization using local alabaster and Aswan granite materials.': { k: 'dining.beanos_desc', ar: 'يمزج هويته المريحة مع روح الحضارة المصرية باستخدام مواد الألباستر المحلي وجرانيت أسوان.' },
    'Cultural Cafe': { k: 'dining.cultural_cafe', ar: 'مقهى ثقافي' },
    'Parisian Origin': { k: 'dining.parisian_origin', ar: 'أصل باريسي' },
    'Laduree': { k: 'dining.laduree', ar: 'لادوريه' },
    'Upscale bakery with Parisian origins, serving a unique collection of world-famous macarons and sweets at the GEM.': { k: 'dining.laduree_full_desc', ar: 'مخبز راقٍ ذو أصول باريسية، يقدم مجموعة فريدة من الماكرون والحلويات ذات الشهرة العالمية في المتحف المصري الكبير.' },
    'Luxury P&eacute;tisserie': { k: 'dining.luxury_patisserie', ar: 'باتيسري فاخرة' },
    'Luxury Pâtisserie': { k: 'dining.luxury_patisserie', ar: 'باتيسري فاخرة' },
    '100% Italian Gelato': { k: 'dining.italian_gelato', ar: 'جيلاتو إيطالي 100٪' },
    'Dolato': { k: 'dining.dolato', ar: 'دولاتو' },
    'A treat shop where your comfort cone takes you on an emotional roller-coaster with authentic Italian Gelato.': { k: 'dining.dolato_desc', ar: 'متجر حلوى حيث يأخذك مخروط الراحة الخاص بك في رحلة عاطفية مليئة بالجيلاتو الإيطالي الأصيل.' },
    'Gelato Shop': { k: 'dining.gelato_shop', ar: 'متجر جيلاتو' },
    'Legend Since 1928': { k: 'dining.legend_1928', ar: 'أسطورة منذ 1928' },
    'Mandarine Koueider': { k: 'dining.mandarine', ar: 'ماندرين قويدر' },
    'Exceptional quality and timeless craftsmanship in oriental sweets, from artisanal ice cream to signature pastries.': { k: 'dining.mandarine_desc', ar: 'جودة استثنائية وحرفية خالدة في الحلويات الشرقية، من الآيس كريم الحرفي إلى المعجنات المميزة.' },
    'Oriental Sweets': { k: 'dining.oriental_sweets', ar: 'حلويات شرقية' },
    'Pyramid Gelato': { k: 'dining.pyramid_gelato', ar: 'جيلاتو الأهرامات' },
    'Italian artisanal gelato with a historical twist. Try the famous Pyramid-shaped treats and exclusive Egyptian flavors.': { k: 'dining.pyramid_gelato_desc', ar: 'جيلاتو إيطالي حرفي مع لمسة تاريخية. جرب الحلويات الشهيرة على شكل أهرامات والنكهات المصرية الحصرية.' },
    'Artisanal Gelato': { k: 'dining.artisanal_gelato', ar: 'جيلاتو حرفي' },
    'Everyday Needs': { k: 'dining.everyday_needs', ar: 'الاحتياجات اليومية' },
    'Premium Mart': { k: 'dining.premium_mart', ar: 'بريميوم مارت' },
    'A convenience store for your everyday items, covering all your essentials while exploring the GEM complex.': { k: 'dining.mart_desc', ar: 'متجر صغير للعناصر اليومية الخاصة بك، يغطي جميع أساسياتك أثناء استكشاف مجمع المتحف المصري الكبير.' },
    'Convenience Mart': { k: 'dining.convenience_mart', ar: 'متجر صغير' },
    'Exclusivity': { k: 'dining.exclusivity', ar: 'حصرية' },
    'DINING BEYOND': { k: 'dining.dining_beyond', ar: 'تناول طعام يتجاوز' },
    'HISTORY': { k: 'dining.history', ar: 'التاريخ' },
    'Secure your place at the heart of the Grand Egyptian Museum. Experience a culinary odyssey where ancient heritage meets modern fine dining.': { k: 'dining.reserve_desc', ar: 'تأمين مكانك في قلب المتحف المصري الكبير. جرب رحلة طهي تلتقي فيها التراث القديم بتناول الطعام الفاخر الحديث.' },
    'World Class': { k: 'dining.world_class', ar: 'مستوى عالمي' },
    'Chef Curated': { k: 'dining.chef_curated', ar: 'برعاية الشيف' },
    'Pyramid View': { k: 'dining.pyramid_view', ar: 'إطلالة على الأهرام' },
    'Private Terrace': { k: 'dining.private_terrace', ar: 'شرفة خاصة' },
    'Reserve Your': { k: 'dining.reserve_your', ar: 'احجز' },
    'Table': { k: 'dining.table', ar: 'طاولتك' },
    'Preferred Venue': { k: 'dining.preferred_venue', ar: 'المكان المفضل' },
    'Select Restaurant': { k: 'dining.select_restaurant', ar: 'حدد مطعم' },
    'Zooba - Street Gourmet': { k: 'dining.zooba_street', ar: 'زوبا - طعام الشارع' },
    '30 NORTH - Specialty Coffee': { k: 'dining.30north_coffee', ar: '30 نورث - قهوة متخصصة' },
    'Ladurée - French Pâtisserie': { k: 'dining.laduree_french', ar: 'لادوريه - باتيسري فرنسية' },
    'Ladur&eacute;e - French P&eacute;tisserie': { k: 'dining.laduree_french', ar: 'لادوريه - باتيسري فرنسية' },
    'The Grand Lounge - Fine Dining': { k: 'dining.grand_lounge', ar: 'جراند لاونج - تناول طعام فاخر' },
    'Date': { k: 'dining.date', ar: 'التاريخ' },
    'Time': { k: 'dining.time', ar: 'الوقت' },
    'Number of Guests': { k: 'dining.guests', ar: 'عدد الضيوف' },
    'Verify Availability': { k: 'dining.verify_avail', ar: 'التحقق من التوفر' },
    'Dining Schedule': { k: 'dining.dining_schedule', ar: 'جدول تناول الطعام' },
    'Fine Dining': { k: 'dining.fine_dining', ar: 'تناول الطعام الفاخر' },
    'Cafés & Bistros': { k: 'dining.cafes_bistros', ar: 'المقاهي والبيسترو' },
    'Caf&eacute;s & Bistros': { k: 'dining.cafes_bistros', ar: 'المقاهي والبيسترو' },
    'Street Food & Quick Bites': { k: 'dining.street_food', ar: 'طعام الشارع والوجبات السريعة' }
};

let htmlContent = fs.readFileSync('-museum_dining/code.html', 'utf8');
let langContent = fs.readFileSync('global-lang.js', 'utf8');

for (const [enText, data] of Object.entries(map)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const regexLoose = new RegExp(`(>\\s*)(${escapedText})(\\s*<)`, 'g');
    htmlContent = htmlContent.replace(regexLoose, (match, p1, p2, p3) => {
        if (p1.includes('data-i18n')) return match;
        return `${p1}<span data-i18n="${data.k}">${p2}</span>${p3}`;
    });

    if (!htmlContent.includes(`data-i18n="${data.k}"`)) {
        htmlContent = htmlContent.replace(`placeholder="${enText}"`, `placeholder="${enText}" data-i18n-placeholder="${data.k}"`);
    }
}

// Special case title
htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title data-i18n="dining.title">TUTORA | Museum Dining</title>');

// Add language button to header if missing
if (!htmlContent.includes('id="langBtn"')) {
    const target = `<button class="theme-toggle" id="themeToggle">
                <span class="material-symbols-outlined">dark_mode</span>
            </button>`;

    const replacement = `<button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 10px;">
                                                    <span class="material-symbols-outlined">language</span>
                                                </button>
                                                <button class="theme-toggle" id="themeToggle">
                <span class="material-symbols-outlined">dark_mode</span>
            </button>`;
    htmlContent = htmlContent.replace(target, replacement);
}

// Ensure global-lang.js is cache busted
htmlContent = htmlContent.replace(/global-lang\.js(\?v=\d+)?/, 'global-lang.js?v=' + Date.now());
fs.writeFileSync('-museum_dining/code.html', htmlContent, 'utf8');
console.log('-museum_dining/code.html updated');

// Update global-lang.js
const newEn = {};
const newAr = {};

for (const [enText, data] of Object.entries(map)) {
    if (!langContent.includes('"' + data.k + '"')) {
        newEn[data.k] = enText;
        newAr[data.k] = data.ar;
    }
}

const enEntries = Object.entries(newEn).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(newAr).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');
