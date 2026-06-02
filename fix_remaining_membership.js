const fs = require('fs');
let c = fs.readFileSync('-membership/code.html', 'utf8');
c = c.replace('<span class="highlight">Member?</span>', '<span class="highlight" data-i18n="membership.member_q2">Member?</span>');
c = c.replace('All Access (Main Galleries + Tutankhamun Gallery)', '<span data-i18n="membership.all_access">All Access (Main Galleries + Tutankhamun Gallery)</span>');
c = c.replace('MEMBER?', '<span data-i18n="membership.member_q3">MEMBER?</span>');
fs.writeFileSync('-membership/code.html', c);
console.log('Fixed tags');
