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
    
    if (content.includes('profile-dropdown') || content.includes('navProfileLink')) {
        const $ = cheerio.load(content, { decodeEntities: false });
        
        const dropdownMenu = $('#navProfileLink .dropdown-menu');
        if (dropdownMenu.length > 0) {
            let favHref = '../fav/favourite.html';
            let profileHref = '../Profile/profile.html';
            let settingsHref = '../setting/setting.html';
            
            const existingFav = dropdownMenu.find('a[href*="fav"]');
            if (existingFav.length > 0) favHref = existingFav.attr('href');
            
            const existingProfile = dropdownMenu.find('a[href*="rofile"]').first(); 
            if (existingProfile.length > 0) profileHref = existingProfile.attr('href');

            const existingSettings = dropdownMenu.find('a[href*="setting"]');
            if (existingSettings.length > 0) settingsHref = existingSettings.attr('href');
            
            $('#langBtn').remove();
            
            const newContent = `
              <a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>
              <a href="${profileHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.profile"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
              <a href="${favHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.favorites"><span class="material-symbols-outlined" style="font-size: 18px;">favorite</span> Favorites</a>
              <a href="${settingsHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.settings"><span class="material-symbols-outlined" style="font-size: 18px;">settings</span> Settings</a>
              <a href="#" class="dropdown-link" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;" data-i18n="nav.logout"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
            `;
            
            dropdownMenu.html(newContent);
            fs.writeFileSync(file, $.html(), 'utf8');
            modifiedCount++;
        }
    }
}

// Remove the CSS that hides #langBtn on mobile so it is visible in the dropdown
let css = fs.readFileSync('d:/Testing/Project/global-theme.css', 'utf8');
css = css.replace(/#langBtn\s*\{\s*display:\s*none\s*!important;\s*\}/g, '/* langBtn is now in dropdown */');
fs.writeFileSync('d:/Testing/Project/global-theme.css', css, 'utf8');

console.log('Modified ' + modifiedCount + ' files and fixed CSS.');
