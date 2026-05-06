// Dining Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initDiningBooking();
});

// 1. Scroll Reveal Animation
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

