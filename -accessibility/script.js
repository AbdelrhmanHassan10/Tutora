document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Standardized)
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.remove('dark', 'light');
    body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        const icon = themeBtn?.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            body.classList.remove('dark', 'light');
            body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // 2. Profile Image Synchronization
    function syncProfile() {
        const profileImg = document.querySelector('.profile-img');
        if (!profileImg) return;
        const currentAvatar = localStorage.getItem('currentAvatar');
        const userProfile = localStorage.getItem('userProfile');
        if (currentAvatar) {
            profileImg.src = currentAvatar;
        } else if (userProfile) {
            try {
                const userData = JSON.parse(userProfile);
                if (userData.profileImage) profileImg.src = userData.profileImage;
            } catch (e) {}
        }
    }
    syncProfile();
    window.syncGlobalAvatar = syncProfile;

    // 3. Mobile Menu
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeBtn');

    if (menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));

    // 4. Accessibility Settings Logic
    // Text Size
    const textSizeRange = document.getElementById('textSizeRange');
    const sizeLabels = document.querySelectorAll('.acc-size-labels span');
    if (textSizeRange) {
        textSizeRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sizeLabels.forEach((label, i) => {
                label.classList.toggle('active', i === val - 1);
            });
            const sizes = ['14px', '16px', '18px', '20px'];
            document.documentElement.style.fontSize = sizes[val - 1];
        });
    }

    // High Contrast & Reduce Motion
    const highContrastToggle = document.getElementById('highContrast');
    const reduceMotionToggle = document.getElementById('reduceMotion');

    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', (e) => {
            body.classList.toggle('high-contrast', e.target.checked);
            localStorage.setItem('highContrast', e.target.checked);
        });
        // Initial state
        if (localStorage.getItem('highContrast') === 'true') {
            highContrastToggle.checked = true;
            body.classList.add('high-contrast');
        }
    }

    if (reduceMotionToggle) {
        reduceMotionToggle.addEventListener('change', (e) => {
            body.classList.toggle('reduce-motion', e.target.checked);
            localStorage.setItem('reduceMotion', e.target.checked);
        });
        // Initial state
        if (localStorage.getItem('reduceMotion') === 'true') {
            reduceMotionToggle.checked = true;
            body.classList.add('reduce-motion');
        }
    }

    // 5. Scroll Animations
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim-on-scroll').forEach(el => observer.observe(el));
});
