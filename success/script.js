document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. DYNAMIC CONTENT & DATA HANDLING
    // ============================================

    const API_BASE_URL = 'https://gem-backend-production-40ae.up.railway.app/api';

    async function verifyPayment() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order') || urlParams.get('orderId') || urlParams.get('merchant_order_id');
        const transactionId = urlParams.get('id') || urlParams.get('transactionId') || urlParams.get('transaction_id');

        if (!orderId && !transactionId) return null;

        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/bookings/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: orderId || '',
                    transactionId: transactionId || ''
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Payment verified:', data.message);
                return data.booking || null;
            } else {
                console.warn('Payment verification failed:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            return null;
        }
    }

    async function initializeSuccessPage() {
        // Step 1: Verify payment with backend if returning from Paymob
        const verifiedBooking = await verifyPayment();

        const bookingDataString = localStorage.getItem('currentBooking');
        
        // --- Sync Profile Data to Header ---
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const localData = localStorage.getItem(`localProfileData_${user.email}`);
        let finalUserData = user;
        if (localData) {
            try { finalUserData = { ...user, ...JSON.parse(localData) }; } catch(e) {}
        }

        const nameElement = document.getElementById('bearerName');
        const headerAvatar = document.getElementById('headerAvatar');
        const userGreeting = document.querySelector('.user-greeting');

        if (nameElement) nameElement.textContent = finalUserData.name || "Abdelrhman Hassan";
        if (userGreeting) userGreeting.textContent = (finalUserData.name || "Explorer").split(' ')[0];
        
        const avatar = finalUserData.avatar || finalUserData.profileImage || finalUserData.profilePicture || localStorage.getItem('currentAvatar');
        if (avatar && headerAvatar) headerAvatar.src = avatar;

        if (!bookingDataString && !verifiedBooking) {
            console.warn("No booking data found. Using placeholders.");
            return;
        }

        let bookingState;
        try {
            bookingState = bookingDataString ? JSON.parse(bookingDataString) : {};
        } catch (e) {
            console.error("Failed to parse booking data:", e);
            bookingState = {};
        }

        // Merge verified booking data if available
        if (verifiedBooking) {
            bookingState = { ...bookingState, ...verifiedBooking };
        }

        // --- UI Elements ---
        const bookingRefElement = document.getElementById('bookingRef');
        const copyBtn = document.getElementById('copyBtn');
        const displayDate = document.getElementById('displayDate');
        const totalPaid = document.getElementById('totalPaid');
        const currencyCode = document.getElementById('currencyCode');
        const ticketContainer = document.getElementById('ticketListContainer');
        const diningSection = document.getElementById('diningSection');
        const diningVenue = document.getElementById('diningVenue');
        const diningTime = document.getElementById('diningTime');

        // --- 1. Generation Reference ---
        const bookingRef = verifiedBooking?._id 
            ? `GEM-${verifiedBooking._id.slice(-8).toUpperCase()}`
            : `GEM-AUTH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (bookingRefElement) bookingRefElement.textContent = bookingRef;
        if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(bookingRef, copyBtn));

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
        let currencySymbol = (bookingState.currency === 'EGP' || bookingState.visitorType === 'egyptian') ? 'EGP ' : '$';
        if (currencyCode) currencyCode.textContent = (bookingState.currency === 'EGP' || bookingState.visitorType === 'egyptian') ? 'EGP' : 'USD';

        if (bookingState.tickets && ticketContainer) {
            ticketContainer.innerHTML = '';
            const isIntl = bookingState.visitorType === 'international';
            
            Object.values(bookingState.tickets).forEach(ticket => {
                if (ticket.quantity > 0) {
                    const priceList = ticket.price || { intl: 0, local: 0 };
                    const price = isIntl ? (priceList.intl || 0) : (priceList.local || 0);
                    subtotal += ticket.quantity * price;
                    
                    const row = document.createElement('div');
                    row.className = 'data-row';
                    row.innerHTML = `
                        <span class="data-label">${ticket.name}</span>
                        <span class="data-value">x${ticket.quantity}</span>
                    `;
                    ticketContainer.appendChild(row);
                }
            });
        }

        // --- 4. Dining Logic ---
        if (bookingState.dining && diningSection) {
            diningSection.style.display = 'block';
            if (diningVenue) diningVenue.textContent = bookingState.dining.venue || 'The Grand Lounge';
            if (diningTime) diningTime.textContent = `${bookingState.dining.date} at ${bookingState.dining.time}`;
            subtotal += (bookingState.dining.deposit || 0);
        }

        // --- 5. Totals (14% VAT as per backend docs) ---
        // Use server-provided total if available from verified booking
        if (verifiedBooking && verifiedBooking.total) {
            if (totalPaid) {
                totalPaid.textContent = `${currencySymbol}${verifiedBooking.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
        } else {
            const taxes = subtotal * 0.14;
            const finalTotal = subtotal + taxes;

            if (totalPaid) {
                totalPaid.textContent = `${currencySymbol}${finalTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
        }
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
    function createRoyalSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'royal-sparkle';
        sparkle.style.left = `${Math.random() * 100}vw`;
        const size = Math.random() * 4 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        sparkle.style.background = Math.random() > 0.4 ? '#ECB613' : '#FFFFFF';
        sparkle.style.boxShadow = `0 0 10px ${sparkle.style.background}`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 4000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .royal-sparkle { position: fixed; top: -10px; border-radius: 50%; pointer-events: none; z-index: 9999; animation: royalFall linear forwards; }
        @keyframes royalFall { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(100vh) scale(0); opacity: 0; } }
    `;
    document.head.appendChild(styleSheet);

    // --- Action Button Logic ---
    const btnDownload = document.getElementById('btnDownload');
    if (btnDownload) {
        btnDownload.onclick = () => {
            if (window.showPremiumToast) {
                window.showPremiumToast('Generating your celestial pass...', 'success');
                setTimeout(() => window.print(), 1500);
            } else {
                window.print();
            }
        };
    }

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const updateThemeIcon = (isDark) => {
        const icon = themeToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    };

    // Initialize Theme from LocalStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(savedTheme, 'success-page');
    if (themeToggle) updateThemeIcon(savedTheme === 'dark');

    if (themeToggle) {
        themeToggle.onclick = () => {
            const isDark = document.body.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(newTheme);
            
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme === 'dark');
            
            if (window.showPremiumToast) {
                window.showPremiumToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Activated`, 'info');
            }
        };
    }



    initializeSuccessPage();
});

