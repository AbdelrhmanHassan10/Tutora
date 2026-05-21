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
      // SAMPLE DATA (Replace with API call)
      // ============================================
      const SAMPLE_ARTIFACTS = [{
              id: "6643b109558a239478145f07",
              title: "The Golden Mask",
              dynasty: "18th Dynasty",
              material: "Gold",
              site: "Valley of the Kings",
              gallery: "Royal Treasures",
              image: "./unnamed (1).png",
              description: "A magnificent golden mask from the New Kingdom period.",
              date: "1332 BCE"
          },
          {
              id: "6643b109558a239478145f08",
              title: "Painted Sarcophagus",
              dynasty: "Middle Kingdom",
              material: "Wood",
              site: "Saqqara",
              gallery: "Funerary Arts",
              image: "./unnamed (2).png",
              description: "Beautifully decorated wooden sarcophagus with hieroglyphics.",
              date: "1900 BCE"
          },
          {
              id: "6643b109558a239478145f09",
              title: "Royal Chariot",
              dynasty: "New Kingdom",
              material: "Wood & Gold",
              site: "Grand Hall Gallery",
              gallery: "Royal Treasures",
              image: "./royal_chariot_real.jpg",
              description: "An ornate royal chariot used for ceremonial purposes.",
              date: "1295 BCE"
          },
          {
              id: "6643b109558a239478145f0a",
              title: "Rosetta Stone",
              dynasty: "Ptolemaic Period",
              material: "Granite",
              site: "Rashid (Rosetta)",
              gallery: "Historical Monuments",
              image: "./rosetta_stone_real.jpg",
              description: "The famous stone that helped decode Egyptian hieroglyphics.",
              date: "196 BCE"
          },
          {
              id: "6643b109558a239478145f0b",
              title: "Canopic Jars",
              dynasty: "Ramesside Period",
              material: "Limestone",
              site: "Funerary Gallery",
              gallery: "Funerary Arts",
              image: "./Canopic Jarspng.png",
              description: "Set of four jars used to store mummified organs.",
              date: "1200 BCE"
          },
          {
              id: "6643b109558a239478145f0c",
              title: "Hunefer Papyrus",
              dynasty: "19th Dynasty",
              material: "Papyrus",
              site: "Theban Necropolis",
              gallery: "Ancient Texts",
              image: "./Hunefer Papyrus.jpg",
              description: "Ancient papyrus scroll with Book of the Dead inscriptions.",
              date: "1280 BCE"
          },
          {
              id: "6643b109558a239478145f0d",
              title: "Sphinx Model",
              dynasty: "Old Kingdom",
              material: "Limestone",
              site: "Giza Plateau",
              gallery: "Monumental Art",
              image: "./Sphinx Model.webp",
              description: "A miniature model of the Great Sphinx of Giza.",
              date: "2558 BCE"
          },
          {
              id: "6643b109558a239478145f0e",
              title: "Rosetta Stone Copy",
              dynasty: "Ptolemaic Period",
              material: "Granite",
              site: "Rashid (Rosetta)",
              gallery: "Historical Monuments",
              image: "./the-rosetta-stone.jpg",
              description: "A replica of the famous Rosetta Stone.",
              date: "196 BCE"
          },
          {
              id: "daily-1",
              title: "Inlaid Wooden Chair",
              dynasty: "New Kingdom",
              material: "Wood & Ivory",
              site: "Deir el-Medina",
              gallery: "Daily Life",
              image: "./daily_life_chair.png",
              description: "A remarkably preserved chair with ebony and ivory inlays, showcasing the luxury of Egyptian furniture.",
              date: "1350 BCE"
          },
          {
              id: "statue-1",
              title: "The Seated Scribe",
              dynasty: "5th Dynasty",
              material: "Limestone",
              site: "Saqqara",
              gallery: "Statuary",
              image: "./The Seated Scribewebp.webp",
              description: "A world-renowned masterpiece of painted limestone, capturing the lifelike focus of a royal scribe.",
              date: "2450 BCE"
          },
          {
              id: "jewel-1",
              title: "Golden Pectoral",
              dynasty: "Middle Kingdom",
              material: "Gold & Lapis",
              site: "Dahshur",
              gallery: "Jewelry",
              image: "./golden_pectoral_real.jpg",
              description: "A stunning ceremonial breastplate with a winged scarab, symbolizing eternal life and protection.",
              date: "1850 BCE"
          }
      ];

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
              const div = document.createElement('div');
              div.className = 'filter-option';
              div.innerHTML = `
                        <input type="checkbox" id="${filterType}_${option}" value="${option}" 
                               ${isChecked ? 'checked' : ''} data-filter-type="${filterType}">
                        <label for="${filterType}_${option}">${option}</label>
                    `;
              container.appendChild(div);
          });
      }

      window.applyFilter = function(filterType) {
          const checkboxes = document.querySelectorAll(`input[data-filter-type="${filterType}"]:checked`);
          STATE.filters[filterType] = Array.from(checkboxes).map(cb => cb.value);
          window.closeFilterModal(filterType + 'Modal');
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
          let displayList = [];
          
          if (hasActiveFilters) {
              sections.forEach(s => s.style.display = 'none');
              if (dynamicGallery) dynamicGallery.style.display = 'block';
              if (dynamicTitle) dynamicTitle.textContent = 'Search Results';
              if (dynamicDesc) dynamicDesc.textContent = `Found ${STATE.filteredArtifacts.length} items matching your criteria`;
              displayList = STATE.filteredArtifacts;
          } else {
              sections.forEach(s => s.style.display = 'block');
              
              // Only show the dynamic section if there are actually items from the Admin
              const adminItems = STATE.allArtifacts.filter(a => !a.id.toString().startsWith('6643') && !a.id.toString().includes('daily-') && !a.id.toString().includes('statue-') && !a.id.toString().includes('jewel-'));
              
              if (adminItems.length > 0) {
                  if (dynamicGallery) dynamicGallery.style.display = 'block';
                  if (dynamicTitle) dynamicTitle.textContent = 'Recent Discoveries';
                  if (dynamicDesc) dynamicDesc.textContent = 'New artifacts added by our curators.';
                  displayList = adminItems;
              } else {
                  if (dynamicGallery) dynamicGallery.style.display = 'none';
              }
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
          
          let sourceList = customList;
          if (!sourceList) {
              const hasActiveFilters = Object.values(STATE.filters).some(f => 
                  (Array.isArray(f) && f.length > 0) || (typeof f === 'string' && f !== '')
              );
              if (hasActiveFilters) {
                  sourceList = STATE.filteredArtifacts;
              } else {
                  // Default view: ONLY show admin-added items (exclude samples)
                  sourceList = STATE.allArtifacts.filter(a => 
                      !a.id.toString().startsWith('6643') && 
                      !a.id.toString().includes('daily-') && 
                      !a.id.toString().includes('statue-') && 
                      !a.id.toString().includes('jewel-')
                  );
              }
          }
          
          const endIdx = STATE.currentPage * CONFIG.ITEMS_PER_PAGE;
          const displayArtifacts = sourceList.slice(0, endIdx);
          
          // Total items count text
          const countLabel = document.getElementById('totalResultsText');
          const heroCountLabel = document.querySelector('.count-text');
          
          const totalCount = sourceList.length;
          const displayCount = displayArtifacts.length;

          const hasActiveFilters = Object.values(STATE.filters).some(f => 
              (Array.isArray(f) && f.length > 0) || (typeof f === 'string' && f !== '')
          );

          if (countLabel) countLabel.textContent = `Showing ${displayCount} of ${totalCount} results`;
          if (heroCountLabel) {
              if (hasActiveFilters) {
                  heroCountLabel.textContent = `Showing ${displayCount} of ${totalCount} artifacts`;
              } else {
                  // In thematic mode, count the static HTML cards
                  const staticCards = document.querySelectorAll('.collection-section .artifact-card');
                  heroCountLabel.textContent = `Showing ${staticCards.length} of 42,000 artifacts`;
              }
          }

          grid.className = `artifact-grid ${STATE.viewMode}`;
          grid.innerHTML = ''; // This will be optimized to append only in a real app, but works for the current scale

          console.log(`Rendering ${displayArtifacts.length} artifacts to grid...`);

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


      // ============================================
      // NAVIGATION & THEME (Handled by global-core.js)
      // ============================================

      // Search
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

      // Filter Buttons
      document.getElementById('dynastyFilterBtn') ?.addEventListener('click', () => openFilterModal('dynastyModal'));
      document.getElementById('materialFilterBtn') ?.addEventListener('click', () => openFilterModal('materialModal'));
      document.getElementById('siteFilterBtn') ?.addEventListener('click', () => openFilterModal('siteModal'));
      document.getElementById('galleryFilterBtn') ?.addEventListener('click', () => openFilterModal('galleryModal'));

      // Reset Filters
      document.getElementById('resetFiltersBtn') ?.addEventListener('click', () => {
          STATE.filters = { dynasty: [], material: [], site: [], gallery: [], search: '' };
          STATE.currentPage = 1;
          if (mainSearch) mainSearch.value = '';
          if (headerSearch) headerSearch.value = '';
          applyAllFilters();
          showNotification('Filters reset.', 'info');
      });

      // ============================================
      // MOBILE NAVIGATION
      // ============================================
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

      // Mobile Dropdowns
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

      // Close menu when clicking links
      document.querySelectorAll('.menu-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
          link.addEventListener('click', closeMenu);
      });

      // View Toggle
      document.querySelectorAll('.view-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
              e.target.closest('button').classList.add('active');
              STATE.viewMode = e.target.closest('button').dataset.view;
              renderArtifacts();
          });
      });

      // Load More Button
      const loadMoreBtn = document.querySelector('.load-more-btn');
      if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
              // Since we are always dynamic now, we don't need this transition logic
              // Just load the next page

              STATE.currentPage++;
              renderArtifacts();
              
              // Only hide the button if we've reached the end
              const totalItems = STATE.filteredArtifacts.length;
              if (STATE.currentPage * CONFIG.ITEMS_PER_PAGE >= totalItems) {
                  const loadMoreSection = document.querySelector('.load-more-section');
                  if (loadMoreSection) loadMoreSection.style.display = 'none';
              }
          });
      }

      // Close modals on outside click
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
          
          // 1. Instantly load sample data to ensure zero-wait rendering
          STATE.allArtifacts = [...SAMPLE_ARTIFACTS];
          populateFilterOptions();
          applyAllFilters();
          showLoading(false);
          
          // 2. Fetch dynamic API data asynchronously
          try {
              const res = await fetch('https://gem-backend-production-1ea2.up.railway.app/api/artifacts');
              if (res.ok) {
                  const data = await res.json();
                  const fetchedData = Array.isArray(data) ? data : (data.artifacts || data.data || []);
                  
                  const mappedAPI = fetchedData.map(art => ({
                      ...art,
                      id: art._id || art.id,
                      title: art.title || art.name || 'Unknown',
                      image: art.image || art.imageUrl || './unnamed (1).png',
                      dynasty: art.dynasty || art.era || 'Unknown',
                      material: art.material || 'Unknown',
                      site: art.site || 'Unknown',
                      gallery: art.gallery || 'Unknown',
                      description: art.description || '',
                      date: art.date || ''
                  }));

                  // Merge API artifacts with Samples
                  const collectionArtifacts = mappedAPI.filter(art => !art.category || art.category === 'collection' || art.category === 'both');
                  STATE.allArtifacts = [...collectionArtifacts, ...SAMPLE_ARTIFACTS];
                  
                  // Re-apply filters to update grid with new data silently
                  populateFilterOptions();
                  applyAllFilters();
              }
          } catch(e) {
              console.warn("API artifacts unavailable, relying on mock data.", e);
          }
          
          try {
              await initializeFavoriteStates();
          } catch(e) {
              console.error("Favorites init failed", e);
          }
          console.log('✓ Collection Page Initialized with', STATE.allArtifacts.length, 'items');
      }

            // ============================================
      // ARTIFACT MODAL LOGIC
      // ============================================
     // ============================================
// ARTIFACT MODAL LOGIC (UPDATED)
// ============================================

window.openArtifactModal = function(artifact) {
    const modal = document.getElementById('artifactModal');
    if (!modal) return;

    // Fill Data
    document.getElementById('modalImg').src = artifact.image || '';
    document.getElementById('modalTitle').textContent = artifact.title || 'Unknown';
    document.getElementById('modalDesc').textContent = artifact.description || 'No description available';

    document.getElementById('modalDynasty').textContent = artifact.dynasty || '';
    document.getElementById('modalPeriod').textContent = artifact.date || '';

    document.getElementById('modalDate').textContent = artifact.date || 'Unknown';
    document.getElementById('modalMaterial').textContent = artifact.material || 'Unknown';
    document.getElementById('modalSite').textContent = artifact.site || 'Unknown';
    document.getElementById('modalGallery').textContent = artifact.gallery || 'Unknown';

    // Significance (اختياري)
    const sigBlock = document.getElementById('modalSignificanceBlock');
    const sigText = document.getElementById('modalSignificance');

    if (artifact.significance) {
        sigText.textContent = artifact.significance;
        sigBlock.style.display = 'block';
    } else {
        sigBlock.style.display = 'none';
    }

    // Favorite Button
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

    // View Button
    const viewBtn = document.getElementById('modalViewBtn');
    viewBtn.onclick = () => {
        window.location.href = `../Artifact-show/code.html?id=${artifact.id}`;
    };

    // Share Button (NEW)
    const shareBtn = document.getElementById('modalShareBtn');
    shareBtn.onclick = () => {
        navigator.clipboard.writeText(window.location.href + `?artifact=${artifact.id}`);
        showNotification('Link copied!', 'success');
    };

    // Open modal
    modal.classList.add('active');
    };

    // CLOSE MODAL
    function closeArtifactModal() {
        const modal = document.getElementById('artifactModal');
        if (modal) modal.classList.remove('active');
    }

    // Close button
    document.getElementById('closeArtifactModal')?.addEventListener('click', closeArtifactModal);

    // Click outside
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

        // Create 50 dust particles for optimized performance
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
        // Create 15 royal shapes (Hieroglyphs)
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
    // Clean up all inline onclick attributes from static buttons to prevent double-navigation
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.removeAttribute('onclick');
    });
    // Unified click listener on .main-content (handles both static and dynamic cards)
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
                // Pass pre-loaded artifact data to Artifact Show page for instant rendering
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