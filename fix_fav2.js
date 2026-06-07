const fs = require('fs');
const c = fs.readFileSync('card/card.html', 'utf8');
const f = fs.readFileSync('fav/favourite.html', 'utf8');

const headerStart = c.indexOf('<div class="menu-overlay" id="menuOverlay"></div>');
const headerEnd = c.indexOf('<main style="padding-top: 100px;');

if (headerStart === -1 || headerEnd === -1) {
    console.error('Could not find card header boundaries');
    process.exit(1);
}

const headerContent = c.substring(headerStart, headerEnd);

const fHeaderStart = f.indexOf('<div class="menu-overlay" id="menuOverlay"></div>');
const fHeaderEnd = f.indexOf('<main class="main-content">');

if (fHeaderStart === -1 || fHeaderEnd === -1) {
    console.error('Could not find fav header boundaries');
    process.exit(1);
}

let newF = f.substring(0, fHeaderStart) + headerContent + f.substring(fHeaderEnd);

// Also replace the Welcome Back Abdelrhman string
const targetString = '<h1 class="title font-serif"><span data-i18n="fav.welcome_back"><span data-i18n="fav.welcome_back">Welcome back</span></span>, Abdelrhman</h1>';
const replaceString = '<h1 class="title font-serif"><span data-i18n="fav.welcome_back"><span data-i18n="fav.welcome_back">Welcome back</span></span>, <span id="userNameDisplay">Abdelrhman</span></h1>';

newF = newF.replace(targetString, replaceString);

fs.writeFileSync('fav/favourite.html', newF, 'utf8');
console.log('Successfully replaced header and username span in favourite.html');
