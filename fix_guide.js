const fs = require('fs');
let lang = fs.readFileSync('global-lang.js', 'utf8');

lang = lang.replace(/"branding\.the": "[^"]*"/g, '"branding.the": "الدليل"');
lang = lang.replace(/"branding\.smart": "[^"]*"/g, '"branding.smart": "الذكي"');
lang = lang.replace(/"branding\.guide": "[^"]*"/g, '"branding.guide": "&nbsp;"');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated');
