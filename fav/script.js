// Immediately-invoked function to set the theme before DOM loads.
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    document.body.classList.toggle('light', savedTheme === 'light');
})();

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const artifactGrid = document.querySelector('.saved-section .artifact-grid');
    const welcomeTitle = document.querySelector('.dashboard-header .title');

    // --- Immediate Profile Sync ---
    try {
        let storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser && storedUser.email) {
            const localOverride = localStorage.getItem(`localProfileData_${storedUser.email}`);
            if (localOverride) {
                storedUser = { ...storedUser, ...JSON.parse(localOverride) };
            }
        }
        if (storedUser.name && welcomeTitle) {
            const firstName = storedUser.name.split(' ')[0];
            welcomeTitle.textContent = `Welcome back, ${firstName}`;
        }
    } catch(e) {}


    // ============================================
    // 1. API & DATA HANDLING
    // ============================================

    async function makeApiRequest(endpoint, method = 'GET') {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification("Session expired. Please log in.", 'error');
            setTimeout(() => { window.location.href = '../2.login/code.html'; }, 2000);
            return null;
        }

        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { method, headers });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }
            if (response.status === 204) return { success: true };
            return await response.json();
        } catch (error) {
            console.error(`API Error:`, error);
            showNotification(error.message, 'error');
            throw error;
        }
    }

    const api = {
        getMe: () => makeApiRequest('/auth/me'),
        getMyFavorites: () => makeApiRequest('/favorites/my'),
        removeFavorite: (id) => makeApiRequest(`/favorites/${id}`, 'DELETE'),
    };

    // ============================================
    // 2. UI RENDERING
    // ============================================

    function createFavoriteCard(favoriteItem) {
        const artifact = favoriteItem.artifact;
        if (!artifact) return '';

        return `
            <div class="artifact-card" data-id="${artifact.id}">
                <div class="card-bg" style="background-image: url('${artifact.imageUrl || '../collection/unnamed.png'}');">
                    <button class="btn-fav-active" title="Remove from favorites">
                        <span class="material-symbols-outlined">favorite</span>
                    </button>
                    <div class="card-info">
                        <span class="card-dynasty">${artifact.dynasty || 'New Kingdom'}</span>
                        <h3 class="card-title font-serif text-white">${artifact.name}</h3>
                        <p class="card-material opacity-70 text-xs">${artifact.material || 'Artifact Detail'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFavorites(favorites) {
        if (!artifactGrid) return;
        if (!favorites || favorites.length === 0) {
            artifactGrid.innerHTML = `
                <div class="loading-state">
                    <span class="material-symbols-outlined mb-4" style="font-size: 40px">inventory_2</span>
                    <p>Your collection is empty.</p>
                    <a href="../collection/collection.html" class="btn-revisit mt-4" style="text-decoration: none">EXPLORE COLLECTION</a>
                </div>
            `;
            return;
        }
        artifactGrid.innerHTML = favorites.map(createFavoriteCard).join('');
        attachCardEventListeners();
    }

    function attachCardEventListeners() {
        document.querySelectorAll('.btn-fav-active').forEach(btn => {
            btn.addEventListener('click', handleRemoveFavorite);
        });
    }

    async function handleRemoveFavorite(event) {
        event.stopPropagation();
        const card = event.currentTarget.closest('.artifact-card');
        const artifactId = card.dataset.id;
        if (!artifactId) return;

        if (!confirm(`Remove this artifact from your saved treasures?`)) return;

        try {
            await api.removeFavorite(artifactId);
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) translateY(20px)';
            setTimeout(() => {
                card.remove();
                if (artifactGrid.children.length === 0) renderFavorites([]);
            }, 400);
            showNotification('Artifact removed.', 'info');
        } catch (error) {}
    }

    // ============================================
    // 3. TAB COORIDNATION
    // ============================================

    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.dashboard-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            // Toggle Tab Active State
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Toggle Section Visibility
            sections.forEach(section => {
                section.classList.toggle('active', section.id === targetId);
            });
        });
    });

    // ============================================
    // 4. THEME & NAVIGATION
    // ============================================

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        const updateThemeUI = () => {
            const isDark = document.body.classList.contains('dark');
            if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        };

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            document.body.classList.toggle('light');
            const isDarkNow = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
            updateThemeUI();
        });
        updateThemeUI();
    }

    // Mobile Menu
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
    document.querySelectorAll('.menu-link, .dropdown-item').forEach(link => link.addEventListener('click', closeMenu));

    // ============================================
    // 5. INITIALIZATION
    // ============================================

    async function init() {
        try {
            const [userResponse, favoritesResponse] = await Promise.all([
                api.getMe().catch(() => null),
                api.getMyFavorites().catch(() => null)
            ]);

            if (userResponse && userResponse.data && welcomeTitle) {
                const firstName = userResponse.data.name.split(' ')[0];
                welcomeTitle.textContent = `Welcome back, ${firstName}`;
            }

            if (favoritesResponse && favoritesResponse.data) {
                renderFavorites(favoritesResponse.data);
            } else {
                renderFavorites([]);
            }
        } catch (error) {
            artifactGrid.innerHTML = '<p class="loading-state text-error">Failed to synchronize your collection.</p>';
        }
    }

    init();

    // Notification Helper
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <span class="material-symbols-outlined">${type === 'error' ? 'error' : 'info'}</span>
            ${message}
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('out');
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Notification Styles
    const notifyStyles = document.createElement('style');
    notifyStyles.textContent = `
        .custom-notification { position: fixed; top: 30px; right: 30px; background: #2f3542; color: white; padding: 15px 25px; border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 9999; animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .custom-notification.error { border-left: 4px solid #ff4757; }
        .custom-notification.info { border-left: 4px solid #f2d00d; }
        .custom-notification.out { opacity: 0; transform: translateX(50px) scale(0.9); transition: 0.4s ease; }
        @keyframes slideIn { from { transform: translateX(100px) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
    `;
    document.head.appendChild(notifyStyles);
});
