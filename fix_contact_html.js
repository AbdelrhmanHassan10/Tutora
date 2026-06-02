const fs = require('fs');
let html = fs.readFileSync('get in touch/get-in-touch.html', 'utf8');

// Fix double spans like <span data-i18n="xyz"><span data-i18n="xyz">text</span></span>
html = html.replace(/<span data-i18n="([^"]+)">\s*<span data-i18n="\1">([^<]+)<\/span>\s*<\/span>/g, '<span data-i18n="$1">$2</span>');

// Check for any remaining nested span like <span data-i18n="contact.xyz"><span data-i18n="contact.abc">text</span></span>
html = html.replace(/<span data-i18n="([^"]+)">\s*<span data-i18n="([^"]+)">([^<]+)<\/span>\s*<\/span>/g, '<span data-i18n="$2">$3</span>');

// Write back
fs.writeFileSync('get in touch/get-in-touch.html', html, 'utf8');
console.log('Fixed double spans');
