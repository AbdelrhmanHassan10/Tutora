document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Dark/Light Mode)
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle?.querySelector('.material-symbols-outlined');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('privacy-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDarkMode = body.classList.toggle('dark-mode');
            if (themeIcon) themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
            localStorage.setItem('privacy-theme', isDarkMode ? 'dark' : 'light');
        });
    }

    // 2. Professional Mobile Menu Logic
     
    // 3. Scrollspy Navigation
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    if (navItems.length > 0 && contentSections.length > 0) {
        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the upper part of the viewport
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

    // 4. Smooth Scroll for Sidebar Links
    document.querySelectorAll('.sidebar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Contact DPO Simulation
    const contactBtn = document.querySelector('.sidebar-contact-box button');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            alert('You are being redirected to contact your Data Protection Officer (DPO). Thank you for your privacy!');
        });
    }
});
