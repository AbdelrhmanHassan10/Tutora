const fs = require('fs');

const cssRules = `
/* RTL Fixes for Narrative section */
html[dir="rtl"] .drop-cap::first-letter {
    float: right;
    padding-right: 0;
    padding-left: 15px;
}

html[dir="rtl"] .narrative-title::after, 
html[dir="rtl"] .arch-content h2::after, 
html[dir="rtl"] .stats-title::after, 
html[dir="rtl"] .location-title::after {
    left: auto !important;
    right: 0 !important;
}

html[dir="rtl"] .narrative-text {
    text-align: right;
}
`;

fs.appendFileSync('About us/style.css', cssRules, 'utf8');
console.log('Appended RTL fixes to About us/style.css');
