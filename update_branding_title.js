const fs = require('fs');
let lang = fs.readFileSync('global-lang.js', 'utf8');

lang = lang.replace(/"branding\.sovereign": "سيادي"/, '"branding.sovereign": "الهوية"');
lang = lang.replace(/"branding\.identity": "هوية"/, '"branding.identity": "السيادية"');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated');
