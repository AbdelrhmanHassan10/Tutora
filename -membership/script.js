document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initMobileMenu();
    syncProfileData();
    
    // Global effects are handled by global-core.js
    setTimeout(() => {
        if (window.initRoyalAtmosphere) window.initRoyalAtmosphere();
        if (window.init3DParallax) window.init3DParallax();
    }, 100);
});

// 1. FAQ Accordion Logic
function initFAQ() {
    const faqItems = document.querySelectorAll('.mem-faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'SUMMARY' || e.target.closest('summary')) {
                if (item.hasAttribute('open')) return;
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
}

// 2. Mobile Menu
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = (show) => {
        if (mobileMenu) mobileMenu.classList.toggle('active', show);
        if (menuOverlay) menuOverlay.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
}

// 3. Profile Sync
function syncProfileData() {
    const profileImg = document.querySelector('.profile-img');
    const savedAvatar = localStorage.getItem('currentAvatar');
    
    if (profileImg && savedAvatar) {
        profileImg.src = savedAvatar;
    }
}

// 4. Payment Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('closePaymentModal');
    const form = document.getElementById('paymentForm');
    const successMsg = document.getElementById('paymentSuccess');
    const titleEl = document.getElementById('paymentTierTitle');
    const priceEl = document.getElementById('paymentTierPrice');
    const submitBtn = document.getElementById('submitPaymentBtn');
    const finishBtn = document.getElementById('finishPaymentBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

    // Membership Tiers Data
    const tiers = {
        'joinYoungExplorer': { title: 'Young Explorer', price: '$75 / Year' },
        'joinHeritageResident': { title: 'Heritage Resident', price: '$250 / Year' },
        'joinLegacyFounder': { title: 'Legacy Founder', price: '$1,500 / Year' }
    };

    // Open Modal
    Object.keys(tiers).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                titleEl.textContent = tiers[id].title;
                priceEl.textContent = tiers[id].price;
                
                // Reset form state
                form.style.display = 'flex';
                successMsg.style.display = 'none';
                form.reset();
                if(btnText) btnText.style.display = 'inline-block';
                if(btnSpinner) btnSpinner.style.display = 'none';
                submitBtn.disabled = false;
                
                modal.classList.add('active');
            });
        }
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(finishBtn) finishBtn.addEventListener('click', closeModal);
    
    // Close on click outside
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Handle Form Submit
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            submitBtn.disabled = true;
            if(btnText) btnText.style.display = 'none';
            if(btnSpinner) btnSpinner.style.display = 'inline-block';
            
            // Simulate API request delay
            setTimeout(() => {
                form.style.display = 'none';
                successMsg.style.display = 'block';
            }, 2000);
        });
    }

    // Format Card Number (adds spaces)
    const cardInput = document.getElementById('pmtCard');
    if(cardInput) {
        cardInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 0) {
                val = val.match(/.{1,4}/g).join(' ');
            }
            e.target.value = val;
        });
    }

    // Format Expiry Date (MM/YY)
    const expInput = document.getElementById('pmtExp');
    if(expInput) {
        expInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            e.target.value = val;
        });
    }
});
