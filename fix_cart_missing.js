const fs = require('fs');

let htmlContent = fs.readFileSync('card/card.html', 'utf8');

// Subtitle
htmlContent = htmlContent.replace(
    /Review your selected royal treasures before proceeding to checkout\./g,
    '<span data-i18n="cart.subtitle">Review your selected royal treasures before proceeding to checkout.</span>'
);

// Taxes & Fees
htmlContent = htmlContent.replace(
    /Taxes & Fees \\(5%\\)/g,
    '<span data-i18n="cart.taxes_fees">Taxes & Fees (5%)</span>'
);
htmlContent = htmlContent.replace(
    /Taxes &amp; Fees \\(5%\\)/g,
    '<span data-i18n="cart.taxes_fees">Taxes &amp; Fees (5%)</span>'
);

// YOUR CART (uppercase text might be inside a span)
htmlContent = htmlContent.replace(
    />\\s*YOUR CART\\s*</gi,
    '><span data-i18n="cart.title">YOUR CART</span><'
);

fs.writeFileSync('card/card.html', htmlContent, 'utf8');
console.log('card.html updated');

// Update JS for missing string
let jsContent = fs.readFileSync('card/card.js', 'utf8');
jsContent = jsContent.replace(/<p>Your cart is empty\\.</g, '<p>${tCart("empty_cart", "Your cart is empty.")}<');
fs.writeFileSync('card/card.js', jsContent, 'utf8');
console.log('card.js updated');

// Update global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = {
    "cart.subtitle": "Review your selected royal treasures before proceeding to checkout.",
    "cart.taxes_fees": "Taxes & Fees (5%)"
};

const newAr = {
    "cart.subtitle": "راجع الكنوز الملكية المحددة قبل المتابعة للدفع.",
    "cart.taxes_fees": "الضرائب والرسوم (5%)"
};

const enEntries = Object.entries(newEn).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');
const arEntries = Object.entries(newAr).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\\n        ' + arEntries + ',');

// Fix newlines
langContent = langContent.split('\\\\n').join(String.fromCharCode(10));

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');
