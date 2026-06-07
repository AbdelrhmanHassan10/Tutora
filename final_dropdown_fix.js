const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
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
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('profile-dropdown') || content.includes('navProfileLink') || content.includes('menuProfileLink')) {
        const $ = cheerio.load(content, { decodeEntities: false });
        
        // desktop dropdown
        const dropdownMenu = $('#navProfileLink .dropdown-menu');
        
        // mobile dropdown
        const mobileDropdownMenu = $('#menuProfileLink .dropdown-items');
        
        
        let langHref = '../';
        let favHref = '../fav/favourite.html';
        let profileHref = '../Profile/profile.html';
        let settingsHref = '../setting/setting.html';
        
        // Try to find existing hrefs to preserve correct relative paths
        const findHref = (selector) => {
            let el = dropdownMenu.find(selector).first();
            if (el.length === 0) el = mobileDropdownMenu.find(selector).first();
            if (el.length > 0) return el.attr('href');
            return null;
        };

        const existingFav = findHref('a[href*="fav"]');
        if (existingFav) favHref = existingFav;
        
        const existingProfile = findHref('a[href*="rofile"]'); 
        if (existingProfile) profileHref = existingProfile;

        const existingSettings = findHref('a[href*="setting"]');
        if (existingSettings) settingsHref = existingSettings;
        
        $('#langBtn').remove(); // remove old language button outside if any
        
        const desktopContent = `
          <a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>
          <a href="${profileHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.profile"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
          <a href="${favHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.favorites"><span class="material-symbols-outlined" style="font-size: 18px;">favorite</span> Favorites</a>
          <a href="${settingsHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.settings"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
          <a href="#" class="dropdown-link" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;" data-i18n-html="nav.logout"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
        `;

        const mobileContent = `
          <a href="#" class="dropdown-item" id="menuLangBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>
          <a href="${profileHref}" class="dropdown-item" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.profile"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
          <a href="${favHref}" class="dropdown-item" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.favorites"><span class="material-symbols-outlined" style="font-size: 18px;">favorite</span> Favorites</a>
          <a href="${settingsHref}" class="dropdown-item" style="display: flex; align-items: center; gap: 8px;" data-i18n-html="nav.settings"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
          <a href="#" class="dropdown-item" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;" data-i18n-html="nav.logout"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
        `;
        
        if (dropdownMenu.length > 0) {
            dropdownMenu.html(desktopContent);
            changed = true;
        }

        if (mobileDropdownMenu.length > 0) {
            mobileDropdownMenu.html(mobileContent);
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, $.html(), 'utf8');
            modifiedCount++;
        }
    }
}

console.log('Modified ' + modifiedCount + ' files completely.');
