document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MOBILE MENU DRAWER ---
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

    // --- 2. MOBILE DROPDOWN ---
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.menu-dropdown');
            const items = dropdown?.querySelector('.dropdown-items');
            if (btn && items) {
                btn.classList.toggle('active');
                items.classList.toggle('show');
            }
        });
    });

    // --- 3. SCROLLSPY NAVIGATION ---
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    if (navItems.length > 0 && contentSections.length > 0) {
        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const scrollspyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.sidebar-nav a[href="#${id}"]`);

                    if (navLink) {
                        navItems.forEach(link => link.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        contentSections.forEach(section => {
            scrollspyObserver.observe(section);
        });
    }

    // --- 4. SMOOTH SCROLL FOR SIDEBAR LINKS ---
    document.querySelectorAll('.sidebar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. CONTACT SIMULATION ---
    const contactBtn = document.querySelector('.sidebar-contact-box button');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            console.log('User navigating to contact/feedback.');
        });
    }

    // --- 6. ROYAL ATMOSPHERE GENERATOR ---
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        if (!dustContainer) return;

        // Generate Massive Dust
        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 10 + 20;
            const delay = Math.random() * -30;
            
            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: float ${duration}s infinite linear;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 1.5}px);
            `;
            dustContainer.appendChild(dust);
        }

        // Generate Royal Shapes
        if (shapesContainer) {
            const shapes = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
            const shapeCount = 20;
            for (let i = 0; i < shapeCount; i++) {
                const shape = document.createElement('div');
                shape.className = 'royal-shape';
                shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 20 + 20;
                const duration = Math.random() * 20 + 25;
                
                shape.style.cssText = `
                    font-size: ${size}px;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    animation: rotateFloat ${duration}s infinite ease-in-out;
                    animation-delay: ${Math.random() * -20}s;
                `;
                shapesContainer.appendChild(shape);
            }
        }
    }
    initRoyalAtmosphere();
});

