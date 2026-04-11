document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. STATE MANAGEMENT
    // ============================================

    const bookingState = {
        date: null,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        timeSlot: null,
        tickets: {
            adult: { quantity: 0, price: 25.00, name: "General Admission - Adult" },
            student: { quantity: 0, price: 15.00, name: "Student / Child" },
            resident: { quantity: 0, price: 3.00, name: "Egyptian / Arab Resident" },
            senior: { quantity: 0, price: 18.00, name: "Senior Citizen" }
        },
        addons: {
            audio: { selected: false, price: 8.00, name: "Audio Guide" },
            ramses: { selected: false, price: 12.00, name: "Special Exhibition: Ramses II" },
            photo: { selected: false, price: 5.00, name: "Photography Pass" },
            vip: { selected: false, price: 15.00, name: "VIP Fast-Track Entry" }
        }
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
                else if (action === 'add' && currentQty < 20) currentQty++;
                bookingState.tickets[ticketKey].quantity = currentQty;
                qtyValueEl.textContent = currentQty;

                // Visual feedback
                if (currentQty > 0) {
                    qtyValueEl.style.color = '#ECB613';
                } else {
                    qtyValueEl.style.color = '';
                }

                updateOrderSummary();
                updateProgressSteps();
            });
        });
    });

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

        Object.values(bookingState.tickets).forEach(ticket => {
            if (ticket.quantity > 0) {
                const itemTotal = ticket.quantity * ticket.price;
                subtotal += itemTotal;
                items += `<div class="summary-item"><span>${ticket.quantity}x ${ticket.name}</span><span>$${itemTotal.toFixed(2)}</span></div>`;
            }
        });

        Object.values(bookingState.addons).forEach(addon => {
            if (addon.selected) {
                subtotal += addon.price;
                items += `<div class="summary-item"><span>1x ${addon.name}</span><span>$${addon.price.toFixed(2)}</span></div>`;
            }
        });

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

        const taxes = subtotal * 0.07;
        const total = subtotal + taxes;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxesEl) taxesEl.textContent = `$${taxes.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // ============================================
    // 7. PROGRESS BAR
    // ============================================

    function updateProgressSteps() {
        const steps = document.querySelectorAll('.progress-step');
        const lines = document.querySelectorAll('.progress-line');

        // Step 1: Date & Time selected
        const step1Done = bookingState.date !== null && bookingState.timeSlot !== null;
        // Step 2: At least one ticket
        const totalTickets = Object.values(bookingState.tickets).reduce((s, t) => s + t.quantity, 0);
        const step2Done = totalTickets > 0;
        // Step 3: Any addon (optional, mark as active if user has interacted)
        const step3Done = Object.values(bookingState.addons).some(a => a.selected);

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

        if (totalQuantity === 0) {
            showNotification("Please select at least one ticket.", 'error');
            document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Store booking details
        localStorage.setItem('currentBooking', JSON.stringify(bookingState));

        showNotification("Proceeding to checkout...", 'success');

        setTimeout(() => {
            window.location.href = '../payment/payment.html';
        }, 1000);
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
    // 12. INITIALIZATION
    // ============================================

    renderCalendar();
    updateOrderSummary();
    updateProgressSteps();

    console.log('✓ Booking page initialized successfully.');
});
