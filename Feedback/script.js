document.addEventListener("DOMContentLoaded", function() {

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuBtn) {
        menuBtn.addEventListener("click", function() {
            mobileMenu.classList.add("active");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            mobileMenu.classList.remove("active");
        });
    }

}); // ============================================
// COMPLETE CLEAN SCRIPT (Dark + Mobile Menu)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // DARK MODE SYSTEM (GLOBAL)
    // ============================================

    const themeBtn = document.getElementById('themeBtn');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';

    if (savedTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    function updateThemeIcon() {
        if (!themeBtn) return;

        const icon = themeBtn.querySelector('.material-symbols-outlined');
        if (!icon) return;

        icon.textContent = html.classList.contains('dark') ?
            'light_mode' :
            'dark_mode';
    }

    updateThemeIcon();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');

            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            updateThemeIcon();
        });
    }

    // ============================================
    // MOBILE MENU SYSTEM
    // ============================================

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        if (!mobileMenu || !menuOverlay) return;

        mobileMenu.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!mobileMenu || !menuOverlay) return;

        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking any link
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ============================================
    // MOBILE DROPDOWN TOGGLE
    // ============================================

    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.menu-dropdown');
            if (parent) parent.classList.toggle('open');
        });
    });

    console.log("✓ Dark mode + Mobile menu working");
});