const fs = require('fs');
const path = require('path');

// 1. Revert CSS change
let cssPath = path.join(__dirname, 'global-theme.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    css = css.replace(/@media \(max-width: 900px\) \{ \.header-right #langBtn, \.header-right #navProfileLink, \.header-right #navLoginBtn \{ display: none !important; \} \}/g, '');
    fs.writeFileSync(cssPath, css);
    console.log("Reverted CSS change.");
}

// 2. Process all HTML files
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

    // Remove the standalone langBtn
    const langBtnRegex = /<button class="icon-btn" id="langBtn"[\s\S]*?<\/button>/;
    if (langBtnRegex.test(content)) {
        content = content.replace(langBtnRegex, '');
        changed = true;
    }

    // Add language option inside profile dropdown if not already there
    const profileDropdownRegex = /(<div class="dropdown-menu"[^>]*>)/;
    if (profileDropdownRegex.test(content) && !content.includes('id="langBtn"')) {
        const langLink = `\n          <a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>`;
        content = content.replace(profileDropdownRegex, `$1${langLink}`);
        changed = true;
    }

    // Also ensure login button shows when logged out by removing it from the hidden mobile menu CSS?
    // The user just wants the Profile menu visible on mobile, which is done by reverting the CSS.
    // However, if logged out, they won't have a profile menu. They will have a login button. That's fine.

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log("Updated:", filePath);
    }
}

processDirectory(__dirname);
console.log("Done.");
