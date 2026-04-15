/* ============================================
   SETTINGS PAGE LOGIC - TUTORA
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Tab Switching
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const sections = document.querySelectorAll('.settings-panel');

    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update Active Button
            sidebarBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update Active Section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `${tabId}-tab`) {
                    sec.classList.add('active');
                }
            });
        });
    });

    // 2. Accessibility: Text Size Logic
    const textSizeRange = document.getElementById('text-size-range');
    const previewText = document.getElementById('preview-text');

    const updateTextSize = (val) => {
        if (!previewText) return;
        let size = '1rem';
        if (val == 2) size = '1.25rem';
        if (val == 3) size = '1.75rem';
        previewText.style.fontSize = size;
        // Optimization: apply to body for instant preview if needed, 
        // but here we just preview in the box until "Apply"
    };

    if (textSizeRange) {
        textSizeRange.addEventListener('input', (e) => updateTextSize(e.target.value));
    }

    // 3. Accessibility: Contrast Logic
    const contrastOptions = document.querySelectorAll('input[name="contrast"]');
    contrastOptions.forEach(opt => {
        opt.addEventListener('change', () => {
            // Preview logic if desired
        });
    });

    // 4. Appearance: Theme Sync
    const updateThemeCards = (theme) => {
        const currentTheme = theme || localStorage.getItem('theme') || 'dark';
        const cards = document.querySelectorAll('.theme-card');
        cards.forEach(card => {
            const isDarkCard = card.querySelector('.dark');
            card.classList.remove('active');
            if (currentTheme === 'dark' && isDarkCard) card.classList.add('active');
            if (currentTheme === 'light' && !isDarkCard) card.classList.add('active');
        });
    };

    // Listen for global theme changes (from the sun/moon button)
    window.addEventListener('themeChanged', (e) => {
        updateThemeCards(e.detail.theme);
    });

    // Initial card state
    updateThemeCards();

    // 5. Load Stored Settings
    const loadSettings = () => {
        const storedSize = localStorage.getItem('gem-text-size') || 2;
        const storedContrast = localStorage.getItem('gem-contrast') || 'standard';
        const storedMotion = localStorage.getItem('gem-motion') !== 'false'; // default true

        if (textSizeRange) {
            textSizeRange.value = storedSize;
            updateTextSize(storedSize);
        }

        const contrastInput = document.querySelector(`input[name="contrast"][value="${storedContrast}"]`);
        if (contrastInput) contrastInput.checked = true;

        const motionInput = document.getElementById('motionToggle');
        if (motionInput) motionInput.checked = storedMotion;
    };

    loadSettings();

    // 6. Apply & Save Settings
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // Collect Values
            const size = textSizeRange ? textSizeRange.value : 2;
            const contrast = document.querySelector('input[name="contrast"]:checked').value;
            const motion = document.getElementById('motionToggle').checked;

            // Save to LocalStorage
            localStorage.setItem('gem-text-size', size);
            localStorage.setItem('gem-contrast', contrast);
            localStorage.setItem('gem-motion', motion);

            // Apply logic (Global effects)
            if (contrast === 'high') {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }

            // Feedback
            if (window.showPremiumToast) {
                window.showPremiumToast('Settings saved successfully. Portal optimized.', 'success');
            } else {
                alert('Settings saved!');
            }
        });
    }

    // 7. Reset Defaults
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('gem-text-size');
            localStorage.removeItem('gem-contrast');
            localStorage.removeItem('gem-motion');
            
            loadSettings();
            document.body.classList.remove('high-contrast');

            if (window.showPremiumToast) {
                window.showPremiumToast('Restored original museum defaults.', 'success');
            } else {
                alert('Settings reset.');
            }
        });
    }
});