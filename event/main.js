document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // ROYAL ATMOSPHERE & EFFECTS
    // ============================================
    class RoyalAtmosphere {
        constructor() {
            this.dustContainer = document.getElementById('dust-container');
            this.shapesContainer = document.getElementById('shapes-container');
            this.cursorGlow = document.getElementById('cursorGlow');
            this.scrollProgress = document.getElementById('scrollProgress');
            this.init();
        }

        init() {
            if (this.dustContainer) this.createDust();
            if (this.shapesContainer) this.createShapes();
            this.initCursorGlow();
            this.initScrollEffects();
            this.initRevealOnScroll();
        }

        createDust() {
            for (let i = 0; i < 150; i++) {
                const dust = document.createElement('div');
                dust.className = 'dust';
                const size = Math.random() * 3 + 1;
                const duration = Math.random() * 10 + 10;
                const delay = Math.random() * 20;
                const drift = (Math.random() - 0.5) * 200;

                dust.style.width = `${size}px`;
                dust.style.height = `${size}px`;
                dust.style.left = `${Math.random() * 100}%`;
                dust.style.setProperty('--duration', `${duration}s`);
                dust.style.setProperty('--drift', `${drift}px`);
                dust.style.animationDelay = `-${delay}s`;

                this.dustContainer.appendChild(dust);
            }
        }

        createShapes() {
            const shapes = ['triangle', 'rect', 'circle'];
            for (let i = 0; i < 20; i++) {
                const shape = document.createElement('div');
                shape.className = 'royal-shape';
                const type = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 40 + 20;

                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                if (type === 'circle') shape.style.borderRadius = '50%';
                if (type === 'triangle') {
                    shape.style.width = '0';
                    shape.style.height = '0';
                    shape.style.borderLeft = `${size / 2}px solid transparent`;
                    shape.style.borderRight = `${size / 2}px solid transparent`;
                    shape.style.borderBottom = `${size}px solid rgba(212, 175, 55, 0.1)`;
                    shape.style.background = 'none';
                }

                shape.style.setProperty('--startX', `${Math.random() * 100}vw`);
                shape.style.setProperty('--startY', `${Math.random() * 100}vh`);
                shape.style.setProperty('--endX', `${Math.random() * 100}vw`);
                shape.style.setProperty('--endY', `${Math.random() * 100}vh`);
                shape.style.setProperty('--duration', `${Math.random() * 30 + 30}s`);

                this.shapesContainer.appendChild(shape);
            }
        }

        initCursorGlow() {
            if (!this.cursorGlow) return;
            document.addEventListener('mousemove', (e) => {
                this.cursorGlow.style.left = `${e.clientX}px`;
                this.cursorGlow.style.top = `${e.clientY}px`;
            });
        }

        initScrollEffects() {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                if (this.scrollProgress) this.scrollProgress.style.width = scrolled + "%";

                const header = document.querySelector('.header');
                if (header) {
                    if (window.scrollY > 50) header.classList.add('scrolled');
                    else header.classList.remove('scrolled');
                }
            });
        }

        initRevealOnScroll() {
            const revealElements = document.querySelectorAll('.reveal-section');
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));
        }
    }

    new RoyalAtmosphere();

    // ============================================
    // ROYAL SLIDER CLASS
    // ============================================
    class RoyalSlider {
        constructor(sliderId, prevBtnId, nextBtnId, progressId) {
            this.slider = document.getElementById(sliderId);
            this.prevBtn = document.getElementById(prevBtnId);
            this.nextBtn = document.getElementById(nextBtnId);
            this.progress = document.getElementById(progressId);
            if (!this.slider) return;
            this.init();
        }

        init() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.scroll('prev'));
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.scroll('next'));
            this.slider.addEventListener('scroll', () => this.updateProgress());
            this.updateProgress();
            this.startAutoScroll();
        }

        scroll(direction) {
            const scrollAmount = this.slider.clientWidth * 0.8;
            this.slider.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }

        updateProgress() {
            const scrollLeft = this.slider.scrollLeft;
            const scrollWidth = this.slider.scrollWidth - this.slider.clientWidth;
            const percent = (scrollLeft / scrollWidth) * 100;
            if (this.progress) this.progress.style.width = percent + '%';
        }

        startAutoScroll() {
            setInterval(() => {
                if (this.slider.scrollLeft + this.slider.clientWidth >= this.slider.scrollWidth - 10) {
                    this.slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    this.scroll('next');
                }
            }, 8000);
        }
    }

    new RoyalSlider('factsSlider', 'factPrev', 'factNext', 'factProgress');
    new RoyalSlider('quizSlider', 'quizPrev', 'quizNext', 'quizProgress');

    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("closeBtn");
    const menuOverlay = document.getElementById("menuOverlay");

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add("active");
        if (menuOverlay) menuOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove("active");
        if (menuOverlay) menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

    // ============================================
    // QUIZ LOGIC
    // ============================================
    const quizOptions = document.querySelectorAll('.quiz-opt');
    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const parent = opt.parentElement;
            const options = parent.querySelectorAll('.quiz-opt');
            
            // Remove previous classes
            options.forEach(o => {
                o.classList.remove('correct-answer', 'wrong-answer');
                o.disabled = true;
            });

            if (opt.classList.contains('correct')) {
                opt.classList.add('correct-answer');
                showPremiumToast('Excellent! That is correct.', 'success');
            } else {
                opt.classList.add('wrong-answer');
                const correct = parent.querySelector('.correct');
                if (correct) correct.classList.add('correct-answer');
                showPremiumToast('Keep learning, young explorer!', 'info');
            }
        });
    });

    function showPremiumToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `premium-toast ${type}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'info'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // ============================================
    // API INTEGRATION (Events)
    // ============================================
    async function fetchEvents() {
        const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
        
        try {
            const res = await fetch(`${API_URL}/events`);
            if (res.ok) {
                const events = await res.json();
                const eventGrid = document.querySelector('.event-grid');
                
                if (eventGrid && events && events.length > 0) {
                    eventGrid.innerHTML = '';
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    
                    events.forEach(event => {
                        const dateObj = new Date(event.date);
                        let dateStr = event.date;
                        if (!isNaN(dateObj.getTime())) {
                            dateStr = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')} • ${dateObj.getFullYear()}`;
                        }
                        
                        const imgUrl = event.imageUrl || '../the-grand-egyptian-museum-fully-opens-completing-gizas-new-cultural-landmark_8.jpg';
                        
                        const card = document.createElement('div');
                        card.className = 'event-card micro-lift reveal-section visible';
                        card.innerHTML = `
                            <div class="card-image-wrapper">
                                <div class="card-image" style="background-image: url('${imgUrl}')"></div>
                                <button class="btn-favorite">
                                    <span class="material-symbols-outlined">favorite</span>
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="event-date">
                                    <span class="material-symbols-outlined" style="font-size: 1.1rem">calendar_month</span> ${dateStr}
                                </div>
                                <h3 class="event-title">${event.title}</h3>
                                <p class="event-desc">${event.description ? event.description.substring(0, 100) + '...' : 'Explore this amazing exhibition at the Grand Egyptian Museum.'}</p>
                                <div class="card-footer">
                                    <span class="event-location" style="display: flex; align-items: center; gap: 4px; color: #b3b3b3; font-size: 0.9rem;">
                                        <span class="material-symbols-outlined" style="font-size: 1.1rem">location_on</span> Gallery ${Math.floor(Math.random() * 5) + 1}
                                    </span>
                                    <button class="btn-details">
                                        View Details <span class="material-symbols-outlined" style="font-size: 1.1rem">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        `;
                        eventGrid.appendChild(card);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    }

    fetchEvents();

    console.log('✓ Royal Event Experience Initialized');
});