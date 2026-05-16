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

        // Clear old dates (keep headers)
        const headers = grid.querySelectorAll('.calendar-day-header');
        grid.innerHTML = '';
        headers.forEach(h => grid.appendChild(h));

        const firstDay = new Date(bookingState.year, bookingState.month, 1).getDay();
        const daysInMonth = new Date(bookingState.year, bookingState.month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
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

    // ============================================
    
    // ============================================
    

    function createShapes() {
        const container = document.getElementById('shapes-container');
        if (!container) return;
        const glyphs = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.fontSize = `${Math.random() * 20 + 20}px`;
            shape.style.animation = `rotateFloat ${Math.random() * 20 + 20}s ease-in-out infinite`;
            container.appendChild(shape);
        }
    }

    createShapes();

    console.log('✓ Booking page initialized successfully.');
});

