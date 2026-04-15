document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Handled by global-core.js)
    
    // 2. Professional Mobile Menu Logic
    const menuTrigger = document.querySelector('.menu-btn');
    const navOverlay = document.querySelector('.mobile-nav-overlay');
const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = menuTrigger?.querySelector('.material-symbols-outlined');
    
    let isMenuOpen = false;

    if (menuTrigger) {
        menuTrigger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
navOverlay.classList.add('active');
mobileMenu.classList.add('active');                if (menuIcon) menuIcon.textContent = 'close';
                document.body.style.overflow = 'hidden';
                
                // Staggered animation for menu items
                const items = document.querySelectorAll('.mobile-nav-item');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${0.1 * (index + 1)}s`;
                });
            } else {
            navOverlay.classList.remove('active');
            mobileMenu.classList.remove('active');       
                if (menuIcon) menuIcon.textContent = 'menu';
                document.body.style.overflow = '';
            }
        });
    }

    // Close menu on link click
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            navOverlay.classList.remove('active');
            mobileMenu.classList.remove('active');       
            if (menuIcon) menuIcon.textContent = 'menu';
            document.body.style.overflow = '';
        });
    });
if (navOverlay) {
    navOverlay.addEventListener('click', () => {
        isMenuOpen = false;
        navOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (menuIcon) menuIcon.textContent = 'menu';
        document.body.style.overflow = '';
    });
}const closeBtn = document.getElementById('closeBtn');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        isMenuOpen = false;
        navOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (menuIcon) menuIcon.textContent = 'menu';
        document.body.style.overflow = '';
    });
}
    // 3. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.mission-card, .fact-card, .hero-text, .hero-visual').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // 4. Interactive Mission Cards
    document.querySelectorAll('.btn-mission').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.mission-card');
            const missionName = card.querySelector('.mission-name').textContent;
            
            btn.innerHTML = '<span class="material-symbols-outlined">sync</span> Loading...';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                btn.innerHTML = 'Start Mission';
                btn.style.pointerEvents = 'auto';
                alert(`Ready to start "${missionName}"? Let's go, Explorer!`);
            }, 1500);
        });
    });

    // 5. Floating Badge Interaction
    const badge = document.querySelector('.badge-pill');
    if (badge) {
        badge.addEventListener('click', () => {
            alert('You have 3 badges! Keep exploring to unlock the Golden Sarcophagus!');
        });
    }

    // 6. Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 7. Dynamic API Integration - Kid-Friendly Artifacts
    async function fetchKidsArtifacts() {
        const container = document.getElementById('dynamic-artifacts-container');
        if (!container) return;

        try {
            const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
            const res = await fetch(`${API_URL}/artifacts`);
            
            if (res.ok) {
                const data = await res.json();
                let artifacts = Array.isArray(data) ? data : (data.artifacts || data.data || []);
                
                // Programmatic Filtering setup
                // Filter logic: any artifact with `targetAudience` == 'kids', `isKidFriendly` == true, or explicitly tagged.
                // Alternatively, we fallback to all artifacts if no explicit tagging exists to show functionality.
                let filteredArtifacts = artifacts.filter(art => {
                    if (art.isKidFriendly) return true;
                    if (art.targetAudience && art.targetAudience.toLowerCase().includes('kid')) return true;
                    // Fallback keyword search in description/title for demonstration
                    const text = ((art.title || art.name || '') + ' ' + (art.description || '')).toLowerCase();
                    return text.includes('kid') || text.includes('child') || text.includes('interactive') || text.includes('toy');
                });

                // For testing/demonstration, if the backend doesn't have filtered ones, just take a few
                if (filteredArtifacts.length === 0 && artifacts.length > 0) {
                    filteredArtifacts = artifacts.slice(0, 3);
                }

                if (filteredArtifacts.length > 0) {
                    container.innerHTML = '';
                    filteredArtifacts.forEach(artifact => {
                        const img = artifact.image || artifact.imageUrl || '../the-grand-egyptian-museum-fully-opens-completing-gizas-new-cultural-landmark_8.jpg';
                        const title = artifact.title || artifact.name || 'Unknown Artifact';
                        const desc = artifact.description || '';
                        
                        const card = document.createElement('div');
                        card.className = 'fact-card';
                        card.style.flex = '0 0 auto';
                        card.style.width = '300px';
                        
                        card.innerHTML = `
                            <div class="fact-icon-box" style="padding: 0; overflow: hidden; height: 150px; background: transparent;">
                                <img src="${img}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <h4 class="fact-title" style="margin-top: 15px;">${title}</h4>
                            <p class="fact-text" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                ${desc}
                            </p>
                            <div class="fact-footer">
                                <span class="fact-topic" style="color: #ecb613;">Explore</span>
                                <a href="../Artifact-show/code.html?id=${artifact.id || artifact._id}" style="color: white; text-decoration: none;">
                                    <span class="material-symbols-outlined" style="cursor: pointer;">arrow_forward</span>
                                </a>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = '<p style="color: #94A3B8; text-align: center; width: 100%;">No interactive artifacts found at the moment! Check back later.</p>';
                }
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Error fetching kids artifacts:', error);
            container.innerHTML = '<p style="color: #94A3B8; text-align: center; width: 100%;">Failed to load interactive artifacts.</p>';
        }
    }

    fetchKidsArtifacts();
});
// ========== FACTS CAROUSEL FUNCTIONALITY ==========
const factsContainer = document.getElementById('facts-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const currentCardSpan = document.getElementById('current-card');
const totalCardsSpan = document.getElementById('total-cards');

// Configuration
const cardWidth = 300; // Card width + gap
const scrollAmount = cardWidth + 24; // Card width + gap (1.5rem = 24px)
let currentPosition = 0;

// Get total number of cards
const totalCards = document.querySelectorAll('.fact-card').length;
totalCardsSpan.textContent = totalCards;

// Initialize progress
updateProgress();

// ========== SCROLL FUNCTIONS ==========
function scrollPrev() {
    if (currentPosition > 0) {
        currentPosition -= scrollAmount;
        factsContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        updateProgress();
    }
}

function scrollNext() {
    const maxScroll = factsContainer.scrollWidth - factsContainer.clientWidth;
    if (currentPosition < maxScroll) {
        currentPosition += scrollAmount;
        factsContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        updateProgress();
    }
}

// ========== BUTTON EVENT LISTENERS ==========
prevBtn.addEventListener('click', scrollPrev);
nextBtn.addEventListener('click', scrollNext);

// ========== UPDATE PROGRESS INDICATOR ==========
function updateProgress() {
    const scrollLeft = factsContainer.scrollLeft;
    const scrollWidth = factsContainer.scrollWidth;
    const clientWidth = factsContainer.clientWidth;
    
    // Calculate current card position
    const cardIndex = Math.round(scrollLeft / scrollAmount) + 1;
    const clampedIndex = Math.min(cardIndex, totalCards);
    
    currentCardSpan.textContent = clampedIndex;
    
    // Calculate progress percentage
    const maxScroll = scrollWidth - clientWidth;
    const progressPercent = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    progressFill.style.width = progressPercent + '%';
    
    // Update button states
    updateButtonStates(scrollLeft, maxScroll);
}

function updateButtonStates(scrollLeft, maxScroll) {
    const isAtStart = scrollLeft <= 10;
    const isAtEnd = scrollLeft >= maxScroll - 10;
    
    // Disable prev button at start
    if (isAtStart) {
        prevBtn.classList.add('disabled');
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    // Disable next button at end
    if (isAtEnd) {
        nextBtn.classList.add('disabled');
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// ========== SCROLL EVENT LISTENER ==========
factsContainer.addEventListener('scroll', updateProgress);
window.addEventListener('resize', () => {
    updateProgress();
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        scrollPrev();
    } else if (e.key === 'ArrowRight') {
        scrollNext();
    }
});

// ========== TOUCH/SWIPE SUPPORT ==========
let touchStartX = 0;
let touchEndX = 0;

factsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

factsContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swiped left - scroll right
            scrollNext();
        } else {
            // Swiped right - scroll left
            scrollPrev();
        }
    }
}

// ========== BOOKMARK FUNCTIONALITY ==========
document.querySelectorAll('.fact-footer .material-symbols-outlined').forEach((bookmark) => {
    bookmark.addEventListener('click', function(e) {
        e.stopPropagation();
        this.style.color = this.style.color === 'rgb(255, 215, 0)' ? 'var(--accent-gold)' : '#FFD700';
        this.textContent = this.textContent === 'bookmark' ? 'bookmark_added' : 'bookmark';
        
        // Add animation
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'pulse 0.3s ease-out';
        }, 10);
    });
});

// ========== SMOOTH SCROLL INITIALIZATION ==========
window.addEventListener('load', () => {
    updateProgress();
});

// ========== CARD INTERACTION EFFECTS ==========
document.querySelectorAll('.fact-card').forEach((card) => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-6px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========== ACCESSIBILITY IMPROVEMENTS ==========
prevBtn.setAttribute('aria-label', 'Previous facts');
nextBtn.setAttribute('aria-label', 'Next facts');
factsContainer.setAttribute('role', 'region');
factsContainer.setAttribute('aria-label', 'Facts carousel');

// ========== CONSOLE LOG ==========
console.log('Facts carousel initialized with ' + totalCards + ' cards');
console.log('Use arrow keys to navigate or click the buttons');
 