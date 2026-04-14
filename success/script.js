document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. DYNAMIC CONTENT & DATA HANDLING
    // ============================================

    function initializeSuccessPage() {
        const bookingDataString = localStorage.getItem('currentBooking');
        
        if (!bookingDataString) {
            console.warn("No booking data found. Using placeholders.");
            return;
        }

        let bookingState;
        try {
            bookingState = JSON.parse(bookingDataString);
        } catch (e) {
            console.error("Failed to parse booking data:", e);
            return;
        }

        // --- UI Elements ---
        const bookingRefElement = document.querySelector('[data-field="booking-ref"]');
        const copyBtn = document.getElementById('copyBtn');
        const nameElement = document.querySelector('[data-field="name"]');
        const displayDate = document.getElementById('displayDate');
        const totalPaid = document.getElementById('totalPaid');
        const currencyCode = document.getElementById('currencyCode');
        const ticketContainer = document.getElementById('ticketListContainer');
        const diningSection = document.getElementById('diningSection');
        const diningVenue = document.getElementById('diningVenue');
        const diningTime = document.getElementById('diningTime');

        // --- 1. Generation Reference & Name ---
        const randomRef = `GEM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (bookingRefElement) bookingRefElement.textContent = randomRef;
        if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(randomRef, copyBtn));

        // Get Name from localStorage if available
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (nameElement) nameElement.textContent = user.name || "Valued Visitor";

        // --- 2. Date Formatting ---
        if (displayDate && bookingState.date) {
            const dateObj = new Date(bookingState.date);
            const formatted = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            displayDate.textContent = `${formatted} | ${bookingState.timeSlot || ''}`;
        }

        // --- 3. Tickets Logic ---
        let subtotal = 0;
        let currencySymbol = bookingState.visitorType === 'egyptian' ? 'EGP ' : '$';
        if (currencyCode) currencyCode.textContent = bookingState.visitorType === 'egyptian' ? 'EGP' : 'USD';

        if (bookingState.tickets && ticketContainer) {
            ticketContainer.innerHTML = '';
            const isIntl = bookingState.visitorType === 'international';
            
            Object.values(bookingState.tickets).forEach(ticket => {
                if (ticket.quantity > 0) {
                    const price = isIntl ? ticket.price.intl : ticket.price.local;
                    subtotal += ticket.quantity * price;
                    
                    const row = document.createElement('div');
                    row.className = 'summary-row';
                    row.innerHTML = `
                        <span class="summary-label">${ticket.name}</span>
                        <span class="summary-value">x${ticket.quantity}</span>
                    `;
                    ticketContainer.appendChild(row);
                }
            });
        }


        // --- 4. Dining Logic ---
        if (bookingState.dining && diningSection) {
            diningSection.style.display = 'block';
            if (diningVenue) diningVenue.textContent = bookingState.dining.venue || 'Premium Restaurant';
            if (diningTime) diningTime.textContent = `${bookingState.dining.date} at ${bookingState.dining.time}`;
            subtotal += (bookingState.dining.deposit || 0);
        }

        // --- 5. Totals (5% Tax) ---
        const taxes = subtotal * 0.05;
        const finalTotal = subtotal + taxes;

        if (totalPaid) {
            totalPaid.textContent = `${currencySymbol}${finalTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }

        // --- Clean up ---
        // localStorage.removeItem('currentBooking'); // Optional: keep for receipt printing until navigation
    }

    function copyToClipboard(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined" style="color: #10b981;">check</span>';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
            }, 2000);
        });
    }

    // --- UI Interactions ---
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
        confetti.style.backgroundColor = Math.random() > 0.5 ? '#ECB613' : '#FFFFFF';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .confetti { position: fixed; top: -10px; width: 10px; height: 10px; pointer-events: none; z-index: 1001; animation: fall linear forwards; border-radius: 2px; }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    for (let i = 0; i < 60; i++) {
        setTimeout(() => createConfetti(), i * 40);
    }

    initializeSuccessPage();
});
