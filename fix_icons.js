const fs = require('fs');

const filesToFix = [
  'd:\\Testing\\Project\\card\\card.html',
  'd:\\Testing\\Project\\fav\\favourite.html',
  'd:\\Testing\\Project\\get in touch\\get-in-touch.html',
  'd:\\Testing\\Project\\shop\\shop.html'
];

for (const file of filesToFix) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace: <a href="../booking/booking.html" class="btn-booking" title="Book Tickets"><span class="booking-text" data-i18n="nav.booking">Booking</span></a>
    content = content.replace(
        /<a href="([^"]*)" class="btn-booking"[^>]*>(?:<span[^>]*>.*?<\/span>|.*?)<\/a>/g,
        (match, href) => {
            if (match.includes('booking-icon')) return match;
            return `<a href="${href}" class="btn-booking" title="Book Tickets"><span class="booking-text" data-i18n="nav.booking">Booking</span><span class="material-symbols-outlined booking-icon" style="display: none;">local_activity</span></a>`;
        }
    );
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
}
