 document.addEventListener('DOMContentLoaded', () => {

     // --- 1. THEME MANAGEMENT (CORRECTED & UNIFIED) ---
     const themeToggle = document.getElementById('theme-toggle');
     const body = document.body;

     if (themeToggle) {
         const themeIcon = themeToggle.querySelector('.material-symbols-outlined');

         const applyTheme = (theme) => {
             // Use 'light' and 'dark' to match the new clean CSS
             body.classList.remove('dark', 'light');
             body.classList.add(theme);

             if (themeIcon) {
                 themeIcon.textContent = (theme === 'dark') ? 'light_mode' : 'dark_mode';
             }
             localStorage.setItem('gem-theme', theme);
         };

         const savedTheme = localStorage.getItem('gem-theme') || 'dark';
         applyTheme(savedTheme);

         themeToggle.addEventListener('click', () => {
             const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
             applyTheme(newTheme);
         });
     }

     // --- 2. MOBILE MENU FUNCTIONALITY (CORRECTED & UNIFIED) ---
     const menuBtn = document.getElementById('menuBtn');
     const closeBtn = document.getElementById('closeBtn');
     const mobileMenu = document.getElementById('mobileMenu');
     const menuOverlay = document.getElementById('menuOverlay');

     const openMenu = () => {
         if (mobileMenu && menuOverlay) {
             mobileMenu.classList.add('open'); // This now matches the CSS
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

     document.querySelectorAll('.menu-link').forEach(link => {
         link.addEventListener('click', closeMenu);
     });

     // --- (Add any other JS functionalities you need here) ---

     console.log("✅ All systems are running correctly!");
 });

 // ============================================
 // LANGUAGE TOGGLE
 // ============================================

 document.querySelectorAll('.language-toggle button').forEach(btn => {
     btn.addEventListener('click', () => {
         // Remove active from all buttons
         document.querySelectorAll('.language-toggle button').forEach(b => {
             b.classList.remove('active');
         });
         // Add active to clicked button
         btn.classList.add('active');
         const lang = btn.getAttribute('data-lang');
         localStorage.setItem('language', lang);
         console.log('Language changed to:', lang);
     });
 });

 // ============================================
 // SMOOTH SCROLL FOR NAVIGATION
 // ============================================

 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
         const href = this.getAttribute('href');
         if (href !== '#' && document.querySelector(href)) {
             e.preventDefault();
             const target = document.querySelector(href);
             target.scrollIntoView({
                 behavior: 'smooth',
                 block: 'start'
             });
         }
     });
 });

 // ============================================
 // BUTTON INTERACTIONS
 // ============================================

 // Learn More buttons
 document.querySelectorAll('.btn-learn').forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();
         console.log('Learn More clicked');
         // Add ripple effect
         addRipple(btn, e);
     });
 });

 // Action buttons
 document.querySelectorAll('.btn-action-gold, .btn-action-turquoise').forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();
         console.log('Action button clicked');
         addRipple(btn, e);
     });
 });

 // Primary and Accent buttons
 document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
     btn.addEventListener('click', (e) => {
         console.log('Button clicked:', btn.textContent);
         addRipple(btn, e);
     });
 });


 // ============================================
 // FILTER PILLS
 // ============================================

 const pills = document.querySelectorAll('.pill');

 pills.forEach(pill => {
     pill.addEventListener('click', () => {
         // Remove active class from all pills
         pills.forEach(p => p.classList.remove('active'));

         // Add active class to clicked pill
         pill.classList.add('active');

         const category = pill.textContent.trim();
         console.log('Filter by:', category);

         // Trigger animation
         pill.style.transform = 'scale(0.95)';
         setTimeout(() => {
             pill.style.transform = 'scale(1)';
         }, 100);
     });
 });

 // ============================================
 // ADD TO CART
 // ============================================

 const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
 let cartCount = 2; // Starting count

 addToCartBtns.forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();

         const productName = btn.closest('.product-card').querySelector('.product-name').textContent;
         console.log('Added to cart:', productName);

         // Update cart badge
         cartCount++;
         updateCartBadge();

         // Show feedback
         const originalText = btn.innerHTML;
         btn.innerHTML = '<span class="material-symbols-outlined">check</span> Added!';
         btn.style.backgroundColor = '#40E0D0';

         setTimeout(() => {
             btn.innerHTML = originalText;
             btn.style.backgroundColor = '#FFFFFF';
         }, 2000);

         // Pulse animation
         btn.style.transform = 'scale(0.95)';
         setTimeout(() => {
             btn.style.transform = 'scale(1)';
         }, 100);
     });
 });

 function updateCartBadge() {
     const badge = document.querySelector('.cart-badge');
     if (badge) {
         badge.textContent = cartCount;
         badge.style.animation = 'pulse 0.5s ease-out';
         setTimeout(() => {
             badge.style.animation = '';
         }, 500);
     }
 }

 // ============================================
 // WISHLIST BUTTONS
 // ============================================

 const wishlistBtns = document.querySelectorAll('.wishlist-btn');

 wishlistBtns.forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();

         const productName = btn.closest('.product-card').querySelector('.product-name').textContent;
         const isLiked = btn.classList.toggle('liked');

         console.log(isLiked ? 'Added to wishlist:' : 'Removed from wishlist:', productName);

         // Change color
         if (isLiked) {
             btn.style.color = '#FF6B6B';
         } else {
             btn.style.color = '#FFFFFF';
         }

         // Scale animation
         btn.style.transform = 'scale(0.9)';
         setTimeout(() => {
             btn.style.transform = 'scale(1)';
         }, 150);
     });
 });

 // ============================================
 // SEARCH FUNCTIONALITY
 // ============================================

 const searchInput = document.querySelector('.search-input');

 if (searchInput) {
     searchInput.addEventListener('input', (e) => {
         const query = e.target.value.toLowerCase();
         console.log('Searching for:', query);

         // Add visual feedback
         if (query.length > 0) {
             searchInput.style.boxShadow = '0 0 0 2px #D4AF37';
         } else {
             searchInput.style.boxShadow = 'none';
         }
     });

     searchInput.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') {
             console.log('Search submitted:', searchInput.value);
             // Trigger search animation
             searchInput.style.transform = 'scale(0.98)';
             setTimeout(() => {
                 searchInput.style.transform = 'scale(1)';
             }, 100);
         }
     });
 }

 // ============================================
 // ICON BUTTONS
 // ============================================

 const iconBtns = document.querySelectorAll('.icon-btn:not(.cart-btn)');

 iconBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         console.log('Icon button clicked');

         // Pulse animation
         btn.style.animation = 'pulse 0.5s ease-out';
         setTimeout(() => {
             btn.style.animation = '';
         }, 500);
     });
 });

 // ============================================
 // CART BUTTON
 // ============================================

 const cartBtn = document.querySelector('.cart-btn');

 if (cartBtn) {
     cartBtn.addEventListener('click', () => {
         console.log('Cart clicked, items:', cartCount);

         // Scale animation
         cartBtn.style.transform = 'scale(0.9)';
         setTimeout(() => {
             cartBtn.style.transform = 'scale(1)';
         }, 150);
     });
 }

 // ============================================
 // HERO SECTION INTERACTIONS
 // ============================================

 const heroSection = document.querySelector('.hero-section');
 const shopBtn = document.querySelector('.btn-primary');

 if (shopBtn) {
     shopBtn.addEventListener('click', () => {
         console.log('Shop the Collection clicked');

         // Scale animation
         shopBtn.style.transform = 'scale(0.95)';
         setTimeout(() => {
             shopBtn.style.transform = 'scale(1)';
         }, 100);
     });
 }

 // ============================================
 // PRODUCT CARD INTERACTIONS
 // ============================================

 const productCards = document.querySelectorAll('.product-card');

 productCards.forEach(card => {
     card.addEventListener('mouseenter', () => {
         card.style.transform = 'translateY(-4px)';
     });

     card.addEventListener('mouseleave', () => {
         card.style.transform = 'translateY(0)';
     });
 });

 // ============================================
 // KEYBOARD SHORTCUTS
 // ============================================

 document.addEventListener('keydown', (e) => {
     // Press 'D' to toggle dark mode
     if (e.key === 'd' || e.key === 'D') {
         body.classList.toggle('light-mode');
         const isLight = body.classList.contains('light-mode');
         localStorage.setItem('theme', isLight ? 'light' : 'dark');
         updateThemeIcon();
     }

     // Press 'S' to focus search
     if ((e.key === 's' || e.key === 'S') && searchInput) {
         e.preventDefault();
         searchInput.focus();
         searchInput.style.boxShadow = '0 0 0 2px #D4AF37';
     }

     // Press 'C' to open cart
     if (e.key === 'c' || e.key === 'C') {
         cartBtn.click();
     }
 });

 // ============================================
 // ANIMATIONS
 // ============================================

 const style = document.createElement('style');
 style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
    }

    .pill {
        transition: all 0.3s ease;
    }

    .pill:active {
        transform: scale(0.95);
    }

    .add-to-cart-btn {
        transition: all 0.3s ease;
    }

    .add-to-cart-btn:active {
        transform: scale(0.95);
    }

    .wishlist-btn {
        transition: all 0.3s ease;
    }

    .wishlist-btn:active {
        transform: scale(0.9);
    }

    .icon-btn {
        transition: all 0.3s ease;
    }

    .icon-btn:active {
        transform: scale(0.9);
    }

    .product-card {
        transition: all 0.3s ease;
    }

    .btn-primary {
        transition: all 0.3s ease;
    }

    .btn-primary:active {
        transform: scale(0.95);
    }

    .search-input {
        transition: all 0.3s ease;
    }

    .theme-toggle {
        transition: all 0.3s ease;
    }
`;
 document.head.appendChild(style);

 // ============================================
 // SCROLL ANIMATIONS
 // ============================================

 window.addEventListener('scroll', () => {
     const navbar = document.querySelector('.navbar');
     const scrollY = window.scrollY;

     if (scrollY > 50) {
         navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
     } else {
         navbar.style.boxShadow = 'none';
     }
 });

 // ============================================
 // INTERSECTION OBSERVER FOR ANIMATIONS
 // ============================================

 const observerOptions = {
     threshold: 0.1,
     rootMargin: '0px 0px -50px 0px'
 };

 const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
             observer.unobserve(entry.target);
         }
     });
 }, observerOptions);

 productCards.forEach(card => {
     observer.observe(card);
 });

 // ============================================
 // PAGE LOAD ANIMATION
 // ============================================

 window.addEventListener('load', () => {
     console.log('✓ Shop page loaded successfully');
     console.log('🌙 Dark mode available - press D or click theme toggle');
     console.log('🔍 Press S to focus search');
     console.log('🛒 Press C to open cart');

     // Fade in animation
     body.style.animation = 'fadeIn 0.6s ease-out';
 });

 // ============================================
 // RESPONSIVE ADJUSTMENTS
 // ============================================

 function handleResize() {
     const width = window.innerWidth;
     console.log('Window width:', width);
 }

 window.addEventListener('resize', handleResize);

 // ============================================
 // DYNAMIC PRODUCT LOADING
 // ============================================

 function loadMoreProducts() {
     console.log('Loading more products...');
     // Simulate loading more products
 }

 // ============================================
 // FILTER PRODUCTS
 // ============================================

 function filterProducts(category) {
     const products = document.querySelectorAll('.product-card');

     products.forEach(product => {
         // Simple filter logic
         product.style.opacity = '1';
         product.style.display = 'block';
     });

     console.log('Filtered by:', category);
 }

 // ============================================
 // SORT PRODUCTS
 // ============================================

 function sortProducts(sortBy) {
     console.log('Sorting by:', sortBy);

     const products = Array.from(document.querySelectorAll('.product-card'));

     if (sortBy === 'price-low') {
         products.sort((a, b) => {
             const priceA = parseFloat(a.querySelector('.product-price').textContent);
             const priceB = parseFloat(b.querySelector('.product-price').textContent);
             return priceA - priceB;
         });
     } else if (sortBy === 'price-high') {
         products.sort((a, b) => {
             const priceA = parseFloat(a.querySelector('.product-price').textContent);
             const priceB = parseFloat(b.querySelector('.product-price').textContent);
             return priceB - priceA;
         });
     }
 }

 // ============================================
 // INITIALIZATION
 // ============================================

 document.addEventListener('DOMContentLoaded', () => {
     console.log('✓ All scripts initialized');

     // Add smooth transitions to all elements
     document.querySelectorAll('*').forEach(el => {
         el.style.transition = 'all 0.3s ease';
     });
 });

 // ============================================
 // PERFORMANCE MONITORING
 // ============================================

 if (window.performance) {
     window.addEventListener('load', () => {
         const perfData = window.performance.timing;
         const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
         console.log('Page load time:', pageLoadTime + 'ms');
     });
 }