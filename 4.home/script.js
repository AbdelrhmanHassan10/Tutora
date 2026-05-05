document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-1ea2.up.railway.app/api';
    const isMobile = window.innerWidth < 768;

    // ============================================
    // 1. NAVIGATION & MENU LOGIC
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = (open) => {
        mobileMenu?.classList.toggle('active', open);
        menuOverlay?.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuBtn?.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
    menuOverlay?.addEventListener('click', () => toggleMenu(false));

    // Dropdown Menus (Mobile)
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

    // ============================================
    // 2. DATA FETCHING (Artifacts & Events)
    // ============================================
    const initData = async () => {
        try {
            // Fetch Artifact of the Day
            const artifactRes = await fetch(`${API_URL}/artifacts`);
            if (artifactRes.ok) {
                const artifacts = await artifactRes.json();
                if (artifacts?.length) {
                    const item = artifacts[Math.floor(Math.random() * artifacts.length)];
                    const panel = document.querySelector('.curator-panel');
                    if (panel) {
                        const img = panel.querySelector('.curator-image');
                        const title = panel.querySelector('.highlight-title');
                        const desc = panel.querySelector('.artifact-desc');
                        const link = panel.querySelector('a[href*="advanced-3D.html"]');

                        if (img && item.imageUrl) img.style.backgroundImage = `url('${item.imageUrl}')`;
                        if (title) title.textContent = item.name;
                        if (desc) desc.textContent = item.description?.substring(0, 150) + '...';
                        if (link && item._id) link.href = `../Artifact-show/Artifact-show.html?id=${item._id}`;
                    }
                }
            }

            // Fetch Events
            const eventRes = await fetch(`${API_URL}/events`);
            if (eventRes.ok) {
                const events = await eventRes.json();
                if (events?.length) {
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
                            eventCard.className = 'event-card reveal';
                            eventCard.innerHTML = `
                                <div class="event-date">${monthStr}<br><strong>${dayStr}</strong></div>
                                <div class="event-details">
                                    <h4>${evt.title}</h4>
                                    <p>${evt.description?.substring(0, 80)}...</p>
                                </div>
                            `;
                            eventCard.addEventListener('click', () => { window.location.href = '../event/event.html'; });
                            eventsGrid.appendChild(eventCard);
                        });
                    }
                }
            }
        } catch (e) { console.error("Data load failed", e); }
    };

    // ============================================
    // 3. ATMOSPHERIC EFFECTS & PERFORMANCE
    // ============================================
    const initEffects = () => {
        if (isMobile) {
            // Remove heavy animation containers on mobile to save RAM/Battery
            document.getElementById('dust-container')?.remove();
            document.getElementById('shapes-container')?.remove();
            return; 
        }

        // Desktop Only: Light 3D Parallax
        const hero = document.querySelector('.hero');
        const content = document.querySelector('.hero-content');
        if (hero && content) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                content.style.transform = `rotateY(${x * 15}deg) rotateX(${y * -15}deg)`;
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                content.style.transform = 'rotateY(0) rotateX(0)';
            });
        }
    };

    // ============================================
    // 4. SCROLL OPTIMIZATION (Observer & Progress)
    // ============================================
    const initScroll = () => {
        const header = document.querySelector('.header');
        const progress = document.getElementById('scrollProgress');
        
        // Scroll Reveal Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section:not(.hero), .curator-panel, .membership-section').forEach(s => {
            s.classList.add('reveal');
            observer.observe(s);
        });

        // Staggered reveals for grid items
        document.querySelectorAll('.tours-scroll, .events-grid, .amenities-grid, .quick-info-bar').forEach(grid => {
            Array.from(grid.children).forEach((child, index) => {
                child.classList.add('reveal');
                // Limit delay to first 5 items to avoid excessive wait
                if (index > 0 && index < 6) {
                    child.classList.add(`delay-${index * 100}`);
                }
                observer.observe(child);
            });
        });

        // Optimized Header & Progress updates
        let ticking = false;
        let lastScrollY = window.scrollY;
        let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let isScrolled = lastScrollY > 50;

        // Cache total height and update on resize
        window.addEventListener('resize', () => {
            totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Update progress bar
                    if (progress && totalHeight > 0) {
                        const pct = Math.min(100, Math.max(0, (lastScrollY / totalHeight) * 100));
                        progress.style.width = pct + '%';
                    }

                    // Toggle header state only when changed
                    const shouldBeScrolled = lastScrollY > 50;
                    if (shouldBeScrolled !== isScrolled) {
                        isScrolled = shouldBeScrolled;
                        header?.classList.toggle('scrolled', isScrolled);
                        
                        // Subtle logo shrink
                        const logoCircle = header?.querySelector('.logo-circle');
                        if (logoCircle) {
                            logoCircle.style.transform = isScrolled ? 'scale(0.9)' : 'scale(1)';
                        }
                    }

                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // --- Hero Background Slider ---
    const initSlider = () => {
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
    };

    // Initialize All Modules
    initData();
    initEffects();
    initScroll();
    initSlider();

    console.log('✓ Home System Optimized & Synced');
});

