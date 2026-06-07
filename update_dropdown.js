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
    
    // Only modify files that have the profile dropdown
    if (content.includes('profile-dropdown') || content.includes('navProfileLink')) {
        const $ = cheerio.load(content, { decodeEntities: false });
        
        const dropdownMenu = $('#navProfileLink .dropdown-menu');
        if (dropdownMenu.length > 0) {
            // Find relative path for fav and profile if possible
            let favHref = '../fav/favourite.html';
            let profileHref = '../Profile/profile.html';
            
            const existingFav = dropdownMenu.find('a[href*="fav"]');
            if (existingFav.length > 0) favHref = existingFav.attr('href');
            
            const existingProfile = dropdownMenu.find('a[href*="rofile"]').first(); // exclude Edit-profile if any
            if (existingProfile.length > 0) profileHref = existingProfile.attr('href');
            
            // Remove existing langBtn outside the dropdown
            $('#langBtn').remove();
            
            // Build new dropdown content
            const newContent = `
              <a href="${favHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.favorites"><span class="material-symbols-outlined" style="font-size: 18px;">favorite</span> Favorites</a>
              <a href="#" class="dropdown-link" id="langBtn" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.language"><span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language</a>
              <a href="${profileHref}" class="dropdown-link" style="display: flex; align-items: center; gap: 8px;" data-i18n="nav.profile"><span class="material-symbols-outlined" style="font-size: 18px;">person</span> Profile</a>
              <a href="#" class="dropdown-link" onclick="handleLogout(); return false;" style="display: flex; align-items: center; gap: 8px; color: #e74c3c;" data-i18n="nav.logout"><span class="material-symbols-outlined" style="font-size: 18px;">logout</span> Logout</a>
            `;
            
            dropdownMenu.html(newContent);
            
            fs.writeFileSync(file, $.html(), 'utf8');
            modifiedCount++;
        }
    }
}
console.log('Modified ' + modifiedCount + ' files.');
