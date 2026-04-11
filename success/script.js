document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. DYNAMIC CONTENT & DATA HANDLING
    // ============================================

    function initializeSuccessPage() {
        // Retrieve the booking data saved by the booking page
        const bookingDataString = localStorage.getItem('currentBooking');
        
        if (!bookingDataString) {
            console.warn("No booking data found. Displaying placeholder data.");
            return;
        }

        let bookingState;
        try {
            bookingState = JSON.parse(bookingDataString);
        } catch (e) {
            console.error("Failed to parse booking data:", e);
            return;
        }

        // --- UI Elements to Update ---
        const bookingRefElement = document.querySelector('[data-field="booking-ref"]');
        const copyBtn = document.querySelector('.copy-btn');
        const nameElement = document.querySelector('.summary-value[data-field="name"]');
        const ticketElement = document.querySelector('.summary-value[data-field="ticket"]');
        const dateElement = document.querySelector('.summary-value[data-field="date"]');
        const priceElement = document.querySelector('.total-price');

        // --- Generate a random booking reference ---
        const randomRef = `GEM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (bookingRefElement) bookingRefElement.textContent = randomRef;
        if (copyBtn) copyBtn.setAttribute('data-copy', randomRef);

        // --- Calculate total price ---
        let subtotal = 0;
        let ticketCount = 0;
        if (bookingState.tickets) {
            Object.values(bookingState.tickets).forEach(ticket => {
                if (ticket.quantity > 0) {
                    subtotal += ticket.quantity * ticket.price;
                    ticketCount += ticket.quantity;
                }
            });
        }
        if (bookingState.addons) {
            Object.values(bookingState.addons).forEach(addon => {
                if (addon.selected) subtotal += addon.price;
            });
        }
        const total = subtotal * 1.07; // Add 7% tax

        // --- Update the UI with the booking data ---
        if (nameElement) nameElement.textContent = "Valued Visitor"; 
        if (ticketElement) ticketElement.textContent = `${ticketCount} Ticket(s)`;
        if (dateElement) {
            const formattedDate = new Date(bookingState.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            dateElement.textContent = `${formattedDate} at ${bookingState.timeSlot || 'TBD'}`;
        }
        if (priceElement) priceElement.innerHTML = `$${total.toFixed(2)} <span class="currency">USD</span>`;

        // --- Clean up localStorage ---
        localStorage.removeItem('currentBooking');
        
        console.log("✓ Success page populated with booking data.");
    }

    // ============================================
    // 2. UI INTERACTIONS
    // ============================================

    // --- Copy to Clipboard ---
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = copyBtn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span class="material-symbols-outlined">check</span>';
                copyBtn.style.color = '#D4AF37';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.style.color = '';
                }, 2000);
            }).catch(err => console.error('Failed to copy:', err));
        });
    }
    
    // --- Confetti Animation on Load ---
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 30}, 80%, 60%)`; // Gold-toned confetti
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti styles dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .confetti { position: fixed; top: -10px; width: 8px; height: 8px; pointer-events: none; z-index: 1001; animation: fall linear forwards; border-radius: 2px; }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    // Launch confetti on load
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createConfetti(), i * 30);
    }

    // ============================================
    // 3. INITIALIZATION
    // ============================================
    initializeSuccessPage();
});
