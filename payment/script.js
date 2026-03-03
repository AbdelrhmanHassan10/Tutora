document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // 1. Theme Management
    // =========================
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
    const body = document.body;

    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        themeIcon.textContent = 'dark_mode';
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        localStorage.setItem('site-theme', isDarkMode ? 'dark' : 'light');
    });

    // =========================
    // 2. Professional Mobile Menu
    // =========================
    const menuTrigger = document.querySelector('.mobile-menu-trigger');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
    const menuIcon = menuTrigger.querySelector('.material-symbols-outlined');

    // 🔥 Create external close button
    const externalCloseBtn = document.createElement('span');
    externalCloseBtn.className = 'material-symbols-outlined external-close';
    externalCloseBtn.textContent = 'close';
    navOverlay.appendChild(externalCloseBtn);

    let isMenuOpen = false;

    function openMenu() {
        isMenuOpen = true;
        navOverlay.classList.add('active');
        menuIcon.textContent = 'close';
        document.body.style.overflow = 'hidden';

        const items = document.querySelectorAll('.mobile-nav-item');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${0.1 * (index + 1)}s`;
        });
    }

    function closeMenu() {
        isMenuOpen = false;
        navOverlay.classList.remove('active');
        menuIcon.textContent = 'menu';
        document.body.style.overflow = '';
    }

    menuTrigger.addEventListener('click', () => {
        isMenuOpen ? closeMenu() : openMenu();
    });

    externalCloseBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-item').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // =========================
    // 3. Payment Method Switching
    // =========================
    const methodLabels = document.querySelectorAll('.method-label');
    const cardForm = document.querySelector('form');

    methodLabels.forEach(label => {
        label.addEventListener('click', () => {
            methodLabels.forEach(l => l.classList.remove('active'));
            label.classList.add('active');

            const method = label.querySelector('input').value;
            if (method === 'paypal') {
                cardForm.style.opacity = '0.3';
                cardForm.style.pointerEvents = 'none';
            } else {
                cardForm.style.opacity = '1';
                cardForm.style.pointerEvents = 'auto';
            }
        });
    });

    // =========================
    // 4. Card Number Formatting
    // =========================
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g);
            e.target.value = formatted ? formatted.join(' ').substring(0, 19) : '';
        });
    }

    // =========================
    // 5. Expiry Date Formatting
    // =========================
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }

    // =========================
    // 6. Pay Button Interaction
    // =========================
    const payBtn = document.querySelector('.btn-pay');
    if (payBtn) {
        payBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = payBtn.innerHTML;

            payBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Processing...';
            payBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                alert('Payment Successful! Redirecting to confirmation...');
                window.location.href = '../success/success.html';
            }, 2000);
        });
    }

});