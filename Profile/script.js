// ============================================
// GEM DASHBOARD - OPTIMIZED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. THEME TOGGLE (DARK/LIGHT MODE)
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('gem-theme') || 'dark';
    if (savedTheme === 'light-mode') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('light-mode');
        updateThemeIcon(false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-mode');
            localStorage.setItem('gem-theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);

            // Rotation animation
            themeToggle.style.transition = 'transform 0.3s ease';
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    function updateThemeIcon(isLight) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = isLight ? 'dark_mode' : 'light_mode';
        }
    }

    // 2. MOBILE MENU (SIDEBAR TOGGLE)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileCloseBtn && sidebar) {
        mobileCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // 3. NAVIGATION ITEMS INTERACTION
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu after selection
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // 4. SEARCH FUNCTIONALITY
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            // Optional: Add filtering logic here
            if (query.length > 0) {
                searchInput.parentElement.style.boxShadow = '0 0 0 2px #f2b90d';
            } else {
                searchInput.parentElement.style.boxShadow = 'none';
            }
        });
    }

    // 5. WISHLIST BUTTONS
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('.material-symbols-outlined');
            const isLiked = this.classList.toggle('liked');

            if (icon) {
                icon.style.fontVariationSettings = isLiked ? "'FILL' 1" : "'FILL' 0";
                icon.style.color = isLiked ? '#FF6B6B' : 'inherit';
            }

            // Scale animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // 6. BUTTON RIPPLE EFFECT
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // 7. KEYBOARD SHORTCUTS
    document.addEventListener('keydown', (e) => {
        // Toggle theme with 'D'
        if ((e.key === 'd' || e.key === 'D') && e.target.tagName !== 'INPUT') {
            if (themeToggle) themeToggle.click();
        }
        // Focus search with 'S'
        if ((e.key === 's' || e.key === 'S') && e.target.tagName !== 'INPUT') {
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
});

// Add required styles for JS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .ripple-effect {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple {
        to { transform: scale(200); opacity: 0; }
    }
    .wishlist-btn.liked .material-symbols-outlined {
        font-variation-settings: 'FILL' 1 !important;
        color: #FF6B6B !important;
    }
`;
document.head.appendChild(styleSheet);