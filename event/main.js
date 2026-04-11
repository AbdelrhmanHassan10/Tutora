document.addEventListener('DOMContentLoaded', () => {
    // Note: Global Auth and Theme is handled by global-core.js
    // If you need to add event-specific logic, do it here.

    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    // ======== Mobile Menu Toggle ========

    // جلب العناصر
    const menuBtn = document.getElementById("menuBtn"); 
    const mobileMenu = document.getElementById("mobileMenu"); 
    const closeBtn = document.getElementById("closeBtn");
    const menuOverlay = document.getElementById("menuOverlay");

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add("open");
        if (menuOverlay) menuOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove("open");
        if (menuOverlay) menuOverlay.classList.remove("open");
        document.body.style.overflow = "";
    };

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

    // غلق المينيو بالضغط على أي رابط جوه المنيو
    if (mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll(".menu-link, .dropdown-item");
        menuLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    }

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
            const titleBlock = card.querySelector('.artifact-title');
            const locBlock = card.querySelector('.location-text');
            const dynBlock = card.querySelector('.dynasty-label');

            const title = titleBlock ? titleBlock.textContent.toLowerCase() : '';
            const location = locBlock ? locBlock.textContent.toLowerCase() : '';
            const dynasty = dynBlock ? dynBlock.textContent.toLowerCase() : '';

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
            if (icon) {
                const isFilled = icon.style.fontVariationSettings ? icon.style.fontVariationSettings.includes("'FILL' 1") : false;
                icon.style.fontVariationSettings = isFilled ? "'FILL' 0" : "'FILL' 1";
                this.style.color = isFilled ? 'white' : '#f2d00d';
            }
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
                const href = btn.getAttribute('href');
                if (href === '#' || !href) e.preventDefault();
                addRipple(btn, e);
            });
        });

    // ============================================
    // NEWSLETTER FORM HANDLER
    // ============================================

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            const button = newsletterForm.querySelector('button');
            const originalText = button.textContent;

            button.disabled = true;
            button.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite">sync</span> Subscribing...';

            setTimeout(() => {
                button.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Subscribed!';
                newsletterForm.querySelector('input').value = '';
                alert(`Thank you for joining our community! A confirmation has been sent to ${email}.`);
                
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                }, 3000);
            }, 1500);
        });
    }

    console.log('✓ Event page logic initialized');
});