const fs = require('fs');
let c = fs.readFileSync('global-lang.js', 'utf8');

// Find where booking translations were injected
let idx = c.indexOf('booking:');
if (idx === -1) idx = c.indexOf('"booking"');
console.log('booking idx:', idx);
if (idx > -1) console.log(c.substring(idx, idx + 300));

// Check how other existing keys are structured (flat vs nested)
// Find what keys exist in LOCAL_TRANSLATIONS en
const enIdx = c.indexOf("en: {");
console.log('\n--- EN structure ---');
console.log(c.substring(enIdx, enIdx + 500));
