const fs = require('fs');
let langJs = fs.readFileSync('global-lang.js', 'utf8');

langJs = langJs.replace(
    /"edit_profile\.title": "TUTORA Profile \\|"edit_profile\.title": "TUTORA Profile \\| Edit Profile",/g,
    '"edit_profile.title": "TUTORA Profile | Edit Profile",'
);

langJs = langJs.replace(
    /"edit_profile\.title": "ملف توتورا الشخصي \\|"edit_profile\.title": "ملف توتورا الشخصي \\| تعديل الملف الشخصي",/g,
    '"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",'
);

fs.writeFileSync('global-lang.js', langJs, 'utf8');
console.log('global-lang.js fixed');
