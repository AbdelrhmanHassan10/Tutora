const fs = require('fs');
let langJs = fs.readFileSync('global-lang.js', 'utf8');

langJs = langJs.replace(/"edit_profile\.title": "TUTORA Profile \\|[^,\n]*",/, '"edit_profile.title": "TUTORA Profile | Edit Profile",');

langJs = langJs.replace(/"edit_profile\.title": "ملف توتورا الشخصي \\|[^,\n]*",/, '"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",');

fs.writeFileSync('global-lang.js', langJs, 'utf8');
console.log('Fixed again');
