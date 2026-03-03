/**
 * Tutora - Home Page Script (NO OPTIONAL CHAINING)
 * This version removes all '?' to ensure compatibility with all environments.
 */

const API_BASE_URL = 'https://gem-backend-production.up.railway.app/api';

document.addEventListener('DOMContentLoaded', async() => {
    // ============================================
    // 1. ORIGINAL DARK MODE LOGIC (YOUR CODE)
    // ============================================
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;

    // Function to update theme icon (from your code)
    function updateThemeIcon() {
        if (themeBtn) {
            const icon = themeBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                if (body.classList.contains('dark-mode')) {
                    icon.textContent = 'light_mode';
                } else {
                    icon.textContent = 'dark_mode';
                }
            }
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon();
    }

    // Toggle dark mode (Your original event listener)
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
        });
    }

    // ============================================
    // 2. BACKEND INTEGRATION (NEW)
    // ============================================
    const token = localStorage.getItem('token');

    // Initialize User Data
    await initializeUser(token);

    // Load Artifacts
    await loadArtifacts();

    // ============================================
    // 3. ORIGINAL MOBILE MENU LOGIC
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // ============================================
    // 4. USER PROFILE & LOGOUT
    // ============================================
    const logoutBtn = document.getElementById('logoutBtn');

    const handleLogout = (e) => {
        if (e) e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../2.login/code.html';
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    async function initializeUser(token) {
        const userNameEl = document.getElementById('userName');
        const welcomeNameEl = document.getElementById('welcomeName');

        if (!token) {
            if (welcomeNameEl) welcomeNameEl.textContent = 'Explorer';
            return;
        }

        try {
            const response = await fetch(API_BASE_URL + '/auth/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (response.ok) {
                const userData = await response.json();
                if (userNameEl) userNameEl.textContent = userData.name;
                if (welcomeNameEl) welcomeNameEl.textContent = userData.name.split(' ')[0];
                localStorage.setItem('user', JSON.stringify(userData));
            } else if (response.status === 401) {
                handleLogout();
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        }
    }

    async function loadArtifacts() {
        const grid = document.getElementById('artifactsGrid');
        if (!grid) return;

        try {
            const response = await fetch(API_BASE_URL + '/artifacts');
            if (!response.ok) throw new Error('Failed to fetch artifacts');

            const artifacts = await response.json();
            if (artifacts.length === 0) return;

            grid.innerHTML = artifacts.map(function(artifact) {
                return '<div class="artifact-card">' +
                    '<div class="artifact-image">' +
                    '<img src="' + (artifact.imageUrl || 'https://via.placeholder.com/300x400?text=Artifact') + '" alt="' + artifact.name + '">' +
                    '<button class="fav-btn" onclick="window.toggleFavorite(\'' + artifact.id + '\')">' +
                    '<span class="material-symbols-outlined">favorite_border</span>' +
                    '</button>' +
                    '</div>' +
                    '<div class="artifact-info">' +
                    '<h3>' + artifact.name + '</h3>' +
                    '<p>' + (artifact.description ? artifact.description.substring(0, 80) + '...' : 'No description available.') + '</p>' +
                    '<a href="../artifact-details/details.html?id=' + artifact.id + '" class="btn-details">View Details</a>' +
                    '</div>' +
                    '</div>';
            }).join('');
        } catch (error) {
            console.error('Artifacts load error:', error);
        }
    }
});

window.toggleFavorite = async function(artifactId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add to favorites');
        return;
    }

    try {
        const response = await fetch(API_BASE_URL + '/favorites/' + artifactId, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Added to favorites! ❤️');
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to update favorites');
        }
    } catch (error) {
        console.error('Favorite error:', error);
    }
};