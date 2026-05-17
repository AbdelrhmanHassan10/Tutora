document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. STATE MANAGEMENT
    // ============================================

    const bookingState = {
        date: null,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        timeSlot: null,
        visitorType: 'international', // 'international' or 'egyptian'
        tickets: {
            general_adult: { quantity: 0, price: { intl: 25.00, local: 200 }, name: "General Admission - Adult" },
            general_student: { quantity: 0, price: { intl: 15.00, local: 100 }, name: "General Admission - Student/Child" },
            guided_adult: { quantity: 0, price: { intl: 38.00, local: 350 }, name: "Guided Experience - Adult" },
            guided_student: { quantity: 0, price: { intl: 20.00, local: 175 }, name: "Guided Experience - Student/Child" },
            tut_adult: { quantity: 0, price: { intl: 42.00, local: 450 }, name: "Tutankhamun Pass - Adult" },
            tut_student: { quantity: 0, price: { intl: 22.00, local: 225 }, name: "Tutankhamun Pass - Student/Child" },
            kids_child: { quantity: 0, price: { intl: 15.00, local: 100 }, name: "Kids Museum - Explorer" },
            kids_adult: { quantity: 0, price: { intl: 10.00, local: 75 }, name: "Kids Museum - Guardian" }
        },
        addons: {
            audio: { selected: false, price: 8.00, name: "Audio Guide" },
            ramses: { selected: false, price: 12.00, name: "Special Exhibition: Ramses II" },
            photo: { selected: false, price: 5.00, name: "Photography Pass" },
            vip: { selected: false, price: 15.00, name: "VIP Fast-Track Entry" }
        },
        dining: null
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // ============================================
    // 2. CALENDAR LOGIC
    // ============================================

    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthLabel = document.getElementById('calendarMonth');
        if (!grid || !monthLabel) return;

        monthLabel.textContent = `${monthNames[bookingState.month]} ${bookingState.year}`;

        // Keep headers
        const headers = `
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
        `;
        grid.innerHTML = headers;

        const firstDay = new Date(bookingState.year, bookingState.month, 1).getDay();
        const daysInMonth = new Date(bookingState.year, bookingState.month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            grid.appendChild(emptyCell);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(bookingState.year, bookingState.month, day);
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-date';
            dayEl.textContent = day;

            if (dateObj < today) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-date').forEach(d => d.classList.remove('active'));
                    dayEl.classList.add('active');
                    bookingState.date = dateObj;
                    updateSummaryDate();
                    updateProgressSteps();
                });
                
                // If it's the selected date
                if (bookingState.date && bookingState.date.toDateString() === dateObj.toDateString()) {
                    dayEl.classList.add('active');
                }
            }
            grid.appendChild(dayEl);
        }
    }

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        bookingState.month--;
        if (bookingState.month < 0) {
            bookingState.month = 11;
            bookingState.year--;
        }
        renderCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        bookingState.month++;
        if (bookingState.month > 11) {
            bookingState.month = 0;
            bookingState.year++;
        }
        renderCalendar();
    });

    // ============================================
    // 3. TIME SLOTS
    // ============================================

    document.querySelectorAll('.time-slot').forEach(slot => {
        if (slot.classList.contains('disabled')) return;
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
            slot.classList.add('active');
            bookingState.timeSlot = slot.getAttribute('data-time');
            updateSummaryTime();
            updateProgressSteps();
        });
    });

    // ============================================
    // 4. VISITOR TYPE SWITCHER
    // ============================================

    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            bookingState.visitorType = btn.getAttribute('data-type');
            updateTicketPrices();
            updateOrderSummary();
        });
    });

    function updateTicketPrices() {
        const isLocal = bookingState.visitorType === 'egyptian';
        const currency = isLocal ? 'EGP ' : '$';
        
        for (const [key, ticket] of Object.entries(bookingState.tickets)) {
            const priceEl = document.getElementById(`price-${key.replace('_', '-')}`);
            if (priceEl) {
                const price = isLocal ? ticket.price.local : ticket.price.intl;
                priceEl.textContent = `${currency}${price.toFixed(2)}`;
            }
        }
    }

    // ============================================
    // 5. TICKET QUANTITIES
    // ============================================

    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const ticketKey = selector.getAttribute('data-ticket');
        const qtyValue = selector.querySelector('.qty-value');
        const btns = selector.querySelectorAll('.qty-btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('.material-symbols-outlined').textContent;
                if (icon === 'add') {
                    bookingState.tickets[ticketKey].quantity++;
                } else if (icon === 'remove' && bookingState.tickets[ticketKey].quantity > 0) {
                    bookingState.tickets[ticketKey].quantity--;
                }
                qtyValue.textContent = bookingState.tickets[ticketKey].quantity;
                updateOrderSummary();
                updateProgressSteps();
            });
        });
    });

    // ============================================
    // 6. ADD-ONS
    // ============================================

    document.querySelectorAll('.addon-card').forEach(card => {
        const addonKey = card.getAttribute('data-addon');
        const addBtn = card.querySelector('.btn-add');

        addBtn?.addEventListener('click', () => {
            bookingState.addons[addonKey].selected = !bookingState.addons[addonKey].selected;
            card.classList.toggle('selected', bookingState.addons[addonKey].selected);
            addBtn.textContent = bookingState.addons[addonKey].selected ? 'Remove' : 'Add';
            updateOrderSummary();
            updateProgressSteps();
        });
    });

    // ============================================
    // 7. SUMMARY LOGIC
    // ============================================

    function updateSummaryDate() {
        const el = document.getElementById('summaryDate');
        if (el && bookingState.date) {
            el.innerHTML = `<span class="material-symbols-outlined">calendar_today</span> <span>${bookingState.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>`;
            el.classList.add('active');
        }
    }

    function updateSummaryTime() {
        const el = document.getElementById('summaryTime');
        if (el && bookingState.timeSlot) {
            el.innerHTML = `<span class="material-symbols-outlined">schedule</span> <span>${bookingState.timeSlot}</span>`;
            el.classList.add('active');
        }
    }

    function updateOrderSummary() {
        const container = document.getElementById('summaryItems');
        if (!container) return;

        let html = '';
        let subtotal = 0;
        const isLocal = bookingState.visitorType === 'egyptian';
        const currency = isLocal ? 'EGP ' : '$';

        // Tickets
        for (const [key, ticket] of Object.entries(bookingState.tickets)) {
            if (ticket.quantity > 0) {
                const price = isLocal ? ticket.price.local : ticket.price.intl;
                const total = price * ticket.quantity;
                subtotal += total;
                html += `
                    <div class="summary-item">
                        <div class="item-info">
                            <span class="item-name">${ticket.name}</span>
                            <span class="item-qty">x${ticket.quantity}</span>
                        </div>
                        <span class="item-price">${currency}${total.toFixed(2)}</span>
                    </div>
                `;
            }
        }

        // Add-ons
        for (const [key, addon] of Object.entries(bookingState.addons)) {
            if (addon.selected) {
                subtotal += addon.price;
                html += `
                    <div class="summary-item">
                        <div class="item-info">
                            <span class="item-name">${addon.name}</span>
                        </div>
                        <span class="item-price">${currency}${addon.price.toFixed(2)}</span>
                    </div>
                `;
            }
        }

        // Shop Items (from cart)
        const cartData = localStorage.getItem('tutora_cart');
        if (cartData) {
            try {
                const cartItems = JSON.parse(cartData);
                if (cartItems && cartItems.length > 0) {
                    cartItems.forEach(item => {
                        const itemTotal = item.price * item.quantity;
                        subtotal += itemTotal;
                        html += `
                            <div class="summary-item">
                                <div class="item-info">
                                    <span class="item-name" style="color: #ecb613;"><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">shopping_bag</span>${item.name}</span>
                                    <span class="item-qty">x${item.quantity}</span>
                                </div>
                                <span class="item-price">${currency}${itemTotal.toFixed(2)}</span>
                            </div>
                        `;
                    });
                }
            } catch (e) {
                console.error("Failed to parse cart items:", e);
            }
        }

        // Dining Reservation
        if (bookingState.dining) {
            const diningFee = 5.00;
            subtotal += diningFee;
            html += `
                <div class="summary-item">
                    <div class="item-info">
                        <span class="item-name" style="color: #ecb613;"><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">restaurant</span>${bookingState.dining.venue} Reservation</span>
                    </div>
                    <span class="item-price">${currency}${diningFee.toFixed(2)}</span>
                </div>
            `;
        }

        if (html === '') {
            html = `
                <div class="summary-empty">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <p>No tickets or items selected yet</p>
                </div>
            `;
        }

        container.innerHTML = html;

        // Totals
        const tax = subtotal * 0.07;
        const total = subtotal + tax;

        document.getElementById('subtotalAmount').textContent = `${currency}${subtotal.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `${currency}${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `${currency}${total.toFixed(2)}`;
        
        // Update checkout button state
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            // We keep it enabled so the user can click it and see validation errors
            checkoutBtn.disabled = false;
        }
    }

    // ============================================
    // 8. PROGRESS STEPS
    // ============================================

    function updateProgressSteps() {
        const steps = document.querySelectorAll('.progress-step');
        const lines = document.querySelectorAll('.progress-line');

        // Step 1: Date & Time
        if (bookingState.date && bookingState.timeSlot) {
            steps[1].classList.add('active');
            lines[0].classList.add('active');
        } else {
            steps[1].classList.remove('active');
            lines[0].classList.remove('active');
        }

        // Step 2: Tickets
        const hasTickets = Object.values(bookingState.tickets).some(t => t.quantity > 0);
        if (hasTickets) {
            steps[2].classList.add('active');
            lines[1].classList.add('active');
        } else {
            steps[2].classList.remove('active');
            lines[1].classList.remove('active');
        }

        // Step 3: Add-ons (Optional, but active if anything selected)
        const hasAddons = Object.values(bookingState.addons).some(a => a.selected);
        if (hasAddons) {
            steps[3].classList.add('active');
            lines[2].classList.add('active');
        } else {
            steps[3].classList.remove('active');
            lines[2].classList.remove('active');
        }
    }

    // ============================================
    // 9. FAQ ACCORDION
    // ============================================

    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // ============================================
    // 10. CHECKOUT FLOW (MOCK VERIFICATION)
    // ============================================

    const checkoutBtn = document.getElementById('checkoutBtn');
    const verifyOverlay = document.getElementById('verifyOverlay');
    const verifyStatus = document.getElementById('verifyStatus');
    const verifyTitle = document.getElementById('verifyTitle');

    checkoutBtn?.addEventListener('click', () => {
        // Validation Checks
        const hasTickets = Object.values(bookingState.tickets).some(t => t.quantity > 0);
        const cartData = localStorage.getItem('tutora_cart');
        const cartItems = cartData ? JSON.parse(cartData) : [];
        const hasShopItems = cartItems.length > 0;
        const hasDining = bookingState.dining != null;

        if (!hasTickets && !hasShopItems && !hasDining) {
            showNotification('Please select at least one ticket, a dining reservation, or shop items to proceed.', 'error');
            document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (hasTickets) {
            if (!bookingState.date) {
                showNotification('Please select a visit date from the calendar.', 'error');
                document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (!bookingState.timeSlot) {
                showNotification('Please select an available time slot.', 'error');
                document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }

        verifyOverlay.classList.add('active');
        
        const stages = [
            { text: "Securing connection...", time: 1000 },
            { text: "Validating availability...", time: 2000 },
            { text: "Finalizing your tickets...", time: 3500 },
            { text: "Redirecting to payment...", time: 5000 }
        ];

        stages.forEach(stage => {
            setTimeout(() => {
                verifyStatus.textContent = stage.text;
                if (stage.text.includes("Redirecting")) {
                    verifyTitle.textContent = "Success!";
                    
                    // Save the current booking state for the payment page
                    localStorage.setItem('currentBooking', JSON.stringify(bookingState));

                    setTimeout(() => {
                        window.location.href = "../payment/payment.html"; // Assuming payment page exists
                    }, 1000);
                }
            }, stage.time);
        });
    });

    // ============================================
    // 11. NOTIFICATIONS
    // ============================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
        const color = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');

        notification.innerHTML = `
            <div class="noti-icon-wrapper" style="background: ${color}20; color: ${color};">
                <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div class="noti-content">
                <span class="noti-msg">${message}</span>
            </div>
            <div class="noti-progress" style="background: ${color};"></div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('slide-out');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Inject Notification Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .notification {
            position: fixed;
            top: 100px;
            right: 40px;
            min-width: 350px;
            max-width: 450px;
            background: rgba(15, 18, 22, 0.95);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 1.25rem;
            color: white;
            display: flex;
            align-items: center;
            gap: 16px;
            z-index: 10000;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            overflow: hidden;
            animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .noti-icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .noti-icon-wrapper span { font-size: 1.75rem; }
        .noti-msg { font-size: 0.95rem; font-weight: 600; line-height: 1.4; color: #f8f9fa; }
        .noti-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            animation: progress 4s linear forwards;
        }
        .notification-error { 
            animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, shake 0.4s ease-in-out;
        }
        @keyframes slideInRight { 
            from { transform: translateX(120%); opacity: 0; } 
            to { transform: translateX(0); opacity: 1; } 
        }
        @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .notification.slide-out {
            animation: slideOutRight 0.5s ease forwards;
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
        }
        .calendar-grid { 
            gap: 8px !important; 
            padding: 10px 0;
        }
        .calendar-date {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
            color: var(--text-primary);
            border: 1px solid transparent;
        }
        .calendar-date:hover:not(.disabled) {
            background: rgba(236, 182, 19, 0.1);
            color: #ECB613;
            border-color: rgba(236, 182, 19, 0.3);
        }
        .calendar-date.active {
            background: #ECB613 !important;
            color: #121212 !important;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(236, 182, 19, 0.3);
        }
        .calendar-date.disabled {
            opacity: 0.2;
            cursor: not-allowed;
            text-decoration: line-through;
        }
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .notification.slide-out { animation: slideOut 0.5s ease forwards; }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // 12. INITIALIZATION & DATA HYDRATION
    // ============================================

    function hydrateDiningData() {
        const diningData = localStorage.getItem('diningBooking');
        if (diningData) {
            try {
                const dining = JSON.parse(diningData);
                bookingState.dining = dining;
                
                if (dining.date) {
                    bookingState.date = new Date(dining.date);
                    bookingState.month = bookingState.date.getMonth();
                    bookingState.year = bookingState.date.getFullYear();
                }
                if (dining.time) {
                    bookingState.timeSlot = dining.time;
                }
                
                updateSummaryDate();
                updateSummaryTime();
                showNotification(`Dining at ${dining.venue} added to your booking!`, 'success');
                localStorage.removeItem('diningBooking');
            } catch (e) {
                console.error('Error hydrating dining data:', e);
            }
        }
    }

    hydrateDiningData();
    renderCalendar();
    updateOrderSummary();
    updateProgressSteps();

    console.log('✓ Booking page initialized successfully.');

    console.log('✓ Booking page initialized successfully.');
});
