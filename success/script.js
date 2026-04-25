document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. DYNAMIC CONTENT & DATA HANDLING
    // ============================================

    function initializeSuccessPage() {
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
        
        const avatar = finalUserData.profileImage || finalUserData.profilePicture || localStorage.getItem('currentAvatar');
        if (avatar && headerAvatar) headerAvatar.src = avatar;

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
        const randomRef = `GEM-AUTH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        if (bookingRefElement) bookingRefElement.textContent = randomRef;
        if (copyBtn) copyBtn.addEventListener('click', () => copyToClipboard(randomRef, copyBtn));

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

        // --- 5. Totals (5% Tax) ---
        const taxes = subtotal * 0.05;
        const finalTotal = subtotal + taxes;

        if (totalPaid) {
            totalPaid.textContent = `${currencySymbol}${finalTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
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
        .royal-sparkle { position: fixed; top: -10px; pointer-events: none; z-index: 1001; animation: royalFall linear forwards; border-radius: 50%; opacity: 0.8; }
        @keyframes royalFall { 
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);

    for (let i = 0; i < 70; i++) {
        setTimeout(() => createRoyalSparkle(), i * 35);
    }

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

    // ============================================
    // ROYAL ATMOSPHERE (Golden Dust & Shapes)
    // ============================================
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        
        if (!dustContainer || !shapesContainer) return;

        // Create 150 dust particles
        for (let i = 0; i < 150; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s infinite linear ${delay}s`;
            
            dustContainer.appendChild(particle);
        }

        // Create 15 royal shapes (Hieroglyphs)
        const hieroglyphs = ['𓂀', '𓋹', '𓅓', '𓇳', '𓇿', '𓆎', '𓃻', '𓂋', '𓏏', '𓈖'];
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.textContent = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
            
            const size = Math.random() * 20 + 20;
            shape.style.fontSize = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            shape.style.left = `${left}%`;
            shape.style.top = `${top}%`;
            
            const duration = Math.random() * 20 + 20;
            const delay = Math.random() * 10;
            shape.style.animation = `rotateFloat ${duration}s infinite ease-in-out ${delay}s`;
            
            shapesContainer.appendChild(shape);
        }
    }

    initRoyalAtmosphere();
    initializeSuccessPage();
});

