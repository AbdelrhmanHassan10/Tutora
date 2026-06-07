const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDirectory(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            updateHTML(fullPath);
        }
    }
}

function updateHTML(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove the wrongfully placed #langBtn
    const wrongLangRegex = /\s*<a href="#" class="dropdown-link" id="langBtn".*?<\/a>/g;
    if (wrongLangRegex.test(content)) {
        content = content.replace(wrongLangRegex, '');
        changed = true;
    }

    // 2. Also remove the standalone button if it still exists
    const standaloneLangRegex = /\s*<button class="icon-btn" id="langBtn"[\s\S]*?<\/button>/;
    if (standaloneLangRegex.test(content)) {
        content = content.replace(standaloneLangRegex, '');
        changed = true;
    }

    // 3. Insert langBtn properly inside the navProfileLink dropdown
    const targetRegex = /(<div class="nav-dropdown profile-dropdown" id="navProfileLink"[\s\S]*?<div class="dropdown-menu"[^>]*>)/;
    if (targetRegex.test(content) && !content.includes('id="langBtn"')) {
        const langLink = `\n          <a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>`;
        content = content.replace(targetRegex, `$1${langLink}`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log("Updated:", filePath);
    }
}

processDirectory(__dirname);
console.log("Done fixing.");
