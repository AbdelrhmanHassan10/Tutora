document.addEventListener('DOMContentLoaded', () => {

    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    updateThemeIcon();

    // Toggle dark mode
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeBtn.querySelector('.material-symbols-outlined');

        if (body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
        } else {
            icon.textContent = 'dark_mode';
        }
    }

});
// Initialize theme from localStorage or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// Toggle theme on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}
// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks = document.querySelectorAll('.menu-link');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

// Open mobile menu
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

// Close mobile menu
const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

// Close menu when link is clicked
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});


// 3. Tab Switching (if applicable)
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// 4. Favorite Buttons (if applicable)
const favBtns = document.querySelectorAll('.btn-fav-active, .btn-favorite');
favBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const icon = this.querySelector('.material-symbols-outlined');
        if (icon) {
            const isFilled = icon.style.fontVariationSettings && icon.style.fontVariationSettings.includes("'FILL' 1");
            if (isFilled) {
                icon.style.fontVariationSettings = "'FILL' 0";
                this.style.backgroundColor = '';
                this.style.color = '';
            } else {
                icon.style.fontVariationSettings = "'FILL' 1";
                this.style.backgroundColor = '#f2d00d';
                this.style.color = '#000000';
            }
        }
    });
});