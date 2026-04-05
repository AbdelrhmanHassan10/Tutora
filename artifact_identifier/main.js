const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');

// Default is DARK
if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
} else {
    body.classList.add('dark-mode');
}

updateThemeIcon();

// Toggle dark mode
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// Update theme icon
function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}

// ============================================
// LANGUAGE TOGGLE
// ============================================

document.querySelectorAll('.language-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all buttons
        document.querySelectorAll('.language-toggle button').forEach(b => {
            b.classList.remove('active');
        });
        // Add active to clicked button
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        console.log('Language changed to:', lang);
    });
});

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// BUTTON INTERACTIONS
// ============================================

// Learn More buttons
document.querySelectorAll('.btn-learn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Learn More clicked');
        // Add ripple effect
        addRipple(btn, e);
    });
});

// Action buttons
document.querySelectorAll('.btn-action-gold, .btn-action-turquoise').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Action button clicked');
        addRipple(btn, e);
    });
});

// Primary and Accent buttons
document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log('Button clicked:', btn.textContent);
        addRipple(btn, e);
    });
});
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


// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// BUTTON INTERACTIONS
// ============================================

const primaryButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

primaryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('Button clicked:', this.textContent.trim());

        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// ============================================
// FAQ ACCORDION
// ============================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');

    summary.addEventListener('click', (e) => {
        e.preventDefault();

        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
                otherItem.removeAttribute('open');
            }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
            item.removeAttribute('open');
        } else {
            item.setAttribute('open', '');
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// ============================================
// IMAGE LAZY LOADING
// ============================================

const images = document.querySelectorAll('img');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '10';
            img.onload = () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            };
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// CARD HOVER EFFECTS
// ============================================

const cards = document.querySelectorAll('.card, .example-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            animationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.card, .example-card, .faq-item').forEach(el => {
    animationObserver.observe(el);
});

// ============================================
// PROFILE IMAGE CLICK
// ============================================

const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    profileImg.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Profile clicked');
    });
}

// ============================================
// SEARCH FUNCTIONALITY (if needed)
// ============================================

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            console.log('Search query:', query);
        }
    });
}

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

function handleResponsive() {
    const width = window.innerWidth;

    // Adjust for different screen sizes
    if (width <= 768) {
        // Mobile optimizations
        document.body.style.fontSize = '16px';
    } else {
        // Desktop optimizations
        document.body.style.fontSize = '16px';
    }
}

window.addEventListener('resize', handleResponsive);
handleResponsive();

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Tutora AI page loaded successfully');
    console.log('📱 Mobile menu available on small screens');
    console.log('🎨 Smooth animations enabled');
    console.log('🔍 FAQ accordion ready');

    // Initial active link update
    updateActiveLink();
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'M' to toggle mobile menu on mobile screens
    if (e.key === 'm' || e.key === 'M') {
        if (window.innerWidth <= 768) {
            mobileNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
            icon.textContent = mobileNav.classList.contains('active') ? 'close' : 'menu';
        }
    }

    // Press 'Home' to scroll to top
    if (e.key === 'Home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// ============================================
// FADE IN UP ANIMATION
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
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
document.head.appendChild(style);

// ============================================
// AI ARTIFACT IDENTIFIER INTEGRATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-photo-btn');
    const cameraBtn = document.getElementById('use-camera-btn');
    const fileInput = document.getElementById('scan-upload');
    const cameraInput = document.getElementById('camera-upload');
    
    const resultContainer = document.getElementById('scan-result-container');
    const resultTitle = document.getElementById('scan-result-title');
    const resultDesc = document.getElementById('scan-result-desc');

    function handleFile(e) {
        if (e.target.files && e.target.files[0]) {
            analyzeImage(e.target.files[0]);
        }
    }

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFile);
    }
    if (cameraBtn && cameraInput) {
        cameraBtn.addEventListener('click', () => cameraInput.click());
        cameraInput.addEventListener('change', handleFile);
    }

    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        
        resultContainer.style.display = 'block';
        resultTitle.textContent = 'Analyzing...';
        resultTitle.style.color = '#ecb613';
        resultDesc.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Please wait while Tutora AI analyzes the image.';
        
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://gem-backend-production-cb6d.up.railway.app/api/ai/detect', {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok && data.predictions && data.predictions.length > 0) {
                const topMatch = data.predictions[0];
                resultTitle.textContent = `Match Found: ${topMatch.className}`;
                resultTitle.style.color = '#34d399';
                resultDesc.innerHTML = `Probability: ${(topMatch.probability * 100).toFixed(1)}% <br/> Accessing historical records...`;
            } else {
                resultTitle.textContent = 'Artifact Not Recognized';
                resultTitle.style.color = '#f87171';
                resultDesc.textContent = data.message || 'The AI could not identify this artifact with high confidence.';
            }
        } catch (error) {
            console.error('AI Detection Error:', error);
            resultTitle.textContent = 'Connection Error';
            resultTitle.style.color = '#f87171';
            resultDesc.textContent = 'Failed to connect to Tutora AI. Please check your network and try again.';
        }
    }
});
