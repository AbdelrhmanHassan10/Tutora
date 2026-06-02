const fs = require('fs');
let lang = fs.readFileSync('global-lang.js', 'utf8');

lang = lang.replace(/"branding\.the": "الـ"/, '"branding.the": "المرشد"');
lang = lang.replace(/"branding\.smart": "ذكي"/, '"branding.smart": "الذكي"');
lang = lang.replace(/"branding\.guide": "دليل"/, '"branding.guide": ""');

fs.writeFileSync('global-lang.js', lang, 'utf8');
console.log('global-lang.js updated');
