const fs = require('fs');
let c = fs.readFileSync('-membership/code.html', 'utf8');
const faqs = c.match(/<div class=\"faq-question[^>]*>[\s\S]*?<\/div>/g) || [];
console.log(faqs.join('\n'));
