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

    // --- 5. CONTACT DPO SIMULATION ---
    const contactBtn = document.querySelector('.sidebar-contact-box button');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            // Prevent default if it's in an <a> tag
            // e.preventDefault(); 
            console.log('User navigating to contact DPO/Feedback.');
        });
    }

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

