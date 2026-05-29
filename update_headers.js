const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    const originalContent = content;
    let changed = false;

    // 1. Replace logo-section div with a tag
    const logoPattern = /<div class="logo-section">([\s\S]*?)<h2 class="logo-text">Tutora<\/h2>\s*<\/div>/g;
    
    // Calculate prefix based on logo.png path
    const prefixMatch = content.match(/src="(.*?)logo\.png"/);
    const prefix = prefixMatch ? prefixMatch[1] : "../";

    const logoReplacement = `<a href="${prefix}4.home/code.html" class="logo-section" style="text-decoration: none;">$1<h2 class="logo-text">Tutora</h2></a>`;
    
    if (logoPattern.test(content)) {
        content = content.replace(logoPattern, logoReplacement);
        changed = true;
    }

    // 2. Add titles to icons in header-right
    if (content.includes('<button class="theme-btn" id="themeBtn">')) {
        content = content.replace('<button class="theme-btn" id="themeBtn">', '<button class="theme-btn" id="themeBtn" title="Toggle Theme">');
        changed = true;
    }

    const bookingPattern = /(<a href="[^"]*?booking\/booking\.html"[^>]*class="btn-booking"[^>]*)(?<!title="Book Tickets")>/g;
    if (bookingPattern.test(content)) {
        content = content.replace(bookingPattern, '$1 title="Book Tickets">');
        changed = true;
    }

    const favPattern = /(<a href="[^"]*?fav\/favourite\.html"[^>]*)(?<!title="Favorites")>/g;
    if (favPattern.test(content)) {
        content = content.replace(favPattern, '$1 title="Favorites">');
        changed = true;
    }

    const cartPattern = /(<a href="[^"]*?card\/card\.html"[^>]*)(?<!title="Cart")>/g;
    if (cartPattern.test(content)) {
        content = content.replace(cartPattern, '$1 title="Cart">');
        changed = true;
    }

    if (content.includes('<button class="icon-btn" id="langBtn">')) {
        content = content.replace('<button class="icon-btn" id="langBtn">', '<button class="icon-btn" id="langBtn" title="Language">');
        changed = true;
    }

    const profilePattern = /<a href="([^"]*?Profile\/profile\.html)"[^>]*>\s*<img src="([^"]*?)" alt="Profile" class="profile-img"\s*\/?>\s*<\/a>/g;
    
    if (profilePattern.test(content)) {
        content = content.replace(profilePattern, (match, profileUrl, imgSrc) => {
            const settingsUrl = prefix + "setting/setting.html";
            const loginUrl = prefix + "2.login/code.html";

            return `<div class="nav-dropdown profile-dropdown" id="navProfileLink" style="display: none;" title="Profile">
            <button class="nav-link dropdown-trigger profile-trigger" style="padding: 0; background: transparent; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer;">
              <span class="material-symbols-outlined" style="color: var(--text-primary);">expand_more</span>
              <img src="${imgSrc}" alt="Profile" class="profile-img" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary-gold);" />
            </button>
            <div class="dropdown-menu" style="right: 0; left: auto; min-width: 150px;">
              <a href="${profileUrl}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
              <a href="${settingsUrl}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
              <a href="#" class="dropdown-link" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
            </div>
          </div>
          
          <a href="${loginUrl}" class="icon-btn-link" id="navLoginBtn" style="display: none;" title="Login">
            <button class="icon-btn">
              <span class="material-symbols-outlined">login</span>
            </button>
          </a>`;
        });
        changed = true;
    }

    if (changed && content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === '.git' || file === 'node_modules') return;
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filepath));
        } else {
            if (filepath.endsWith('.html')) {
                results.push(filepath);
            }
        }
    });
    return results;
}

const htmlFiles = walk('.');
htmlFiles.forEach(processFile);
