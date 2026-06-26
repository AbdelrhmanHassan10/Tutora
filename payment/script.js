(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme);

    // ============================================
    // 0. ATMOSPHERIC DUST EFFECT
    // ============================================

    function initDust() {
        const dustContainer = document.createElement('div');
        dustContainer.id = 'dust-container';
        dustContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden;';
        document.body.appendChild(dustContainer);

        const isMobile = window.innerWidth <= 768;
        const dustCount = isMobile ? 30 : 80;

        for (let i = 0; i < dustCount; i++) {
            const dust = document.createElement('div');
            const duration = Math.random() * 15 + 15;
            const delay = Math.random() * -20;
            const size = Math.random() * 2 + 1.5;
            
            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: floatDust ${duration}s infinite linear;
                animation-delay: ${delay}s;
                position: absolute;
                background: rgba(236, 182, 19, 0.4);
                border-radius: 50%;
                pointer-events: none;
            `;
            dustContainer.appendChild(dust);
        }
    }

    initDust();

    // ============================================
    // 1. LOAD BOOKING DATA FROM LOCAL STORAGE
    // ============================================

    function initializeOrderSummary() {
        // Retrieve the booking data saved by the previous page
        const bookingDataString = localStorage.getItem('currentBooking');

        if (!bookingDataString) {
            console.error("No booking data found in localStorage.");
            // Display an error message if no data is found
            const orderCard = document.querySelector('.order-card');
            if (orderCard) {
                orderCard.innerHTML = '<p style="color: red; padding: 1rem;">Booking details not found. Please go back and try again.</p>';
            }
            return;
        }

        const bookingState = JSON.parse(bookingDataString);

        // --- UI Elements to Update ---
        const orderItemsContainer = document.querySelector('.order-items');
        const subtotalEl = document.querySelector('.order-totals .total-row:nth-child(1) span:last-child');
        const taxesEl = document.querySelector('.order-totals .total-row:nth-child(2) span:last-child');
        const totalEl = document.querySelector('.order-totals .total-row.final span:last-child');
        const payBtn = document.querySelector('.btn-pay');

        // --- Calculation Logic ---
        let subtotal = 0;
        let itemsHTML = '';
        const isIntl = bookingState.visitorType === 'international';
        const currencySymbol = isIntl ? '$' : 'EGP ';

        // Calculate subtotal from tickets
        Object.values(bookingState.tickets).forEach(ticket => {
            if (ticket.quantity > 0) {
                const price = isIntl ? ticket.price.intl : ticket.price.local;
                const itemTotal = ticket.quantity * price;
                subtotal += itemTotal;
                itemsHTML += `
                    <div class="order-item">
                        <img class="item-img" src="./unnamed (5).png" alt="Ticket">
                        <div class="item-info">
                            <p class="item-name">${ticket.name}</p>
                            <p class="item-details">Qty: ${ticket.quantity} | ${currencySymbol}${price.toLocaleString()}</p>
                        </div>
                    </div>
                `;
            }
        });

        // Calculate subtotal from addons
        Object.values(bookingState.addons).forEach(addon => {
            if (addon.selected) {
                const price = isIntl ? addon.price : addon.price * 50; // Simple conversion for addons
                subtotal += price;
                itemsHTML += `
                    <div class="order-item">
                        <img class="item-img" src="./unnamed (5).png" alt="Add-on">
                        <div class="item-info">
                            <p class="item-name">${addon.name}</p>
                            <p class="item-details">Qty: 1 | ${currencySymbol}${price.toLocaleString()}</p>
                        </div>
                    </div>
                `;
            }
        });

        // Add Dining Logic if present
        if (bookingState.dining) {
            const deposit = isIntl ? 5.00 : 5.00 * 50; // Use $5.00 as previously set
            subtotal += deposit;
            itemsHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <p class="item-name">${bookingState.dining.venue} Reservation</p>
                        <p class="item-details">Deposit: ${currencySymbol}${deposit.toLocaleString()}</p>
                    </div>
                </div>
            `;
        }

        // Add Shop Items (from cart)
        const cartData = localStorage.getItem('tutora_cart');
        if (cartData) {
            try {
                const cartItems = JSON.parse(cartData);
                if (cartItems && cartItems.length > 0) {
                    cartItems.forEach(item => {
                        const itemTotal = item.price * item.quantity;
                        // Shop items are typically priced in $, convert if local
                        const price = isIntl ? itemTotal : itemTotal * 50; 
                        subtotal += price;
                        itemsHTML += `
                            <div class="order-item">
                                <img class="item-img" src="${item.image}" alt="Shop Item" onerror="this.src='./unnamed (5).png'">
                                <div class="item-info">
                                    <p class="item-name">${item.name}</p>
                                    <p class="item-details">Qty: ${item.quantity} | ${currencySymbol}${price.toLocaleString()}</p>
                                </div>
                            </div>
                        `;
                    });
                }
            } catch (e) {
                console.error("Failed to parse cart items in payment page:", e);
            }
        }

        const taxes = subtotal * 0.05; // 5% Admin Fee
        const total = subtotal + taxes;

        // --- Update the UI with the calculated values ---
        if (orderItemsContainer) orderItemsContainer.innerHTML = itemsHTML;
        if (subtotalEl) subtotalEl.textContent = `${currencySymbol}${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if (taxesEl) taxesEl.textContent = `${currencySymbol}${taxes.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if (totalEl) totalEl.textContent = `${currencySymbol}${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        
        if (payBtn) {
            payBtn.textContent = `Pay ${currencySymbol}${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
    }

    // ============================================
    // 2. PAYMENT METHODS & FORM HANDLERS
    // ============================================

    function initPaymentHandlers() {
        // --- Payment Method Switching ---
        const methodLabels = document.querySelectorAll('.method-label');
        const cardForm = document.querySelector('form');
        methodLabels.forEach(label => {
            label.addEventListener('click', () => {
                methodLabels.forEach(l => l.classList.remove('active'));
                label.classList.add('active');
                const method = label.querySelector('input').value;
                if (cardForm) {
                    cardForm.style.display = (method === 'paypal') ? 'none' : 'block';
                }
            });
        });

        // --- Card Formatting ---
        const cardInput = document.getElementById('card-number');
        if (cardInput) {
            cardInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = (value.match(/.{1,4}/g) || []).join(' ').substring(0, 19);
            });
        }

        const expiryInput = document.getElementById('expiry-date');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value.length > 2 ? `${value.substring(0, 2)}/${value.substring(2, 4)}` : value;
            });
        }

        // --- Pay Button Interaction (With API integration) ---
        const API_BASE_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
        const payBtn = document.querySelector('.btn-pay');
        if (payBtn) {
            payBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                payBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Processing...';
                payBtn.disabled = true;

                try {
                    const token = localStorage.getItem('token');
                    const bookingDataString = localStorage.getItem('currentBooking');
                    if (!token) {
                        alert("Authentication token missing. Please log in.");
                        window.location.href = '../2.login/code.html';
                        return;
                    }
                    const bookingState = bookingDataString ? JSON.parse(bookingDataString) : {};
                    
                    // Map frontend ticket keys to backend-compliant categories
                    const categoryMap = {
                        'general_adult': 'adult',
                        'guided_adult': 'adult',
                        'tut_adult': 'adult',
                        'general_student': 'student',
                        'guided_student': 'child',
                        'tut_student': 'child'
                    };

                    const tickets = [];
                    Object.entries(bookingState.tickets || {}).forEach(([key, t]) => {
                        if (t.quantity > 0) {
                            const category = categoryMap[key] || 'adult';
                            const existing = tickets.find(tk => tk.category === category);
                            if (existing) {
                                existing.quantity += t.quantity;
                            } else {
                                tickets.push({ category, quantity: t.quantity });
                            }
                        }
                    });

                    const visitDate = bookingState.date ? new Date(bookingState.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                    const nationalityType = bookingState.visitorType === 'egyptian' ? 'egyptian' : 'expatriate';
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const nameParts = (user.name || 'Guest User').split(' ');

                    const payload = {
                        visitDate,
                        nationalityType,
                        tickets,
                        billingData: {
                            first_name: nameParts[0] || 'Guest',
                            last_name: nameParts.slice(1).join(' ') || 'User',
                            email: user.email || 'guest@tutora.com',
                            phone_number: user.phone || '+20100000000'
                        }
                    };

                    const bookingResponse = await fetch(`${API_BASE_URL}/bookings/checkout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });

                    const bookingResult = await bookingResponse.json().catch(() => ({}));

                    if (!bookingResponse.ok) {
                        throw new Error(bookingResult.message || 'Failed to checkout booking');
                    }

                    if (bookingResult.checkoutUrl) {
                        window.location.href = bookingResult.checkoutUrl;
                        return;
                    }

                    const overlay = document.getElementById('verifyOverlay');
                    const statusEl = document.getElementById('verifyStatus');
                    const titleEl = document.getElementById('verifyTitle');
                    
                    if (overlay) {
                        overlay.classList.add('active');
                        if (titleEl) titleEl.textContent = "Processing";

                        const statuses = [
                            "Authorizing payment...",
                            "Verifying transaction...",
                            "Securing digital tickets...",
                            "Finalizing confirmation..."
                        ];

                        let current = 0;
                        const interval = setInterval(() => {
                            if (current < statuses.length) {
                                if (statusEl) {
                                    statusEl.style.opacity = '0';
                                    setTimeout(() => {
                                        statusEl.textContent = statuses[current];
                                        statusEl.style.opacity = '1';
                                        current++;
                                    }, 300);
                                } else {
                                    current++;
                                }
                            } else {
                                clearInterval(interval);
                                
                                // Clear cart and booking data upon successful checkout
                                localStorage.removeItem('tutora_cart');
                                localStorage.removeItem('currentBooking');
                                if (typeof updateGlobalCartBadge === 'function') {
                                    updateGlobalCartBadge();
                                }
                                
                                if (window.sendSystemNotification) {
                                    window.sendSystemNotification('Purchase Successful!', 'Your booking and purchases have been confirmed. Thank you for your royal visit.', 'success', user.email);
                                }

                                setTimeout(() => {
                                    window.location.href = '../success/success.html';
                                }, 500);
                            }
                        }, 1000);
                    } else {
                        // Clear cart and booking data upon successful checkout
                        localStorage.removeItem('tutora_cart');
                        localStorage.removeItem('currentBooking');
                        if (typeof updateGlobalCartBadge === 'function') {
                            updateGlobalCartBadge();
                        }
                        if (window.sendSystemNotification) {
                            window.sendSystemNotification('Purchase Successful!', 'Your booking and purchases have been confirmed. Thank you for your royal visit.', 'success', user.email);
                        }
                        window.location.href = '../success/success.html';
                    }

                } catch (error) {
                    console.error("Booking/Payment error:", error);
                    alert("Error: " + error.message);
                    payBtn.innerHTML = 'Pay Again';
                    payBtn.disabled = false;
                }
            });
        }
    }

    // Initialize Page
    initializeOrderSummary();
    initPaymentHandlers();
    console.log("✓ Payment page initialized.");
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.querySelector('.theme-toggle');
    themeBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
});

