// ============================================
// DARK MODE TOGGLE
// ============================================

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

// Open mobile menu
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
});

// Close mobile menu
function closeMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
}

closeBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking a link
document.querySelectorAll('.menu-link').forEach(link => {
    if (!link.classList.contains('dropdown-toggle')) {
        link.addEventListener('click', closeMenu);
    }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// ============================================
// MOBILE DROPDOWN TOGGLE
// ============================================

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggle.classList.toggle('active');
        const items = toggle.nextElementSibling;
        items.classList.toggle('active');
    });
});

// ============================================
// DARK MODE TOGGLE
// ============================================

const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon();
}

// Toggle dark mode
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Update theme icon
function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

document.querySelectorAll('.language-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all buttons
        document.querySelectorAll('.language-toggle button').forEach(b => {
            b.classList.remove('active');
        });
        // Add active to clicked button
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        console.log('Language changed to:', lang);
    });
});
// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

const calendarDates = document.querySelectorAll('.calendar-date:not(.disabled)');
const calendarNavBtns = document.querySelectorAll('.calendar-nav-btn');

calendarDates.forEach(date => {
    date.addEventListener('click', function() {
        // Remove previous selection
        calendarDates.forEach(d => d.classList.remove('selected'));
        // Add selection to clicked date
        this.classList.add('selected');
        console.log('Date selected:', this.textContent);
    });
});

calendarNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Calendar navigation clicked');
    });
});

// ============================================
// TIME SLOT SELECTION
// ============================================

const timeSlots = document.querySelectorAll('.time-slot:not(.disabled)');

timeSlots.forEach(slot => {
    slot.addEventListener('click', function() {
        // Remove previous selection
        timeSlots.forEach(s => s.classList.remove('selected'));
        // Add selection to clicked slot
        this.classList.add('selected');
        console.log('Time slot selected:', this.textContent);
    });
});

// ============================================
// QUANTITY SELECTORS
// ============================================

const qtyBtns = document.querySelectorAll('.qty-btn');

qtyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const qtyValue = this.parentElement.querySelector('.qty-value');
        let currentQty = parseInt(qtyValue.textContent);

        if (this.querySelector('.material-symbols-outlined').textContent === 'remove') {
            if (currentQty > 0) {
                currentQty--;
            }
        } else {
            currentQty++;
        }

        qtyValue.textContent = currentQty;
        console.log('Quantity updated:', currentQty);
    });
});

// ============================================
// ADD/REMOVE ADD-ONS
// ============================================

const addBtns = document.querySelectorAll('.btn-add');

addBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const addonCard = this.closest('.addon-card');
        addonCard.classList.add('addon-selected');

        // Replace button
        const price = this.parentElement.querySelector('.addon-price').textContent;
        this.outerHTML = `
            <button class="btn-added">
                <span class="material-symbols-outlined">check</span>
                Added
            </button>
        `;

        console.log('Add-on added');
    });
});

// ============================================
// CHECKOUT BUTTON
// ============================================

const checkoutBtn = document.querySelector('.btn-checkout');

checkoutBtn.addEventListener('click', function() {
    console.log('Proceeding to checkout...');
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
});

// ============================================
// LANGUAGE BUTTON
// ============================================

const languageBtn = document.querySelector('.btn-language');

languageBtn.addEventListener('click', function() {
    console.log('Language selector clicked');
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
});

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

function handleResize() {
    const width = window.innerWidth;

    if (width > 768) {
        mobileNav.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
        icon.textContent = 'menu';
    }
}

window.addEventListener('resize', handleResize);

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.ticket-card, .addon-card, .info-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'M' to toggle mobile menu on mobile screens
    if (e.key === 'm' || e.key === 'M') {
        if (window.innerWidth <= 768) {
            mobileNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
            icon.textContent = mobileNav.classList.contains('active') ? 'close' : 'menu';
        }
    }

    // Press 'Home' to scroll to top
    if (e.key === 'Home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Press 'D' to toggle dark mode
    if (e.key === 'd' || e.key === 'D') {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    }
});

// ============================================
// FADE IN UP ANIMATION
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Booking page loaded successfully');
    console.log('🌙 Dark mode available - click the moon icon or press D');
    console.log('📱 Mobile menu available on small screens');
    console.log('🎫 Ticket booking system ready');

    // Initial active link update
    updateActiveLink();
});