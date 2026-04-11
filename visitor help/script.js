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
});