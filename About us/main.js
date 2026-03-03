document.addEventListener('DOMContentLoaded', () => {
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

    // 1. Mobile Menu Toggle
    const header = document.querySelector('header');
    const navGroup = document.querySelector('.nav-group');

    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 32px;">menu</span>';

    if (window.innerWidth <= 768) {
        header.insertBefore(mobileMenuBtn, navGroup);
    }

    mobileMenuBtn.addEventListener('click', () => {
        const isMenuOpen = navGroup.style.display === 'flex';

        if (isMenuOpen) {
            navGroup.style.display = 'none';
            mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 32px;">menu</span>';
        } else {
            navGroup.style.display = 'flex';
            navGroup.style.flexDirection = 'column';
            navGroup.style.position = 'absolute';
            navGroup.style.top = '100%';
            navGroup.style.left = '0';
            navGroup.style.width = '100%';
            navGroup.style.backgroundColor = '#121212';
            navGroup.style.padding = '2rem';
            navGroup.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

            const mainNav = navGroup.querySelector('.main-nav');
            mainNav.style.display = 'flex';
            mainNav.style.flexDirection = 'column';
            mainNav.style.alignItems = 'center';
            mainNav.style.width = '100%';

            mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 32px;">close</span>';
        }
    });
    const themeBtn = document.getElementById("themeBtn");
    const themeIcon = themeBtn.querySelector("span");

    // تحميل الثيم
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        themeIcon.textContent = "light_mode";
    } else {
        document.body.classList.remove("light-mode");
        themeIcon.textContent = "dark_mode";
    }

    // عند الضغط
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            themeIcon.textContent = "light_mode";
        } else {
            localStorage.setItem("theme", "dark");
            themeIcon.textContent = "dark_mode";
        }
    });

    // 2. Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                let currentCount = 0;
                const duration = 2000;
                const increment = countTo / (duration / 16);

                const updateCount = () => {
                    currentCount += increment;

                    if (currentCount < countTo) {
                        target.innerText = Math.floor(currentCount).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = countTo.toLocaleString();
                    }
                };

                updateCount();
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));


    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.hero-title, .hero-subtitle, .narrative-title, .narrative-text, .stat-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        revealObserver.observe(el);
    });


    /* ===============================
   4. Cinematic Smooth Parallax
=============================== */

    const heroImage = document.querySelector('.hero-image');
    const heroImageSection = document.querySelector('.hero-image-section');

    if (heroImage && heroImageSection) {

        let current = 0;
        let target = 0;
        const ease = 0.08; // كل ما الرقم يقل الحركة تبقى أنعم

        window.addEventListener('scroll', () => {

            const scrollY = window.scrollY;
            const sectionTop = heroImageSection.offsetTop;
            const sectionHeight = heroImageSection.offsetHeight;

            if (
                scrollY + window.innerHeight > sectionTop &&
                scrollY < sectionTop + sectionHeight
            ) {
                target = (scrollY - sectionTop) * 0.15;
            }

        });

        function animate() {
            current += (target - current) * ease;
            heroImage.style.transform = `translateY(${current}px)`;
            requestAnimationFrame(animate);
        }

        animate();
    }



    // 5. Smooth Scroll for Directions
    const directionsBtn = document.querySelector('.btn-directions');

    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/search/Grand+Egyptian+Museum', '_blank');
        });
    }

}); // ============================================
// REUSABLE FOOTER COMPONENT - JAVASCRIPT
// ============================================

// ============================================
// DARK MODE SYSTEM (DEFAULT = DARK)
// ============================================

(function() {

    if (themeBtn === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', function() {

    const body = document.body;

    function applyTheme(themeBtn) {
        if (themeBtn === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }

        localStorage.setItem('themeBtn', themeBtn);
    }

    // Load saved themeBtn (default dark)
    const savedthemeBtn = localStorage.getItem('themeBtn') || 'dark';
    themeBtn(themeBtn);

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
        const newthemeBtn = isDark ? 'light' : 'dark';

        if (newthemeBtn === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }

        localStorage.setItem('themeBtn', newthemeBtn);
    },

    getCurrentthemeBtn: function() {
        return localStorage.getItem('themeBtn') || 'dark';
    }
};

console.log('✓ GEM Footer Component Loaded (Default: Dark Mode)');