document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME TOGGLE SYSTEM ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.classList.remove('dark', 'light');
        body.classList.add(theme);
        localStorage.setItem('gem-theme', theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }
    };

    const savedTheme = localStorage.getItem('gem-theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // --- 2. MOBILE MENU SYSTEM ---
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

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 3. MOBILE DROPDOWN TOGGLE ---
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent menu from closing
            const dropdown = btn.closest('.menu-dropdown');
            const content = dropdown.querySelector('.dropdown-items');

            btn.classList.toggle('active');
            content.classList.toggle('show');
        });
    });

    // --- 4. FORM & SCROLL EFFECTS (Your existing code) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.contact-item, .form-container, .map-container').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    console.log("✓ All systems are running correctly.");
});