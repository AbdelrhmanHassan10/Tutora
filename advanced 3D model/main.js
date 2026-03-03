// ============================================
// DARK MODE TOGGLE
// ============================================

const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeIcon();
}

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
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Museum Explorer loaded successfully');
    console.log('🌙 Dark mode available - click the moon icon to toggle');
});
const API_BASE = "https://gem-backend-production.up.railway.app/api";

// ===============================
// Helper Function
// ===============================
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(API_BASE + endpoint, {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: "Bearer " + token }),
        },
        ...options,
    });

    if (!res.ok) {
        throw new Error("API Error");
    }

    return res.json();
}

// ===============================
// Get Artifact ID from URL
// ===============================
const params = new URLSearchParams(window.location.search);
const artifactId = params.get("id");

if (!artifactId) {
    alert("Artifact not found");
    throw new Error("Missing ID");
}

// ===============================
// Load Artifact Details
// ===============================
async function loadArtifact() {
    try {
        const data = await apiFetch(`/artifacts/${artifactId}`);

        document.querySelector(".artifact-name").textContent = data.name;
        document.querySelector(".artifact-desc").textContent = data.description;
        document.querySelector(".viewer-img").src = data.image;

    } catch (error) {
        console.error(error);
        alert("Failed to load artifact");
    }
}

loadArtifact();

// ===============================
// Add to Favorites
// ===============================
const favBtn = document.querySelector(".btn-collection");

favBtn.addEventListener("click", async() => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "../auth/login.html";
        return;
    }

    try {
        await apiFetch("/favorites", {
            method: "POST",
            body: JSON.stringify({ artifactId }),
        });

        favBtn.textContent = "✓ Added to Collection";
        favBtn.disabled = true;

    } catch (error) {
        console.error(error);
        alert("Failed to add to favorites");
    }
});