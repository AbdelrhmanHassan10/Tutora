document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // API INTEGRATION & CORE LOGIC
    // ============================================
    const BASE_URL = 'https://gem-backend-production.up.railway.app/api';

    // --- Helper function for API requests ---
    async function makeApiRequest(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token'); // Use the correct token key
        if (!token) {
            console.warn("Authentication token not found. Redirecting to login.");
            // Optional: Redirect to login page if no token is found
            // window.location.href = '/path/to/your/login.html';
            return;
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
            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return {}; // Handle No Content responses
            }
            return await response.json();
        } catch (error) {
            console.error(`API Request Error on ${endpoint}:`, error);
            alert(`API Error: ${error.message}`);
            throw error;
        }
    }

    // --- API Function Objects ---
    const api = {
        getMe: () => makeApiRequest('/auth/me'),
        getMyBookings: () => makeApiRequest('/bookings/my'),
        getMyFavorites: () => makeApiRequest('/favorites/my'),
        addFavorite: (artifactId) => makeApiRequest(`/favorites/${artifactId}`, 'POST'),
        removeFavorite: (artifactId) => makeApiRequest(`/favorites/${artifactId}`, 'DELETE')
    };

    // --- Functions to Update UI ---
    function updateProfileUI(user) {
        if (!user) return;
        document.querySelector('.profile-name').textContent = user.name || 'Explorer';
        document.querySelector('.user-avatar img').src = user.profilePicture || './unnamed.png';
        document.querySelector('.profile-image').src = user.profilePicture || './unnamed.png';

        if (user.createdAt) {
            const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
            document.querySelector('.join-date').textContent = `Joined ${joinDate}`;
        }
    }

    function updateBookingsUI(bookings) {
        const visitCard = document.querySelector('.visit-card');
        if (!bookings || bookings.length === 0) {
            visitCard.innerHTML = '<p>No upcoming visits found.</p>';
            return;
        }
        const latestBooking = bookings[0]; // Display the first booking
        const visitDate = new Date(latestBooking.date);

        document.querySelector('.visit-title').textContent = latestBooking.type || 'Museum Entry';
        document.querySelector('.detail-item .detail-value').textContent = visitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        document.querySelector('.detail-item:nth-child(2) .detail-value').textContent = visitDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        document.querySelector('.visitor-count').textContent = `+${latestBooking.quantity - 1}`;
    }

    function updateFavoritesUI(favorites) {
        const favoriteIds = new Set(favorites.map(fav => fav.artifactId));
        document.querySelectorAll('.artifact-card').forEach(card => {
            const artifactId = card.dataset.artifactId; // Assumes you add data-artifact-id to your HTML
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (favoriteIds.has(artifactId)) {
                wishlistBtn.classList.add('liked');
                const icon = wishlistBtn.querySelector('.material-symbols-outlined');
                icon.style.fontVariationSettings = "'FILL' 1";
                icon.style.color = '#FF6B6B';
            }
        });
    }

    // --- Initial Data Fetching ---
    async function loadDashboardData() {
        try {
            const [user, bookings, favorites] = await Promise.all([
                api.getMe(),
                api.getMyBookings(),
                api.getMyFavorites()
            ]);

            if (user) updateProfileUI(user.data);
            if (bookings) updateBookingsUI(bookings.data);
            if (favorites) updateFavoritesUI(favorites.data);

        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
    }

    loadDashboardData();


    // ============================================
    // ORIGINAL SCRIPT (UI & INTERACTIONS)
    // ============================================

    // 1. THEME TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('gem-theme') || 'dark';
    body.classList.toggle('light-mode', savedTheme === 'light');

    function updateThemeIcon(isLight) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = isLight ? 'dark_mode' : 'light_mode';
    }
    updateThemeIcon(body.classList.contains('light-mode'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-mode');
            localStorage.setItem('gem-theme', isLight ? 'light' : 'dark');
            updateThemeIcon(isLight);
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => { themeToggle.style.transform = 'rotate(0deg)'; }, 300);
        });
    }

    // 2. MOBILE MENU
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (mobileCloseBtn && sidebar) {
        mobileCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 3. WISHLIST BUTTONS (WITH API INTEGRATION)
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const card = this.closest('.artifact-card');
            const artifactId = card.dataset.artifactId;
            if (!artifactId) {
                console.error("Artifact ID not found on card.");
                return;
            }

            const isLiked = this.classList.toggle('liked');
            const icon = this.querySelector('.material-symbols-outlined');

            try {
                if (isLiked) {
                    await api.addFavorite(artifactId);
                    icon.style.fontVariationSettings = "'FILL' 1";
                    icon.style.color = '#FF6B6B';
                } else {
                    await api.removeFavorite(artifactId);
                    icon.style.fontVariationSettings = "'FILL' 0";
                    icon.style.color = 'inherit';
                }
            } catch (error) {
                // Revert UI on failure
                this.classList.toggle('liked');
                console.error(`Failed to update favorite status for artifact ${artifactId}:`, error);
            }
        });
    });

    // Add a temporary way to assign artifact IDs for the demo
    // In a real app, these would come from the server when rendering the cards
    const artifactCards = document.querySelectorAll('.carousel-section .artifact-card');
    const demoArtifactIds = [
        "60d5ec49a3d3a40015f4b3c1", // Tutankhamun's Mask
        "60d5ec49a3d3a40015f4b3c2", // Rosetta Stone
        "60d5ec49a3d3a40015f4b3c3", // Bust of Nefertiti
        "60d5ec49a3d3a40015f4b3c4", // The Great Sphinx
        "60d5ec49a3d3a40015f4b3c5", // Golden Canopic Jars
        "60d5ec49a3d3a40015f4b3c2" // Rosetta Stone (duplicate for demo)
    ];
    artifactCards.forEach((card, index) => {
        if (demoArtifactIds[index]) {
            card.dataset.artifactId = demoArtifactIds[index];
        }
    });
});

// Add required styles for JS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .ripple-effect { position: absolute; width: 2px; height: 2px; background: rgba(255, 255, 255, 0.4); border-radius: 50%; transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
    @keyframes ripple { to { transform: scale(200); opacity: 0; } }
    .wishlist-btn.liked .material-symbols-outlined { font-variation-settings: 'FILL' 1 !important; color: #FF6B6B !important; }
`;
document.head.appendChild(styleSheet);