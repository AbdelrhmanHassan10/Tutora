const fs = require('fs');
let content = fs.readFileSync('global-lang.js', 'utf8');
content = content.replace(
    '        "edit_profile.title": "TUTORA Profile |"edit_profile.title": "TUTORA Profile |"edit_profile.title": "TUTORA Profile | Edit Profile",',
    '        "edit_profile.title": "TUTORA Profile | Edit Profile",'
);
content = content.replace(
    '        "edit_profile.title": "ملف توتورا الشخصي |"edit_profile.title": "ملف توتورا الشخصي |"edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",',
    '        "edit_profile.title": "ملف توتورا الشخصي | تعديل الملف الشخصي",'
);
fs.writeFileSync('global-lang.js', content, 'utf8');
console.log('Fixed exactly');
