document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Dark/Light Mode)
const themeToggle = document.querySelector('.theme-btn'); // صححت الاسم
const themeIcon = themeToggle?.querySelector('.material-symbols-outlined'); 
   const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('kids-theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLightMode = body.classList.toggle('light-mode');
            if (themeIcon) themeIcon.textContent = isLightMode ? 'dark_mode' : 'light_mode';
            localStorage.setItem('kids-theme', isLightMode ? 'light' : 'dark');
        });
    }

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

// ========== THEME TOGGLE SUPPORT ==========
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        
        // Save preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
    });
}

// ========== LOAD SAVED THEME ==========
const savedTheme = localStorage.getItem('theme') || 'light-mode';
document.body.classList.add(savedTheme);

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
 