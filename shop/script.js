document.addEventListener('DOMContentLoaded', () => {
    // Note: Theme, Avatar Sync, and Active Link Highlighting are handled by global-core.js

    // --- 1. MOBILE MENU & DROPDOWN LOGIC (EXACT SYNC WITH HOME) ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- Mobile Dropdowns ---
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems) {
                dropdownItems.classList.toggle('show');
                toggle.classList.toggle('active');
            }
        });
    });

    // --- Desktop Dropdown Fallback ---
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.opacity = '1';
        });
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.opacity = '0';
        });
    });

    // --- 2. ADVANCED FILTERING SYSTEM ---
    const pills = document.querySelectorAll('.pill');
    const products = document.querySelectorAll('.product-card');

    function filterProducts(category) {
        products.forEach(product => {
            product.style.opacity = '0';
            product.style.transform = 'scale(0.9) translateY(20px)';
            
            setTimeout(() => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    product.style.display = 'none';
                }
            }, 300);
        });
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const category = pill.dataset.category;
            filterProducts(category);
        });
    });

    // --- 3. LIVE SEARCH SYSTEM ---
    const shopSearch = document.getElementById('shopSearch');
    if (shopSearch) {
        shopSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            products.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                const category = product.querySelector('.product-cat').textContent.toLowerCase();
                
                if (name.includes(query) || category.includes(query)) {
                    product.style.display = 'block';
                    product.style.opacity = '1';
                } else {
                    product.style.display = 'none';
                    product.style.opacity = '0';
                }
            });
        });
    }

    // --- 4. CART & WISHLIST FEEDBACK ---
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Added';
            btn.style.background = '#28a745';
            btn.style.color = '#fff';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        });
    });

    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('.material-symbols-outlined');
            if (btn.classList.contains('active')) {
                icon.style.fontVariationSettings = "'FILL' 1";
                icon.style.color = "#ff4757";
            } else {
                icon.style.fontVariationSettings = "'FILL' 0";
                icon.style.color = "";
            }
        });
    });

    // --- 5. NEWSLETTER FEEDBACK ---
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = newsletterForm.querySelector('button');
            button.textContent = "Subscribed!";
            button.style.background = "#fff";
            button.style.color = "#000";
            button.disabled = true;
            newsletterForm.querySelector('input').value = "";
        });
    }
    // --- 6. ROYAL ATMOSPHERE (Standardized) ---
    function createDust() {
        const container = document.getElementById('dust-container');
        if (!container) return;
        const count = 50;
        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = `${size}px`;
            dust.style.height = `${size}px`;
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            dust.style.opacity = Math.random() * 0.5;
            dust.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            container.appendChild(dust);
        }
    }

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

    createDust();
    createShapes();
});