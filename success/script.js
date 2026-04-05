document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. DYNAMIC CONTENT & DATA HANDLING
    // ============================================

    function initializeSuccessPage() {
        // Retrieve the booking data saved by the booking page
        const bookingDataString = localStorage.getItem('currentBooking');
        
        if (!bookingDataString) {
            console.error("No booking data found. Displaying placeholder data.");
            // In a real scenario, you might want to redirect or show an error
            // For now, we'll just let the default HTML values show.
            return;
        }

        const bookingState = JSON.parse(bookingDataString);

        // --- UI Elements to Update ---
        const bookingRefElement = document.querySelector('.booking-ref');
        const copyBtn = document.querySelector('.copy-btn');
        const nameElement = document.querySelector('.summary-value[data-field="name"]');
        const ticketElement = document.querySelector('.summary-value[data-field="ticket"]');
        const dateElement = document.querySelector('.summary-value[data-field="date"]');
        const priceElement = document.querySelector('.total-price');

        // --- Generate a random booking reference ---
        const randomRef = `GEM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (bookingRefElement) bookingRefElement.textContent = randomRef;
        if (copyBtn) copyBtn.setAttribute('data-copy', randomRef);

        // --- Calculate total price again ---
        let subtotal = 0;
        let ticketCount = 0;
        Object.values(bookingState.tickets).forEach(ticket => {
            if (ticket.quantity > 0) {
                subtotal += ticket.quantity * ticket.price;
                ticketCount += ticket.quantity;
            }
        });
        Object.values(bookingState.addons).forEach(addon => {
            if (addon.selected) subtotal += addon.price;
        });
        const total = subtotal * 1.07; // Add 7% tax

        // --- Update the UI with the booking data ---
        // For the name, we'll use a placeholder as it's not in the booking state
        if (nameElement) nameElement.textContent = "Valued Visitor"; 
        if (ticketElement) ticketElement.textContent = `${ticketCount} Ticket(s)`;
        if (dateElement) {
            const formattedDate = new Date(bookingState.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            dateElement.textContent = `${formattedDate} at ${bookingState.timeSlot}`;
        }
        if (priceElement) priceElement.textContent = `$${total.toFixed(2)}`;

        // --- Clean up localStorage ---
        // After displaying the data, remove it so it doesn't show up again on a fresh visit.
        localStorage.removeItem('currentBooking');
        
        console.log("✓ Success page populated with booking data.");
    }

    // ============================================
    // 2. PRESERVED UI SCRIPT (Your Original Code, Cleaned Up)
    // ============================================

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (themeToggle) {
        const updateThemeIcon = () => {
            const isDark = body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? 'light_mode' : 'dark_mode';
        };
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        body.classList.toggle('light-mode', savedTheme !== 'dark');
        updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            body.classList.toggle('light-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

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
                    copyBtn.style.color = ''; // Revert to original color
                }, 2000);
            }).catch(err => console.error('Failed to copy:', err));
        });
    }

    // --- Download & Return Buttons ---
    const downloadBtn = document.querySelector('.btn-primary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Simulate download
            console.log('Download ticket clicked');
            window.print(); // A simple way to "download" is to print the page
        });
    }

    const returnBtn = document.querySelector('.btn-secondary');
    if (returnBtn) {
        returnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            body.style.transition = 'opacity 0.3s ease';
            body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = '../4.home/code.html'; // Correct path to home
            }, 300);
        });
    }
    
    // --- Confetti Animation on Load ---
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .confetti { position: fixed; top: -10px; width: 8px; height: 8px; pointer-events: none; z-index: 1001; animation: fall linear forwards; }
        @keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    window.addEventListener('load', () => {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createConfetti(), i * 20);
        }
    });

    // ============================================
    // 3. INITIALIZATION
    // ============================================
    initializeSuccessPage();
});
