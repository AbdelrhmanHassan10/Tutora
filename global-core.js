// ============================================
// GLOBAL CORE SCRIPT - TUTORA
// ============================================

const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
// Fallback if direct fails (CORS): 'https://cors-anywhere.herokuapp.com/https://gem-backend-production-cb6d.up.railway.app/api'

document.addEventListener('DOMContentLoaded', () => {

    // 1. GLOBAL AUTHENTICATION CHECK
    window.initializeAuth = async function() {
        const token = localStorage.getItem('token');
        const profileImg = document.querySelector('.profile-img, .profile-image, .nav-profile-image, .user-avatar img');
        const langBtn = document.getElementById('langBtn') || document.getElementById('menuLangBtn');
        const favBtn = document.querySelector('.icon-btn:has(.material-symbols-outlined:contains("favorite")), .menu-icon-link:has(.material-symbols-outlined:contains("favorite"))') || document.querySelector('a[href*="fav"]');
        const bookingBtn = document.querySelector('.btn-booking, .menu-booking-btn');

        if (token) {
            // Initially show profile if token exists (optimistic)
            if (profileImg) profileImg.style.display = 'block';
            if (favBtn) favBtn.style.display = 'flex';
            
            // If langBtn was a login button, we should hide it or restore its original state
            // But we don't know its original state easily. So we just ensure it's NOT the login icon.

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

            // Change Lang button to Login
            if (langBtn) {
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
    window.applyTheme = function() {
        const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
        const body = document.body;
        const themeBtns = document.querySelectorAll('#themeBtn, #themeToggle, #themeTwo, #theme-toggle, .theme-toggle, .theme-btn');
        
        // Clean up all possible theme classes first
        body.classList.remove('light', 'dark', 'light-mode', 'dark-mode');
        
        if (savedTheme === 'light') {
            body.classList.add('light');
            
            themeBtns.forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'dark_mode';
                    icon.style.color = ''; // Remove hardcoded colors to allow CSS control
                }
            });
        } else {
            body.classList.add('dark');
            
            themeBtns.forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'light_mode';
                    icon.style.color = ''; // Remove hardcoded colors to allow CSS control
                }
            });
        }
    };

    window.toggleTheme = function() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        window.applyTheme();
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
            // Fallback if cached
            if (logoImg.complete) logoImg.onload();
        }

        // 3. Smooth 1-second Progress Logic
        let progress = 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();

        const updateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            
            if (fill) fill.style.width = progress + '%';
            if (percentageText) percentageText.textContent = Math.round(progress) + '%';
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            }
        };

        requestAnimationFrame(updateProgress);

        // 4. Professional Transition-Out
        const hideLoader = () => {
             const checkCompletion = setInterval(() => {
                if (progress >= 100 && (document.readyState === 'complete' || document.readyState === 'interactive')) {
                    clearInterval(checkCompletion);
                    setTimeout(() => {
                        if (loader) {
                            loader.classList.add('hidden');
                        }
                    }, 100); 
                }
            }, 50);
        };

        window.addEventListener('load', hideLoader);
        if (document.readyState === 'complete') hideLoader();

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
                
                setTimeout(() => {
                    window.location.href = anchor.href;
                }, 500); 
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
});
