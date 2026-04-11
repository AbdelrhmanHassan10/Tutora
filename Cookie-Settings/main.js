document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MOBILE MENU DRAWER ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- 2. MOBILE DROPDOWN ---
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.menu-dropdown');
            const items = dropdown?.querySelector('.dropdown-items');
            if (btn && items) {
                btn.classList.toggle('active');
                items.classList.toggle('show');
            }
        });
    });

    // --- 3. COOKIE PREFERENCE MANAGEMENT ---
    const saveBtn = document.getElementById('save-btn');
    const rejectBtn = document.getElementById('reject-btn');
    const analyticalToggle = document.getElementById('analytical');
    const marketingToggle = document.getElementById('marketing');

    // Load saved preferences
    const loadPreferences = () => {
        const savedPrefs = JSON.parse(localStorage.getItem('tutora_cookie_prefs') || '{}');
        if (analyticalToggle) analyticalToggle.checked = savedPrefs.analytical ?? false;
        if (marketingToggle) marketingToggle.checked = savedPrefs.marketing ?? false;
    };

    const savePreferences = (analytical, marketing) => {
        const prefs = {
            analytical,
            marketing,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('tutora_cookie_prefs', JSON.stringify(prefs));
        
        // Visual feedback
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Settings Saved!';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
    };

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            savePreferences(analyticalToggle.checked, marketingToggle.checked);
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            if (analyticalToggle) analyticalToggle.checked = false;
            if (marketingToggle) marketingToggle.checked = false;
            savePreferences(false, false);
        });
    }

    // Initialize
    loadPreferences();
});
