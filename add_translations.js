const fs = require('fs');

let js = fs.readFileSync('global-lang.js', 'utf8');

// Insert English translations
js = js.replace('en: {', 'en: {\n        "cart-badge": "Cart",\n        "profile menu": "Profile Menu",');

// Insert Arabic translations
js = js.replace('ar: {', 'ar: {\n        "cart-badge": "السلة",\n        "profile menu": "الحساب",');

fs.writeFileSync('global-lang.js', js, 'utf8');
console.log('Successfully added translations to global-lang.js');
