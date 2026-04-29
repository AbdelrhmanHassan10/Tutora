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

    // --- Mobile Menu ---

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
    function initRoyalAtmosphere(color = '#f2b90d') {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        
        if (!dustContainer || !shapesContainer) return;

        // Clear existing
        dustContainer.innerHTML = '';
        shapesContainer.innerHTML = '';

        // Create 150 dust particles
        for (let i = 0; i < 150; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
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
            shape.style.color = color;
            shape.style.textShadow = `0 0 15px ${color}`;
            
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

    // ============================================
    // DYNAMIC IMAGE EFFECTS (3D Tilt & Parallax)
    // ============================================
    const imagePanel = document.querySelector('.artifact-image-panel');
    const artifactImg = document.querySelector('.artifact-image');

    if (imagePanel && artifactImg) {
        imagePanel.addEventListener('mousemove', (e) => {
            if (artifactImg.classList.contains('zoomed')) return; // Disable tilt when zoomed

            const rect = imagePanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 degrees
            const rotateY = ((x - centerX) / centerX) * 15;
            
            // Only apply tilt on desktop
            if (window.innerWidth > 768) {
                artifactImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                
                // Slight parallax for atmosphere
                const dust = document.getElementById('dust-container');
                if (dust) dust.style.transform = `translate(${rotateY * 0.5}px, ${rotateX * 0.5}px)`;
            }
        });

        imagePanel.addEventListener('mouseleave', () => {
            if (artifactImg.classList.contains('zoomed')) return;
            artifactImg.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            const dust = document.getElementById('dust-container');
            if (dust) dust.style.transform = `none`;
        });
    }

    // ============================================
    // ARTIFACT TOOLBAR ACTIONS
    // ============================================
    const btnRotate = document.getElementById('btnRotate');
    const btnZoom = document.getElementById('btnZoom');
    const btnExpand = document.getElementById('btnExpand');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const overlayImg = fullscreenOverlay ? fullscreenOverlay.querySelector('.overlay-img') : null;
    const overlayClose = fullscreenOverlay ? fullscreenOverlay.querySelector('.overlay-close') : null;

    let currentRotation = 0;

    if (btnRotate && artifactImg) {
        btnRotate.addEventListener('click', () => {
            currentRotation += 90;
            artifactImg.style.transform = `perspective(1000px) rotate(${currentRotation}deg)`;
        });
    }

    if (btnZoom && artifactImg) {
        btnZoom.addEventListener('click', () => {
            artifactImg.classList.toggle('zoomed');
            const icon = btnZoom.querySelector('.material-symbols-outlined');
            if (artifactImg.classList.contains('zoomed')) {
                icon.textContent = 'zoom_out';
            } else {
                icon.textContent = 'zoom_in';
                artifactImg.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            }
        });
    }

    if (btnExpand && artifactImg && fullscreenOverlay) {
        btnExpand.addEventListener('click', () => {
            overlayImg.src = artifactImg.src;
            fullscreenOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (overlayClose) {
        overlayClose.addEventListener('click', () => {
            fullscreenOverlay.classList.remove('active');
            document.body.style.overflow = 'hidden'; // Keep layout overflow hidden
        });
    }

    // ============================================
    // MOBILE SCROLL SYNC (Sticky & Rotate)
    // ============================================
    const artifactLayout = document.querySelector('.artifact-layout');
    if (artifactLayout) {
        artifactLayout.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) {
                const scrollPos = artifactLayout.scrollTop;
                const maxScroll = 300; // Point where image is fully shrunk
                const progress = Math.min(scrollPos / maxScroll, 1);
                
                // Shrink height
                const newHeight = 50 - (progress * 20); // From 50vh to 30vh
                if (imagePanel) imagePanel.style.height = `${newHeight}vh`;
                
                // Rotate based on scroll
                const scrollRotation = progress * 45; // Rotate up to 45 degrees
                if (artifactImg && !artifactImg.classList.contains('zoomed')) {
                    artifactImg.style.transform = `perspective(1000px) rotate(${currentRotation + scrollRotation}deg) scale(${1 - progress * 0.1})`;
                }

                // Fade toolbar
                const toolbar = document.querySelector('.artifact-toolbar');
                if (toolbar) toolbar.style.opacity = 1 - progress;
            }
        });
    }

    // Initialize the atmosphere
    window.initRoyalAtmosphere = initRoyalAtmosphere;
    initRoyalAtmosphere();
    });