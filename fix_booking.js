const fs = require('fs');
let c = fs.readFileSync('booking/main.js', 'utf8');

// Fix: the /Total/g replacement broke variable names like "itemTotal" and "orderTotal"
// Revert those broken replacements
c = c.replace(/item\$\{tBook\("total", "Total"\)\}/g, 'itemTotal');
c = c.replace(/order\$\{tBook\("total", "Total"\)\}/g, 'orderTotal');
c = c.replace(/sub\$\{tBook\("total", "Total"\)\}/g, 'subTotal');
c = c.replace(/grand\$\{tBook\("total", "Total"\)\}/g, 'grandTotal');

// Also fix any other broken occurrences where Total was in a variable context
// Find all remaining occurrences
const pattern = /([a-zA-Z_])\$\{tBook\("total", "Total"\)\}/g;
c = c.replace(pattern, (match, prefix) => {
    return prefix + 'Total';
});

fs.writeFileSync('booking/main.js', c, 'utf8');
console.log('Fixed broken Total replacements');
