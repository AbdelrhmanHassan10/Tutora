// ============================================
// MUSEUM DINING - LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    syncProfileData();
    initScrollReveal();
    initDiningBooking();
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

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (closeBtn && mobileMenu) {
        closeBtn.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
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

// 6. Dining Booking Logic
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
            btn.textContent = 'Add to Order';
            
            if (cardRestaurant === selectedVenue) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        });
    });

    // Handle Pre-order Button Clicks
    preorderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);

            const index = selectedItems.findIndex(item => item.name === name);
            if (index > -1) {
                // Remove
                selectedItems.splice(index, 1);
                btn.classList.remove('added');
                btn.textContent = 'Add to Order';
            } else {
                // Add
                selectedItems.push({ name, price });
                btn.classList.add('added');
                btn.textContent = 'Added';
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

// 7. Notification System
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
    .notification {
        position: fixed; top: 20px; right: 20px; color: white; padding: 1rem 1.5rem;
        border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 10001;
        font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
        animation: slideIn 0.3s ease-out forwards; display: flex; align-items: center; gap: 0.5rem;
        backdrop-filter: blur(10px);
    }
    .notification-info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .notification-success { background: linear-gradient(135deg, #10b981, #059669); }
    .notification-error { background: linear-gradient(135deg, #ef4444, #dc2626); }
    @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
`;
document.head.appendChild(notifyStyles);


