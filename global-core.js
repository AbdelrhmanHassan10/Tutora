// ============================================
// GLOBAL CORE SCRIPT - TUTORA
// ============================================

const API_BASE_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
// Fallback if direct fails (CORS): 'https://cors-anywhere.herokuapp.com/https://gem-backend-production-1ea2.up.railway.app/api'

document.addEventListener('DOMContentLoaded', () => {

    // 1. GLOBAL AUTHENTICATION CHECK
    window.initializeAuth = async function() {
        const token = localStorage.getItem('token');
        const profileImg = document.querySelector('.profile-img, .profile-image, .nav-profile-image, .user-avatar img');
        const langBtn = document.getElementById('langBtn') || document.getElementById('menuLangBtn');
        const favBtn = document.querySelector('a[href*="fav"], a[href*="favourite"], .icon-btn-favorite, .menu-icon-link-favorite') || 
                       Array.from(document.querySelectorAll('.icon-btn, .menu-icon-link')).find(el => el.textContent.includes('favorite'));
        const bookingBtn = document.querySelector('.btn-booking, .menu-booking-btn');

        if (token) {
            if (profileImg) profileImg.style.display = 'block';
            if (favBtn) favBtn.style.display = 'flex';
            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const user = data.user || data;
                    
                    // Update Avatar with user-specific logic
                    let avatar = user.profileImage || user.profilePicture;
                    
                    // Check user-specific local storage if backend is empty
                    if (!avatar) {
                        const localData = localStorage.getItem(`localProfileData_${user.email}`);
                        if (localData) {
                            try {
                                const parsed = JSON.parse(localData);
                                avatar = parsed.profileImage || parsed.profilePicture;
                            } catch(e) {}
                        }
                    }

                    if (avatar) {
                        localStorage.setItem('currentAvatar', avatar);
                        window.syncGlobalAvatar();
                    }
                } else if (response.status === 401) {
                    handleLogout();
                }
            } catch (err) {
                console.warn("Auth verify failed (network/CORS), keeping optimistic state:", err);
            }
        } else {
            // Logged Out State
            if (profileImg) profileImg.style.display = 'none';
            if (favBtn) favBtn.style.display = 'none';

            // Change Lang button to Login (only if language system is NOT active)
            if (langBtn && !window.TutoraLang) {
                langBtn.innerHTML = `<span class="material-symbols-outlined" style="color: white;">login</span>`;
                langBtn.title = "Login";
                langBtn.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = '../2.login/code.html';
                };
            }
        }
    };

    window.handleLogout = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentAvatar');
        // Clear all profile images immediately for visual feedback
        const profileImages = document.querySelectorAll('.profile-img, .profile-image, .user-avatar img, .nav-profile-image, img[alt="Profile"], img[alt="User Profile"]');
        profileImages.forEach(img => {
            img.src = '../Profile/profile-placeholder.svg'; // Or any general placeholder
        });
        window.location.href = '../2.login/code.html';
    };

    // Run Auth Init
    window.initializeAuth();

    // 2. GLOBAL AVATAR SYNC
    window.syncGlobalAvatar = function() {
        const currentAvatar = localStorage.getItem('currentAvatar');
        if (currentAvatar) {
            const profileImages = document.querySelectorAll('.profile-img, .profile-image, .user-avatar img, .nav-profile-image, img[alt="Profile"], img[alt="User Profile"]');
            profileImages.forEach(img => {
                img.src = currentAvatar;
            });
        }
    };

    // Run on initial load
    window.syncGlobalAvatar();

    // 3. GLOBAL THEME MANAGEMENT
    window.applyTheme = function(themeName) {
        // If a specific theme is passed, save it first
        if (themeName) {
            localStorage.setItem('theme', themeName);
        }

        const savedTheme = localStorage.getItem('theme') || 'dark';
        const body = document.body;
        const themeBtns = document.querySelectorAll('#themeBtn, #themeToggle, #themeTwo, #theme-toggle, .theme-toggle, .theme-btn');
        
        body.classList.remove('light', 'dark', 'light-mode', 'dark-mode');
        
        if (savedTheme === 'light') {
            body.classList.add('light');
            themeBtns.forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'dark_mode';
            });
        } else {
            body.classList.add('dark');
            themeBtns.forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'light_mode';
            });
        }

        // Custom Event for other components (like Settings page) to react
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: savedTheme } }));
    };

    window.toggleTheme = function() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        window.applyTheme(newTheme);
    };

    // Run Theme Init
    window.applyTheme();

    // Attach to existing and potentially dynamically added buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#themeBtn, #themeToggle, #themeTwo, #theme-toggle, .theme-toggle, .theme-btn');
        if (btn) {
            e.preventDefault();
            window.toggleTheme();
        }
    });

    // 4. ACTIVE PAGE NAV HIGHLIGHT
    const activePath = window.location.pathname.toLowerCase().replace(/\/$/, '').split('/').pop();
    const navLinks = document.querySelectorAll('.desktop-nav a, .menu-nav a, .dropdown-link, .dropdown-item');
    
    navLinks.forEach(link => {
        const linkPath = link.pathname.toLowerCase().replace(/\/$/, '').split('/').pop();
        if (linkPath === activePath && linkPath !== '') {
            link.style.setProperty('color', '#ECB613', 'important');
            link.style.setProperty('font-weight', '900', 'important');
            
            if(link.closest('.desktop-nav')) {
                link.style.borderBottom = '2px solid #ECB613';
                link.style.paddingBottom = '4px';
            }
        }
    });

    // 5. GLOBAL NAVIGATION HANDLERS (MOBILE MENU & DROPDOWNS)
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    if (menuBtn && mobileMenu && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Global Dropdown Toggles (Mobile)
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('.dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
                toggle.classList.toggle('active');
                dropdownItems.classList.toggle('show');
            }
        }
    });

    // 6. GLOBAL LOADER INJECTION & TRANSITIONS
    const initGlobalLoader = () => {
        // Find base path relative to this script
        const scripts = document.getElementsByTagName('script');
        let basePath = '';
        for (let s of scripts) {
            if (s.src.includes('global-core.js')) {
                basePath = s.src.replace('global-core.js', '');
                break;
            }
        }

        // 1. Inject Loader CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = basePath + 'global-loader.css';
        document.head.appendChild(link);

        // 2. Inject Loader HTML
        const loaderHTML = `
            <div id="global-loader">
                <div class="loader-starfield"></div>
                <div class="loader-sparkle"></div>
                <div class="loader-logo-wrapper">
                    <div class="loader-glow"></div>
                    <div class="loader-logo-frame" style="width: 160px; height: 160px; overflow: hidden; border-radius: 50%; opacity: 0; transform: scale(0.8); transition: all 0.6s var(--ease-premium);">
                        <img id="loader-logo-img" src="${basePath}logo.png" alt="Tutora Logo" style="width: 100%; height: 100%; object-fit: cover; opacity: 0;">
                    </div>
                </div>
                <h1 class="loader-title">Tutora</h1>
                <div class="loader-subtitle-wrapper">
                    <div class="loader-line"></div>
                    <p class="loader-subtitle">Celestial Alignments</p>
                    <div class="loader-line rev"></div>
                </div>
                <div class="loader-progress-container">
                    <p class="loader-status-text">Aligning the heavens...</p>
                    <div class="loader-progress-bar">
                        <div class="loader-progress-fill" id="loader-fill"></div>
                    </div>
                    <div class="percentage-box" id="loader-percentage">0%</div>
                </div>
                <!-- Ambient Bottom Gradient -->
                <div class="loader-bottom-gradient"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);

        const loader = document.getElementById('global-loader');
        const fill = document.getElementById('loader-fill');
        const percentageText = document.getElementById('loader-percentage');
        const logoFrame = loader.querySelector('.loader-logo-frame');
        const logoImg = document.getElementById('loader-logo-img');

        // Professional Image Entrance
        if (logoImg) {
            logoImg.onload = () => {
                if (logoFrame) {
                    logoFrame.style.opacity = '1';
                    logoFrame.style.transform = 'scale(1)';
                }
                logoImg.style.opacity = '1';
            };
            // Fallback if cached (Safely execute if onload is a function)
            if (logoImg.complete && typeof logoImg.onload === 'function') {
                logoImg.onload();
            }
        }

        // 3. Smooth Snappy Progress Logic (Crash-proof & Mobile Optimized)
        let progress = 0;
        const isMobileDevice = window.innerWidth <= 768;
        const duration = isMobileDevice ? 500 : 1000; // 500ms on mobile, 1000ms on desktop
        const getTimestamp = () => (window.performance && window.performance.now) ? performance.now() : Date.now();
        const startTime = getTimestamp();

        const updateProgress = (currentTime) => {
            const now = currentTime || getTimestamp();
            const elapsed = now - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            
            if (fill) fill.style.width = progress + '%';
            if (percentageText) percentageText.textContent = Math.round(progress) + '%';
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            }
        };

        requestAnimationFrame(updateProgress);

        // 4. Snappy Transition-Out (Prevents locking on slow connections)
        const hideLoader = () => {
             const checkCompletion = setInterval(() => {
                const isReady = document.readyState === 'complete' || document.readyState === 'interactive';
                if (progress >= 100 && isReady) {
                    clearInterval(checkCompletion);
                    setTimeout(() => {
                        if (loader) {
                            loader.classList.add('hidden');
                        }
                    }, 80); // Snap close
                }
            }, 30);
        };

        // Bind loader dismissal immediately to DOMContentLoaded and window load
        window.addEventListener('load', hideLoader);
        document.addEventListener('DOMContentLoaded', hideLoader);
        
        // Optimistically dismiss if DOM is already parsed/interactive/complete
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            hideLoader();
        }

        // 5. Show loader on link clicks (Internal only)
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            
            // Ignore hashes, JS calls, external links, and target blank
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || anchor.target === '_blank') return;
            
            // Only internal links
            const isInternal = href.startsWith('.') || href.startsWith('/') || !href.includes('://');
            
            if (isInternal) {
                const url = new URL(anchor.href);
                if (url.pathname === window.location.pathname && url.hash) return;

                e.preventDefault();
                if (loader) {
                    progress = 0; 
                    if(fill) fill.style.width = '0%';
                    if(percentageText) percentageText.textContent = '0%';
                    loader.classList.remove('hidden');
                }
                
                const transitionDelay = isMobileDevice ? 250 : 500;
                setTimeout(() => {
                    window.location.href = anchor.href;
                }, transitionDelay); 
            }
        });

        // 6. Fix for back/forward transitions
        window.addEventListener('pageshow', (event) => {
            if (event.persisted && loader) {
                loader.classList.add('hidden');
            }
        });
    };

    initGlobalLoader();

    // 7. GLOBAL PREMIUM TOAST SYSTEM
    window.showPremiumToast = function(message, type = 'success') {
        // Remove existing to avoid stacking overlaps if preferred, 
        // or just let them stack if CSS allows. Here we replace for clarity.
        const existing = document.querySelector('.premium-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${icon}</span>
            <div class="toast-content">
                <span class="toast-msg">${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show-toast');

        // Auto-remove
        setTimeout(() => {
            toast.classList.remove('show-toast');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    // 8. GLOBAL ROYAL ATMOSPHERE (Optimized Dust & Shapes)
    window.initRoyalAtmosphere = function() {
        let dustContainer = document.getElementById('dust-container');
        if (!dustContainer) {
            dustContainer = document.createElement('div');
            dustContainer.id = 'dust-container';
            dustContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998; overflow: hidden;';
            document.body.appendChild(dustContainer);
        }

        let shapesContainer = document.getElementById('shapes-container');
        if (!shapesContainer) {
            shapesContainer = document.createElement('div');
            shapesContainer.id = 'shapes-container';
            shapesContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998; overflow: hidden;';
            document.body.appendChild(shapesContainer);
        }

        const isMobile = window.innerWidth <= 768;
        const path = window.location.pathname;
        
        // Density Configuration - Optimized for smooth scrolling on mobile
        let dustCount = isMobile ? 20 : 150;
        let shapeCount = isMobile ? 3 : 12;
        let shape3DCount = isMobile ? 0 : 2;

        const isAuthPage = path.includes('/2.login/') || path.includes('/3.register/');
        if (isAuthPage) {
            dustCount = 40; 
            shapeCount = 5;
            shape3DCount = 1;
        }

        // 4. Generate Royal Dust (Visible, Small, No Blur for Performance)
        for (let i = 0; i < dustCount; i++) {
            const dust = document.createElement('div');
            const duration = Math.random() * 15 + 15;
            const delay = Math.random() * -20;
            const size = Math.random() * 1.5 + 1.5; // Size between 1.5px and 3px (lighter and smaller)
            
            dust.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: floatDust ${duration}s infinite linear;
                animation-delay: ${delay}s;
                position: absolute;
                background: rgba(236, 182, 19, 0.45); /* Lighter opacity to reduce visual heaviness */
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
            `;
            dustContainer.appendChild(dust);
        }

        // 5. Generate Ancient Archaeological Shapes (Hieroglyphs)
        const glyphs = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽', '𓇳', '𓈖', '𓋀', '𓁹', '𓂋', '𓆎', '𓎛'];
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
            const duration = Math.random() * 20 + 20;
            const delay = Math.random() * -30;
            
            shape.style.cssText = `
                left: ${Math.random() * 90}vw;
                top: ${Math.random() * 90}vh;
                animation: rotateFloat ${duration}s infinite ease-in-out;
                animation-delay: ${delay}s;
                position: absolute;
                color: rgba(236, 182, 19, 0.2);
                font-size: 3rem;
                font-family: 'Cinzel', serif;
                pointer-events: none;
                z-index: 9999;
            `;
            shapesContainer.appendChild(shape);
        }

        // 6. Generate 3D Shapes (Subtle Pyramids)
        const shape3DTypes = ['pyramid'];
        for (let i = 0; i < shape3DCount; i++) {
            const shapeWrapper = document.createElement('div');
            shapeWrapper.className = 'royal-shape-3d';
            
            const type = shape3DTypes[Math.floor(Math.random() * shape3DTypes.length)];
            shapeWrapper.classList.add(`shape-${type}`);
            
            const facesCount = type === 'pyramid' ? 4 : 6;
            for (let j = 0; j < facesCount; j++) {
                const face = document.createElement('div');
                face.className = 'face';
                shapeWrapper.appendChild(face);
            }

            shapeWrapper.style.cssText = `
                left: ${Math.random() * 90}vw;
                top: ${Math.random() * 90}vh;
                animation: rotateFloat3D ${Math.random() * 10 + 20}s infinite ease-in-out;
                animation-delay: ${Math.random() * -30}s;
                transform: scale(${Math.random() * 0.5 + 0.5});
            `;
            shapesContainer.appendChild(shapeWrapper);
        }
    };

    // Initialize Atmospheric Effects
    window.initRoyalAtmosphere();


    // ============================================
    // 9. CINEMATIC 3D PARALLAX
    // ============================================
    window.init3DParallax = function() {
        const heroes = document.querySelectorAll('.hero, .main-hero, .landing-hero, .scanner-hero, .guide-hero, .chatbot-container');
        
        heroes.forEach(hero => {
            const content = hero.querySelector('.hero-content, .chatbot-window, .scanner-box, .guide-content');
            if (!content) return;

            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                const isMobile = window.innerWidth <= 768;
                const range = isMobile ? 5 : 15;
                content.style.transform = `rotateY(${x * range}deg) rotateX(${y * -range}deg) translateZ(20px)`;
            });

            hero.addEventListener('mouseleave', () => {
                content.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
            });
        });
    };

    // ============================================
    // 10. SMOOTH EXPERIENCE ENGINE (Global Integration)
    // ============================================
    window.initSmoothExperience = function() {
        const isMobile = window.innerWidth <= 768;

        // Page Loaded Trigger
        setTimeout(() => document.body.classList.add('page-loaded'), 100);

        // Cursor Glow Creation & Movement
        if (!isMobile) {
            let cursorGlow = document.getElementById('cursorGlow');
            if (!cursorGlow) {
                cursorGlow = document.createElement('div');
                cursorGlow.id = 'cursorGlow';
                document.body.appendChild(cursorGlow);
            }
            window.addEventListener('mousemove', (e) => {
                cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            });
        }

        // Staggered Reveal Logic
        const observerOptions = {
            threshold: isMobile ? 0.05 : 0.1,
            rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -60px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const targets = [
            '.hero-content', '.section-title', '.card', '.stat-box', '.exhibition-card', 
            '.artifact-panel', '.amenity-card', '.info-section', '.event-card', 
            '.feature-item', '.curator-panel', '.membership-content', '.newsletter-content',
            '.tour-card', '.footer-column', '.museum-stat', '.form-card-3d'

        ];

        targets.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal-hidden');
                
                // Auto-staggering
                if (!isMobile) {
                    const parent = el.parentElement;
                    const siblings = Array.from(parent.children).filter(c => targets.some(t => targets.some(selector => c.matches(selector))));
                    const childIndex = siblings.indexOf(el);
                    if (childIndex >= 0 && childIndex < 6) {
                        el.classList.add(`reveal-delay-${childIndex}`);
                    }
                }

                revealObserver.observe(el);
            });
        });

        // Magnetic Interactions
        if (!isMobile) {
            document.querySelectorAll('.btn-primary, .btn-accent, .nav-item, .card, .booking-btn, .btn-learn').forEach(btn => {
                if (btn.classList.contains('social-btn')) return; // Explicitly skip social buttons
                btn.addEventListener('mousemove', (e) => {

                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const deltaX = (x - centerX) / 10;
                    const deltaY = (y - centerY) / 10;
                    btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.02)`;
                    btn.style.transition = 'none';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = `translate3d(0, 0, 0) scale(1)`;
                    btn.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                });
            });
        }
    };

    // ============================================
    // 11. GLOBAL CART SYSTEM
    // ============================================
    window.updateGlobalCartBadge = function() {
        const cartItems = JSON.parse(localStorage.getItem('tutora_cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-badge').forEach(badge => {
            if (totalItems > 0) {
                badge.style.display = 'flex';
                badge.textContent = totalItems > 99 ? '99+' : totalItems;
            } else {
                badge.style.display = 'none';
            }
        });
    };

    // Initialize All Global Modules
    window.init3DParallax();
    window.initSmoothExperience();
    window.updateGlobalCartBadge();
});


