const fs = require('fs');

let htmlContent = fs.readFileSync('card/card.html', 'utf8');

// Title
htmlContent = htmlContent.replace(
    /Your <span class="gold-text">Cart<\/span>/g,
    '<span data-i18n="cart.title">Your <span class="gold-text">Cart</span></span>'
);

htmlContent = htmlContent.replace(
    />Your Cart</g,
    '><span data-i18n="cart.title">Your Cart</span><'
);
// Case sensitive? No, the HTML says "Your <span class="gold-text">Cart</span>" on line 153.
// Wait, looking at the user's screenshot, it's uppercase "YOUR CART". CSS probably makes it uppercase `text-transform: uppercase`.

// Taxes & Fees
htmlContent = htmlContent.replace(
    />Taxes &amp; Fees \\(5%\\)</g,
    '><span data-i18n="cart.taxes_fees">Taxes &amp; Fees (5%)</span><'
);
htmlContent = htmlContent.replace(
    />Taxes & Fees \\(5%\\)</g,
    '><span data-i18n="cart.taxes_fees">Taxes & Fees (5%)</span><'
);

fs.writeFileSync('card/card.html', htmlContent, 'utf8');
console.log('card.html updated');

// Update JS for missing string "Return to Shop" and "Your cart is empty."
// Since template literals with `tCart` were already injected, let's verify `card.js`
let jsContent = fs.readFileSync('card/card.js', 'utf8');
jsContent = jsContent.replace(/<p>Your cart is empty\\.</g, '<p>${tCart("empty_cart", "Your cart is empty.")}<');
fs.writeFileSync('card/card.js', jsContent, 'utf8');
console.log('card.js updated');

// Adding cache buster for global-lang.js so the new strings show up.
let htmlContentCache = fs.readFileSync('card/card.html', 'utf8');
htmlContentCache = htmlContentCache.replace(/global-lang\.js\?v=\d+/, 'global-lang.js?v=' + Date.now());
fs.writeFileSync('card/card.html', htmlContentCache, 'utf8');

console.log('cache busted');
