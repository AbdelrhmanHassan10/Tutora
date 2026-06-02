const fs = require('fs');

const htmlMap = {
    'Your Cart': { k: 'cart.title', ar: 'عربة التسوق الخاصة بك' },
    'Order Summary': { k: 'cart.order_summary', ar: 'ملخص الطلب' },
    'Subtotal': { k: 'cart.subtotal', ar: 'المجموع الفرعي' },
    'Total': { k: 'cart.total', ar: 'المجموع' },
    'Proceed to Checkout': { k: 'cart.checkout_btn', ar: 'متابعة الدفع' },
    'TUTORA Shop | Your Cart': { k: 'cart.page_title', ar: 'متجر TUTORA | عربة التسوق الخاصة بك' },
    'Estimated Tax': { k: 'cart.tax', ar: 'الضريبة المقدرة' } // Added just in case
};

let htmlContent = fs.readFileSync('card/card.html', 'utf8');

for (const [enText, data] of Object.entries(htmlMap)) {
    const escapedText = enText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    const flexibleText = escapedText.replace(/\\s+/g, '\\s+');
    
    const regex = new RegExp('([>\\s]*)(' + flexibleText + ')([\\s*<])', 'g');
    htmlContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
        if (match.includes('data-i18n')) return match;
        return p1 + '<span data-i18n="' + data.k + '">' + enText + '</span>' + p3;
    });
    
    // Title specifically
    if (enText.includes('TUTORA')) {
        htmlContent = htmlContent.replace(/<title>(.*?)<\/title>/, '<title data-i18n="cart.page_title">$1</title>');
    }
}
// Fix standalone "Cart" and "Your" that might have been skipped if not matched
htmlContent = htmlContent.replace(/<span class=\"accent\">Your<\/span> Cart/, '<span class="accent" data-i18n="cart.title">Your Cart</span>');


fs.writeFileSync('card/card.html', htmlContent, 'utf8');
console.log('card.html updated');

// Update card.js
let jsContent = fs.readFileSync('card/card.js', 'utf8');

const transCode = `
function tCart(key, defaultText) {
    if (window.TutoraLang && typeof window.TutoraLang.getCurrentLang === 'function') {
        const lang = window.TutoraLang.getCurrentLang();
        if (lang === 'ar' && window.CART_AR && window.CART_AR[key]) {
            return window.CART_AR[key];
        }
    }
    return defaultText;
}

window.CART_AR = {
    "empty_cart": "عربة التسوق الخاصة بك فارغة.",
    "return_shop": "العودة للمتجر",
    "item_removed": "تمت إزالة العنصر من العربة",
    "cart_empty_toast": "عربة التسوق فارغة"
};
`;

if (!jsContent.includes('tCart(')) {
    jsContent = transCode + jsContent;
    
    jsContent = jsContent.replace(/Your cart is empty\\./g, '${tCart("empty_cart", "Your cart is empty.")}');
    jsContent = jsContent.replace(/Return to Shop/g, '${tCart("return_shop", "Return to Shop")}');
    jsContent = jsContent.replace(/"Item removed from cart"/g, 'tCart("item_removed", "Item removed from cart")');
    jsContent = jsContent.replace(/"Your cart is empty"/g, 'tCart("cart_empty_toast", "Your cart is empty")');
    
    jsContent += "\nwindow.addEventListener('languageChanged', () => { if(typeof renderCart === 'function') renderCart(); });\n";
    
    fs.writeFileSync('card/card.js', jsContent, 'utf8');
    console.log('card.js updated');
}

// Update global-lang.js
let langContent = fs.readFileSync('global-lang.js', 'utf8');

const newEn = {
    "cart.title": "Your Cart",
    "cart.order_summary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.total": "Total",
    "cart.tax": "Estimated Tax",
    "cart.checkout_btn": "Proceed to Checkout",
    "cart.page_title": "TUTORA Shop | Your Cart"
};

const newAr = {
    "cart.title": "عربة التسوق",
    "cart.order_summary": "ملخص الطلب",
    "cart.subtotal": "المجموع الفرعي",
    "cart.total": "المجموع",
    "cart.tax": "الضريبة المقدرة",
    "cart.checkout_btn": "متابعة الدفع",
    "cart.page_title": "متجر TUTORA | عربة التسوق"
};

const enEntries = Object.entries(newEn).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');
const arEntries = Object.entries(newAr).filter(([k]) => !langContent.includes('"' + k + '"')).map(([k,v]) => '"' + k + '": "' + v.replace(/"/g, '\\"') + '"').join(',\n        ');

if (enEntries) langContent = langContent.replace('en: {', 'en: {\n        ' + enEntries + ',');
if (arEntries) langContent = langContent.replace('ar: {', 'ar: {\n        ' + arEntries + ',');

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js updated');

// Update style.css for RTL
let cssContent = fs.readFileSync('card/style.css', 'utf8');
if (!cssContent.includes('[dir="rtl"] .cart-container')) {
    cssContent += `
/* RTL Cart */
[dir="rtl"] body { text-align: right; }
[dir="rtl"] .cart-container { flex-direction: row-reverse; }
[dir="rtl"] .cart-item { flex-direction: row-reverse; text-align: right; }
[dir="rtl"] .cart-item-info { margin-right: 1.5rem; margin-left: 0; }
[dir="rtl"] .summary-row { flex-direction: row-reverse; }
[dir="rtl"] .quantity-controls { flex-direction: row-reverse; margin-left: 2rem; margin-right: 0; }
[dir="rtl"] .cart-item-total { text-align: left; }
`;
    fs.writeFileSync('card/style.css', cssContent, 'utf8');
    console.log('style.css RTL updated');
}
