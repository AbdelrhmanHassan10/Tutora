document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation and Sidebar Toggle (Royal Superstar Sync)
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

    // Dropdown Toggle for Mobile Menu
    const dropdownToggle = document.querySelector('.mobile-menu .dropdown-toggle');
    const dropdownItems = document.querySelector('.mobile-menu .dropdown-items');
    
    if (dropdownToggle && dropdownItems) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownToggle.classList.toggle('active');
            dropdownItems.classList.toggle('show');
            
            // Toggle icon
            const icon = dropdownToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = dropdownItems.classList.contains('show') ? 'expand_less' : 'expand_more';
            }
        });
    }

    // Close menu when clicking links
    if (mobileMenu) {
        mobileMenu.querySelectorAll('.menu-link, .dropdown-item').forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', closeMenu);
            }
        });
    }

    // 2. Button Interaction Feedback
    document.querySelectorAll('.gold-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Launching Lab...';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            }, 1000);
        });
    });

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
});

