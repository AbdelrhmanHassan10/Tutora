const fs = require('fs');
const c = fs.readFileSync('booking/booking.html', 'utf8');

// Check which data-i18n keys exist
const matches = c.match(/data-i18n="([^"]+)"/g);
if (matches) {
    const keys = matches.map(m => m.match(/data-i18n="([^"]+)"/)[1]);
    console.log('Found', keys.length, 'data-i18n attributes:');
    keys.forEach(k => console.log(' ', k));
}

// Check if en block has these keys
const lang = fs.readFileSync('global-lang.js', 'utf8');
const sample = ['booking.order_summary', 'booking.select_date', 'booking.adult'];
sample.forEach(k => {
    console.log(`\n"${k}" in global-lang.js:`, lang.includes(`"${k}"`));
});
