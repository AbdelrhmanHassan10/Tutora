// Immediately-invoked function to set the theme before DOM loads.
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark', savedTheme === 'dark');
})();

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const artifactGrid = document.querySelector('.saved-section .artifact-grid');
    const welcomeTitle = document.querySelector('.dashboard-header .title');

    // ============================================
    // 1. API & DATA HANDLING (The Core Logic)
    // ============================================

    // --- API Helper Function ---
    async function makeApiRequest(endpoint, method = 'GET') {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification("Authentication session has expired. Please log in again.", 'error');
            // Redirect to login page after a short delay
            setTimeout(() => { window.location.href = '../2.login/code.html'; }, 2000);
            return null;
        }

        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const config = { method, headers };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return { success: true };
            }
            return await response.json();
        } catch (error) {
            console.error(`API Request Failed: ${method} ${endpoint}`, error);
            showNotification(error.message, 'error');
            throw error;
        }
    }

    // --- API Methods Object ---
    const api = {
        getMe: () => makeApiRequest('/auth/me'),
        getMyFavorites: () => makeApiRequest('/favorites/my'),
        removeFavorite: (id) => makeApiRequest(`/favorites/${id}`, 'DELETE'),
    };

    // ============================================
    // 2. UI RENDERING
    // ============================================

    // --- Function to create a single favorite card ---
    function createFavoriteCard(favoriteItem) {
        const artifact = favoriteItem.artifact;
        if (!artifact) return ''; // Safety check

        return `
            <div class="artifact-card" data-id="${artifact.id}">
                <div class="card-bg" style="background-image: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%), url('${artifact.imageUrl || './unnamed (1).png'}');">
                    <button class="btn-fav-active" title="Remove from favorites">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">favorite</span>
                    </button>
                    <div>
                        <span class="card-dynasty">${artifact.dynasty || 'Unknown Dynasty'}</span>
                        <h3 class="card-title">${artifact.name}</h3>
                        <h5 style="color: gray;">${artifact.material || 'Various Materials'}</h5>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Function to render all favorite cards into the grid ---
    function renderFavorites(favorites) {
        if (!artifactGrid) return;
        if (!favorites || favorites.length === 0) {
            artifactGrid.innerHTML = '<p class="empty-message">Your collection is empty. Go to the Collection page to add some treasures!</p>';
            return;
        }
        artifactGrid.innerHTML = favorites.map(createFavoriteCard).join('');
        attachCardEventListeners();
    }

    // ============================================
    // 3. EVENT LISTENERS
    // ============================================

    // --- Attaches click listeners to the favorite buttons ---
    function attachCardEventListeners() {
        document.querySelectorAll('.btn-fav-active').forEach(btn => {
            btn.addEventListener('click', handleRemoveFavorite);
        });
    }

    // --- Handler for removing an item from favorites ---
    async function handleRemoveFavorite(event) {
        event.stopPropagation();
        const card = event.currentTarget.closest('.artifact-card');
        const artifactId = card.dataset.id;

        if (!artifactId) return;

        // Ask for confirmation before deleting
        const isConfirmed = confirm(`Are you sure you want to remove this artifact from your collection?`);
        if (!isConfirmed) return;

        try {
            await api.removeFavorite(artifactId);
            // Animate out and remove the card from the UI for immediate feedback
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.remove();
                // If the grid becomes empty, show the empty message
                if (artifactGrid.children.length === 0) {
                    artifactGrid.innerHTML = '<p class="empty-message">Your collection is empty. Go to the Collection page to add some treasures!</p>';
                }
            }, 300);
            showNotification('Artifact removed from your collection.', 'info');
        } catch (error) {
            // Error is already handled by makeApiRequest
        }
    }

    // ============================================
    // 4. INITIALIZATION
    // ============================================

    async function initializeDashboard() {
        try {
            const [userResponse, favoritesResponse] = await Promise.all([
                api.getMe(),
                api.getMyFavorites()
            ]);

            if (userResponse && userResponse.data && welcomeTitle) {
                welcomeTitle.textContent = `Welcome back, ${userResponse.data.name.split(' ')[0]}`;
            }

            if (favoritesResponse && favoritesResponse.data) {
                renderFavorites(favoritesResponse.data);
            } else {
                renderFavorites([]); // Render the empty state if there's no data
            }
        } catch (error) {
            if (artifactGrid) artifactGrid.innerHTML = '<p class="empty-message error">Could not load your collection. Please try again later.</p>';
        }
    }

    initializeDashboard();

    // ============================================
    // 5. PRESERVED ORIGINAL UI SCRIPT
    // ============================================

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        const body = document.body;
        const themeIcon = themeBtn.querySelector('.material-symbols-outlined');
        const updateIcon = () => {
            if (themeIcon) themeIcon.textContent = body.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        };
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark');
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
            updateIcon();
        });
        updateIcon();
    }

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const openMenu = () => { if (mobileMenu) mobileMenu.classList.add('active'); if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; };
    const closeMenu = () => { if (mobileMenu) mobileMenu.classList.remove('active'); if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; };
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.menu-link, .dropdown-item').forEach(link => link.addEventListener('click', closeMenu));

    // --- Tab Switching ---
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // --- Notification System ---
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .notification { position: fixed; top: 20px; right: 20px; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1001; font-weight: 600; font-family: 'Noto Sans', sans-serif; font-size: 14px; animation: slideIn 0.3s ease-out forwards; }
        .notification-info { background-color: #3b82f6; }
        .notification-success { background-color: #10b981; }
        .notification-error { background-color: #ef4444; }
        .empty-message { color: #9ca3af; text-align: center; width: 100%; padding: 2rem; }
        .empty-message.error { color: #f87171; }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(120%); } }
    `;
    document.head.appendChild(styleSheet);
});
