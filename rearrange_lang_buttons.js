const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'tutora-react') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles('d:/Testing/Project');
let modifiedCount = 0;

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. DESKTOP: Remove from dropdown
    const desktopDropdownLangStr = '<a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>';
    if (html.includes(desktopDropdownLangStr)) {
        html = html.replace(desktopDropdownLangStr, '');
        changed = true;
    }
    
    // Add to navbar if not already there
    const desktopLangHtml = `\n        <button class="icon-btn" id="langBtn" style="margin-right: 5px;" title="Language">\n          <span class="material-symbols-outlined">language</span>\n        </button>`;
    
    // Insert before profile link
    if (!html.includes('id="langBtn"') && html.includes('<div class="nav-dropdown profile-dropdown" id="navProfileLink"')) {
        html = html.replace('<div class="nav-dropdown profile-dropdown" id="navProfileLink"', desktopLangHtml + '\n        <div class="nav-dropdown profile-dropdown" id="navProfileLink"');
        changed = true;
    }

    // 2. MOBILE: Remove from footer
    const mobileFooterLangRegex = /<button class="menu-icon-link" id="menuLangBtn">[\s\S]*?<\/button>/;
    if (mobileFooterLangRegex.test(html)) {
        html = html.replace(mobileFooterLangRegex, '');
        changed = true;
    }

    // Add to dropdown if not already there
    const mobileDropdownLangHtml = `\n          <a href="#" class="dropdown-item" id="menuLangBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>`;
    if (!html.includes('id="menuLangBtn"') && html.includes('<div class="dropdown-items">')) {
        // Insert right after <div class="dropdown-items"> inside the profile dropdown
        // The first dropdown-items is usually the profile one, but let's be careful.
        // Actually, let's just insert it after the profile one.
        const profileDropdownIndex = html.indexOf('id="menuProfileLink"');
        if (profileDropdownIndex !== -1) {
            const dropdownItemsIndex = html.indexOf('<div class="dropdown-items">', profileDropdownIndex);
            if (dropdownItemsIndex !== -1) {
                const insertPos = dropdownItemsIndex + '<div class="dropdown-items">'.length;
                html = html.substring(0, insertPos) + mobileDropdownLangHtml + html.substring(insertPos);
                changed = true;
            }
        }
    }

    if (changed) {
        fs.writeFileSync(file, html);
        modifiedCount++;
    }
}

console.log('Modified HTML files: ' + modifiedCount);

// 3. RESTORE badge CSS for Desktop Navbar icon
let cssPath = 'd:/Testing/Project/global-lang.css';
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    css = css.replace(/\.menu-icon-link#menuLangBtn::after\s*\{/g, '#langBtn::after {\n');
    fs.writeFileSync(cssPath, css);
    console.log('Restored badge in global-lang.css');
}
