/**
 * Tutora Smooth Experience Engine
 * Handles reveals, scroll optimizations, and hardware acceleration globally.
 */
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;

    // 1. Force Hardware Acceleration for smooth rendering
    // On mobile, we only accelerate the most critical visible components to save memory
    const selectors = isMobile 
        ? ['.hero', '.card', '.artifact-image', '.stat-box'] 
        : ['section', '.hero', '.card', '.artifact-image', 'img', '.stat-box', '.info-section'];
        
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

    // Elements to reveal - reduced list for mobile to avoid CPU spikes
    const targets = isMobile
        ? ['.hero-content', '.section-title', '.card', '.stat-box', '.exhibition-card']
        : ['.hero-content', '.section-title', '.card', '.info-section', '.stat-box', '.historical-quote', '.footer-column', '.exhibition-card', '.event-card', '.feature-item', '.about-content', '.museum-stat'];

    targets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal-hidden');
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

    // 4. Smooth Mouse Move effect (Desktop Only)
    if (!isMobile) {
        document.querySelectorAll('.card, .stat-box, .btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                btn.style.setProperty('--mouse-x', `${x}px`);
                btn.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // 5. CRITICAL PERFORMANCE FIX FOR MOBILE
    // Heavy backgrounds (Dust & Shapes) are the primary cause of scroll lag
    if (isMobile) {
        const heavyBackgrounds = ['#dust-container', '#shapes-container', '#cursorGlow', '.dust-particle', '.royal-shape'];
        heavyBackgrounds.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none'; // Force hide to stop CPU/GPU load
            });
        });

        // Optimize overall page responsiveness
        document.body.style.textRendering = 'optimizeSpeed';
        document.body.style.webkitFontSmoothing = 'antialiased';
    }
});
