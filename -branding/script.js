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

    // 4. Scroll Reveal Animations
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

    // 5. Royal Atmosphere Generator (More Dust & Small Shapes)
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
                animation: float ${duration}s infinite linear;
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
                const size = Math.random() * 8 + 8; // Small: 8-16px
                const duration = Math.random() * 20 + 25;
                
                shape.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    transform: rotate(${Math.random() * 360}deg);
                    opacity: ${Math.random() * 0.15 + 0.05};
                    animation: float ${duration}s infinite linear reverse;
                    animation-delay: ${Math.random() * -25}s;
                    clip-path: ${i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'};
                    border: 1px solid rgba(236, 182, 19, 0.3);
                `;
                shapesContainer.appendChild(shape);
            }
        }
    }
    initRoyalAtmosphere();

    // 6. Cinematic 3D Parallax for Hero
    const hero = document.querySelector('.brand-hero');
    const heroContent = document.querySelector('.brand-hero-content');
    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateZ(30px)`;
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        });
    }
});
