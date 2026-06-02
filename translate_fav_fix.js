const fs = require('fs');

const htmlMap = {
    'Guardian Dashboard': { k: 'fav.guardian_dash', ar: 'لوحة تحكم الوصي' },
    'Welcome back': { k: 'fav.welcome_back', ar: 'مرحباً بعودتك' },
    'Member Level': { k: 'fav.member_level', ar: 'مستوى العضوية' },
    'Gold Patron': { k: 'fav.gold_patron', ar: 'راعي ذهبي' },
    'Saved Treasures': { k: 'fav.saved_treasures', ar: 'الكنوز المحفوظة' },
    'My Journey': { k: 'fav.my_journey', ar: 'رحلتي' },
    'Saved Fun Facts': { k: 'fav.saved_facts', ar: 'معلومات ممتعة محفوظة' },
    'Your Collection': { k: 'fav.your_collection', ar: 'مجموعتك' },
    'EXPLORE MORE': { k: 'fav.explore_more', ar: 'اكتشف المزيد' },
    'Loading your treasures...': { k: 'fav.loading_treasures', ar: 'جاري تحميل كنوزك...' },
    'Journey History': { k: 'fav.journey_history', ar: 'سجل الرحلة' },
    "It's empty! You haven't created a journey yet.": { k: 'fav.empty_journey', ar: 'إنها فارغة! لم تقم بإنشاء رحلة بعد.' },
    'Create My Journey': { k: 'fav.create_journey', ar: 'إنشاء رحلتي' },
    'Collected Ancient Wisdom': { k: 'fav.collected_wisdom', ar: 'الحكمة القديمة المجمعة' },
    'LEARN MORE FACTS': { k: 'fav.learn_more_facts', ar: 'تعلم المزيد من الحقائق' },
    "You haven't saved any fun facts yet.": { k: 'fav.empty_facts', ar: 'لم تقم بحفظ أي حقائق ممتعة بعد.' },
    'Your Saved Items': { k: 'fav.saved_items_title', ar: 'عناصرك المحفوظة' },
    'TUTORA Favorites | Your Saved Items': { k: 'fav.page_title', ar: 'مفضلات TUTORA | عناصرك المحفوظة' },
    'Explore': { k: 'fav.explore', ar: 'استكشف' }
};

let htmlContent = fs.readFileSync('fav/favourite.html', 'utf8');

for (const [enText, data] of Object.entries(htmlMap)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const flexibleText = escapedText.replace(/\\s+/g, '\\s+');
    
    const regex = new RegExp('([>\\s]*)(' + flexibleText + ')([\\s*<])', 'g');
    htmlContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
        if (match.includes('data-i18n')) return match;
        return p1 + '<span data-i18n="' + data.k + '">' + enText + '</span>' + p3;
    });
    
    if (!htmlContent.includes('data-i18n="' + data.k + '"')) {
        htmlContent = htmlContent.replace(new RegExp(flexibleText, 'g'), '<span data-i18n="' + data.k + '">' + enText + '</span>');
    }
}

fs.writeFileSync('fav/favourite.html', htmlContent, 'utf8');
console.log('favourite.html updated.');
