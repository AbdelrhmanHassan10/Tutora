const fs = require('fs');
let content = fs.readFileSync('global-lang.js', 'utf8');
const enInject = '"overview": "Overview", "details": "Details", "specifications": "Specifications", "backBtnText": "Back", "view_ar": "View in AR",';
const arInject = '"overview": "نظرة عامة", "details": "التفاصيل", "specifications": "المواصفات", "backBtnText": "العودة", "view_ar": "عرض بالواقع المعزز",';
content = content.replace('en: {', 'en: { ' + enInject);
content = content.replace('ar: {', 'ar: { ' + arInject);
fs.writeFileSync('global-lang.js', content, 'utf8');
console.log('done');
