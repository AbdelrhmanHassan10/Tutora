/**
 * Tutora Halls Gallery - Advanced Interactions
 * Features: Cinematic Parallax, Scroll Revelations, Dynamic Content Loading
 */

document.addEventListener('DOMContentLoaded', () => {
    initStandardNavigation();
    initScrollRevelations();
    initParallaxHero();
    initHallInteractions();
    initChronologicalFilter();
});

/**
 * Standard Header & Mobile Menu Logic
 */
function initStandardNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const themeBtn = document.getElementById('themeBtn');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay click
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Theme Toggle Sync
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark');
            document.body.classList.toggle('light', !isDark);
            
            const icon = themeBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
            
            localStorage.setItem('tutora-theme', isDark ? 'dark' : 'light');
        });
    }
}

/**
 * Cinematic Parallax for Hero
 */
function initParallaxHero() {
    const heroImg = document.querySelector('.hero-video-bg img');
    if (!heroImg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled * 0.0005})`;
            document.querySelector('.hero-content').style.transform = `translateY(${scrolled * 0.2}px)`;
            document.querySelector('.hero-content').style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });
}

/**
 * Hall Card Dynamic Interactions
 */
function initHallInteractions() {
    const cards = document.querySelectorAll('.hall-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 10;
            const yPercent = (y / rect.height - 0.5) * 10;
            
            const img = card.querySelector('.hall-card-img');
            if (img) {
                img.style.transform = `scale(1.1) translate(${xPercent}px, ${yPercent}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const img = card.querySelector('.hall-card-img');
            if (img) {
                img.style.transform = 'scale(1) translate(0, 0)';
            }
        });
    });
}

/**
 * Chronological Gallery Filtering
 */
function initChronologicalFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const hallBoxes = document.querySelectorAll('.hall-box');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            hallBoxes.forEach(box => {
                if (category === 'all' || box.dataset.category === category) {
                    box.style.display = 'block';
                    setTimeout(() => box.style.opacity = '1', 10);
                } else {
                    box.style.opacity = '0';
                    setTimeout(() => box.style.display = 'none', 300);
                }
            });
        });
    });
}

/**
 * Reveal elements on scroll
 */
function initScrollRevelations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));
}
