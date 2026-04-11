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

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
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
});
