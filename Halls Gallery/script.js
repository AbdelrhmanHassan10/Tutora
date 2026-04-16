/**
 * Tutora Halls Gallery - Advanced Interactions
 * Features: Cinematic Parallax, Scroll Revelations, Dynamic Content Loading, Video Gallery
 */

(function() {
    function initGallery() {
        initStandardNavigation();
        initScrollRevelations();
        initParallaxHero();
        initHallInteractions();
        initChronologicalFilter();
        initVideoGallery();
    }

    // Safety: Run immediately if DOM ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    /**
     * Standard Header & Mobile Menu Logic
     */
    function initStandardNavigation() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const themeBtn = document.getElementById('themeBtn');

        function openMenu() {
            if (mobileMenu) mobileMenu.classList.add('active');
            if (menuOverlay) menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log("Tutora: Menu Opened");
        }

        function closeMenu() {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log("Tutora: Menu Closed");
        }

        // Use document-level delegation to be absolutely sure we catch the click
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Check for Open Button
            if (target.closest('#menuBtn') || target.closest('.menu-btn')) {
                e.preventDefault();
                openMenu();
            }
            
            // Check for Close Button or Overlay
            if (target.closest('#closeBtn') || target.closest('.close-btn') || target.closest('#menuOverlay')) {
                e.preventDefault();
                closeMenu();
            }
            
            // Check for Dropdown Toggles inside Mobile Menu
            const dropdownToggle = target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                e.preventDefault();
                e.stopPropagation();
                const parent = dropdownToggle.closest('.menu-dropdown');
                const items = parent ? parent.querySelector('.dropdown-items') : null;
                
                dropdownToggle.classList.toggle('active');
                if (items) {
                    items.classList.toggle('show');
                }
            }
        });

        // Theme Toggle - Sync with Global (uses 'theme' key)
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'dark';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                
                if (window.applyTheme) {
                    window.applyTheme();
                } else {
                    document.body.classList.toggle('dark', newTheme === 'dark');
                    document.body.classList.toggle('light', newTheme === 'light');
                }
            });
        }
    }

    /**
     * Cinematic Parallax for Hero
     */
    function initParallaxHero() {
        const heroImg = document.querySelector('.hero-video-bg img');
        if (!heroImg) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 + scrolled * 0.0005})`;
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                    heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
                }
            }
        });
    }

    /**
     * Hall Card Dynamic Interactions
     */
    function initHallInteractions() {
        const cards = document.querySelectorAll('.hall-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = (x / rect.width - 0.5) * 15;
                const yPercent = (y / rect.height - 0.5) * 15;
                
                const img = card.querySelector('.hall-card-img');
                if (img) {
                    img.style.transform = `scale(1.15) translate(${xPercent}px, ${yPercent}px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('.hall-card-img');
                if (img) {
                    img.style.transform = 'scale(1) translate(0, 0)';
                }
            });
        });
    }

    /**
     * Chronological Gallery Filtering
     */
    function initChronologicalFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const hallBoxes = document.querySelectorAll('.hall-box');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.filter;
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                hallBoxes.forEach(box => {
                    if (category === 'all' || box.dataset.category === category) {
                        box.style.display = 'block';
                        setTimeout(() => box.style.opacity = '1', 10);
                    } else {
                        box.style.opacity = '0';
                        setTimeout(() => box.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    /**
     * Video Gallery — Fetches from API with YouTube fallback
     */
    function initVideoGallery() {
        const videoGrid = document.getElementById('videoGrid');
        if (!videoGrid) return;

        // Curated fallback videos: real GEM & Egyptian artifact content from YouTube
        const FALLBACK_VIDEOS = [
            {
                title: "The Truth About King Tut's Golden Mask",
                description: "National Geographic's full episode exploring the world's most famous golden death mask — 11kg of solid gold, crafted over 3,300 years ago.",
                youtubeId: "UmL4uPn6xe0",
                duration: "45:00",
                badge: "Royal Treasures"
            },
            {
                title: "Building The Great Pyramid of Giza",
                description: "Follow archaeologists as they explore restricted areas and unlock secrets about the construction of the world's greatest monument.",
                youtubeId: "hO3tE1v57D0",
                duration: "44:21",
                badge: "Lost Treasures"
            },
            {
                title: "Evolution of Ancient Egypt's Pyramids",
                description: "Trace the architectural evolution from simple mastabas to the towering Great Pyramid — a journey through millennia of engineering.",
                youtubeId: "TMkoX1kfyDs",
                duration: "44:14",
                badge: "Documentary"
            },
            {
                title: "Great Pyramid Mystery — How Was It Built?",
                description: "Jean-Pierre Houdin's revolutionary theory about an internal ramp system that could explain the pyramid's construction.",
                youtubeId: "S38pY22j83M",
                duration: "50:38",
                badge: "Engineering"
            },
            {
                title: "Secrets of Ancient Egypt's Pharaohs",
                description: "Discover the lives, deaths, and divine rituals of the pharaohs who ruled the Nile Valley for over 3,000 years.",
                youtubeId: "wPeLkPHCcTM",
                duration: "51:23",
                badge: "Pharaohs"
            },
            {
                title: "Egypt's Valley of the Kings",
                description: "Journey deep into the sacred necropolis where the greatest pharaohs of the New Kingdom were laid to rest.",
                youtubeId: "F9P-ho2UTDA",
                duration: "46:15",
                badge: "Exploration"
            }
        ];

        // Show loading state
        videoGrid.innerHTML = '<div class="video-loading" style="grid-column: 1/-1;"><span class="material-symbols-outlined">hourglass_top</span><p>Loading gallery...</p></div>';

        // Try API first, then fallback
        fetch('https://gem-backend-production-cb6d.up.railway.app/api/videos')
            .then(res => res.json())
            .then(apiVideos => {
                if (Array.isArray(apiVideos) && apiVideos.length > 0) {
                    renderApiVideos(apiVideos);
                } else {
                    renderFallbackVideos();
                }
            })
            .catch(() => {
                renderFallbackVideos();
            });

        function renderApiVideos(videos) {
            videoGrid.innerHTML = videos.map(video => {
                const dur = video.duration ? formatDuration(video.duration) : '';
                return `
                <div class="video-card anim-reveal" data-url="${video.url}">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail || ''}" alt="${video.title}" />
                        <div class="video-overlay"></div>
                        <div class="video-play-btn">
                            <span class="material-symbols-outlined">play_arrow</span>
                        </div>
                        ${dur ? '<span class="video-duration">' + dur + '</span>' : ''}
                    </div>
                    <div class="video-info">
                        <span class="video-badge">Museum Collection</span>
                        <h3>${video.title}</h3>
                        <p>${video.description || 'Explore this artifact from the Grand Egyptian Museum collection.'}</p>
                    </div>
                </div>`;
            }).join('');

            attachPlayHandlers();
            reinitReveals();
        }

        function renderFallbackVideos() {
            videoGrid.innerHTML = FALLBACK_VIDEOS.map(video => `
                <div class="video-card anim-reveal" data-youtube="${video.youtubeId}">
                    <div class="video-thumbnail">
                        <img src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" alt="${video.title}" loading="lazy" />
                        <div class="video-overlay"></div>
                        <div class="video-play-btn">
                            <span class="material-symbols-outlined">play_arrow</span>
                        </div>
                        <span class="video-duration">${video.duration}</span>
                    </div>
                    <div class="video-info">
                        <span class="video-badge">${video.badge}</span>
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                    </div>
                </div>
            `).join('');

            attachPlayHandlers();
            reinitReveals();
        }

        function attachPlayHandlers() {
            videoGrid.querySelectorAll('.video-card').forEach(card => {
                card.addEventListener('click', () => {
                    const youtubeId = card.dataset.youtube;
                    const videoUrl = card.dataset.url;
                    const thumbnail = card.querySelector('.video-thumbnail');

                    if (youtubeId) {
                        thumbnail.innerHTML = '<iframe src="https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                    } else if (videoUrl) {
                        thumbnail.innerHTML = '<video src="' + videoUrl + '" controls autoplay style="width:100%;height:100%;object-fit:cover;"></video>';
                    }
                });
            });
        }

        function reinitReveals() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            videoGrid.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));
        }

        function formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return mins + ':' + secs.toString().padStart(2, '0');
        }
    }

    /**
     * Reveal elements on scroll
     */
    function initScrollRevelations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.anim-reveal').forEach(el => observer.observe(el));
    }
})();
