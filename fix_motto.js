const fs = require('fs');
let lang = fs.readFileSync('global-lang.js', 'utf8');

lang = lang.replace(/"branding\.motto": "[^"]*"/g, '"branding.motto": "\\"حجر عتيق، روح رقمية\\""');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated');
