document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MOBILE MENU SYSTEM ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 2. MOBILE DROPDOWN TOGGLE ---
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdown = btn.closest('.menu-dropdown');
            const content = dropdown.querySelector('.dropdown-items');

            btn.classList.toggle('active');
            content.classList.toggle('show');
        });
    });

    // --- 3. FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Premium feedback
            btn.style.width = btn.offsetWidth + 'px';
            btn.innerHTML = '<span class="material-symbols-outlined rotating">sync</span> Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.8';

            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Message Sent!';
                btn.style.background = '#10b981'; // Green success
                btn.style.color = '#fff';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = ''; // Back to gold
                    btn.style.color = '';
                    btn.style.width = '';
                    btn.style.opacity = '';
                    contactForm.reset();
                }, 3000);
            }, 2000);
        });
    }

    // --- 4. NEWSLETTER SUBMISSION ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Joining...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-outlined">done</span> Welcome!';
                btn.style.background = '#10b981';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    newsletterForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // --- 5. SCROLL ANIMATIONS ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.contact-item, .form-container, .map-section, .department-card, .faq-item, .newsletter-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    // --- 6. ROYAL ATMOSPHERE (Standardized - Local) ---
    function createDust() {
        const container = document.getElementById('dust-container');
        if (!container) return;
        const count = 50;
        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = `${size}px`;
            dust.style.height = `${size}px`;
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            dust.style.opacity = Math.random() * 0.5;
            dust.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            container.appendChild(dust);
        }
    }

    function createShapes() {
        const container = document.getElementById('shapes-container');
        if (!container) return;
        const glyphs = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.fontSize = `${Math.random() * 20 + 20}px`;
            shape.style.animation = `rotateFloat ${Math.random() * 20 + 20}s ease-in-out infinite`;
            container.appendChild(shape);
        }
    }

    createDust();
    createShapes();
});