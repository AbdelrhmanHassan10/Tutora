document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production.up.railway.app/api';

    // ============================================
    // 1. API INTEGRATION & STATE MANAGEMENT
    // ============================================

    let currentBookingId = null;
    let currentBookingTotal = 0;

    // --- API Helper ---
    async function makeApiRequest(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Authentication session has expired. Please log in again.");
            window.location.href = '../2.login/code.html'; // Redirect to login
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
            // Handle PUT requests that might not return a body
            if (response.status === 200 && response.headers.get('content-length') === '0') {
                return { success: true };
            }
            return await response.json();
        } catch (error) {
            console.error(`API Request Error on ${endpoint}:`, error);
            alert(`API Error: ${error.message}`);
            throw error;
        }
    }

    // --- UI Update Function ---
    function updateOrderSummary(booking) {
        if (!booking) return;

        const orderItemsContainer = document.querySelector('.order-items');
        const subtotalEl = document.querySelector('.order-totals .total-row:nth-child(1) span:nth-child(2)');
        const taxesEl = document.querySelector('.order-totals .total-row:nth-child(2) span:nth-child(2)');
        const totalEl = document.querySelector('.order-totals .total-row.final span:nth-child(2)');
        const payBtn = document.querySelector('.btn-pay');

        // Assuming the API returns a simple structure for now
        // In a real scenario, you'd get detailed items from the booking object
        const quantity = booking.quantity || 1;
        const type = booking.type || "Museum Tickets";
        const date = new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const time = booking.time || "";

        // Calculate price based on quantity (example logic)
        const subtotal = quantity * 25; // Example: $25 per ticket
        const taxes = subtotal * 0.10; // Example: 10% tax
        const total = subtotal + taxes;
        currentBookingTotal = total;

        orderItemsContainer.innerHTML = `
            <div class="order-item">
                <img class="item-img" src="./unnamed (5).png" alt="Ticket">
                <div class="item-info">
                    <p class="item-name">${type}</p>
                    <p class="item-details">Qty: ${quantity} | ${date} - ${time}</p>
                </div>
            </div>`;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxesEl.textContent = `$${taxes.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
        payBtn.textContent = `Pay $${total.toFixed(2)}`;
    }

    // --- Page Initialization ---
    async function initializeCheckout() {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');

        if (!bookingId) {
            alert("No booking ID found. Returning to booking page.");
            window.location.href = '../booking/booking.html';
            return;
        }

        currentBookingId = bookingId;

        // In a real scenario, you would fetch the specific booking details
        // For now, we'll simulate it since there's no GET /bookings/:id endpoint
        // const bookingDetails = await makeApiRequest(`/bookings/${bookingId}`);
        // For this demo, we'll use placeholder data based on the ID.
        const mockBookingDetails = {
            id: bookingId,
            quantity: 2,
            type: "Adult General Admission",
            date: new Date().toISOString(),
            time: "10:00 AM"
        };
        updateOrderSummary(mockBookingDetails);
    }

    initializeCheckout();


    // ============================================
    // 2. ORIGINAL UI SCRIPT (ADAPTED)
    // ============================================

    // --- Theme Management ---
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
    const body = document.body;
    const savedTheme = localStorage.getItem('site-theme') || 'dark';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        localStorage.setItem('site-theme', isDarkMode ? 'dark' : 'light');
    });

    // --- Payment Method Switching ---
    document.querySelectorAll('.method-label').forEach(label => {
        label.addEventListener('click', () => {
            document.querySelectorAll('.method-label').forEach(l => l.classList.remove('active'));
            label.classList.add('active');
            const isCard = label.querySelector('input').value === 'card';
            document.querySelector('form').style.opacity = isCard ? '1' : '0.3';
            document.querySelector('form').style.pointerEvents = isCard ? 'auto' : 'none';
        });
    });

    // --- Input Formatting ---
    const cardInput = document.getElementById('card-number');
    cardInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
    });
    const expiryInput = document.getElementById('expiry-date');
    expiryInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').substring(0, 5);
    });

    // --- Pay Button Interaction (with API) ---
    const payBtn = document.querySelector('.btn-pay');
    payBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        if (!currentBookingId) {
            alert("Booking information is missing. Cannot proceed.");
            return;
        }

        payBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Processing...';
        payBtn.disabled = true;

        try {
            const result = await makeApiRequest(`/bookings/${currentBookingId}/pay`, 'PUT');
            if (result) {
                alert('Payment Successful! Redirecting to confirmation...');
                // Redirect to success page, passing the booking ID
                window.location.href = `../success/success.html?bookingId=${currentBookingId}`;
            } else {
                // Handle cases where API call fails but doesn't throw an error
                payBtn.innerHTML = `Pay $${currentBookingTotal.toFixed(2)}`;
                payBtn.disabled = false;
            }
        } catch (error) {
            // Error is already alerted by makeApiRequest
            payBtn.innerHTML = `Pay $${currentBookingTotal.toFixed(2)}`;
            payBtn.disabled = false;
        }
    });
});