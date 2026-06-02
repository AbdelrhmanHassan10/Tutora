const fs = require('fs');
const file = 'Exhibition-Halls/script.js';
let content = fs.readFileSync(file, 'utf8');

// Update renderHalls
content = content.replace(
    /<span class="era-badge">\$\{hall\.era\}<\/span>/,
    '<span class="era-badge" data-i18n="exhibition.halls.${hall.id}.era">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".era") || hall.era : hall.era}</span>'
);

content = content.replace(
    /<h3>\$\{hall\.name\}<\/h3>/,
    '<h3 data-i18n="exhibition.halls.${hall.id}.name">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".name") || hall.name : hall.name}</h3>'
);

content = content.replace(
    /<p>\$\{hall\.shortDesc\}<\/p>/,
    '<p data-i18n="exhibition.halls.${hall.id}.shortDesc">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".shortDesc") || hall.shortDesc : hall.shortDesc}</p>'
);

// Update showHallDetails
content = content.replace(
    /<h2>\$\{hall\.name\}<\/h2>/,
    '<h2 data-i18n="exhibition.halls.${hall.id}.name">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".name") || hall.name : hall.name}</h2>'
);

content = content.replace(
    /<p class="modal-era">\$\{hall\.era\}<\/p>/,
    '<p class="modal-era" data-i18n="exhibition.halls.${hall.id}.era">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".era") || hall.era : hall.era}</p>'
);

content = content.replace(
    /<p class="modal-desc">\$\{hall\.longDesc\}<\/p>/,
    '<p class="modal-desc" data-i18n-html="exhibition.halls.${hall.id}.longDesc">${typeof window.t === "function" ? window.t("exhibition.halls."+hall.id+".longDesc") || hall.longDesc : hall.longDesc}</p>'
);

// We need to bust the cache of global-lang.js in exhibition-halls.html if not already done.
// But we already did that earlier, so no worries.

fs.writeFileSync(file, content);
console.log('script.js updated!');
