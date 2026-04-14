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
            tut_student: { quantity: 0, price: { intl: 22.00, local: 225 }, name: "Tutankhamun Pass - Student/Child" }
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

        // Clear old dates (keep headers)
        const headers = grid.querySelectorAll('.calendar-day-header');
        grid.innerHTML = '';
        headers.forEach(h => grid.appendChild(h));

        const firstDay = new Date(bookingState.year, bookingState.month, 1).getDay();
        const daysInMonth = new Date(bookingState.year, bookingState.month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.classList.add('calendar-date', 'disabled');
            grid.appendChild(empty);
        }

        // Day buttons
        for (let day = 1; day <= daysInMonth; day++) {
            const btn = document.createElement('button');
            btn.classList.add('calendar-date');
            btn.textContent = day;

            const dateObj = new Date(bookingState.year, bookingState.month, day);
            dateObj.setHours(0, 0, 0, 0);

            if (dateObj < today) {
                btn.classList.add('past');
            } else {
                if (dateObj.getTime() === today.getTime()) {
                    btn.classList.add('today');
                }
                
                // Check if this date is selected
                if (bookingState.date &&
                    bookingState.date.getDate() === day &&
                    bookingState.date.getMonth() === bookingState.month &&
                    bookingState.date.getFullYear() === bookingState.year) {
                    btn.classList.add('selected');
                }

                btn.addEventListener('click', () => {
                    bookingState.date = new Date(bookingState.year, bookingState.month, day);
                    renderCalendar();
                    updateSummaryDate();
                    updateProgressSteps();
                });
            }

            grid.appendChild(btn);
        }
    }

    // Calendar Navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        const today = new Date();
        if (bookingState.month === today.getMonth() && bookingState.year === today.getFullYear()) return;
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

    document.querySelectorAll('.time-slot:not(.disabled)').forEach(slotEl => {
        slotEl.addEventListener('click', function () {
            document.querySelector('.time-slot.selected')?.classList.remove('selected');
            this.classList.add('selected');
            bookingState.timeSlot = this.dataset.time;
            updateSummaryTime();
            updateProgressSteps();
        });
    });

    // ============================================
    // 4. TICKET QUANTITY
    // ============================================

    function initTicketSelectors() {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const selector = btn.closest('.quantity-selector');
                const ticketKey = selector.dataset.ticket;
                const qtyValueEl = selector.querySelector('.qty-value');
                
                if (!ticketKey || !bookingState.tickets[ticketKey]) return;

                let currentQty = bookingState.tickets[ticketKey].quantity;
                const action = btn.querySelector('.material-symbols-outlined').textContent;

                if (action === 'remove' && currentQty > 0) currentQty--;
                else if (action === 'add' && currentQty < 20) currentQty++;

                bookingState.tickets[ticketKey].quantity = currentQty;
                qtyValueEl.textContent = currentQty;

                if (currentQty > 0) {
                    qtyValueEl.style.color = '#ECB613';
                } else {
                    qtyValueEl.style.color = '';
                }

                updateOrderSummary();
                updateProgressSteps();
            });
        });
    }

    // Call it initially
    initTicketSelectors();


    // ============================================
    // 5. ADD-ONS
    // ============================================

    document.querySelectorAll('.addon-card').forEach(card => {
        const addonKey = card.dataset.addon;
        if (!addonKey || !bookingState.addons[addonKey]) return;

        const button = card.querySelector('button');
        
        const handleToggle = (e) => {
            // Only prevent toggle if clicking something else inside the card
            if (e.target.closest('button')) {
                // Button clicked
            } else {
                // Card body clicked, also toggle
            }

            const isSelected = card.classList.toggle('addon-selected');
            bookingState.addons[addonKey].selected = isSelected;

            if (isSelected) {
                button.innerHTML = `<span class="material-symbols-outlined">check</span> Added`;
                button.classList.remove('btn-add');
                button.classList.add('btn-added');
            } else {
                button.innerHTML = 'Add';
                button.classList.add('btn-add');
                button.classList.remove('btn-added');
            }

            updateOrderSummary();
            updateProgressSteps();
        };

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            handleToggle(e);
        });
        
        card.addEventListener('click', handleToggle);
    });

    // ============================================
    // 6. ORDER SUMMARY UPDATES
    // ============================================

    function updateSummaryDate() {
        const el = document.getElementById('summaryDate');
        if (!el || !bookingState.date) return;
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.innerHTML = `
            <span class="material-symbols-outlined">calendar_today</span>
            <span>${bookingState.date.toLocaleDateString('en-US', opts)}</span>
        `;
    }

    function updateSummaryTime() {
        const el = document.getElementById('summaryTime');
        if (!el || !bookingState.timeSlot) return;
        el.innerHTML = `
            <span class="material-symbols-outlined">schedule</span>
            <span>${bookingState.timeSlot}</span>
        `;
    }

    function updateOrderSummary() {
        const summaryContainer = document.getElementById('summaryItems');
        const subtotalEl = document.getElementById('subtotalAmount');
        const taxesEl = document.getElementById('taxAmount');
        const totalEl = document.getElementById('totalAmount');

        if (!summaryContainer) return;

        let items = '';
        let subtotal = 0;
        const isIntl = bookingState.visitorType === 'international';
        const currencySymbol = isIntl ? '$' : 'EGP ';

        Object.values(bookingState.tickets).forEach(ticket => {
            if (ticket.quantity > 0) {
                const price = isIntl ? ticket.price.intl : ticket.price.local;
                const itemTotal = ticket.quantity * price;
                subtotal += itemTotal;
                items += `<div class="summary-item"><span>${ticket.quantity}x ${ticket.name}</span><span>${currencySymbol}${itemTotal.toLocaleString()}</span></div>`;
            }
        });

        Object.values(bookingState.addons).forEach(addon => {
            if (addon.selected) {
                // For simplicity, we convert the USD price to EGP if local (approx 50 EGP per $1)
                const price = isIntl ? addon.price : addon.price * 50;
                subtotal += price;
                items += `<div class="summary-item"><span>1x ${addon.name}</span><span>${currencySymbol}${price.toLocaleString()}</span></div>`;
            }
        });

        // Add Dining Logic
        if (bookingState.dining) {
            const d = bookingState.dining;
            
            // 1. Fixed Table Deposit (200 EGP or ~$4)
            const deposit = isIntl ? 4.00 : 200;
            subtotal += deposit;
            items += `
                <div class="summary-item dining-header">
                    <span><i class="fas fa-utensils"></i> ${d.venue} Reservation</span>
                    <span>${currencySymbol}${deposit.toLocaleString()}</span>
                </div>
                <div class="summary-details">${d.guests} Guests | ${d.time}</div>
            `;

            // 2. Pre-ordered Items
            d.items.forEach(item => {
                // Convert EGP prices from dining page to USD if Intl
                const itemPrice = isIntl ? (item.price / 50) : item.price;
                subtotal += itemPrice;
                items += `<div class="summary-item dish-item"><span>+ ${item.name}</span><span>${currencySymbol}${itemPrice.toFixed(2)}</span></div>`;
            });
        }


        if (items === '') {
            summaryContainer.innerHTML = `
                <div class="summary-empty">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <p>No tickets selected yet</p>
                </div>
            `;
        } else {
            summaryContainer.innerHTML = items;
        }

        const taxes = subtotal * 0.05; // 5% Admin Fee
        const total = subtotal + taxes;

        if (subtotalEl) subtotalEl.textContent = `${currencySymbol}${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        if (taxesEl) taxesEl.textContent = `${currencySymbol}${taxes.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        if (totalEl) totalEl.textContent = `${currencySymbol}${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    // Visitor Type Switcher Logic
    function initVisitorToggle() {
        document.querySelectorAll('.switch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type; // 'international' or 'egyptian'
                bookingState.visitorType = type;
                
                // Update UI state
                document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update Prices in Cards
                updateTicketCardPrices();
                
                // Refresh Summary
                updateOrderSummary();
            });
        });
    }

    function updateTicketCardPrices() {
        const isIntl = bookingState.visitorType === 'international';
        const currency = isIntl ? '$' : 'EGP ';
        const cards = document.querySelectorAll('.ticket-card');
        
        cards.forEach(card => {
            card.querySelectorAll('.ticket-row').forEach(row => {
                const ticketKey = row.querySelector('.quantity-selector').dataset.ticket;
                const ticket = bookingState.tickets[ticketKey];
                if (ticket) {
                    const priceVal = isIntl ? ticket.price.intl : ticket.price.local;
                    row.querySelector('.ticket-price').textContent = `${currency}${priceVal}`;
                }
            });
        });
    }

    // Call it
    initVisitorToggle();


    // ============================================
    // 7. PROGRESS BAR
    // ============================================

    function updateProgressSteps() {
        const steps = document.querySelectorAll('.progress-step');
        const lines = document.querySelectorAll('.progress-line');

        // Step 1: Date & Time selected
        const step1Done = bookingState.date !== null && bookingState.timeSlot !== null;
        // Step 2: At least one ticket OR dining reservation
        const totalTickets = Object.values(bookingState.tickets).reduce((s, t) => s + t.quantity, 0);
        const step2Done = totalTickets > 0 || bookingState.dining !== null;
        // Step 3: Any addon
        const step3Done = Object.values(bookingState.addons).some(a => a.selected);
        
        // Final Checkout Active
        const canCheckout = step1Done && step2Done;

        if (steps[0]) {
            steps[0].classList.toggle('active', true);
            steps[0].classList.toggle('completed', step1Done);
        }
        if (lines[0]) lines[0].classList.toggle('active', step1Done);

        if (steps[1]) {
            steps[1].classList.toggle('active', step1Done);
            steps[1].classList.toggle('completed', step2Done);
        }
        if (lines[1]) lines[1].classList.toggle('active', step2Done);

        if (steps[2]) {
            steps[2].classList.toggle('active', step2Done);
            steps[2].classList.toggle('completed', step3Done);
        }
        if (lines[2]) lines[2].classList.toggle('active', step2Done);

        if (steps[3]) {
            steps[3].classList.toggle('active', step1Done && step2Done);
        }
    }

    // ============================================
    // 8. CHECKOUT
    // ============================================

    document.getElementById('checkoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();

        const totalQuantity = Object.values(bookingState.tickets).reduce((sum, t) => sum + t.quantity, 0);

        if (!bookingState.date) {
            showNotification("Please select a visit date.", 'error');
            document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (!bookingState.timeSlot) {
            showNotification("Please select a time slot.", 'error');
            document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Allow checkout if tickets > 0 OR dining is present
        if (totalQuantity === 0 && !bookingState.dining) {
            showNotification("Please select at least one ticket or a dining reservation.", 'error');
            document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }


        // Store booking details
        localStorage.setItem('currentBooking', JSON.stringify(bookingState));

        // Trigger Transition Overlay
        const overlay = document.getElementById('verifyOverlay');
        const statusEl = document.getElementById('verifyStatus');
        const venueEl = document.getElementById('verifyVenue');
        
        if (overlay) {
            overlay.classList.add('active');
            
            const statuses = [
                "Validating request...",
                "Checking availability...",
                "Securing slots...",
                "Preparing checkout..."
            ];
            
            if (bookingState.dining) {
                venueEl.textContent = `Reservation at ${bookingState.dining.venue}`;
                venueEl.style.opacity = '1';
            }

            let current = 0;
            const interval = setInterval(() => {
                if (current < statuses.length) {
                    statusEl.style.opacity = '0';
                    setTimeout(() => {
                        statusEl.textContent = statuses[current];
                        statusEl.style.opacity = '1';
                        current++;
                    }, 300);
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        window.location.href = '../payment/payment.html';
                    }, 500);
                }
            }, 1000);
        } else {
            // Fallback if overlay not found
            window.location.href = '../payment/payment.html';
        }
    });

    // ============================================
    // 9. FAQ ACCORDION
    // ============================================

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(faq => {
                faq.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ============================================
    // 10. MOBILE MENU
    // ============================================

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
    };
    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Dropdown Menus
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems) {
                dropdownItems.classList.toggle('show');
            }
        });
    });

    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0) scale(1)';
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            }
        });
    });

    // ============================================
    // 11. NOTIFICATION SYSTEM
    // ============================================

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            info: 'info',
            success: 'check_circle',
            error: 'error'
        };

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
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10001;
            font-weight: 600;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out forwards;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(10px);
        }
        .notification .material-symbols-outlined { font-size: 1.25rem; }
        .notification-info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .notification-success { background: linear-gradient(135deg, #10b981, #059669); }
        .notification-error { background: linear-gradient(135deg, #ef4444, #dc2626); }
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
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
                bookingState.dining = JSON.parse(diningData);
                
                // If dining date exists, set it as the main booking date too
                if (bookingState.dining.date) {
                    bookingState.date = new Date(bookingState.dining.date);
                    bookingState.timeSlot = bookingState.dining.time;
                }
                
                updateSummaryDate();
                updateSummaryTime();
                
                // Optional: Show notification
                showNotification(`Dining at ${bookingState.dining.venue} added to your booking!`, 'success');
                
                // Clear to prevent repeat on refresh
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
});

