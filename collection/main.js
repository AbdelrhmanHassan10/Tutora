 document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // CONFIGURATION & STATE
    // ============================================
    const CONFIG = {
        API_BASE_URL: 'https://gem-backend-production-1ea2.up.railway.app/api',
        ITEMS_PER_PAGE: 50,
        DEFAULT_GRID_VIEW: 'grid-3'
    };

    const STATE = {
        allArtifacts: [],
        filteredArtifacts: [],
        currentPage: 1,
        filters: {
            dynasty: [],
            material: [],
            site: [],
            gallery: [],
            search: ''
        },
        sortBy: 'newest',
        viewMode: CONFIG.DEFAULT_GRID_VIEW,
        favorites: new Set(),
        isLoading: false
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
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

    function showLoading(show = true) {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = show ? 'block' : 'none';
    }

    function getUniqueValues(artifacts, field) {
        return [...new Set(artifacts.map(a => a[field]))].sort();
    }

    // ============================================
    // API FUNCTIONS
    // ============================================
    async function makeApiRequest(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        if (!token && method !== 'GET') {
            showNotification('Please log in to manage your favorites.', 'info');
            return null;
        }

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { method, headers };
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);
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

    const api = {
        getMyFavorites: () => makeApiRequest('/favorites/my'),
        addFavorite: (id) => makeApiRequest(`/favorites/${id}`, 'POST', { type: "Artifact" }),
        removeFavorite: (id) => makeApiRequest(`/favorites/${id}?type=Artifact`, 'DELETE'),
        toggleFavorite: (id) => makeApiRequest(`/favorites/toggle/${id}`, 'POST', { type: "Artifact" })
    };

    // ============================================
    // FAVORITE MANAGEMENT
    // ============================================
    async function handleFavoriteClick(event) {
        event.stopPropagation();
        const button = event.currentTarget;
        const card = button.closest('.artifact-card');
        const artifactId = card.dataset.id;

        if (!localStorage.getItem('token')) {
            showNotification('Please log in to save favorites.', 'info');
            return;
        }

        const isCurrentlyFavorite = button.classList.contains('active');

        try {
            if (isCurrentlyFavorite) {
                await api.removeFavorite(artifactId);
                button.classList.remove('active');
                STATE.favorites.delete(artifactId);
                showNotification('Removed from favorites.', 'info');
            } else {
                await api.addFavorite(artifactId);
                button.classList.add('active');
                STATE.favorites.add(artifactId);
                showNotification('Added to favorites!', 'success');
            }
        } catch (error) {
            console.error('Favorite operation failed:', error);
            showNotification('Failed to update favorites', 'error');
        }
    }

    async function initializeFavoriteStates() {
        if (localStorage.getItem('token')) {
            try {
                const favoritesResponse = await api.getMyFavorites();
                const favs = Array.isArray(favoritesResponse) ? favoritesResponse : (favoritesResponse ? favoritesResponse.data || [] : []);
                favs.forEach(fav => {
                    const itemData = fav.artifact || fav.item || fav;
                    const id = fav.artifactId || fav.itemId || (itemData && (itemData._id || itemData.id));
                    if (id) {
                        STATE.favorites.add(id);
                    }
                });
            } catch (error) {
                console.error('Failed to load favorites:', error);
            }
        }
    }

    // ============================================
    // FILTER MODAL MANAGEMENT
    // ============================================
    function openFilterModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }

    window.closeFilterModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    function populateFilterOptions() {
        const dynasties = getUniqueValues(STATE.allArtifacts, 'dynasty');
        const materials = getUniqueValues(STATE.allArtifacts, 'material');
        const sites = getUniqueValues(STATE.allArtifacts, 'site');
        const galleries = getUniqueValues(STATE.allArtifacts, 'gallery');

        populateFilterModal('dynastyFilterOptions', 'dynasty', dynasties);
        populateFilterModal('materialFilterOptions', 'material', materials);
        populateFilterModal('siteFilterOptions', 'site', sites);
        populateFilterModal('galleryFilterOptions', 'gallery', galleries);
    }

    function populateFilterModal(containerId, filterType, options) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        options.forEach(option => {
            const isChecked = STATE.filters[filterType].includes(option);
            const div = document.createElement('label');
            div.className = 'filter-option-custom';
            div.innerHTML = `
                <input type="checkbox" id="${filterType}_${option}" value="${option}" 
                       ${isChecked ? 'checked' : ''} data-filter-type="${filterType}">
                <span class="custom-checkbox"></span>
                <span class="option-label">${option}</span>
            `;
            container.appendChild(div);
        });
    }

    window.applyFilter = function(filterType) {
        const checkboxes = document.querySelectorAll(`input[data-filter-type="${filterType}"]:checked`);
        STATE.filters[filterType] = Array.from(checkboxes).map(cb => cb.value);
        const wrapper = document.getElementById(filterType + 'DropdownWrapper');
        if (wrapper) wrapper.classList.remove('active');
        STATE.currentPage = 1;
        applyAllFilters();
    };

    // ============================================
    // FILTERING & SEARCHING
    // ============================================
    function applyAllFilters() {
        const hasActiveFilters = Object.values(STATE.filters).some(f => 
            (Array.isArray(f) && f.length > 0) || (typeof f === 'string' && f !== '')
        );

        const sections = document.querySelectorAll('.collection-section');
        const dynamicGallery = document.getElementById('dynamicGallery');
        const dynamicTitle = document.getElementById('dynamicTitle');
        const dynamicDesc = document.getElementById('totalResultsText');
        const loadMoreSection = document.querySelector('.load-more-section');
        const noResultsMsg = document.getElementById('noResults');

        // Filter logic
        STATE.filteredArtifacts = STATE.allArtifacts.filter(artifact => {
            const matchesDynasty = STATE.filters.dynasty.length === 0 ||
                STATE.filters.dynasty.includes(artifact.dynasty);
            const matchesMaterial = STATE.filters.material.length === 0 ||
                STATE.filters.material.includes(artifact.material);
            const matchesSite = STATE.filters.site.length === 0 ||
                STATE.filters.site.includes(artifact.site);
            const matchesGallery = STATE.filters.gallery.length === 0 ||
                STATE.filters.gallery.includes(artifact.gallery);
            
            const searchLower = STATE.filters.search.toLowerCase();
            const matchesSearch = STATE.filters.search === '' ||
                (artifact.title && artifact.title.toLowerCase().includes(searchLower)) ||
                (artifact.description && artifact.description.toLowerCase().includes(searchLower));

            return matchesDynasty && matchesMaterial && matchesSite && matchesGallery && matchesSearch;
        });

        // UI Switching & Data Selection
        let displayList = STATE.filteredArtifacts;
        
        if (hasActiveFilters) {
            sections.forEach(s => s.style.display = 'none');
            if (dynamicGallery) dynamicGallery.style.display = 'block';
            if (dynamicTitle) dynamicTitle.textContent = 'Search Results';
            if (dynamicDesc) dynamicDesc.textContent = `Found ${STATE.filteredArtifacts.length} items matching your criteria`;
        } else {
            sections.forEach(s => s.style.display = 'block');
            if (dynamicGallery) dynamicGallery.style.display = 'block';
            if (dynamicTitle) dynamicTitle.textContent = 'Recent Discoveries';
            if (dynamicDesc) dynamicDesc.textContent = 'New artifacts added by our curators.';
        }

        sortArtifacts();
        updateActiveFiltersDisplay();
        renderArtifacts(displayList);
        
        if (hasActiveFilters && STATE.filteredArtifacts.length === 0) {
            if (noResultsMsg) noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }

        // Load more logic
        const totalItems = STATE.filteredArtifacts.length;
        const showingItems = Math.min(STATE.currentPage * CONFIG.ITEMS_PER_PAGE, totalItems);
        if (loadMoreSection) {
            loadMoreSection.style.display = (showingItems < totalItems) ? 'flex' : 'none';
        }
    }

    function sortArtifacts() {
        const sorted = [...STATE.filteredArtifacts];
        switch (STATE.sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'dynasty':
                sorted.sort((a, b) => a.dynasty.localeCompare(b.dynasty));
                break;
        }
        STATE.filteredArtifacts = sorted;
    }

    function updateActiveFiltersDisplay() {
        const container = document.getElementById('activeFiltersContainer');
        const list = document.getElementById('activeFiltersList');
        const hasFilters = Object.values(STATE.filters).some(f =>
            (Array.isArray(f) && f.length > 0) || (typeof f === 'string' && f !== '')
        );

        if (!hasFilters) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        list.innerHTML = '';

        Object.entries(STATE.filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                value.forEach(v => {
                    const badge = document.createElement('span');
                    badge.className = 'filter-badge';
                    badge.innerHTML = `${v} <span class="remove-filter" onclick="removeFilter('${key}', '${v}')">×</span>`;
                    list.appendChild(badge);
                });
            } else if (typeof value === 'string' && value !== '') {
                const badge = document.createElement('span');
                badge.className = 'filter-badge';
                badge.innerHTML = `Search: "${value}" <span class="remove-filter" onclick="clearSearch()">×</span>`;
                list.appendChild(badge);
            }
        });
    }

    window.removeFilter = function(filterType, value) {
        STATE.filters[filterType] = STATE.filters[filterType].filter(v => v !== value);
        STATE.currentPage = 1;
        applyAllFilters();
    };

    window.clearSearch = function() {
        STATE.filters.search = '';
        document.getElementById('mainSearch').value = '';
        document.getElementById('headerSearch').value = '';
        STATE.currentPage = 1;
        applyAllFilters();
    };

    // ============================================
    // RENDERING
    // ============================================
    function renderArtifacts(customList = null) {
        const grid = document.getElementById('artifactGrid');
        const noResults = document.getElementById('noResults');
        
        let sourceList = customList || STATE.filteredArtifacts;
        
        const endIdx = STATE.currentPage * CONFIG.ITEMS_PER_PAGE;
        const displayArtifacts = sourceList.slice(0, endIdx);
        
        const countLabel = document.getElementById('totalResultsText');
        const heroCountLabel = document.querySelector('.count-text');
        
        const totalCount = sourceList.length;
        const displayCount = displayArtifacts.length;

        if (countLabel) countLabel.textContent = `Showing ${displayCount} of ${totalCount} results`;
        if (heroCountLabel) heroCountLabel.textContent = `Showing ${displayCount} of ${totalCount} artifacts`;

        grid.className = `artifact-grid ${STATE.viewMode}`;
        grid.innerHTML = ''; 

        if (displayArtifacts.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        // Helper for XSS sanitization
        const escapeHTML = (str) => {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        };

        displayArtifacts.forEach(artifact => {
            const card = document.createElement('div');
            card.className = 'artifact-card';
            card.dataset.id = artifact.id;
            const isFavorite = STATE.favorites.has(artifact.id);

            card.innerHTML = `
                      <div class="image-container">
                          <img alt="${escapeHTML(artifact.title)}" class="artifact-image" src="${escapeHTML(artifact.image)}" />
                          <div class="image-overlay"></div>
                          <button class="favorite-btn ${isFavorite ? 'active' : ''}">
                              <span class="material-symbols-outlined">favorite</span>
                          </button>
                      </div>
                      <div class="card-content">
                          <p class="dynasty-label">${escapeHTML(artifact.dynasty)}</p>
                          <h3 class="artifact-title">${escapeHTML(artifact.title)}</h3>
                          <p class="card-description">${escapeHTML(artifact.description || '')}</p>
                          <div class="card-footer">
                              <span class="location-text">
                                  <span class="material-symbols-outlined" style="font-size:14px">location_on</span> 
                                  ${escapeHTML(artifact.site || 'Grand Gallery')}
                              </span>
                              <button class="view-details-btn">
                                  <span>Details</span>
                                  <span class="material-symbols-outlined">arrow_forward</span>
                              </button>
                          </div>
                      </div>
                  `;

            grid.appendChild(card);
        });

        updatePaginationControls();
        updateStats();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(STATE.filteredArtifacts.length / CONFIG.ITEMS_PER_PAGE);
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageInfo = document.getElementById('pageInfo');

        if (prevBtn) prevBtn.disabled = STATE.currentPage === 1;
        if (nextBtn) nextBtn.disabled = STATE.currentPage === totalPages;
        if (pageInfo) pageInfo.textContent = `Page ${STATE.currentPage} of ${totalPages}`;
    }

    function updateStats() {
        const totalResults = document.getElementById('totalResults');
        const showingResults = document.getElementById('showingResults');
        const startIdx = (STATE.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + CONFIG.ITEMS_PER_PAGE, STATE.filteredArtifacts.length);

        if (totalResults) totalResults.textContent = STATE.filteredArtifacts.length;
        if (showingResults) showingResults.textContent = `${startIdx + 1}-${endIdx}`;
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    const mainSearch = document.getElementById('mainSearch');
    const headerSearch = document.getElementById('headerSearch');

    const handleSearch = (value) => {
        STATE.filters.search = value;
        STATE.currentPage = 1;
        applyAllFilters();
    };

    if (mainSearch) mainSearch.addEventListener('input', (e) => handleSearch(e.target.value));
    if (headerSearch) headerSearch.addEventListener('input', (e) => {
        handleSearch(e.target.value);
        if (mainSearch) mainSearch.value = e.target.value;
    });

    const filterWrappers = ['dynasty', 'material', 'site', 'gallery'];
    filterWrappers.forEach(type => {
        const btn = document.getElementById(type + 'FilterBtn');
        const wrapper = document.getElementById(type + 'DropdownWrapper');
        if (btn && wrapper) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                filterWrappers.forEach(t => {
                    if (t !== type) {
                        document.getElementById(t + 'DropdownWrapper')?.classList.remove('active');
                    }
                });
                wrapper.classList.toggle('active');
            });
            wrapper.querySelector('.filter-dropdown-menu')?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener('click', () => {
        filterWrappers.forEach(t => {
            document.getElementById(t + 'DropdownWrapper')?.classList.remove('active');
        });
    });

    document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        STATE.filters = { dynasty: [], material: [], site: [], gallery: [], search: '' };
        STATE.currentPage = 1;
        if (mainSearch) mainSearch.value = '';
        if (headerSearch) headerSearch.value = '';
        applyAllFilters();
        showNotification('Filters reset.', 'info');
    });

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-menu .dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const items = toggle.nextElementSibling;
            if (items && items.classList.contains('dropdown-items')) {
                items.classList.toggle('show');
                toggle.classList.toggle('active');
            }
        });
    });

    document.querySelectorAll('.menu-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('button').classList.add('active');
            STATE.viewMode = e.target.closest('button').dataset.view;
            renderArtifacts();
        });
    });

    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            STATE.currentPage++;
            renderArtifacts();
            
            const totalItems = STATE.filteredArtifacts.length;
            if (STATE.currentPage * CONFIG.ITEMS_PER_PAGE >= totalItems) {
                const loadMoreSection = document.querySelector('.load-more-section');
                if (loadMoreSection) loadMoreSection.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('.filter-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    async function initialize() {
        showLoading(true);
        
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/artifacts`);
            if (res.ok) {
                const data = await res.json();
                const fetchedData = Array.isArray(data) ? data : (data.artifacts || data.data || []);
                
                const HALL_IMAGES = {
                    "tutankhamun's mask": "../Halls Gallery/images/tut.png",
                    "golden throne": "../Halls Gallery/images/golden_throne.png",
                    "ceremonial chariot": "../Halls Gallery/images/ceremonial_chariot.png",
                    "golden fan (flabellum)": "../Halls Gallery/images/golden_fan.png",
                    "colossal ramses ii": "../Halls Gallery/images/grand.png",
                    "victory stele of merneptah": "../Halls Gallery/images/Victory Stele of Merneptah.png",
                    "statue of senusret i": "../Halls Gallery/images/Statue of Senusret I.png",
                    "granite column of merneptah": "../Halls Gallery/images/column_merneptah.png",
                    "colossus of a ptolemaic king": "../Halls Gallery/images/ptolemaic_king.png",
                    "colossus of a ptolemaic queen": "../Halls Gallery/images/ptolemaic_queen.png",
                    "sarcophagus of seti i": "../Halls Gallery/images/sarcophagus_seti.png",
                    "canopic chest of queen hetepheres": "../Halls Gallery/images/canopic_chest_hetepheres.png",
                    "golden mask of psusennes i": "../Halls Gallery/images/mask_psusennes.png",
                    "senet game board": "../Halls Gallery/images/senet_board.png",
                    "scribe's palette and pens": "../Halls Gallery/images/scribe_palette.png",
                    "cosmetic palette": "../Halls Gallery/images/cosmetic_palette.png",
                    "ancient egyptian sandals": "../Halls Gallery/images/ancient_sandals.png",
                    "royal makeup kit": "../Halls Gallery/images/makeup_kit.png",
                    "the seated scribe": "../Halls Gallery/images/seated_scribe.png",
                    "statue of king khafre": "../Halls Gallery/images/khafre_statue.png",
                    "group statue of menkaure": "../Halls Gallery/images/menkaure_statue.png",
                    "bust of nefertiti (replica)": "../Halls Gallery/images/nefertiti_bust.png",
                    "statue of king djoser": "../Halls Gallery/images/djoser_statue.png",
                    "narmer palette (replica)": "../Halls Gallery/images/narmer_palette.png",
                    "painted predynastic vessel": "../Halls Gallery/images/predynastic_vessel.png",
                    "ritual flint knife": "../Halls Gallery/images/flint_knife.png",
                    "terra-cotta female figure": "../Halls Gallery/images/terracotta_figure.png",
                    "anubis guardian statue": "../Halls Gallery/images/anubis_guardian.png",
                    "book of the dead fragment": "../Halls Gallery/images/book_of_dead.png",
                    "shabti figures of tutankhamun": "../Halls Gallery/images/tut_shabti.png",
                    "gilded mummy mask": "../Halls Gallery/images/mummy_mask.png",
                    "rosetta stone (replica)": "../Halls Gallery/images/rosetta_stone.png",
                    "fayum mummy portrait": "../Halls Gallery/images/fayum_portrait.png",
                    "statue of sarapis": "../Halls Gallery/images/sarapis_statue.png",
                    "bust of alexander the great": "../Halls Gallery/images/alexander_bust.png",
                    "تمثال حجرى ضخم للملك رمسيس الثاني": "../Halls Gallery/images/ramses_colossal.png",
                    "تمثال على هيئة أبي الهول للملك تحتمس الثالث": "../Halls Gallery/images/thutmose_sphinx.png",
                    "مسلة الملك رمسيس الثاني": "../Halls Gallery/images/obelisk_ramses.png"
                };

                const mappedAPI = fetchedData.map(art => {
                    let artImage = art.image || art.imageUrl || '../suzi-kim-AVUvVdVKcSg-unsplash.jpg';
                    const artTitle = art.title || art.name || 'Unknown';
                    const lowerTitle = artTitle.toLowerCase();
                    
                    // Override images for specific statues from the Halls Gallery
                    if (HALL_IMAGES[lowerTitle]) {
                        artImage = HALL_IMAGES[lowerTitle];
                    } else {
                        // Fallback partial matching just in case names differ slightly
                        for (const [key, value] of Object.entries(HALL_IMAGES)) {
                            if (lowerTitle.includes(key) || key.includes(lowerTitle)) {
                                artImage = value;
                                break;
                            }
                        }
                    }

                    return {
                        ...art,
                        id: art._id || art.id,
                        title: artTitle,
                        image: artImage,
                        dynasty: art.dynasty || art.era || 'Unknown',
                        material: art.material || 'Unknown',
                        site: art.site || 'Unknown',
                        gallery: art.gallery || 'Unknown',
                        description: art.description || '',
                        date: art.date || ''
                    };
                });

                // Get array of names from HALLS_DATA (ignoring case)
                const hallNames = (typeof HALLS_DATA !== 'undefined' ? HALLS_DATA : []).map(h => h.title.toLowerCase());
                
                // Filter out any API items that share a name with our injected Halls items to avoid duplicates
                const uniqueMappedAPI = mappedAPI.filter(art => !hallNames.includes(art.title.toLowerCase()));

                // Prepend Halls artifacts to the beginning of the list
                STATE.allArtifacts = [...(typeof HALLS_DATA !== 'undefined' ? HALLS_DATA : []), ...uniqueMappedAPI];
                
                populateFilterOptions();
                applyAllFilters();
            }
        } catch(e) {
            console.error("API artifacts unavailable", e);
            showNotification("Failed to load artifacts from the server", "error");
        }
        
        try {
            await initializeFavoriteStates();
        } catch(e) {
            console.error("Favorites init failed", e);
        }
        
        showLoading(false);
        console.log('✓ Collection Page Initialized dynamically with', STATE.allArtifacts.length, 'items');
    }

    // ============================================
    // ARTIFACT MODAL LOGIC
    // ============================================
    window.openArtifactModal = function(artifact) {
        const modal = document.getElementById('artifactModal');
        if (!modal) return;

        document.getElementById('modalImg').src = artifact.image || '';
        document.getElementById('modalTitle').textContent = artifact.title || 'Unknown';
        document.getElementById('modalDesc').textContent = artifact.description || 'No description available';
        document.getElementById('modalDynasty').textContent = artifact.dynasty || '';
        document.getElementById('modalPeriod').textContent = artifact.date || '';
        document.getElementById('modalDate').textContent = artifact.date || 'Unknown';
        document.getElementById('modalMaterial').textContent = artifact.material || 'Unknown';
        document.getElementById('modalSite').textContent = artifact.site || 'Unknown';
        document.getElementById('modalGallery').textContent = artifact.gallery || 'Unknown';

        const sigBlock = document.getElementById('modalSignificanceBlock');
        const sigText = document.getElementById('modalSignificance');

        if (artifact.significance) {
            sigText.textContent = artifact.significance;
            sigBlock.style.display = 'block';
        } else {
            sigBlock.style.display = 'none';
        }

        const favBtn = document.getElementById('modalFavBtn');

        if (STATE.favorites.has(artifact.id)) {
            favBtn.classList.add('active');
        } else {
            favBtn.classList.remove('active');
        }

        favBtn.onclick = async () => {
            if (!localStorage.getItem('token')) {
                showNotification('Please log in first', 'info');
                return;
            }

            const isFav = favBtn.classList.contains('active');

            try {
                if (isFav) {
                    await api.removeFavorite(artifact.id);
                    favBtn.classList.remove('active');
                    STATE.favorites.delete(artifact.id);
                    showNotification('Removed from favorites', 'info');
                } else {
                    await api.addFavorite(artifact.id);
                    favBtn.classList.add('active');
                    STATE.favorites.add(artifact.id);
                    showNotification('Added to favorites', 'success');
                }

                renderArtifacts();

            } catch (err) {
                console.error(err);
            }
        };

        const viewBtn = document.getElementById('modalViewBtn');
        viewBtn.onclick = () => {
            window.location.href = `../Artifact-show/code.html?id=${artifact.id}`;
        };

        const shareBtn = document.getElementById('modalShareBtn');
        shareBtn.onclick = () => {
            navigator.clipboard.writeText(window.location.href + `?artifact=${artifact.id}`);
            showNotification('Link copied!', 'success');
        };

        modal.classList.add('active');
    };

    function closeArtifactModal() {
        const modal = document.getElementById('artifactModal');
        if (modal) modal.classList.remove('active');
    }

    document.getElementById('closeArtifactModal')?.addEventListener('click', closeArtifactModal);
    document.getElementById('artifactModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'artifactModal') {
            closeArtifactModal();
        }
    });

    // ============================================
    // ROYAL ATMOSPHERE (Golden Dust & Shapes)
    // ============================================
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        
        if (!dustContainer || !shapesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 2 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            const duration = Math.random() * 8 + 12;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s infinite linear ${delay}s`;        
            dustContainer.appendChild(particle);
        }
        
        const hieroglyphs = ['𓂀', '𓋹', '𓅓', '𓇳', '𓇿', '𓆎', '𓃻', '𓂋', '𓏏', '𓈖'];
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.textContent = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
            
            const size = Math.random() * 15 + 15;
            shape.style.fontSize = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            shape.style.left = `${left}%`;
            shape.style.top = `${top}%`;
            
            const duration = Math.random() * 15 + 25;
            const delay = Math.random() * 15;
            shape.style.animation = `rotateFloat ${duration}s infinite ease-in-out ${delay}s`;
            
            shapesContainer.appendChild(shape);
        }
    }

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.removeAttribute('onclick');
    });

    document.querySelector('.main-content')?.addEventListener('click', (e) => {
        const card = e.target.closest('.artifact-card');
        const favBtn = e.target.closest('.favorite-btn');
        if (favBtn) {
            handleFavoriteClick({
                stopPropagation: () => e.stopPropagation(),
                currentTarget: favBtn
            });
            return;
        }
        if (card) {
            const id = card.dataset.id;
            if (id) {
                e.preventDefault();
                e.stopPropagation();
                const artifact = STATE.allArtifacts.find(a => String(a.id) === String(id) || String(a._id) === String(id));
                if (artifact) {
                    sessionStorage.setItem('currentArtifact', JSON.stringify(artifact));
                } else {
                    sessionStorage.removeItem('currentArtifact');
                }
                window.location.href = `../Artifact-show/code.html?id=${id}`;
            }
        }
    });

    // START
    initRoyalAtmosphere();
    initialize();
});
