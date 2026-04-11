// ============================================
// MEMBERSHIP DASHBOARD - LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    syncProfileData();
});

// 1. Theme Initialization
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
}

// 2. Theme Toggle
function initThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeBtn .material-symbols-outlined');
    if (icon) {
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        const color = theme === 'dark' ? 'white' : 'black';
        icon.style.setProperty('color', color, 'important');
    }
}

// 3. Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
}

// 4. Profile Sync
function syncProfileData() {
    const profileImg = document.querySelector('.profile-img');
    const savedAvatar = localStorage.getItem('currentAvatar');
    
    if (profileImg && savedAvatar) {
        profileImg.src = savedAvatar;
    }
}
