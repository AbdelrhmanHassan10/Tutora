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

    // 6. Royal Atmosphere Generator
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        if (!dustContainer) return;

        // Generate Massive Dust (150 particles for performance on accessibility page)
        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 10 + 20;
            const delay = Math.random() * -30;
            
            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: float ${duration}s infinite linear;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 1.5}px);
            `;
            dustContainer.appendChild(dust);
        }

        // Generate Royal Shapes
        if (shapesContainer) {
            const shapes = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
            const shapeCount = 20;
            for (let i = 0; i < shapeCount; i++) {
                const shape = document.createElement('div');
                shape.className = 'royal-shape';
                shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 20 + 20;
                const duration = Math.random() * 20 + 25;
                
                shape.style.cssText = `
                    font-size: ${size}px;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation: rotateFloat ${duration}s infinite ease-in-out;
                    animation-delay: ${Math.random() * -20}s;
                `;
                shapesContainer.appendChild(shape);
            }
        }
    }
    initRoyalAtmosphere();
});

