/**
 * Kids Museum - Royal Superstar Logic
 * Combined Atmosphere, 3D Effects, and Interactions
 */

const DIVINE_MESSAGES = [
    "Welcome, young protector of history!",
    "Are you ready to solve the Pharaoh's puzzles?",
    "Every artifact has a story. Let's find yours!",
    "The Oracle watches over your explorer journey."
];

class RoyalKidsAtmosphere {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.scrollProgress = document.getElementById('scrollProgress');
        this.dustContainer = document.getElementById('dust-container');
        this.shapesContainer = document.getElementById('shapes-container');
        this.divineGreeting = document.getElementById('divineGreeting');
        this.cursorGlow = document.getElementById('cursorGlow');
        this.heroParallax = document.getElementById('heroStatic');
        this.revealSections = document.querySelectorAll('.reveal-section, section, .event-card, .tour-card, .mission-card');
        
        this.factsContainer = document.getElementById('facts-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentCardSpan = document.getElementById('current-card');
        this.totalCardsSpan = document.getElementById('total-cards');
        this.progressFill = document.getElementById('progress-fill');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        this.initNavigation();
        this.initAtmosphere();
        this.initTypewriter();
        this.initScrollEffects();
        this.initCarousel();
        this.initThemeToggle();
        this.initLanguageToggle();
        this.loadKidArtifacts();
        
        if (!this.isMobile) this.initDesktopEffects();
        console.log("✓ Kids Museum System Optimized & Ready");
    }

    // 1. Navigation & Menu
    initNavigation() {
        const menuBtn = document.getElementById('menuBtn');
        const closeBtn = document.getElementById('closeBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('menuOverlay');

        const toggle = (show) => {
            if (mobileMenu) mobileMenu.classList.toggle('active', show);
            if (overlay) overlay.classList.toggle('active', show);
            document.body.style.overflow = show ? 'hidden' : '';
        };

        menuBtn?.addEventListener('click', () => toggle(true));
        closeBtn?.addEventListener('click', () => toggle(false));
        overlay?.addEventListener('click', () => toggle(false));

        // Dropdown Menus (Mobile)
        document.querySelectorAll('.dropdown-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const items = btn.nextElementSibling;
                if (items && items.classList.contains('dropdown-items')) {
                    btn.classList.toggle('active');
                    items.classList.toggle('show');
                }
            });
        });
    }

    // 2. Atmospheric Particles
    initAtmosphere() {
        if (this.isMobile) {
            this.dustContainer?.remove();
            this.shapesContainer?.remove();
            return;
        }
        if (this.dustContainer) for (let i = 0; i < 80; i++) this.createParticle('dust');
        if (this.shapesContainer) for (let i = 0; i < 20; i++) this.createParticle('shape');
    }

    createParticle(type) {
        const p = document.createElement('div');
        p.className = type === 'dust' ? 'dust' : 'divine-shape';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = (Math.random() - 0.5) * 300;
        const moveY = (Math.random() - 0.5) * 300;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;

        p.style.left = startX + '%';
        p.style.top = startY + '%';
        p.style.setProperty('--moveX', moveX + 'px');
        p.style.setProperty('--moveY', moveY + 'px');
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = delay + 's';

        if (type === 'dust') {
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            this.dustContainer.appendChild(p);
        } else {
            this.shapesContainer.appendChild(p);
        }
    }

    // 3. Typewriter Greeting
    async initTypewriter() {
        if (!this.divineGreeting) return;
        let index = 0;
        while (true) {
            const msg = DIVINE_MESSAGES[index];
            this.divineGreeting.textContent = "";
            for (let char of msg) {
                this.divineGreeting.textContent += char;
                await new Promise(r => setTimeout(r, 50));
            }
            await new Promise(r => setTimeout(r, 4000));
            while (this.divineGreeting.textContent.length > 0) {
                this.divineGreeting.textContent = this.divineGreeting.textContent.slice(0, -1);
                await new Promise(r => setTimeout(r, 30));
            }
            index = (index + 1) % DIVINE_MESSAGES.length;
        }
    }

    // 4. Scroll Effects & Progress
    initScrollEffects() {
        const header = document.querySelector('.header');
        
        // Scroll Reveal Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal', 'revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.revealSections.forEach(s => {
            s.classList.add('reveal');
            observer.observe(s);
        });

        // Progress Bar & Header State
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = (y / totalHeight) * 100;
            
            if (this.scrollProgress) this.scrollProgress.style.width = pct + '%';
            header?.classList.toggle('scrolled', y > 50);
        }, { passive: true });
    }

    // 5. Dynamic Kid Artifacts
    async loadKidArtifacts() {
        const container = document.getElementById('dynamic-artifacts-container');
        if (!container) return;

        try {
            const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
            const res = await fetch(`${API_URL}/artifacts`);
            if (!res.ok) throw new Error('API failed');
            
            const artifacts = await res.json();
            const selection = artifacts.slice(0, 12).sort(() => 0.5 - Math.random()).slice(0, 8);

            container.innerHTML = '';
            selection.forEach(item => {
                const card = document.createElement('div');
                card.className = 'kid-artifact-card micro-lift';
                card.innerHTML = `
                    <div class="artifact-badge">Ancient Treasure</div>
                    <div class="artifact-img" style="background-image: url('${item.imageUrl || '../4.home/images/hero-1.jpg'}')"></div>
                    <div class="artifact-info">
                        <h3>${item.name}</h3>
                        <p>${item.description?.substring(0, 100) || 'An ancient wonder waiting for you to discover its magical story!'}...</p>
                        <a href="../Artifact-show/Artifact-show.html?id=${item._id}" class="btn-artifact-view">Discover More</a>
                    </div>
                `;
                container.appendChild(card);
            });
        } catch (e) {
            container.innerHTML = '<p style="color: #94A3B8; text-align: center; width: 100%;">The Pharaoh is sleeping. Come back later!</p>';
        }
    }

    // 6. Carousel (Facts)
    initCarousel() {
        if (!this.factsContainer) return;
        const cards = this.factsContainer.querySelectorAll('.fact-card');
        if (this.totalCardsSpan) this.totalCardsSpan.textContent = cards.length;

        const updateCarousel = () => {
            const cardWidth = cards[0].offsetWidth + 20;
            this.factsContainer.scrollTo({ left: this.currentIndex * cardWidth, behavior: 'smooth' });
            if (this.currentCardSpan) this.currentCardSpan.textContent = this.currentIndex + 1;
            if (this.progressFill) this.progressFill.style.width = ((this.currentIndex + 1) / cards.length) * 100 + '%';
        };

        this.nextBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex + 1) % cards.length;
            updateCarousel();
        });

        this.prevBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
    }

    // 7. Desktop 3D Parallax
    initDesktopEffects() {
        const hero = document.querySelector('.hero-card');
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
    }

    initThemeToggle() {
        const toggle = document.getElementById('themeBtn');
        toggle?.addEventListener('click', () => {
            document.body.classList.toggle('light');
        });
    }

    initLanguageToggle() {
        document.querySelectorAll('.language-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.language-toggle button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

// Start App
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new RoyalKidsAtmosphere());
} else {
    new RoyalKidsAtmosphere();
}
