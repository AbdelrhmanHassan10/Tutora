/**
 * Tutora Smooth Experience Engine
 * Handles reveals, scroll optimizations, and hardware acceleration globally.
 */
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;

    // 0. Initial Page Transition
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);


    // 0.5 Cursor Glow Movement (Desktop Only)
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && !isMobile) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        });
    }

    // 1. Force Hardware Acceleration

    const selectors = isMobile 
        ? ['.hero', '.artifact-image'] 
        : ['.hero', '.artifact-image', '.stat-box'];
        
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.willChange = 'transform, opacity';
            el.style.transform = 'translateZ(0)'; // Force GPU
        });
    });

    // 2. Intersection Observer for Reveal Animations
    // On mobile, we use a larger rootMargin to start animations earlier (less "pop-in" lag)
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal - expanded list for maximum dynamism
    const targets = isMobile
        ? ['.hero-content', '.section-title', '.card', '.stat-box', '.exhibition-card', '.artifact-panel', '.amenity-card']
        : ['.hero-content', '.section-title', '.card', '.info-section', '.stat-box', '.historical-quote', '.footer-column', '.exhibition-card', '.event-card', '.feature-item', '.about-content', '.museum-stat', '.artifact-panel', '.amenity-card', '.curator-panel', '.membership-content', '.newsletter-content', '.location-header'];


    targets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal-hidden');
            
            // Apply staggering if multiple elements exist in same parent
            if (!isMobile) {
                const parent = el.parentElement;
                const siblings = Array.from(parent.children).filter(c => targets.some(t => c.matches(t)));
                const childIndex = siblings.indexOf(el);
                if (childIndex > 0 && childIndex < 6) {
                    el.classList.add(`reveal-delay-${childIndex}`);
                }
            }

            revealObserver.observe(el);
        });
    });


    // 3. Special dynamic effect for the Hero section
    // Disabled or simplified on mobile to prevent scroll lag
    const hero = document.querySelector('.hero-section, .hero');
    if (hero && !isMobile) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }, { passive: true });
    }

    // 4. Smooth Magnetic Effect for Primary Buttons (Desktop Only)
    if (!isMobile) {
        document.querySelectorAll('.btn-primary, .nav-item, .card, .booking-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Set CSS variables for spotlight effect
                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);

                // Magnetic Pull
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / 8;
                const deltaY = (y - centerY) / 8;
                
                btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.02)`;
                btn.style.transition = 'none';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate3d(0, 0, 0) scale(1)`;
                btn.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            });
        });
    }


    // 5. CRITICAL PERFORMANCE FIX FOR MOBILE
    // Removed hiding of atmospheric effects as they are now optimized.
    if (isMobile) {
        document.body.style.textRendering = 'optimizeSpeed';
        document.body.style.webkitFontSmoothing = 'antialiased';
    }
});
