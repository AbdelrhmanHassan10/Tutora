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
    

        // Generate Small Shapes Only
        if (shapesContainer) {
            const shapeCount = 25;
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
