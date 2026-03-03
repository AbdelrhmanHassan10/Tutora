// 1. Theme Management (Dark/Light Mode)
const themeToggle = document.querySelector('.theme-btn');
const body = document.body;

if (themeToggle) {

    const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
    // Load saved theme
    const savedTheme = localStorage.getItem('tutora-theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');

        if (themeIcon) {
            themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        }

        localStorage.setItem('tutora-theme', isDarkMode ? 'dark' : 'light');
    });
}
// ============================================
// 2. MOBILE MENU FUNCTIONALITY (VERIFIED & WORKING)
// ============================================
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

// هذا الجزء سليم وسيعمل مع كلاس .open في CSS
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

// إغلاق القائمة عند النقر على أي رابط بداخلها
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});
// 3. Scroll Reveal Animation
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.ticket-card, .ai-planner, .info-card, .hero-content').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// 4. Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrollValue = window.scrollY;
    if (hero) {
        hero.style.backgroundPositionY = `${scrollValue * 0.5}px`;
    }
});

// 5. AI Route Planner Simulation
const plannerBtn = document.querySelector('.planner-form button');
const plannerInput = document.querySelector('.planner-input');

if (plannerBtn) {
    plannerBtn.addEventListener('click', () => {
        const interest = plannerInput.value.trim();
        if (!interest) {
            alert('Please give us your interest so we can appreciate it !');
            return;
        }

        plannerBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Planning...';
        plannerBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            alert(`Done! The AI has created a custom path for "${interest}". Enjoy your museum journey!`);
            plannerBtn.innerHTML = 'Generate My Route';
            plannerBtn.style.pointerEvents = 'auto';
            plannerInput.value = '';
        }, 2000);
    });
}

// 6. Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href.startsWith('#')) return; // تجاهل الروابط الخارجية أو الصفحات الأخرى

    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 7. Ticket Hover Effect (Dynamic Scale)
document.querySelectorAll('.ticket-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(236, 182, 19, 0.15)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
    });
});