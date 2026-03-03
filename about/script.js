// ============================================
// MOBILE MENU TOGGLE
// ============================================

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.querySelector('.menu-overlay');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
}

// Close menu when clicking overlay
if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close menu when clicking on a link
const menuLinks = document.querySelectorAll('.menu-link, .dropdown-item');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
});

// ============================================
// MOBILE DROPDOWN TOGGLE
// ============================================

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();

        const dropdownItems = toggle.nextElementSibling;
        if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
            // Close other dropdowns
            document.querySelectorAll('.dropdown-items.show').forEach(item => {
                if (item !== dropdownItems) {
                    item.classList.remove('show');
                    item.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current dropdown
            dropdownItems.classList.toggle('show');
            toggle.classList.toggle('active');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-dropdown') && !e.target.closest('.dropdown-items')) {
        document.querySelectorAll('.dropdown-items.show').forEach(item => {
            item.classList.remove('show');
            item.previousElementSibling.classList.remove('active');
        });
    }
});

// ============================================
// DESKTOP DROPDOWN HOVER
// ============================================

const navDropdowns = document.querySelectorAll('.nav-dropdown');
navDropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        }
    });

    dropdown.addEventListener('mouseleave', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        }
    });
});
// ============================================
// DARK MODE / LIGHT MODE TOGGLE
// ============================================

const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon();
}

// Toggle dark mode
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Update theme icon
function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

document.querySelectorAll('.language-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all buttons
        document.querySelectorAll('.language-toggle button').forEach(b => {
            b.classList.remove('active');
        });
        // Add active to clicked button
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        console.log('Language changed to:', lang);
    });
});

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'scale(1.15)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'scale(1)';
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections and cards
document.querySelectorAll('.section, .timeline-content, .mission-card, .gallery-image').forEach(el => {
    observer.observe(el);
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#D4AF37';
        }
    });
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Tutora website loaded successfully');
    console.log('🌙 Dark mode available - click the moon icon to toggle');
    console.log('⬆️ Scroll down to see the back to top button');
}); // ============================================
// REUSABLE FOOTER COMPONENT - JAVASCRIPT
// ============================================

// ============================================
// DARK MODE SYSTEM (DEFAULT = DARK)
// ============================================

(function() {
    const savedTheme = localStorage.getItem('gemTheme') || 'dark';

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
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
            const isDark = body.classList.contains('dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', function(e) {

        // D → Toggle Dark Mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
            const isDark = body.classList.contains('dark-mode');
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
        const isDark = body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';

        if (newTheme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }

        localStorage.setItem('gemTheme', newTheme);
    },

    getCurrentTheme: function() {
        return localStorage.getItem('gemTheme') || 'dark';
    }
};

console.log('✓ GEM Footer Component Loaded (Default: Dark Mode)');