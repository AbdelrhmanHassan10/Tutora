(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {

    const themeBtn = document.querySelector('.theme-toggle'); // 🔥 مهم

    themeBtn?.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');

        document.body.classList.remove('dark', 'light');
        document.body.classList.add(isDark ? 'light' : 'dark');

        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

});  // ============================================
    // 1. LOAD BOOKING DATA FROM LOCAL STORAGE
    // ============================================

    function initializeOrderSummary() {
        // Retrieve the booking data saved by the previous page
        const bookingDataString = localStorage.getItem('currentBooking');

        if (!bookingDataString) {
            console.error("No booking data found in localStorage.");
            // Display an error message if no data is found
            document.querySelector('.order-card').innerHTML = '<p style="color: red; padding: 1rem;">Booking details not found. Please go back and try again.</p>';
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
            const deposit = isIntl ? 4 : 200;
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
    // 2. PRESERVED UI SCRIPT (Your Original Code)
    // ============================================



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
    const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://gem-backend-production-cb6d.up.railway.app/api';
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
                // Convert currentBooking state to the required payload items array
                const items = [];
                Object.values(bookingState.tickets || {}).forEach(t => {
                   if(t.quantity > 0) items.push({ unitId: t.name, quantity: t.quantity });
                });
                Object.values(bookingState.addons || {}).forEach(a => {
                   if(a.selected) items.push({ unitId: a.name, quantity: 1 });
                });

                // 1. Create booking checkout
                const bookingResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://gem-backend-production-cb6d.up.railway.app/api/bookings/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items })
                });

                if (!bookingResponse.ok) {
                    const bookingResult = await bookingResponse.json().catch(()=>({}));
                    throw new Error(bookingResult.message || 'Failed to checkout booking');
                }

                // --- Start Transition Overlay ---
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
                            setTimeout(() => {
                                window.location.href = '../success/success.html';
                            }, 500);
                        }
                    }, 1000);
                } else {
                    // Fallback
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
    
    // Add spinning animation for the processing icon
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleSheet);

    // ============================================
    // 3. INITIALIZATION
    // ============================================
    initializeOrderSummary();
    console.log("✓ Payment page initialized and populated from localStorage.");
 


