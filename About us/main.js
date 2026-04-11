document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll('.menu-link, .dropdown-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ============================================
    // MOBILE DROPDOWN TOGGLE
    // ============================================

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
                // Close other dropdowns
                document.querySelectorAll('.dropdown-items.show').forEach(item => {
                    if (item !== dropdownItems) {
                        item.classList.remove('show');
                        item.previousElementSibling.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                dropdownItems.classList.toggle('show');
                toggle.classList.toggle('active');
            }
        });
    });

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================

    const stats = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                let currentCount = 0;
                const duration = 2000;
                const increment = countTo / (duration / 16);

                const updateCount = () => {
                    currentCount += increment;
                    if (currentCount < countTo) {
                        target.innerText = Math.floor(currentCount).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = countTo.toLocaleString();
                    }
                };
                updateCount();
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================

    const revealElements = document.querySelectorAll('.hero-title, .hero-subtitle, .narrative-title, .narrative-text, .stat-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        revealObserver.observe(el);
    });

    // ============================================
    // CINEMATIC PARALLAX
    // ============================================

    const heroImage = document.querySelector('.hero-image');
    const heroImageSection = document.querySelector('.hero-image-section');

    if (heroImage && heroImageSection) {
        let current = 0;
        let target = 0;
        const ease = 0.08;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sectionTop = heroImageSection.offsetTop;
            const sectionHeight = heroImageSection.offsetHeight;

            if (scrollY + window.innerHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                target = (scrollY - sectionTop) * 0.15;
            }
        });

        const animateParallax = () => {
            current += (target - current) * ease;
            heroImage.style.transform = `translateY(${current}px)`;
            requestAnimationFrame(animateParallax);
        }
        animateParallax();
    }

    // ============================================
    // DIRECTIONS BTN
    // ============================================

    const directionsBtn = document.querySelector('.btn-directions');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/search/Grand+Egyptian+Museum', '_blank');
        });
    }

    console.log('✓ About Us Logic Loaded');
});