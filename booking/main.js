document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production.up.railway.app/api';

    // ============================================
    // 1. API INTEGRATION & STATE MANAGEMENT
    // ============================================


    async function makeApiRequest(endpoint, method = 'POST', body = null) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to make a booking. Please log in and try again.");
            return null;
        }
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const config = { method, headers };
        if (body) config.body = JSON.stringify(body);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Request Error on ${endpoint}:`, error);
            alert(`API Error: ${error.message}`);
            throw error;
        }
    }

    function updateOrderSummary() {
        const summaryItemsContainer = document.querySelector('.summary-items');
        const subtotalEl = document.querySelector('.summary-totals .summary-row:nth-child(1) span:nth-child(2)');
        const taxesEl = document.querySelector('.summary-totals .summary-row:nth-child(2) span:nth-child(2)');
        const totalEl = document.querySelector('.summary-total .total-price');
        summaryItemsContainer.innerHTML = '';
        let subtotal = 0;

        for (const key in bookingState.tickets) {
            const ticket = bookingState.tickets[key];
            if (ticket.quantity > 0) {
                const itemTotal = ticket.quantity * ticket.price;
                subtotal += itemTotal;
                summaryItemsContainer.innerHTML += `<div class="summary-item"><span>${ticket.quantity}x ${ticket.name}</span><span>$${itemTotal.toFixed(2)}</span></div>`;
            }
        }
        for (const key in bookingState.addons) {
            const addon = bookingState.addons[key];
            if (addon.selected) {
                subtotal += addon.price;
                summaryItemsContainer.innerHTML += `<div class="summary-item"><span>1x ${addon.name}</span><span>$${addon.price.toFixed(2)}</span></div>`;
            }
        }
        const taxes = subtotal * 0.07;
        const total = subtotal + taxes;
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxesEl.textContent = `$${taxes.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // ============================================
    // 2. UI EVENT LISTENERS
    // ============================================

    // --- DARK MODE TOGGLE (RESTORED) ---
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;

    function updateThemeIcon() {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        if (body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
        } else {
            icon.textContent = 'dark_mode';
        }
    }
    const savedTheme = localStorage.getItem('theme');
    // Default to light mode for this page, or use saved preference
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    updateThemeIcon();

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const openMenu = () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
    };
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    };
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // --- Calendar ---
    document.querySelectorAll('.calendar-date:not(.disabled)').forEach(dateEl => {
        dateEl.addEventListener('click', function() {
            document.querySelectorAll('.calendar-date.selected').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            bookingState.date.setDate(parseInt(this.textContent, 10));
        });
    });

    // --- Time Slots ---
    document.querySelectorAll('.time-slot:not(.disabled)').forEach(slotEl => {
        slotEl.addEventListener('click', function() {
            document.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            bookingState.timeSlot = this.textContent.trim();
        });
    });

    // --- Quantity Selectors ---
    document.querySelectorAll('.quantity-selector').forEach((selector, index) => {
        const ticketKey = Object.keys(bookingState.tickets)[index];
        const qtyValueEl = selector.querySelector('.qty-value');
        selector.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let currentQty = bookingState.tickets[ticketKey].quantity;
                if (btn.querySelector('.material-symbols-outlined').textContent === 'remove') {
                    if (currentQty > 0) currentQty--;
                } else {
                    currentQty++;
                }
                bookingState.tickets[ticketKey].quantity = currentQty;
                qtyValueEl.textContent = currentQty;
                updateOrderSummary();
            });
        });
    });

    // --- Add-ons ---
    document.querySelectorAll('.addon-card').forEach((card, index) => {
        const addonKey = Object.keys(bookingState.addons)[index];
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

    // --- Checkout Button ---
    document.querySelector('.btn-checkout').addEventListener('click', async(e) => {
        e.preventDefault();
        const totalQuantity = Object.values(bookingState.tickets).reduce((sum, t) => sum + t.quantity, 0);
        if (totalQuantity === 0) {
            alert("Please select at least one ticket before proceeding.");
            return;
        }
        const bookingData = {
            date: bookingState.date.toISOString().split('T')[0],
            timeSlot: bookingState.timeSlot,
            tickets: bookingState.tickets,
            addons: bookingState.addons,
            totalQuantity: totalQuantity
        };
        const result = await makeApiRequest('/bookings', 'POST', bookingData);

        if (!result) {
            alert("Booking failed. Please try again.");
            return;
        }

        let bookingId = null;

        if (result.data && result.data.id) {
            bookingId = result.data.id;
        } else if (result.data && result.data._id) {
            bookingId = result.data._id;
        } else if (result.id) {
            bookingId = result.id;
        } else if (result._id) {
            bookingId = result._id;
        }

        if (!bookingId) {
            console.log("API Response:", result);
            alert("Booking created but no ID returned from server.");
            return;
        }

        alert("Booking successful! Redirecting to payment page...");

        window.location.href = "../checkout/checkout.html?bookingId=" + bookingId;
    });

    // --- Initial UI setup ---
    updateOrderSummary();
    console.log('✓ Booking page loaded successfully');
});