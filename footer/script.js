// ============================================
// REUSABLE FOOTER COMPONENT - JAVASCRIPT
// ============================================

// ============================================
// DARK MODE SYSTEM (DEFAULT = DARK)
// ============================================

(function() {
    const savedTheme = localStorage.getItem('gemTheme') || 'dark';

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('gem-dark-mode');
    } else {
        document.documentElement.classList.remove('gem-dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('gem-dark-mode');
        } else {
            body.classList.remove('gem-dark-mode');
        }

        localStorage.setItem('gemTheme', theme);
    }

    // Load saved theme (default dark)
    const savedTheme = localStorage.getItem('gemTheme') || 'dark';
    applyTheme(savedTheme);

    // ============================================
    // LANGUAGE TOGGLE
    // ============================================

    const gemLangBtns = document.querySelectorAll('.gem-lang-btn');

    gemLangBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {

            gemLangBtns.forEach(function(b) {
                b.classList.remove('active');
            });

            btn.classList.add('active');

            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('gemLanguage', lang);
            document.documentElement.lang = lang;

            const langName = lang === 'ar' ? 'العربية' : 'English';
            showGemNotification('Language changed to ' + langName);
        });
    });

    // Load saved language
    const savedGemLang = localStorage.getItem('gemLanguage') || 'en';
    document.documentElement.lang = savedGemLang;

    const activeLangBtn = document.querySelector('[data-lang="' + savedGemLang + '"]');
    if (activeLangBtn) {
        activeLangBtn.classList.add('active');
    }

    // ============================================
    // HERO TITLE CLICK (TOGGLE DARK MODE)
    // ============================================

    const gemHeroTitle = document.querySelector('.gem-hero-title');

    if (gemHeroTitle) {
        gemHeroTitle.addEventListener('click', function() {
            const isDark = body.classList.contains('gem-dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', function(e) {

        // D → Toggle Dark Mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
            const isDark = body.classList.contains('gem-dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
            showGemNotification('Dark mode ' + (isDark ? 'disabled' : 'enabled'));
        }

        // L → Toggle Language
        if ((e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey) {

            const currentLang = localStorage.getItem('gemLanguage') || 'en';
            const newLang = currentLang === 'en' ? 'ar' : 'en';

            gemLangBtns.forEach(function(b) {
                b.classList.remove('active');
            });

            const newBtn = document.querySelector('[data-lang="' + newLang + '"]');
            if (newBtn) newBtn.classList.add('active');

            localStorage.setItem('gemLanguage', newLang);
            document.documentElement.lang = newLang;

            const langName = newLang === 'ar' ? 'العربية' : 'English';
            showGemNotification('Language changed to ' + langName);
        }

        // Home
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // End
        if (e.key === 'End') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

});


// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showGemNotification(message, type) {

    if (!type) type = 'info';

    const notification = document.createElement('div');
    notification.className = 'gem-notification gem-notification-' + type;
    notification.textContent = message;

    notification.style.cssText =
        'position:fixed;top:20px;right:20px;' +
        'background:#3b82f6;color:white;padding:1rem 1.5rem;' +
        'border-radius:8px;z-index:1000;font-weight:600;';

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 3000);
}


// ============================================
// EXPORT API
// ============================================

window.gemFooterAPI = {
    toggleDarkMode: function() {
        const body = document.body;
        const isDark = body.classList.contains('gem-dark-mode');
        const newTheme = isDark ? 'light' : 'dark';

        if (newTheme === 'dark') {
            body.classList.add('gem-dark-mode');
        } else {
            body.classList.remove('gem-dark-mode');
        }

        localStorage.setItem('gemTheme', newTheme);
    },

    getCurrentTheme: function() {
        return localStorage.getItem('gemTheme') || 'dark';
    }
};

console.log('✓ GEM Footer Component Loaded (Default: Dark Mode)');