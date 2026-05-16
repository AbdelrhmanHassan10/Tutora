// Immediately-invoked function to set the theme before DOM loads.
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    document.body.classList.toggle('light', savedTheme === 'light');
})();

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
    const artifactGrid = document.querySelector('.saved-section .artifact-grid') || document.querySelector('.artifact-grid');
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
        toggleFavorite: (id, type) => makeApiRequest(`/favorites/toggle/${id}`, 'POST'),
    };

    // ============================================
    // 2. UI RENDERING
    // ============================================

    function createFavoriteCard(favoriteItem) {
        const isEvent = favoriteItem._type === 'Event';
        const item = favoriteItem._itemData || favoriteItem.artifact || favoriteItem.event || favoriteItem.item || favoriteItem;
        if (!item || !item._id && !item.id) return '';

        const title = item.name || item.title || 'Untitled';
        const image = item.image || item.imageUrl || '../collection/unnamed (1).png';
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

    // ============================================
    // 2.5 KIDS MUSEUM FACTS HANDLING
    // ============================================
    
    const FUN_FACTS_DATA = {
        'fact-1': { title: "Mummification 101", text: "They believed the heart was the most important organ, while the brain was often thrown away!", topic: "Science", icon: "science" },
        'fact-2': { title: "Hieroglyph Power", text: "There are over 700 symbols. Some represent sounds, others represent whole words!", topic: "Language", icon: "edit_note" },
        'fact-3': { title: "Pyramids Mystery", text: "The pyramids were built as tombs for pharaohs and remain architectural wonders!", topic: "History", icon: "history_edu" },
        'fact-4': { title: "Ancient Honey", text: "Archaeologists found honey in tombs that is 3,000 years old and STILL perfectly edible!", topic: "Food", icon: "restaurant" },
        'fact-5': { title: "365-Day Year", text: "Egyptians invented the 365-day calendar to predict when the Nile River would flood!", topic: "Science", icon: "calendar_month" },
        'fact-6': { title: "Bread Medicine", text: "They used moldy bread to treat infections—the earliest form of penicillin!", topic: "Medicine", icon: "medication" },
        'fact-7': { title: "Senet Game", text: "Ancient Egyptians loved board games! Senet was their favorite, played for over 3,000 years.", topic: "Games", icon: "casino" },
        'fact-8': { title: "Women's Rights", text: "Egyptian women could own property, sign legal contracts, and even become Pharaohs!", topic: "Society", icon: "balance" },
        'fact-9': { title: "Paid Builders", text: "The pyramids weren't built by slaves, but by respected workers who were paid in bread and beer!", topic: "History", icon: "groups" },
        'fact-10': { title: "First Police", text: "Egyptians had the first police force! They used trained dogs and even monkeys to catch criminals.", topic: "Society", icon: "policy" },
        'fact-11': { title: "Hair Secrets", text: "To stay cool, children often shaved their heads except for one long 'lock of youth' on the side!", topic: "Culture", icon: "content_cut" },
        'fact-12': { title: "Sacred Animals", text: "It wasn't just cats! Crocodiles, ibises, and even baboons were considered sacred and respected.", topic: "Religion", icon: "pets" },
        'fact-13': { title: "First Dentists", text: "Ancient Egyptians were the first to have dentists. They even used gold wire to fix loose teeth!", topic: "Medicine", icon: "dentistry" },
        'fact-14': { title: "Cleopatra's Secret", text: "Cleopatra VII, the most famous Queen of Egypt, was actually Greek, from a family named Ptolemy.", topic: "History", icon: "person" },
        'fact-15': { title: "Giant Sphinx", text: "The Sphinx is carved from a single giant piece of limestone. It guards the pyramids with a lion's body!", topic: "Architecture", icon: "architecture" },
        'fact-16': { title: "Peace Treaty", text: "Ramses II signed the first peace treaty in history with the Hittite Empire 3,000 years ago.", topic: "History", icon: "handshake" },
        'fact-17': { title: "Makeup Power", text: "Both men and women wore eye makeup! It protected their eyes from the sun's glare and biting flies.", topic: "Culture", icon: "visibility" },
        'fact-18': { title: "Surgical Tools", text: "Ancient doctors used copper scalpels and needles to perform surgeries, much like today!", topic: "Medicine", icon: "hardware" },
        'fact-19': { title: "Golden Ratio", text: "Architects used advanced math to build the Great Pyramid, which is perfectly aligned with the stars.", topic: "Science", icon: "calculate" },
        'fact-20': { title: "First Toothpaste", text: "Egyptians invented toothpaste! They used a mix of rock salt, pepper, mint, and dried iris flowers.", topic: "Medicine", icon: "clean_hands" }
    };

    function renderSavedFacts() {
        console.log("--- Syncing Saved Fun Facts ---");
        const grid = document.getElementById('savedFactsGrid');
        if (!grid) return;

        let savedIds = [];
        try {
            savedIds = JSON.parse(localStorage.getItem('savedFacts') || '[]');
        } catch (e) {
            console.error("Failed to parse savedFacts:", e);
            savedIds = [];
        }
        
        console.log("Retrieved IDs:", savedIds);

        if (savedIds.length === 0) {
            if (document.getElementById('factsCount')) document.getElementById('factsCount').style.display = 'none';
            grid.innerHTML = `
                <div class="loading-state">
                    <span class="material-symbols-outlined">lightbulb</span>
                    <p>No fun facts saved yet. Visit the Kids Museum to collect some!</p>
                </div>
            `;
            return;
        }

        // Update badge count
        const badge = document.getElementById('factsCount');
        if (badge) {
            badge.textContent = savedIds.length;
            badge.style.display = 'flex';
        }

        grid.innerHTML = savedIds.map(id => {
            const data = FUN_FACTS_DATA[id];
            if (!data) return '';
            
            const topicClass = {
                'Science': 'icon-science',
                'History': 'icon-history',
                'Language': 'icon-lang',
                'Food': 'icon-science',
                'Medicine': 'icon-medicine',
                'Games': 'icon-art',
                'Society': 'icon-science',
                'Culture': 'icon-art',
                'Religion': 'icon-religion',
                'Architecture': 'icon-art'
            }[data.topic] || '';

            return `
                <div class="fact-fav-card" data-id="${id}">
                    <div class="fact-icon-box ${topicClass}"><span class="material-symbols-outlined">${data.icon}</span></div>
                    <div class="fact-body">
                        <h4>${data.title}</h4>
                        <p>${data.text}</p>
                    </div>
                    <button class="remove-fact-btn" title="Remove Fact">
                        <span class="material-symbols-outlined">bookmark_remove</span>
                    </button>
                </div>
            `;
        }).join('');

        // Attach listeners for removal
        grid.querySelectorAll('.remove-fact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = btn.closest('.fact-fav-card');
                const id = card.dataset.id;
                let currentSaved = JSON.parse(localStorage.getItem('savedFacts') || '[]');
                currentSaved = currentSaved.filter(fid => fid !== id);
                localStorage.setItem('savedFacts', JSON.stringify(currentSaved));
                card.remove();
                if (currentSaved.length === 0) renderSavedFacts();
                showNotification("Fact removed from collection.", "info");
            });
        });
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

            // Re-render facts if that tab is selected
            if (targetId === 'facts') {
                renderSavedFacts();
            } else if (targetId === 'journey') {
                renderJourney();
            }
        });
    });

    // ============================================
    // JOURNEY RENDERING LOGIC
    // ============================================
    function renderJourney() {
        const journeyTimelineWrapper = document.getElementById('journeyTimelineWrapper');
        const journeyItems = document.getElementById('journeyItems');
        const journeyEmptyState = document.getElementById('journeyEmptyState');

        if (!journeyTimelineWrapper || !journeyItems || !journeyEmptyState) return;

        const storedJourney = localStorage.getItem('myJourney');
        if (!storedJourney) {
            journeyTimelineWrapper.style.display = 'none';
            journeyEmptyState.style.display = 'block';
            return;
        }

        try {
            const journeyData = JSON.parse(storedJourney);
            const route = journeyData.route || [];

            if (route.length === 0) {
                journeyTimelineWrapper.style.display = 'none';
                journeyEmptyState.style.display = 'block';
                return;
            }

            journeyEmptyState.style.display = 'none';
            journeyTimelineWrapper.style.display = 'block';

            journeyItems.innerHTML = route.map((spot, index) => {
                const isHighlight = index === 0 || index === route.length - 1;
                return `
                    <div class="timeline-item">
                        <div class="timeline-icon ${isHighlight ? 'pulse-gold' : ''}">
                            <span class="material-symbols-outlined">${spot.icon || 'map'}</span>
                        </div>
                        <div class="timeline-content ${isHighlight ? 'highlight' : ''}">
                            <span class="item-date uppercase tracking-widest">${journeyData.date || 'Today'}</span>
                            <h4 class="item-title font-serif">${spot.title}</h4>
                            <p class="item-desc opacity-70">${spot.desc}</p>
                            <span class="step-time" style="display: inline-block; margin-top: 10// ============================================
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

            const allFavs = [];
            const arts = Array.isArray(artifactFavs) ? artifactFavs : (artifactFavs ? artifactFavs.data || [] : []);
            arts.forEach(f => {
                const itemData = f.artifact || f.item || f;
                if (itemData) allFavs.push({ ...f, _type: 'Artifact', _itemData: itemData });
            });
            
            const evts = Array.isArray(eventFavs) ? eventFavs : (eventFavs ? eventFavs.data || [] : []);
            evts.forEach(f => {
                const itemData = f.event || f.item || f;
                if (itemData) allFavs.push({ ...f, _type: 'Event', _itemData: itemData });
            });

            renderFavorites(allFavs);
            renderJourney();
        } catch (error) {
            console.error("Initialization error:", error);
            if (artifactGrid) artifactGrid.innerHTML = '<p class="loading-state text-error">Failed to synchronize your collection.</p>';
        } finally {
            renderSavedFacts();
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

    // ============================================
    
    // ============================================
    

        const hieroglyphs = ['𓂀', '𓋹', '𓅓', '𓇳', '𓇿', '𓆎', '𓃻', '𓂋', '𓏏', '𓈖'];
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.textContent = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
            shape.style.fontSize = `${Math.random() * 20 + 20}px`;
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animation = `rotateFloat ${Math.random() * 20 + 20}s infinite ease-in-out ${Math.random() * 10}s`;
            shapesContainer.appendChild(shape);
        }
    }

    });

