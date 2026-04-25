document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    syncProfileData();
    initScrollReveal();
    initDiningBooking();
    initRoyalAtmosphere();
    init3DParallax();
});


// 1. Theme Initialization
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
}

// 2. Theme Toggle
function initThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeBtn .material-symbols-outlined');
    if (icon) {
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        icon.style.color = theme === 'dark' ? 'white' : 'black';
    }
}

// 3. Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = (show) => {
        if (mobileMenu) mobileMenu.classList.toggle('active', show);
        if (menuOverlay) menuOverlay.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
}

// 4. Profile Sync
function syncProfileData() {
    const profileImg = document.querySelector('.profile-img');
    const savedAvatar = localStorage.getItem('currentAvatar');
    
    if (profileImg && savedAvatar) {
        profileImg.src = savedAvatar;
    }
}

// 5. Scroll Reveal Animation
function initScrollReveal() {
    const items = document.querySelectorAll('.anim-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, {
        threshold: 0.15
    });

    items.forEach(item => observer.observe(item));
}

// 6. Royal Atmosphere Generator (More Dust & Small Shapes)
function initRoyalAtmosphere() {
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    if (!dustContainer) return;

    // Generate Massive Dust (500 particles)
    const particleCount = 500;
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
            opacity: ${Math.random() * 0.6 + 0.1};
            animation: floatParticle ${duration}s infinite linear;
            animation-delay: ${delay}s;
            filter: blur(${Math.random() * 1.5}px);
        `;
        dustContainer.appendChild(dust);
    }

    // Generate Small Shapes Only
    if (shapesContainer) {
        const shapeCount = 25;
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            const size = Math.random() * 8 + 8;
            const duration = Math.random() * 20 + 25;
            
            shape.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                transform: rotate(${Math.random() * 360}deg);
                opacity: ${Math.random() * 0.15 + 0.05};
                animation: floatParticle ${duration}s infinite linear reverse;
                animation-delay: ${Math.random() * -25}s;
                clip-path: ${i % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'};
                border: 1px solid rgba(236, 182, 19, 0.3);
            `;
            shapesContainer.appendChild(shape);
        }
    }
}

// 7. Cinematic 3D Parallax for Hero
function init3DParallax() {
    const hero = document.querySelector('.din-hero');
    const heroContent = document.querySelector('.din-hero-content');
    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateZ(30px)`;
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        });
    }
}

// 8. Dining Booking Logic
function initDiningBooking() {
    const venueSelect = document.getElementById('venueSelect');
    const preorderBtns = document.querySelectorAll('.preorder-btn');
    const verifyBtn = document.getElementById('verifyBtn');
    
    let selectedItems = [];

    if (!venueSelect || !verifyBtn) return;

    // Handle Venue Change
    venueSelect.addEventListener('change', (e) => {
        const selectedVenue = e.target.value;
        
        // Reset selections when venue changes
        selectedItems = [];
        preorderBtns.forEach(btn => {
            const card = btn.closest('.highlight-item');
            const cardRestaurant = card.dataset.restaurant;
            
            btn.classList.remove('added');
            btn.innerHTML = '<span class="material-symbols-outlined">add_shopping_cart</span> Add to Order';
            
            if (cardRestaurant === selectedVenue) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        });
    });

    // Handle Form Submission
    verifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('reserveDate').value;
        const time = document.getElementById('reserveTime').value;
        const guests = document.getElementById('reserveGuests').value;
        const venue = venueSelect.value;

        if (!venue || !date || !time || !guests) {
            showNotification('Please fill in all reservation details.', 'error');
            return;
        }

        showNotification('Verifying availability...', 'success');


        const diningBooking = {
            venue,
            date,
            time,
            guests,
            deposit: 200, // Fixed Table Deposit
            items: selectedItems,
            timestamp: new Date().getTime()
        };

        // Save to localStorage
        localStorage.setItem('diningBooking', JSON.stringify(diningBooking));
        
        // Redirect to transition page
        window.location.href = 'check-availability.html';
    });
}

// 9. Notification System
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const icons = { info: 'info', success: 'check_circle', error: 'error' };
    notification.innerHTML = `
        <span class="material-symbols-outlined">${icons[type] || 'info'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inject notification styles
const notifyStyles = document.createElement('style');
notifyStyles.textContent = `
    @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
`;
document.head.appendChild(notifyStyles);

