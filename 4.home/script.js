document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-1ea2.up.railway.app/api';
    const isMobile = window.innerWidth < 768;

    // ============================================
    // 1. NAVIGATION & MENU LOGIC
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const toggleMenu = (open) => {
        mobileMenu?.classList.toggle('active', open);
        menuOverlay?.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuBtn?.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
    menuOverlay?.addEventListener('click', () => toggleMenu(false));

    // Dropdown Menus (Mobile)
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownItems = toggle.nextElementSibling;
            if (dropdownItems) {
                toggle.classList.toggle('active');
                dropdownItems.classList.toggle('show');
            }
        });
    });

    // ============================================
    // 2. DATA FETCHING (Artifacts & Events)
    // ============================================
    const initData = async () => {
        try {
            // Fetch Artifact of the Day
            const artifactRes = await fetch(`${API_URL}/artifacts`);
            if (artifactRes.ok) {
                const artifacts = await artifactRes.json();
                if (artifacts?.length) {
                    const item = artifacts[Math.floor(Math.random() * artifacts.length)];
                    const panel = document.querySelector('.curator-panel');
                    if (panel) {
                        const img = panel.querySelector('.curator-image');
                        const title = panel.querySelector('.highlight-title');
                        const desc = panel.querySelector('.artifact-desc');
                        const link = panel.querySelector('a[href*="advanced-3D.html"]');

                        if (img && item.imageUrl) img.style.backgroundImage = `url('${item.imageUrl}')`;
                        if (title) title.textContent = item.name;
                        if (desc) desc.textContent = item.description?.substring(0, 150) + '...';
                        if (link && item._id) link.href = `../Artifact-show/Artifact-show.html?id=${item._id}`;
                    }
                }
            }

            // Fetch Events
            const eventRes = await fetch(`${API_URL}/events`);
            if (eventRes.ok) {
                const events = await eventRes.json();
                if (events?.length) {
                    const eventsGrid = document.querySelector('.events-grid');
                    if (eventsGrid) {
                        const upcomingEvents = events.slice(0, 3);
                        eventsGrid.innerHTML = '';
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                        upcomingEvents.forEach(evt => {
                            const dateObj = new Date(evt.date);
                            const monthStr = months[dateObj.getMonth()] || 'TBD';
                            let dayStr = dateObj.getDate() ? String(dateObj.getDate()).padStart(2, '0') : '--';
                            
                            const eventCard = document.createElement('div');
                            eventCard.className = 'event-card reveal';
                            eventCard.innerHTML = `
                                <div class="event-date">${monthStr}<br><strong>${dayStr}</strong></div>
                                <div class="event-details">
                                    <h4>${evt.title}</h4>
                                    <p>${evt.description?.substring(0, 80)}...</p>
                                </div>
                            `;
                            eventCard.addEventListener('click', () => { window.location.href = '../event/event.html'; });
                            eventsGrid.appendChild(eventCard);
                        });
                    }
                }
            }
        } catch (e) { console.error("Data load failed", e); }
    };

    // ============================================
    // 3. ATMOSPHERIC EFFECTS & PERFORMANCE
    // ============================================
    // Define a lighter version specifically for the Home page to optimize performance
    window.initRoyalAtmosphere = () => {
        const dustContainer = document.getElementById('dust-container');
        if (!dustContainer) return;

        // 1. Generate Atmospheric Dust (Mobile Optimized)
        const particleCount = isMobile ? 40 : 80; 
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 1.5 + 0.5;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.animationDuration = (Math.random() * 10 + 10) + 's';
            dust.style.animationDelay = (Math.random() * -15) + 's';
            dustContainer.appendChild(dust);
        }

    };

    const initEffects = () => {
        // Initialize Royal Atmosphere
        if (window.initRoyalAtmosphere) window.initRoyalAtmosphere();

        // Desktop Only: Light 3D Parallax
        const hero = document.querySelector('.hero');
        const content = document.querySelector('.hero-content');
        if (hero && content && !isMobile) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                content.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                content.style.transform = 'rotateY(0) rotateX(0)';
            });
        }
    };

    // ============================================
    // 4. SCROLL OPTIMIZATION (Progress & Header)
    // ============================================
    const initScroll = () => {
        const header = document.querySelector('.header');
        const progress = document.getElementById('scrollProgress');
        
        // Note: Scroll Reveal animations are now handled globally by smooth-reveal.js
        // to ensure better performance and unified transitions.

        // Optimized Header & Progress updates
        let ticking = false;
        let lastScrollY = window.scrollY;
        let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let isScrolled = lastScrollY > 50;

        // Cache total height and update on resize
        window.addEventListener('resize', () => {
            totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Update progress bar
                    if (progress && totalHeight > 0) {
                        const pct = Math.min(100, Math.max(0, (lastScrollY / totalHeight) * 100));
                        progress.style.width = pct + '%';
                    }

                    // Toggle header state only when changed
                    const shouldBeScrolled = lastScrollY > 50;
                    if (shouldBeScrolled !== isScrolled) {
                        isScrolled = shouldBeScrolled;
                        header?.classList.toggle('scrolled', isScrolled);
                        
                        // Subtle logo shrink
                        const logoCircle = header?.querySelector('.logo-circle');
                        if (logoCircle) {
                            logoCircle.style.transform = isScrolled ? 'scale(0.9)' : 'scale(1)';
                        }
                    }

                    
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // --- Hero Background Slider ---
    const initSlider = () => {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        if (slides.length > 0) {
            let currentSlide = 0;
            let slideInterval;

            const showSlide = (index) => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (index + slides.length) % slides.length;
                slides[currentSlide].classList.add('active');
            };

            const startSlider = () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    showSlide(currentSlide + 1);
                }, 5000);
            };

            if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); startSlider(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); startSlider(); });

            startSlider();
        }
    };

    // Initialize All Modules
    initData();
    initEffects();
    initScroll();
    initSlider();

    console.log('✓ Home System Optimized & Synced');
});


/* ============================================
   MUSEUM MAP INTERACTION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const mapHalls = document.querySelectorAll('.map-hall');
    const legendItems = document.querySelectorAll('.legend-item');
    const tooltip = document.getElementById('mapTooltip');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipDesc = document.getElementById('tooltipDesc');

    // 1. Tooltip Follow Mouse
    const moveTooltip = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        tooltip.style.transform = \	ranslate(\px, \px)\;
        tooltip.style.position = 'fixed';
        tooltip.style.left = '0';
        tooltip.style.top = '0';
    };

    // 2. Hall Interactions
    mapHalls.forEach(hall => {
        hall.addEventListener('mouseenter', (e) => {
            const name = hall.getAttribute('data-name');
            const desc = hall.getAttribute('data-desc');
            tooltipTitle.innerText = name;
            tooltipDesc.innerText = desc;
            tooltip.classList.add('visible');
            
            // Sync with legend
            const hallId = hall.getAttribute('data-id');
            legendItems.forEach(item => {
                if(item.getAttribute('data-hall') === hallId) item.classList.add('active');
            });
        });

        hall.addEventListener('mousemove', moveTooltip);

        hall.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            legendItems.forEach(item => item.classList.remove('active'));
        });
    });

    // 3. Legend Interactions
    legendItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const hallId = item.getAttribute('data-hall');
            mapHalls.forEach(hall => {
                if(hall.getAttribute('data-id') === hallId) hall.classList.add('active-hall');
            });
        });

        item.addEventListener('mouseleave', () => {
            mapHalls.forEach(hall => hall.classList.remove('active-hall'));
        });
    });
});


/* ============================================
   ENHANCED MAP INTERACTION (PARTITIONS)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const tooltipNumber = document.getElementById('tooltipNumber');
    const allHalls = document.querySelectorAll('.map-hall');

    allHalls.forEach(hall => {
        hall.addEventListener('mouseenter', () => {
            const num = hall.getAttribute('data-num');
            if(tooltipNumber) tooltipNumber.innerText = num;
        });
    });
});


/* ============================================
   MAP MODAL INTERACTION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('mapModal');
    const modalClose = document.getElementById('modalClose');
    const markers = document.querySelectorAll('.interactive-marker');
    
    const modalTitle = document.getElementById('modalGalleryTitle');
    const modalPeriod = document.getElementById('modalPeriod');
    const modalArtefacts = document.getElementById('modalArtefacts');

    // 1. Open Modal on Marker Click
    markers.forEach(marker => {
        marker.addEventListener('click', () => {
            const num = marker.getAttribute('data-num');
            const period = marker.getAttribute('data-period');
            const artefacts = marker.getAttribute('data-artefacts').split(',');

            modalTitle.innerText = \Gallery \\;
            modalPeriod.innerText = period;
            
            // Clear and populate artefacts
            modalArtefacts.innerHTML = '';
            artefacts.forEach(art => {
                const li = document.createElement('li');
                li.innerText = art.trim();
                modalArtefacts.appendChild(li);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    // 2. Close Modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});


/* ============================================
   ULTIMATE MAP LOGIC (SEARCH & THEME)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const mapSearch = document.getElementById('mapSearch');
    const themeToggle = document.getElementById('mapThemeToggle');
    const allHalls = document.querySelectorAll('.map-hall');
    const mapContainer = document.querySelector('.interactive-map-section');

    // 1. Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = mapContainer.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        mapContainer.setAttribute('data-theme', newTheme);
        themeToggle.innerText = newTheme === 'light' ? 'Switch to Dark' : 'Switch to Light';
    });

    // 2. Real-time Search
    mapSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        allHalls.forEach(hall => {
            const name = hall.getAttribute('data-name').toLowerCase();
            const num = hall.getAttribute('data-num').toLowerCase();
            
            if (query && (name.includes(query) || num.includes(query))) {
                hall.classList.add('active-hall');
                hall.style.opacity = '1';
            } else if (query) {
                hall.classList.remove('active-hall');
                hall.style.opacity = '0.3';
            } else {
                hall.classList.remove('active-hall');
                hall.style.opacity = '1';
            }
        });
    });
});


/* ============================================
   DYNAMIC MULTI-LEVEL MAP SYSTEM
   ============================================ */
const LEVEL_DATA = {
    'L1': {
        halls: [
            { d: 'M450 600 L550 600 L550 200 L450 200 Z', name: 'The Grand Stairs (Base)', num: 'GS', desc: 'Starting your journey through the chronological ages.' },
            { d: 'M150 150 L350 150 L350 50 L150 50 Z', name: 'Old Kingdom Galleries', num: 'OK', desc: 'Pyramids, Sphinxes, and the birth of a nation.' },
            { d: 'M300 700 L700 700 L700 620 L300 620 Z', name: 'Grand Atrium', num: 'GA', desc: 'Home to the Colossal Statue of Ramses II.' }
        ],
        markers: [
            { x: 500, y: 650, name: 'Statue of Ramses II', desc: 'The 3,200-year-old masterpiece greeting all guests.' }
        ]
    },
    'L2': {
        halls: [
            { d: 'M100 400 L400 400 L400 200 L100 200 Z', name: 'Tutankhamun Galleries', num: 'Tut', desc: 'The golden treasures of the Boy King in their entirety.' },
            { d: 'M400 150 L600 150 L600 50 L400 50 Z', name: 'Middle Kingdom', num: 'MK', desc: 'Classical literature and exquisite jewelry of the Middle Kingdom.' }
        ],
        markers: [
            { x: 250, y: 300, name: 'Gold Mask of Tutankhamun', desc: 'The iconic death mask of the 18th dynasty pharaoh.' }
        ]
    },
    'L3': {
        halls: [
            { d: 'M700 400 L950 400 L950 250 L700 250 Z', name: 'Solar Boat Museum', num: 'SB', desc: 'The legendary vessel of Khufu, perfectly preserved.' },
            { d: 'M650 150 L850 150 L850 50 L650 50 Z', name: 'Library & Research Center', num: 'LIB', desc: 'One of the largest Egyptology libraries in the world.' }
        ],
        markers: [
            { x: 825, y: 325, name: 'Khufu Solar Boat', desc: 'An ancient vessel built for the Pharaoh\'s journey to the afterlife.' }
        ]
    }
};

function updateMap(level) {
    const svg = document.querySelector('.museum-svg.isometric');
    const data = LEVEL_DATA[level];
    
    // Clear existing dynamic content
    const existingHalls = svg.querySelectorAll('.isometric-hall');
    const existingMarkers = svg.querySelectorAll('.neon-marker-group');
    existingHalls.forEach(h => h.remove());
    existingMarkers.forEach(m => m.remove());

    // Add new halls
    data.halls.forEach(h => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'isometric-hall');
        path.setAttribute('d', h.d);
        path.setAttribute('data-name', h.name);
        path.setAttribute('data-num', h.num);
        path.setAttribute('data-desc', h.desc);
        svg.appendChild(path);
    });

    // Add new markers
    data.markers.forEach(m => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'neon-marker-group');
        group.setAttribute('style', \	ransform: translate(\px, \px);\);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'neon-marker');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '-30');
        circle.setAttribute('r', '10');
        circle.setAttribute('data-name', m.name);
        circle.setAttribute('data-desc', m.desc);
        
        group.appendChild(circle);
        svg.appendChild(group);
    });

    // Re-bind tooltips
    bindMapEvents();
}

function bindMapEvents() {
    const tooltip = document.getElementById('mapTooltip');
    const tooltipNum = document.getElementById('tooltipNumber');
    const tooltipTitle = document.getElementById('tooltipTitle');
    const tooltipDesc = document.getElementById('tooltipDesc');

    document.querySelectorAll('.isometric-hall, .neon-marker').forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const name = item.getAttribute('data-name');
            const num = item.getAttribute('data-num') || 'Point';
            const desc = item.getAttribute('data-desc');
            
            tooltipTitle.innerText = name;
            tooltipNum.innerText = num;
            tooltipDesc.innerText = desc;
            tooltip.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
    });
}

document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.level-btn.active').classList.remove('active');
        btn.classList.add('active');
        updateMap(btn.innerText);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => updateMap('L1'));


/* ============================================
   ADVANCED NAVIGATION & PATHFINDING
   ============================================ */
const NAV_DATA = {
    'L1': {
        directions: {
            'GS': 'From the Main Entrance, walk straight past the Ramses II statue. The stairs are directly ahead.',
            'OK': 'Enter the Ground Floor West Wing. Turn left immediately after the info desk.',
            'GA': 'You are currently in the Grand Atrium. The Colossal Statue is in the center.'
        }
    },
    'L2': {
        directions: {
            'Tut': 'Take the Grand Stairs to Level 2. Turn left into the dedicated Tutankhamun wing.',
            'MK': 'Located on the Central Mezzanine. Follow the signs from the Grand Stairs landing.'
        }
    },
    'L3': {
        directions: {
            'SB': 'Use the dedicated elevator in the East Wing or take the Grand Stairs to the summit.',
            'LIB': 'Located in the quiet zone of the North-East wing. Accessible via the Level 3 main bridge.'
        }
    }
};

function showHallDetail(name, num, desc, level) {
    const modal = document.getElementById('mapModal');
    const title = document.getElementById('modalGalleryTitle');
    const period = document.getElementById('modalPeriod');
    const descText = document.getElementById('modalDesc');
    
    // Add navigation info
    const navInfo = NAV_DATA[level].directions[num] || 'Follow the digital signage from the Grand Atrium.';
    
    title.innerText = name + ' (' + num + ')';
    period.innerText = 'Level ' + level;
    descText.innerHTML = \
        <div class='info-block'>
            <strong>About:</strong><br>\
        </div>
        <div class='nav-block' style='margin-top: 1.5rem; padding: 1rem; background: rgba(236,182,19,0.1); border-radius: 10px; border-left: 4px solid #ecb613;'>
            <strong style='color: #ecb613;'>How to reach:</strong><br>\
        </div>
    \;
    
    modal.classList.add('active');
}

// Update the click handler in updateMap or bindMapEvents
function rebindClickHandlers(level) {
    document.querySelectorAll('.isometric-hall, .neon-marker').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            const num = item.getAttribute('data-num') || 'Point';
            const desc = item.getAttribute('data-desc');
            showHallDetail(name, num, desc, level);
        });
    });
}


// Override the updateMap to include level-aware click rebinding
const originalUpdateMap = updateMap;
updateMap = function(level) {
    originalUpdateMap(level);
    rebindClickHandlers(level);
};


/* ============================================
   ROBUST DYNAMIC INJECTION
   ============================================ */
function updateMap(level) {
    const mapLayer = document.getElementById('dynamicMapLayer');
    if (!mapLayer) return;
    
    const data = LEVEL_DATA[level];
    mapLayer.innerHTML = ''; // Clear only the dynamic layer

    // Inject Halls
    data.halls.forEach(h => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'isometric-hall');
        path.setAttribute('d', h.d);
        path.setAttribute('data-name', h.name);
        path.setAttribute('data-num', h.num);
        path.setAttribute('data-desc', h.desc);
        mapLayer.appendChild(path);
    });

    // Inject Markers
    data.markers.forEach(m => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'neon-marker-group');
        group.setAttribute('style', \	ransform: translate(\px, \px);\);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'neon-marker');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '-30');
        circle.setAttribute('r', '15');
        circle.setAttribute('data-name', m.name);
        circle.setAttribute('data-desc', m.desc);
        
        group.appendChild(circle);
        mapLayer.appendChild(group);
    });

    rebindClickHandlers(level);
}

