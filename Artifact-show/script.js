document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';

    // ============================================
    // 1. API & AUTHENTICATION LOGIC (NEW )
    // ============================================

    const token = localStorage.getItem('token');

    // --- Helper function for API requests ---
    async function makeApiRequest(endpoint, method = 'GET', body = null) {
        if (!token) {
            console.warn("Authentication token not found.");
            return null; // Return null if no token
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const config = { method, headers };
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            if (!response.ok) {
                // If token is invalid, log out the user
                if (response.status === 401) {
                    handleLogout();
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return {};
            }
            return await response.json();
        } catch (error) {
            console.error(`API Request Error on ${endpoint}:`, error);
            return null; // Return null on error
        }
    }

    // --- UI Update Functions ---
    function updateUIForLoggedInUser(user) {
        // Hide/Show buttons


        // Update profile image
        const profileImg = document.querySelector('.profile-img');
        if (user && user.data && user.data.profilePicture) {
            profileImg.src = user.data.profilePicture;
        }
    }

    function updateUIForLoggedOutUser() {
        // Hide/Show buttons
        document.querySelector('.btn-booking').style.display = 'block'; // Show booking
        document.querySelector('#langBtn').style.display = 'block'; // Show language/login button

        document.querySelector('.header-right a[href="../fav/favourite.html"]').style.display = 'none'; // Hide favorite
        document.querySelector('.profile-img').style.display = 'none'; // Hide profile image

        // Change language button to a "Login" button
        const loginBtn = document.getElementById('langBtn');
        loginBtn.innerHTML = `<span class="material-symbols-outlined" style="color: white;">login</span>`;
        loginBtn.onclick = () => {
            window.location.href = '../2.login/code.html'; // Redirect to your login page
        };
    }

    // --- Logout Function ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Also clear any cached user data
        window.location.href = '../2.login/code.html'; // Redirect to login page
    };


    // --- Initialization ---
    async function initializePage() {
        if (token) {
            const user = await makeApiRequest('/auth/me');
            if (user) {
                updateUIForLoggedInUser(user);
            } else {
                // This case handles an invalid/expired token
                updateUIForLoggedOutUser();
            }
        } else {
            updateUIForLoggedOutUser();
        }
    }

    initializePage();


    // ============================================
    // 2. ORIGINAL UI SCRIPT (PRESERVED)
    // ============================================

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;

    function updateThemeIcon() {
        if (themeBtn) {
            const icon = themeBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = body.classList.contains('dark-mode') ? 'light_mode' : 'dark_mode';
            }
        }
    }

    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if nothing is saved
    body.classList.toggle('dark-mode', savedTheme !== 'light');
    updateThemeIcon();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
    };
    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- Dropdown Menus ---
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems) {
                dropdownItems.classList.toggle('show');
            }
        });
    });

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

    // Initialize the atmosphere
    initRoyalAtmosphere();
    });