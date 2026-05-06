document.addEventListener('DOMContentLoaded', () => {


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

        // Generate Massive Dust (200 particles)
        const particleCount = 200;
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 15 + 25;
            const delay = Math.random() * -30;
            
            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                background-color: var(--dust-color);
                opacity: ${Math.random() * 0.3 + 0.05};
                animation: float ${duration}s infinite linear;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 1.5}px);
                position: absolute;
                border-radius: 50%;
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
                    border: 1px solid var(--shape-border);
                    position: absolute;
                `;
                shapesContainer.appendChild(shape);
            }
        }
    }
    initRoyalAtmosphere();
    initMobileMenu();
    initThemeToggle();

    function initThemeToggle() {
        const themeBtn = document.getElementById('themeBtn');
        const body = document.body;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.classList.remove('light', 'dark');
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const newTheme = body.classList.contains('light') ? 'dark' : 'light';
                body.classList.remove('light', 'dark');
                body.classList.add(newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        }

        function updateThemeIcon(theme) {
            if (!themeBtn) return;
            const icon = themeBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
            }
        }
    }

    function initMobileMenu() {
        const menuBtn = document.getElementById("menuBtn");
        const closeBtn = document.getElementById("closeBtn");
        const mobileMenu = document.getElementById("mobileMenu");
        const menuOverlay = document.getElementById("menuOverlay");

        const toggleMenu = (show) => {
            if (mobileMenu) mobileMenu.classList.toggle("active", show);
            if (menuOverlay) menuOverlay.classList.toggle("active", show);
            document.body.style.overflow = show ? "hidden" : "";
        };

        if (menuBtn) menuBtn.addEventListener("click", () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));
        if (menuOverlay) menuOverlay.addEventListener("click", () => toggleMenu(false));

        const dropdownToggles = document.querySelectorAll(".mobile-menu .dropdown-toggle");
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener("click", (e) => {
                e.preventDefault();
                const parent = toggle.closest(".menu-dropdown");
                const items = parent.querySelector(".dropdown-items");
                const icon = toggle.querySelector(".material-symbols-outlined");

                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.classList.remove("active");
                        const otherParent = otherToggle.closest(".menu-dropdown");
                        otherParent.querySelector(".dropdown-items").classList.remove("show");
                        const otherIcon = otherToggle.querySelector(".material-symbols-outlined");
                        if (otherIcon) otherIcon.textContent = "expand_more";
                    }
                });

                const isOpen = items.classList.toggle("show");
                toggle.classList.toggle("active", isOpen);
                if (icon) icon.textContent = isOpen ? "expand_less" : "expand_more";
            });
        });
    }

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
