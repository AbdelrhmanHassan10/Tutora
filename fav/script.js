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
        getMyFavorites: (type) => makeApiRequest(`/favorites/my${type ? '?type=' + type : ''}`),
        removeFavorite: (id, type) => makeApiRequest(`/favorites/${id}?type=${type || 'Artifact'}`, 'DELETE'),
    };

    // ============================================
    // 2. UI RENDERING
    // ============================================

    function createFavoriteCard(favoriteItem) {
        const isEvent = favoriteItem._type === 'Event';
        const item = isEvent ? favoriteItem.event : favoriteItem.artifact;
        if (!item) return '';

        const title = item.name || item.title || 'Untitled';
        const image = item.imageUrl || '../collection/unnamed.png';
        const subtitle = isEvent 
            ? (item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Upcoming Event')
            : (item.material || 'Artifact Detail');
        const badge = isEvent ? 'Event' : (item.dynasty || 'New Kingdom');

        return `
            <div class="artifact-card" data-id="${item._id || item.id}" data-type="${isEvent ? 'Event' : 'Artifact'}">
                <div class="card-bg" style="background-image: url('${image}');">
                    <button class="btn-fav-active" title="Remove from favorites">
                        <span class="material-symbols-outlined">favorite</span>
                    </button>
                    <div class="card-info">
                        <span class="card-dynasty">${badge}</span>
                        <h3 class="card-title font-serif text-white">${title}</h3>
                        <p class="card-material opacity-70 text-xs">${subtitle}</p>
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
        const itemType = card.dataset.type || 'Artifact';
        if (!artifactId) return;

        const label = itemType === 'Event' ? 'event' : 'artifact';
        if (!confirm(`Remove this ${label} from your saved treasures?`)) return;

        try {
            await api.removeFavorite(artifactId, itemType);
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) translateY(20px)';
            setTimeout(() => {
                card.remove();
                if (artifactGrid.children.length === 0) renderFavorites([]);
            }, 400);
            showNotification(`${itemType} removed.`, 'info');
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
            const [userResponse, artifactFavs, eventFavs] = await Promise.all([
                api.getMe().catch(() => null),
                api.getMyFavorites('Artifact').catch(() => null),
                api.getMyFavorites('Event').catch(() => null)
            ]);

            if (userResponse && userResponse.data && welcomeTitle) {
                const firstName = userResponse.data.name.split(' ')[0];
                welcomeTitle.textContent = `Welcome back, ${firstName}`;
            }

            // Combine artifacts and events into one list
            const allFavs = [];
            if (artifactFavs && artifactFavs.data) {
                artifactFavs.data.forEach(f => {
                    if (f.artifact) allFavs.push({ ...f, _type: 'Artifact' });
                });
            }
            if (eventFavs && eventFavs.data) {
                eventFavs.data.forEach(f => {
                    if (f.event) allFavs.push({ ...f, _type: 'Event' });
                });
            }

            renderFavorites(allFavs);
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

