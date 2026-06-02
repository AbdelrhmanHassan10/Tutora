const fs = require('fs');
const path = require('path');

const accHtmlPath = path.join(__dirname, '-accessibility/code.html');
let html = fs.readFileSync(accHtmlPath, 'utf8');

// Change data-i18n-html to data-i18n
html = html.replace(/<h1 data-i18n-html="acc\.hero_title">/g, '<h1 data-i18n="acc.hero_title">');
html = html.replace(/<h2 data-i18n-html="acc\.ascension_title">/g, '<h2 data-i18n="acc.ascension_title">');
html = html.replace(/<h3 data-i18n-html="acc\.interface_title">/g, '<h3 data-i18n="acc.interface_title">');
html = html.replace(/<h3 data-i18n-html="acc\.reading_title">/g, '<h3 data-i18n="acc.reading_title">');

// Fix The Sanctuary Service
html = html.replace(
    /<h2 style="font-family: 'Cinzel', serif; font-size: 3\.5rem;">The Sanctuary <span\s+class="gold-text">Service<\/span><\/h2>/,
    '<h2 style="font-family: \'Cinzel\', serif; font-size: 3.5rem;" data-i18n="acc.sanctuary_title">The Sanctuary <span class="gold-text">Service</span></h2>'
);

// Fix The GEM is more than a museum...
html = html.replace(
    /<p style="max-width: 800px; margin: 2rem auto; color: var\(--acc-text-secondary\);">The GEM is more than a museum;\s+it is a supportive environment designed for the safety and comfort of every visitor\.<\/p>/,
    '<p style="max-width: 800px; margin: 2rem auto; color: var(--acc-text-secondary);"><span data-i18n="acc.service_desc">The GEM is more than a museum; it is a supportive environment designed for the safety and comfort of every visitor.</span></p>'
);

fs.writeFileSync(accHtmlPath, html, 'utf8');
console.log('Fixed accessibility html duplicates and missing tags.');
