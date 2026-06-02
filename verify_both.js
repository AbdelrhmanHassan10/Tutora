const fs = require('fs');
const c = fs.readFileSync('global-lang.js', 'utf8');

// Verify all booking keys exist in both en and ar sections
const enStart = c.indexOf('en: {');
const arStart = c.indexOf('ar: {');

const bookingKeys = [
    'booking.book_visit', 'booking.order_summary', 'booking.adult',
    'booking.select_date', 'booking.total', 'booking.online_booking'
];

bookingKeys.forEach(k => {
    // Check if key appears BEFORE arStart (meaning it's in en block)
    const enIdx = c.indexOf(`"${k}"`, enStart);
    const inEn = enIdx > -1 && enIdx < arStart;
    
    // Check if key appears AFTER arStart (meaning it's in ar block)
    const arIdx = c.indexOf(`"${k}"`, arStart);
    const inAr = arIdx > -1;
    
    console.log(`${k}: en=${inEn}, ar=${inAr}`);
});
