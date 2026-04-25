document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';

    // ============================================
    // 1. HOME-SPECIFIC LOGIC
    // ============================================

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
                toggle.classList.toggle('active');
                dropdownItems.classList.toggle('show');
            }
        });
    });

    // --- Hover Dropdowns (Desktop) ---
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0) scale(1)';
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-20px) scale(0.9)';
            }
        });
    });

    const directionsBtn = document.querySelector('.btn-directions');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/search/Grand+Egyptian+Museum', '_blank');
        });
    }

    // --- Hero Background Slider ---
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
            }, 5000);
        };

        if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); startSlider(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); startSlider(); });

        startSlider();
    }

    // ============================================
    // 2. DYNAMIC API INTEGRATION
    // ============================================

    async function fetchArtifactOfTheDay() {
        try {
            const res = await fetch(`${API_URL}/artifacts`);
            if (res.ok) {
                const artifacts = await res.json();
                if (artifacts && artifacts.length > 0) {
                    const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];
                    const curatorPanel = document.querySelector('.curator-panel');
                    if (curatorPanel) {
                        const curatorImg = curatorPanel.querySelector('.curator-image');
                        const highlightTitle = curatorPanel.querySelector('.highlight-title');
                        const artifactDesc = curatorPanel.querySelector('.artifact-desc');
                        const exploreBtn = curatorPanel.querySelector('a[href*="advanced-3D.html"]');

                        if (curatorImg && randomArtifact.imageUrl) curatorImg.style.backgroundImage = `url('${randomArtifact.imageUrl}')`;
                        if (highlightTitle) highlightTitle.textContent = randomArtifact.name;
                        if (artifactDesc) artifactDesc.textContent = randomArtifact.description || `Experience the legacy of the ${randomArtifact.era || 'ancient'} era.`;
                        if (exploreBtn && randomArtifact._id) {
                            exploreBtn.href = `../Artifact-show/Artifact-show.html?id=${randomArtifact._id}`;
                        }
                    }
                }
            }
        } catch (error) { console.error('Error fetching artifacts:', error); }
    }

    async function fetchEvents() {
        try {
            const res = await fetch(`${API_URL}/events`);
            if (res.ok) {
                const events = await res.json();
                if (events && events.length > 0) {
                    const eventsGrid = document.querySelector('.events-grid');
                    if (eventsGrid) {
                        const upcomingEvents = events.slice(0, 3);
                        eventsGrid.innerHTML = '';
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                        upcomingEvents.forEach(evt => {
                            const dateObj = new Date(evt.date);
                            const monthStr = months[dateObj.getMonth()] || 'TBD';
                            let dayStr = dateObj.getDate() ? String(dateObj.getDate()).padStart(2, '0') : '--';
                            
                            const eventCard = document.createElement('div');
                            eventCard.className = 'event-card';
                            const shortDesc = evt.description ? (evt.description.length > 80 ? evt.description.substring(0, 80) + '...' : evt.description) : '';
                            
                            eventCard.innerHTML = `
                                <div class="event-date">${monthStr}<br><strong>${dayStr}</strong></div>
                                <div class="event-details">
                                    <h4>${evt.title}</h4>
                                    <p>${shortDesc}</p>
                                </div>
                            `;
                            eventCard.addEventListener('click', () => { window.location.href = '../event/event.html'; });
                            eventsGrid.appendChild(eventCard);
                        });
                    }
                }
            }
        } catch (error) { console.error('Error fetching events:', error); }
    }

    fetchArtifactOfTheDay();
    fetchEvents();

    // ============================================
    // 3. ROYAL INTERACTIVE EFFECTS
    // ============================================

    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const cursorGlow = document.getElementById('cursorGlow');

    const createAtmosphere = () => {
        if (!dustContainer || !shapesContainer) return;
        
        // Royal Dust (150 particles)
        for (let i = 0; i < 150; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.cssText = `
                position: absolute;
                background: rgba(236, 182, 19, 0.4);
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: float ${Math.random() * 15 + 15}s infinite linear;
                animation-delay: ${Math.random() * -15}s;
            `;
            dustContainer.appendChild(dust);
        }

        // Shapes
        for (let i = 0; i < 12; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(236, 182, 19, 0.1);
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                transform: rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5});
                animation: rotateFloat ${Math.random() * 20 + 20}s infinite linear;
                animation-delay: ${Math.random() * -20}s;
            `;
            shapesContainer.appendChild(shape);
        }
    };

    const initHeroParallax = () => {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        if (!hero || !heroContent) return;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `rotateY(${x * 20}deg) rotateX(${y * -20}deg) translateZ(30px)`;
            
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
                cursorGlow.style.opacity = '1';
            }
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
            if (cursorGlow) cursorGlow.style.opacity = '0';
        });
    };

    const initScrollReveal = () => {
        const reveals = document.querySelectorAll('section, .tour-card, .event-card, .amenity-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    };

    // Initialize All
    createAtmosphere();
    initHeroParallax();
    initScrollReveal();

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    console.log('✓ Home System Restored & Optimized');
});
