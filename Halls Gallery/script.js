/**
 * Tutora Halls Gallery - Advanced Interactions
 * Features: Cinematic Parallax, Scroll Revelations, Dynamic Content Loading
 */

(function() {
    function initGallery() {
        initStandardNavigation();
        initScrollRevelations();
        initParallaxHero();
        initHallInteractions();
        initChronologicalFilter();
    }

    // Safety: Run immediately if DOM ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    /**
     * Standard Header & Mobile Menu Logic
     */
    function initStandardNavigation() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const themeBtn = document.getElementById('themeBtn');

        function openMenu() {
            if (mobileMenu) mobileMenu.classList.add('active');
            if (menuOverlay) menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log("Tutora: Menu Opened");
        }

        function closeMenu() {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log("Tutora: Menu Closed");
        }

        // Use document-level delegation to be absolutely sure we catch the click
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Check for Open Button
            if (target.closest('#menuBtn') || target.closest('.menu-btn')) {
                e.preventDefault();
                openMenu();
            }
            
            // Check for Close Button or Overlay
            if (target.closest('#closeBtn') || target.closest('.close-btn') || target.closest('#menuOverlay')) {
                e.preventDefault();
                closeMenu();
            }
            
            // Check for Dropdown Toggles inside Mobile Menu
            const dropdownToggle = target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                e.preventDefault();
                e.stopPropagation();
                const parent = dropdownToggle.closest('.menu-dropdown');
                const items = parent ? parent.querySelector('.dropdown-items') : null;
                
                dropdownToggle.classList.toggle('active');
                if (items) {
                    items.classList.toggle('show');
                }
            }
        });

        // Theme Toggle - Sync with Global (uses 'theme' key)
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'dark';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                
                if (window.applyTheme) {
                    window.applyTheme();
                } else {
                    document.body.classList.toggle('dark', newTheme === 'dark');
                    document.body.classList.toggle('light', newTheme === 'light');
                }
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
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                    heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
                }
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
                
                const xPercent = (x / rect.width - 0.5) * 15;
                const yPercent = (y / rect.height - 0.5) * 15;
                
                const img = card.querySelector('.hall-card-img');
                if (img) {
                    img.style.transform = `scale(1.15) translate(${xPercent}px, ${yPercent}px)`;
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
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

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
})();
