const fs = require('fs');
let content = fs.readFileSync('global-core.js', 'utf8');

const oldBlockStart = '// Add Mobile Language Option to Profile Dropdown globally';
const newBlock = `// Add Mobile Language Option to Profile Dropdown globally
function injectMobileLang() {
    const profileDropdowns = document.querySelectorAll('.profile-dropdown .dropdown-menu, #navProfileLink .dropdown-menu, #menuProfileLink .dropdown-items, .dropdown-items');
    profileDropdowns.forEach(dropdown => {
        // Only target dropdowns that have Settings or Logout to ensure it's a Profile dropdown
        const isProfileMenu = Array.from(dropdown.children).some(el => el.textContent.includes('Settings') || el.textContent.includes('Logout') || el.textContent.includes('الإعدادات'));
        if (isProfileMenu && !dropdown.querySelector('.mobile-lang-item')) {
            const langItem = document.createElement('a');
            langItem.href = '#';
            langItem.className = 'dropdown-link dropdown-item mobile-lang-item';
            langItem.style.display = 'flex';
            langItem.style.alignItems = 'center';
            langItem.style.gap = '8px';
            langItem.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">language</span> Language';
            langItem.addEventListener('click', (e) => {
                e.preventDefault();
                const mainLangBtn = document.getElementById('langBtn') || document.getElementById('menuLangBtn');
                if (mainLangBtn) mainLangBtn.click();
            });
            const settingsLink = Array.from(dropdown.children).find(el => el.textContent.includes('Settings') || el.textContent.includes('الإعدادات'));
            if (settingsLink) {
                dropdown.insertBefore(langItem, settingsLink);
            } else {
                dropdown.appendChild(langItem);
            }
        }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMobileLang);
} else {
    injectMobileLang();
}`;

if (content.includes(oldBlockStart)) {
    const startIndex = content.indexOf(oldBlockStart);
    content = content.substring(0, startIndex) + newBlock;
    fs.writeFileSync('global-core.js', content, 'utf8');
    console.log('Successfully updated global-core.js');
} else {
    console.log('Could not find old block to replace');
}
