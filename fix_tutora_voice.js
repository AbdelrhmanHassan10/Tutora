const fs = require('fs');
let lang = fs.readFileSync('global-lang.js', 'utf8');

lang = lang.replace(/"branding\.the_tutora": "[^"]*"/g, '"branding.the_tutora": "صوت"');
lang = lang.replace(/"branding\.voice": "[^"]*"/g, '"branding.voice": "توتورا"');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated');
