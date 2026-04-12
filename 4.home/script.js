document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://gem-backend-production-cb6d.up.railway.app/api';

    // ============================================
    // 1. HOME-SPECIFIC LOGIC
    // ============================================

    // Note: Global Auth and Theme is handled by global-core.js
    // If you need to add home-specific logic, do it here.

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
    };
    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- Dropdown Menus ---
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems) {
                toggle.classList.toggle('active'); // Rotates arrow and changes color
                dropdownItems.classList.toggle('show');
            }
        });
    });

    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.opacity = '1';
        });
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.opacity = '0';
        });
    });
    
    const directionsBtn = document.querySelector('.btn-directions');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/search/Grand+Egyptian+Museum', '_blank');
        });
    }

    // --- Hero Background Slider with Manual Controls ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const startSlider = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000); // 5s cycle for a cinematic feel
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
                startSlider(); // Restart interval on interaction
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
                startSlider(); // Restart interval on interaction
            });
        }

        startSlider(); // Initial start
    }

    console.log('✓ Home Logic Loaded');
});

