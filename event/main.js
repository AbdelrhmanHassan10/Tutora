// ============================================
// COLLECTION PAGE - COMPLETE JAVASCRIPT
// ============================================

// Apply dark mode immediately before DOM renders
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark_mode';
    if (savedTheme === 'dark_mode') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // ============================================
    // DARK MODE / LIGHT MODE TOGGLE
    // ============================================

    const themeBtn = document.getElementById('themeBtn');

    function updateThemeIcon() {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        if (body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
        } else {
            icon.textContent = 'dark_mode';
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark_mode' : 'light');
            updateThemeIcon();
        });
    }

    updateThemeIcon();

    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    // ======== Mobile Menu Toggle ========

    // جلب العناصر
    const menuBtn = document.querySelector(".menu-btn"); // زرار الهامبرجر
    const mobileMenu = document.querySelector(".mobile-menu"); // المنيو نفسه
    const closeBtn = document.querySelector(".close-btn"); // زرار الغلق في الهيدر أو المنيو

    // فتح المينيو
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active");
    });

    // غلق المينيو بالزرار
    closeBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

    // غلق المينيو بالضغط على أي رابط جوه المنيو (اختياري)
    const menuLinks = mobileMenu.querySelectorAll(".menu-link, .dropdown-item");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));
        input.addEventListener('input', e => {
            const query = e.target.value.toLowerCase();
            if (query.length > 0) filterArtifacts(query);
            else showAllArtifacts();
        });
    });

    // Artifact filtering
    const artifactCards = document.querySelectorAll('.artifact-card');

    function filterArtifacts(query) {
        artifactCards.forEach(card => {
            const title = card.querySelector('.artifact-title').textContent.toLowerCase();
            const location = card.querySelector('.location-text').textContent.toLowerCase();
            const dynasty = card.querySelector('.dynasty-label').textContent.toLowerCase();

            card.style.display = (title.includes(query) || location.includes(query) || dynasty.includes(query)) ? '' : 'none';
        });
    }

    function showAllArtifacts() {
        artifactCards.forEach(card => card.style.display = '');
    }

    // ============================================
    // FAVORITE BUTTON FUNCTIONALITY
    // ============================================

    const favoriteBtns = document.querySelectorAll('.btn-favorite');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('.material-symbols-outlined');
            const isFilled = icon.style.fontVariationSettings.includes("'FILL' 1");
            icon.style.fontVariationSettings = isFilled ? "'FILL' 0" : "'FILL' 1";
            this.style.color = isFilled ? 'white' : '#f2d00d';
        });
    });

    // ============================================
    // LANGUAGE TOGGLE
    // ============================================

    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.language-toggle button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('language', lang);
            console.log('Language changed to:', lang);
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // BUTTON INTERACTIONS (Learn More, Action, Primary)
    // ============================================

    function addRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.btn-learn, .btn-action-gold, .btn-action-turquoise, .btn-primary, .btn-accent')
        .forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                addRipple(btn, e);
            });
        });

    // ============================================
    // INITIALIZATION LOGS
    // ============================================

    console.log('✓ Collection page loaded successfully');
    console.log('🌙 Dark mode toggle: Press theme button');
    console.log('📱 Mobile menu toggle: Press menu button');
});