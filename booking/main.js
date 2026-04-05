document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. STATE MANAGEMENT (No API)
    // ============================================

    const bookingState = {
        date: new Date(),
        timeSlot: "11:00 - 13:00",
        tickets: {
            adult: { quantity: 0, price: 25.00, name: "General Admission - Adult" },
            student: { quantity: 0, price: 15.00, name: "Student / Child" },
            resident: { quantity: 0, price: 3.00, name: "Egyptian / Arab Resident" }
        },
        addons: {
            ramses: { selected: false, price: 12.00, name: "Special Exhibition: Ramses II" },
            audio: { selected: false, price: 8.00, name: "Audio Guide" }
        }
    };

    // ============================================
    // 2. UI LOGIC & EVENT LISTENERS
    // ============================================

    function updateOrderSummary() {
        const summaryContainer = document.querySelector('.summary-items');
        const subtotalEl = document.querySelector('.summary-totals .summary-row:nth-child(1) span:nth-child(2)');
        const taxesEl = document.querySelector('.summary-totals .summary-row:nth-child(2) span:nth-child(2)');
        const totalEl = document.querySelector('.summary-total .total-price');
        
        summaryContainer.innerHTML = '';
        let subtotal = 0;

        Object.values(bookingState.tickets).forEach(ticket => {
            if (ticket.quantity > 0) {
                const itemTotal = ticket.quantity * ticket.price;
                subtotal += itemTotal;
                summaryContainer.innerHTML += `<div class="summary-item"><span>${ticket.quantity}x ${ticket.name}</span><span>$${itemTotal.toFixed(2)}</span></div>`;
            }
        });

        Object.values(bookingState.addons).forEach(addon => {
            if (addon.selected) {
                subtotal += addon.price;
                summaryContainer.innerHTML += `<div class="summary-item"><span>1x ${addon.name}</span><span>$${addon.price.toFixed(2)}</span></div>`;
            }
        });

        const taxes = subtotal * 0.07;
        const total = subtotal + taxes;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxesEl.textContent = `$${taxes.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
    
    function initializeUIFromState() {
        document.querySelectorAll('.quantity-selector').forEach(selector => {
            selector.querySelector('.qty-value').textContent = '0';
        });
        document.querySelectorAll('.addon-card').forEach(card => {
            card.classList.remove('addon-selected');
            const button = card.querySelector('button');
            button.innerHTML = 'Add';
            button.classList.remove('btn-added');
            button.classList.add('btn-add');
        });
        updateOrderSummary();
    }

    // --- Event Listeners for UI elements ---

    document.querySelectorAll('.calendar-date:not(.disabled)').forEach(dateEl => {
        dateEl.addEventListener('click', function() {
            document.querySelector('.calendar-date.selected')?.classList.remove('selected');
            this.classList.add('selected');
            bookingState.date.setDate(parseInt(this.textContent, 10));
        });
    });

    document.querySelectorAll('.time-slot:not(.disabled)').forEach(slotEl => {
        slotEl.addEventListener('click', function() {
            document.querySelector('.time-slot.selected')?.classList.remove('selected');
            this.classList.add('selected');
            bookingState.timeSlot = this.textContent.trim();
        });
    });

    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const ticketName = selector.closest('.ticket-card').querySelector('.ticket-name').textContent;
        const ticketKey = Object.keys(bookingState.tickets).find(key => bookingState.tickets[key].name === ticketName);
        if (!ticketKey) return;

        const qtyValueEl = selector.querySelector('.qty-value');
        selector.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let currentQty = bookingState.tickets[ticketKey].quantity;
                const action = btn.querySelector('.material-symbols-outlined').textContent;
                if (action === 'remove' && currentQty > 0) currentQty--;
                else if (action === 'add') currentQty++;
                bookingState.tickets[ticketKey].quantity = currentQty;
                qtyValueEl.textContent = currentQty;
                updateOrderSummary();
            });
        });
    });

    document.querySelectorAll('.addon-card').forEach(card => {
        const addonName = card.querySelector('.addon-name').textContent;
        const addonKey = Object.keys(bookingState.addons).find(key => bookingState.addons[key].name === addonName);
        if (!addonKey) return;

        const button = card.querySelector('button');
        button.addEventListener('click', function() {
            const isSelected = card.classList.toggle('addon-selected');
            bookingState.addons[addonKey].selected = isSelected;
            this.innerHTML = isSelected ? `<span class="material-symbols-outlined">check</span> Added` : 'Add';
            this.classList.toggle('btn-add', !isSelected);
            this.classList.toggle('btn-added', isSelected);
            updateOrderSummary();
        });
    });

    // --- Checkout Button (MODIFIED) ---
    // Now it just navigates directly to the payment page.
    document.querySelector('.btn-checkout').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        
        const totalQuantity = Object.values(bookingState.tickets).reduce((sum, t) => sum + t.quantity, 0);
        if (totalQuantity === 0) {
            showNotification("Please select at least one ticket.", 'error');
            return;
        }

        // Store booking details in localStorage to be read by the payment page
        localStorage.setItem('currentBooking', JSON.stringify(bookingState));

        showNotification("Proceeding to checkout...", 'success');
        
        // Navigate to the payment page after a short delay
        setTimeout(() => {
            window.location.href = '../payment/payment.html';
        }, 1000);
    });

    // ============================================
    // 3. PRESERVED UI SCRIPT (Theme, Menu, etc.)
    // ============================================

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        const body = document.body;
        const themeIcon = themeBtn.querySelector('.material-symbols-outlined');
        const updateIcon = () => {
            if (themeIcon) themeIcon.textContent = body.classList.contains('dark-mode') ? 'light_mode' : 'dark_mode';
        };
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateIcon();
        });
        body.classList.toggle('dark-mode', localStorage.getItem('theme') !== 'light');
        updateIcon();
    }

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const openMenu = () => { if (mobileMenu) mobileMenu.classList.add('active'); if (menuOverlay) menuOverlay.classList.add('active'); };
    const closeMenu = () => { if (mobileMenu) mobileMenu.classList.remove('active'); if (menuOverlay) menuOverlay.classList.remove('active'); };
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- Notification System ---
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .notification { position: fixed; top: 20px; right: 20px; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1001; font-weight: 600; font-family: 'Lato', sans-serif; font-size: 14px; animation: slideIn 0.3s ease-out forwards; }
        .notification-info { background-color: #3b82f6; }
        .notification-success { background-color: #10b981; }
        .notification-error { background-color: #ef4444; }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(120%); } }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // 4. INITIALIZATION
    // ============================================
    initializeUIFromState();
    console.log('✓ Booking page initialized (Local Mode - No API).');
});
