// 1. Theme Management (Dark/Light Mode)
const themeToggle = document.querySelector('.theme-btn');
const body = document.body;

if (themeToggle) {

    const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
    // Load saved theme
    const savedTheme = localStorage.getItem('tutora-theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');

        if (themeIcon) {
            themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
        }

        localStorage.setItem('tutora-theme', isDarkMode ? 'dark' : 'light');
    });
}

// 2. Pricing Switcher Logic
const switchBtns = document.querySelectorAll('.switch-btn');
const priceValues = document.querySelectorAll('.price-value');

if (switchBtns.length > 0) {
    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons
            switchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.getAttribute('data-type');
            
            // Update price values
            priceValues.forEach(price => {
                if (type === 'egyptian') {
                    price.textContent = price.getAttribute('data-local');
                } else {
                    price.textContent = price.getAttribute('data-intl');
                }
            });
        });
    });
}
// ============================================
// 2. MOBILE MENU FUNCTIONALITY (VERIFIED & WORKING)
// ============================================
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

// هذا الجزء سليم وسيعمل مع كلاس .open في CSS
const openMenu = () => {
    if (mobileMenu && menuOverlay) {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

const closeMenu = () => {
    if (mobileMenu && menuOverlay) {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
};

if (menuBtn) menuBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

// إغلاق القائمة عند النقر على أي رابط بداخلها
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});
// 3. Scroll Reveal Animation
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.ticket-card, .ai-planner, .info-card, .hero-content').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// 4. Parallax Effect handled by CSS background-attachment: fixed


// 5. AI Route Planner Logic (Enhanced)
const plannerBtn = document.getElementById('generateRouteBtn');
const plannerInput = document.querySelector('.planner-input');
const routeResults = document.getElementById('routeResults');
const routeContent = document.getElementById('routeContent');

const museumSpots = [
    { keywords: ['pharaoh', 'ramses', 'statue', 'king'], title: 'The Colossal Statue of Ramses II', desc: 'Marvel at the 3,200-year-old masterpiece in the main atrium.', time: '15 mins', icon: 'account_balance' },
    { keywords: ['staircase', 'view', 'steps'], title: 'The Grand Staircase', desc: 'Walk through 87 pharaonic statues arranged chronologically.', time: '20 mins', icon: 'stairs' },
    { keywords: ['tutankhamun', 'mask', 'gold', 'jewelry'], title: 'Tutankhamun Galleries', desc: 'The world-famous collection of the Boy King, including the gold mask.', time: '45 mins', icon: 'diamond' },
    { keywords: ['boat', 'khufu', 'ship', 'sun'], title: 'Khufu Solar Boat Museum', desc: 'The oldest intact ship in the world, unearthed near the Great Pyramid.', time: '30 mins', icon: 'directions_boat' },
    { keywords: ['mummies', 'kings', 'queens', 'royal'], title: 'Royal Mummies Hall', desc: 'The final resting place of Egypt’s greatest pharaohs and queens.', time: '40 mins', icon: 'person' },
    { keywords: ['kids', 'children', 'play', 'learn'], title: 'Interactive Kids Museum', desc: 'Hands-on history for the younger explorers.', time: '60 mins', icon: 'child_care' },
    { keywords: ['arts', 'jewelry', 'amulets'], title: 'Ancient Arts & Jewelry Hall', desc: 'Exquisite craftsmanship of the Middle and New Kingdom eras.', time: '25 mins', icon: 'auto_awesome' }
];

if (plannerBtn) {
    plannerBtn.addEventListener('click', () => {
        const interest = plannerInput.value.toLowerCase().trim();
        if (!interest) {
            alert('Please share your interests (e.g., Gold, Statues, Pharaohs) so we can map your journey.');
            return;
        }

        plannerBtn.innerHTML = '<span class="material-symbols-outlined spin">sync</span> Analyzing History...';
        plannerBtn.disabled = true;

        setTimeout(() => {
            // Find matches
            const matches = museumSpots.filter(spot => 
                spot.keywords.some(k => interest.includes(k)) || interest.includes(spot.title.toLowerCase())
            );

            // If no match, pick 3 random ones
            const finalPicks = matches.length > 0 ? matches : museumSpots.sort(() => 0.5 - Math.random()).slice(0, 3);

            // Render
            routeContent.innerHTML = finalPicks.map(spot => `
                <div class="route-step">
                    <div class="step-icon">
                        <span class="material-symbols-outlined">${spot.icon}</span>
                    </div>
                    <div class="step-info">
                        <h5>${spot.title}</h5>
                        <p>${spot.desc}</p>
                        <span class="step-time">${spot.time}</span>
                    </div>
                </div>
            `).join('');

            routeResults.style.display = 'block';
            plannerBtn.innerHTML = 'Generate My Route';
            plannerBtn.disabled = false;
            
            // Auto-scroll to results
            routeResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    });
}

// 6. Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href.startsWith('#')) return; // تجاهل الروابط الخارجية أو الصفحات الأخرى

    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 7. Ticket Hover Effect (Dynamic Scale)
document.querySelectorAll('.ticket-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(236, 182, 19, 0.15)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
    });
});

// 8. FAQ Accordion Functionality
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        // Close all other open answers
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            }
        });

        // Toggle the clicked answer
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        
        if (question.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// ============================================
// ROYAL SUPERSTAR - ATMOSPHERIC SCRIPTS
// ============================================

// 1. Royal Dust Particles System
function createDust() {
    const container = document.getElementById('dust-container');
    if (!container) return;
    
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = `-10px`;
        particle.style.animation = `floatDust ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(particle);
    }
}

// 2. Royal Geometric Shapes
function createShapes() {
    const container = document.getElementById('shapes-container');
    if (!container) return;
    
    const shapes = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'royal-shape';
        shape.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 20;
        const delay = Math.random() * -20;
        
        shape.style.left = `${posX}%`;
        shape.style.top = `${posY}%`;
        shape.style.animation = `rotateFloat ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(shape);
    }
}

// 4. Hero Content Parallax Tilt
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

if (hero && heroContent) {
    hero.addEventListener('mousemove', (e) => {
        const { width, height } = hero.getBoundingClientRect();
        const mouseX = (e.clientX / width) - 0.5;
        const mouseY = (e.clientY / height) - 0.5;
        
        heroContent.style.transform = `perspective(1000px) rotateY(${mouseX * 20}deg) rotateX(${mouseY * -20}deg) translateZ(50px)`;
    });
    
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = `perspective(1000px) rotateY(0) rotateX(0) translateZ(0)`;
    });
}

// Initialize Royal Atmosphere
document.addEventListener('DOMContentLoaded', () => {
    createDust();
    createShapes();
});

// ============================================
// THE DIVINE JOURNEY - EXTRA PREMIUM FEATURES
// ============================================

// 1. The Oracle's Greeting (Typewriter Effect)
const greetings = [
    "The Pharaohs await your arrival...",
    "Unlock the secrets of the Boy King...",
    "Walk the path of the Ancients...",
    "Where history meets eternity...",
    "Your golden passage is ready..."
];

let greetingIndex = 0;
const greetingElement = document.getElementById('divineGreeting');

function typeGreeting(text, i = 0) {
    if (!greetingElement) return;
    if (i < text.length) {
        greetingElement.textContent += text.charAt(i);
        setTimeout(() => typeGreeting(text, i + 1), 50);
    } else {
        setTimeout(eraseGreeting, 3000);
    }
}

function eraseGreeting() {
    if (!greetingElement) return;
    let text = greetingElement.textContent;
    if (text.length > 0) {
        greetingElement.textContent = text.substring(0, text.length - 1);
        setTimeout(eraseGreeting, 30);
    } else {
        greetingIndex = (greetingIndex + 1) % greetings.length;
        setTimeout(() => typeGreeting(greetings[greetingIndex]), 500);
    }
}

// 2. Scroll Progress Journey Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
});

// Initialize Extras
document.addEventListener('DOMContentLoaded', () => {
    if (greetingElement) typeGreeting(greetings[0]);
});