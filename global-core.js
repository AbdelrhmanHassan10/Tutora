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
                    
                    // Update Avatar
                    const avatar = user.profileImage || user.profilePicture || localStorage.getItem('currentAvatar');
                    if (avatar) {
                        localStorage.setItem('currentAvatar', avatar);
                        if (window.syncGlobalAvatar) window.syncGlobalAvatar();
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
});
