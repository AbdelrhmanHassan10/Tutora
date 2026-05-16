document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initMobileMenu();
    syncProfileData();
    
    // Global effects are handled by global-core.js
    if (window.initRoyalAtmosphere) if (window.init3DParallax) window.init3DParallax();
});

// 1. FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.mem-faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'SUMMARY' || e.target.closest('summary')) {
                if (item.hasAttribute('open')) return;
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
}

// 2. Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = (show) => {
        if (mobileMenu) mobileMenu.classList.toggle('active', show);
        if (menuOverlay) menuOverlay.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
}

// 3. Profile Sync
function syncProfileData() {
    const profileImg = document.querySelector('.profile-img');
    const savedAvatar = localStorage.getItem('currentAvatar');
    
    if (profileImg && savedAvatar) {
        profileImg.src = savedAvatar;
    }
}
