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
        this.scrollProgress = document.getElementById('scrollProgress');
        this.dustContainer = document.getElementById('dust-container');
        this.shapesContainer = document.getElementById('shapes-container');
        this.divineGreeting = document.getElementById('divineGreeting');
        this.cursorGlow = document.getElementById('cursorGlow');
        this.heroParallax = document.getElementById('heroStatic');
        this.revealSections = document.querySelectorAll('.reveal-section');
        
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
        this.initScrollProgress();
        this.initAtmosphere();
        this.initTypewriter();
        this.initCursorGlow();
        this.initScrollReveal();
        this.initFAQ();
        this.initCarousel();
        this.initMobileMenu();
        this.initThemeToggle();
        this.initLanguageToggle();
    }

    initScrollProgress() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (this.scrollProgress) this.scrollProgress.style.width = scrolled + "%";
        });
    }

    initAtmosphere() {
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

    async initTypewriter() {
        if (!this.divineGreeting) return;
        let index = 0;
        while (true) {
            const msg = DIVINE_MESSAGES[index];
            for (let char of msg) {
                this.divineGreeting.textContent += char;
                await new Promise(r => setTimeout(r, 50));
            }
            await new Promise(r => setTimeout(r, 3000));
            while (this.divineGreeting.textContent.length > 0) {
                this.divineGreeting.textContent = this.divineGreeting.textContent.slice(0, -1);
                await new Promise(r => setTimeout(r, 30));
            }
            index = (index + 1) % DIVINE_MESSAGES.length;
        }
    }

    initCursorGlow() {
        if (!this.cursorGlow) return;
        window.addEventListener('mousemove', (e) => {
            this.cursorGlow.style.transform = 'translate(' + (e.clientX - 200) + 'px, ' + (e.clientY - 200) + 'px)';
        });
    }

    initScrollReveal() {
        const obs = new IntersectionObserver((es) => {
            es.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        this.revealSections.forEach(s => obs.observe(s));
    }

    initFAQ() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const active = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!active) item.classList.add('active');
            });
        });
    }

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
            this.resetAutoPlay();
        });

        this.prevBtn?.addEventListener('click', () => {
            this.currentIndex = (this.currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
            this.resetAutoPlay();
        });

        this.startAutoPlay(cards.length);
    }

    startAutoPlay(len) {
        if (len <= 1) return;
        this.autoPlayInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % len;
            const cardWidth = this.factsContainer.querySelectorAll('.fact-card')[0].offsetWidth + 20;
            this.factsContainer.scrollTo({ left: this.currentIndex * cardWidth, behavior: 'smooth' });
            if (this.currentCardSpan) this.currentCardSpan.textContent = this.currentIndex + 1;
            if (this.progressFill) this.progressFill.style.width = ((this.currentIndex + 1) / len) * 100 + '%';
        }, 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        const cards = this.factsContainer.querySelectorAll('.fact-card');
        this.startAutoPlay(cards.length);
    }

    initMobileMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const closeBtn = document.getElementById('closeBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('menuOverlay');
        const toggle = (s) => {
            if (mobileMenu) mobileMenu.classList.toggle('active', s);
            if (overlay) overlay.classList.toggle('active', s);
            document.body.style.overflow = s ? 'hidden' : '';
        };
        menuBtn?.addEventListener('click', () => toggle(true));
        closeBtn?.addEventListener('click', () => toggle(false));
        overlay?.addEventListener('click', () => toggle(false));
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

window.addEventListener('load', () => { new RoyalKidsAtmosphere(); });
