document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SEARCH & CATEGORY FILTERING ---
    const searchInput = document.getElementById('faq-search');
    const tabs = document.querySelectorAll('.tab');
    const faqItems = document.querySelectorAll('.faq-item');

    const filterFAQs = () => {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const activeTab = document.querySelector('.tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

        faqItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);
            const matchesSearch = item.innerText.toLowerCase().includes(term);

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
                // Add a small stagger animation
                item.style.animation = 'fadeIn 0.3s ease-out forwards';
            } else {
                item.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterFAQs);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterFAQs();
        });
    });

    // --- 2. MOBILE MENU ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeMenu = () => {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- 3. MOBILE DROPDOWN ---
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.menu-dropdown');
            const items = dropdown.querySelector('.dropdown-items');
            btn.classList.toggle('active');
            items.classList.toggle('show');
        });
    });

    // --- 4. ACCORDION AUTO-CLOSE (Optional Premium Feeling) ---
    const details = document.querySelectorAll('.faq-item details');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                details.forEach(other => {
                    if (other !== detail && other.open) other.open = false;
                });
            }
        });
    });
    // --- 5. ROYAL ATMOSPHERE (Standardized - Local) ---
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