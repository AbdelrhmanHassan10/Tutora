document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';

    // ============================================
    // 1. HOME-SPECIFIC LOGIC
    // ============================================

    // Note: Global Auth and Theme is handled by global-core.js
    // If you need to add home-specific logic, do it here.

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
                toggle.classList.toggle('active'); // Rotates arrow and changes color
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
    
    const directionsBtn = document.querySelector('.btn-directions');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', () => {
            window.open('https://www.google.com/maps/search/Grand+Egyptian+Museum', '_blank');
        });
    }

    // --- Hero Background Slider with Manual Controls ---
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
            }, 5000); // 5s cycle for a cinematic feel
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
                startSlider(); // Restart interval on interaction
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
                startSlider(); // Restart interval on interaction
            });
        }

        startSlider(); // Initial start
    }

    // ============================================
    // 2. DYNAMIC API INTEGRATION (Artifact of the Day & Events)
    // ============================================

    // Fetch and display Artifact of the Day
    async function fetchArtifactOfTheDay() {
        try {
            const res = await fetch(`${API_URL}/artifacts`);
            if (res.ok) {
                const artifacts = await res.json();
                if (artifacts && artifacts.length > 0) {
                    // Pick a random artifact for "Artifact of the Day"
                    const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];
                    
                    const curatorPanel = document.querySelector('.curator-panel');
                    if (curatorPanel) {
                        const curatorImg = curatorPanel.querySelector('.curator-image');
                        const highlightTitle = curatorPanel.querySelector('.highlight-title');
                        const artifactDesc = curatorPanel.querySelector('.artifact-desc');
                        const exploreBtn = curatorPanel.querySelector('a[href*="advanced-3D.html"]');

                        if (curatorImg && randomArtifact.imageUrl) {
                            curatorImg.style.backgroundImage = `url('${randomArtifact.imageUrl}')`;
                        }
                        if (highlightTitle) {
                            highlightTitle.textContent = randomArtifact.name;
                        }
                        if (artifactDesc) {
                            artifactDesc.textContent = randomArtifact.description || `Experience the legacy of the ${randomArtifact.era || 'ancient'} era.`;
                        }
                        if (exploreBtn && randomArtifact._id) {
                            exploreBtn.href = `../Artifact-show/Artifact-show.html?id=${randomArtifact._id}`;
                            // Change text to reflect that we are viewing the artifact 
                            const btnInner = exploreBtn.querySelector('.btn-action-gold');
                            if(btnInner) {
                                btnInner.innerHTML = `Explore Artifact <span class="material-symbols-outlined">arrow_forward</span>`;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching artifacts:', error);
        }
    }

    // Fetch and display Events
    async function fetchEvents() {
        try {
            const res = await fetch(`${API_URL}/events`);
            if (res.ok) {
                const events = await res.json();
                if (events && events.length > 0) {
                    const eventsGrid = document.querySelector('.events-grid');
                    if (eventsGrid) {
                        // Take up to 3 upcoming events alphabetically or just first 3
                        const upcomingEvents = events.slice(0, 3);
                        eventsGrid.innerHTML = ''; // Clear static events

                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                        upcomingEvents.forEach(evt => {
                            const dateObj = new Date(evt.date);
                            const monthStr = months[dateObj.getMonth()] || 'TBD';
                            let dayStr = dateObj.getDate() ? String(dateObj.getDate()).padStart(2, '0') : '--';
                            if (isNaN(dateObj.getTime())) {
                                dayStr = '--';
                            }

                            const eventCard = document.createElement('div');
                            eventCard.className = 'event-card';
                            
                            // Truncate description mapping to static HTML structure
                            const shortDesc = evt.description ? (evt.description.length > 80 ? evt.description.substring(0, 80) + '...' : evt.description) : '';
                            
                            eventCard.innerHTML = `
                                <div class="event-date">${monthStr}<br><strong>${dayStr}</strong></div>
                                <div class="event-details">
                                    <h4>${evt.title}</h4>
                                    <p>${shortDesc}</p>
                                </div>
                            `;
                            
                            // Optional: Make the event card clickable to navigate to the event page
                            eventCard.style.cursor = 'pointer';
                            eventCard.addEventListener('click', () => {
                                window.location.href = '../event/event.html';
                            });

                            eventsGrid.appendChild(eventCard);
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    fetchArtifactOfTheDay();
    fetchEvents();

    console.log('✓ Home Logic Loaded');
});

