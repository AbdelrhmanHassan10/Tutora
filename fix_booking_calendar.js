const fs = require('fs');
let js = fs.readFileSync('booking/main.js', 'utf8');

// The calendar render uses monthNames[currentDate.getMonth()] 
// We need to replace that usage to use getMonthName() when in Arabic

// Find where monthNames is used for display
const usages = [];
let searchFrom = 0;
while (true) {
    const idx = js.indexOf('monthNames[', searchFrom);
    if (idx === -1) break;
    usages.push({ idx, context: js.substring(Math.max(0, idx - 50), idx + 80) });
    searchFrom = idx + 1;
}
console.log('monthNames usages:', usages.length);
usages.forEach((u, i) => console.log(`  ${i}: ${u.context}`));

// Replace monthNames[currentDate.getMonth()] with getMonthName(currentDate.getMonth())
js = js.replace(/monthNames\[currentDate\.getMonth\(\)\]/g, 'getMonthName(currentDate.getMonth())');
// Also handle other patterns
js = js.replace(/monthNames\[(\w+)\.getMonth\(\)\]/g, 'getMonthName($1.getMonth())');
js = js.replace(/monthNames\[(\w+)\]/g, 'getMonthName($1)');

// Also add "Grand Staircase, Statues & Main Exhibition Galleries" translation
let html = fs.readFileSync('booking/booking.html', 'utf8');
html = html.replace(
    /Grand Staircase, Statues & Main Exhibition Galleries/g,
    '<span data-i18n="booking.general_desc">Grand Staircase, Statues & Main Exhibition Galleries</span>'
);

// "Expert human guide + Includes General Admission" subtitle under Guided Experience - already has data-i18n? Check:
if (!html.includes('booking.guided_desc1')) {
    html = html.replace(
        /Expert human guide \+ Includes General Admission/g,
        '<span data-i18n="booking.guided_desc1">Expert human guide + Includes General Admission</span>'
    );
}

fs.writeFileSync('booking/main.js', js, 'utf8');
fs.writeFileSync('booking/booking.html', html, 'utf8');

// Add the general_desc key to global-lang.js
let lang = fs.readFileSync('global-lang.js', 'utf8');
if (!lang.includes('"booking.general_desc"')) {
    lang = lang.replace('en: {', 'en: { "booking.general_desc": "Grand Staircase, Statues & Main Exhibition Galleries",');
    lang = lang.replace('ar: {', 'ar: { "booking.general_desc": "السلم الكبير، التماثيل وصالات العرض الرئيسية",');
    fs.writeFileSync('global-lang.js', lang, 'utf8');
}

console.log('Calendar months and remaining text fixed!');
