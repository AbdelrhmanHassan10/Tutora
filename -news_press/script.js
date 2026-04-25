document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    
    // Initialize theme from localStorage
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

    // 2. Profile Sync
    function syncProfile() {
        const profileImg = document.querySelector('.profile-img');
        if (!profileImg) return;

        // Try to get avatar from standard project keys
        const currentAvatar = localStorage.getItem('currentAvatar');
        const userProfile = localStorage.getItem('userProfile');
        
        if (currentAvatar) {
            profileImg.src = currentAvatar;
        } else if (userProfile) {
            try {
                const userData = JSON.parse(userProfile);
                if (userData.profileImage) profileImg.src = userData.profileImage;
                else if (userData.profilePicture) profileImg.src = userData.profilePicture;
            } catch (e) {
                console.error("Error parsing userProfile:", e);
            }
        }
    }
    syncProfile();

    // Global sync function for other scripts
    window.syncGlobalAvatar = syncProfile;

    // 3. Mobile Menu Logic
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    if (menuBtn && mobileMenu && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);
    }

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim-on-scroll').forEach(el => observer.observe(el));

    // Initialize Atmosphere
    initRoyalAtmosphere();
});

function initRoyalAtmosphere() {
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    if (!dustContainer) return;

    // Generate Massive Dust (500 particles)
    const particleCount = 500;
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
            opacity: ${Math.random() * 0.6 + 0.1};
            animation: floatParticle ${duration}s infinite linear;
            animation-delay: ${delay}s;
            filter: blur(${Math.random() * 1.5}px);
        `;
        dustContainer.appendChild(dust);
    }

    // Generate Small Shapes Only
    if (shapesContainer) {
        const shapeCount = 25;
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            const size = Math.random() * 8 + 8;
            const duration = Math.random() * 20 + 25;
            
            shape.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                transform: rotate(${Math.random() * 360}deg);
                opacity: ${Math.random() * 0.15 + 0.05};
                animation: floatParticle ${duration}s infinite linear reverse;
                animation-delay: ${Math.random() * -25}s;
                clip-path: ${i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'};
                border: 1px solid rgba(236, 182, 19, 0.3);
            `;
            shapesContainer.appendChild(shape);
        }
    }
}
