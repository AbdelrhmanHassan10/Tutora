// ============================================
// COLLECTION PAGE - COMPLETE JAVASCRIPT
// ============================================

// Apply dark mode immediately before DOM renders
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // MOBILE MENU FUNCTIONALITY
    // ============================================

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Open mobile menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });



    // ============================================
    // DARK MODE / LIGHT MODE TOGGLE
    // ============================================

    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        updateThemeIcon();
    }

    // Toggle dark mode
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark');

            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon();

            // Add rotation animation
            themeBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeBtn.style.transform = 'rotate(0deg)';
            }, 300);

        });
    }

    function updateThemeIcon() {
        const isDark = body.classList.contains('dark');
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    }


    // ============================================
    // ARTIFACT FILTERING
    // ============================================

    const filterBtns = document.querySelectorAll('.filter-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const artifactCards = document.querySelectorAll('.artifact-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            applyFilters();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            showAllArtifacts();
            showNotification('Filters reset');
        });
    }

    function filterArtifacts(query) {
        artifactCards.forEach(card => {
            const title = card.querySelector('.artifact-title').textContent.toLowerCase();
            const location = card.querySelector('.location-text').textContent.toLowerCase();
            const dynasty = card.querySelector('.dynasty-label').textContent.toLowerCase();

            if (title.includes(query) || location.includes(query) || dynasty.includes(query)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function showAllArtifacts() {
        artifactCards.forEach(card => {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease-out';
        });
    }

    function applyFilters() {
        // Placeholder for filter logic
        showNotification('Filters applied');
    }

    // ============================================
    // FAVORITE BUTTON FUNCTIONALITY
    // ============================================

    const favoriteBtns = document.querySelectorAll('.favorite-btn');

    favoriteBtns.forEach(btn => {
        // Load favorite state from localStorage
        const cardTitle = btn.closest('.artifact-card').querySelector('.artifact-title').textContent;
        const isFavorite = localStorage.getItem(`favorite-${cardTitle}`) === 'true';

        if (isFavorite) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');

            const isFav = btn.classList.contains('active');
            localStorage.setItem(`favorite-${cardTitle}`, isFav);

            const message = isFav ? 'Added to favorites' : 'Removed from favorites';
            showNotification(message, isFav ? 'success' : 'info');

            addRipple(btn, e);
        });
    });

    // ============================================
    // ARTIFACT CARD CLICK
    // ============================================

    artifactCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.artifact-title').textContent;
            const location = card.querySelector('.location-text').textContent;
            showNotification(`Viewing: ${title} from ${location}`);
            // In real implementation, navigate to detail page
        });
    });

    // ============================================
    // LANGUAGE BUTTON
    // ============================================

    const languageBtn = document.querySelector('.icon-btn:nth-child(5)');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            const currentLang = document.documentElement.lang || 'en';
            const newLang = currentLang === 'en' ? 'ar' : 'en';

            document.documentElement.lang = newLang;
            localStorage.setItem('language', newLang);

            const langName = newLang === 'ar' ? 'العربية' : 'English';
            showNotification('Language changed to ' + langName);
        });
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
            font-family: inherit;
            font-size: 14px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ============================================
    // RIPPLE EFFECT
    // ============================================

    function addRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe artifact cards
    artifactCards.forEach(card => {
        observer.observe(card);
    });

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', (e) => {
        // Press 'D' to toggle dark mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
            if (themeBtn) {
                themeBtn.click();
            }
        }

        // Press 'M' to toggle mobile menu
        if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey) {
            if (window.innerWidth <= 768) {
                if (mobileMenu.classList.contains('open')) {
                    closeMenu();
                } else {
                    mobileMenu.classList.add('open');
                    menuOverlay.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            }
        }

        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }

        // Press '/' to focus search


        // Press 'Home' to scroll to top
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Press 'End' to scroll to bottom
        if (e.key === 'End') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    // ============================================
    // ANIMATIONS STYLES
    // ============================================

    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes rippleAnimation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);

    // ============================================
    // PAGE LOAD INITIALIZATION
    // ============================================

    console.log('✓ Collection page loaded successfully');
    console.log('🌙 Dark mode: Press D to toggle (Default: Dark)');
    console.log('📱 Mobile Menu: Press M to toggle');
    console.log('🔍 Search: Press / to focus search');
    console.log('⌨️ Shortcuts: Home (top), End (bottom), Escape (close menu)');
});

// ============================================
// EXPORT API FOR EXTERNAL USE
// ============================================

window.pageAPI = {
    toggleDarkMode: () => {
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.click();
        }
    },
    toggleMobileMenu: () => {
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.click();
        }
    },
    getCurrentTheme: () => localStorage.getItem('theme') || 'dark',
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    scrollToBottom: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
};

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.querySelector('.menu-overlay');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
}

// Close menu when clicking overlay
if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close menu when clicking on a link
const menuLinks = document.querySelectorAll('.menu-link, .dropdown-item');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
    });
});

// ============================================
// MOBILE DROPDOWN TOGGLE
// ============================================

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();

        const dropdownItems = toggle.nextElementSibling;
        if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
            // Close other dropdowns
            document.querySelectorAll('.dropdown-items.show').forEach(item => {
                if (item !== dropdownItems) {
                    item.classList.remove('show');
                    item.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current dropdown
            dropdownItems.classList.toggle('show');
            toggle.classList.toggle('active');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-dropdown') && !e.target.closest('.dropdown-items')) {
        document.querySelectorAll('.dropdown-items.show').forEach(item => {
            item.classList.remove('show');
            item.previousElementSibling.classList.remove('active');
        });
    }
});

// ============================================
// DESKTOP DROPDOWN HOVER
// ============================================

const navDropdowns = document.querySelectorAll('.nav-dropdown');
navDropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        }
    });

    dropdown.addEventListener('mouseleave', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        }
    });
});