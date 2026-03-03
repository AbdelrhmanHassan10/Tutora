// ============================================
// START: API INTEGRATION & CORE FUNCTIONALITY
// ============================================

const BASE_URL = 'https://gem-backend-production.up.railway.app/api';

/**
 * A helper function to make API requests, handling both JSON and FormData.
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE ).
 * @param {object | FormData} [body=null] - The request body.
 * @param {boolean} [isFormData=false] - Flag to indicate if the body is FormData.
 * @returns {Promise<object>} - The JSON response from the API.
 */
async function makeApiRequest(endpoint, method, body = null, isFormData = false) {
    const token = localStorage.getItem('token');
    const headers = {};

    // Don't set Content-Type for FormData, the browser does it automatically with the correct boundary.
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return {}; // Return an empty object for non-JSON responses (e.g., 204 No Content)
        }

    } catch (error) {
        console.error('API Request Error:', error);
        alert(`API Error: ${error.message}`); // Show a user-friendly error
        throw error;
    }
}

// --- API Function Objects ---
const auth = {
    getMe: () => makeApiRequest('/auth/me', 'GET'),
};

const ai = {
    ask: (formData) => makeApiRequest('/ai/ask', 'POST', formData, true),
};

/**
 * Handles the process of sending an image file to the AI for identification.
 * @param {File} imageFile - The image file to be analyzed.
 */
function identifyArtifact(imageFile) {
    if (!imageFile) {
        alert("No image was provided.");
        return;
    }

    console.log("Preparing to send image to AI:", imageFile.name);
    alert("Analyzing image... Please wait for the result.");

    const formData = new FormData();
    // The API documentation implies the image should be sent directly.
    // If the API expects a specific key like 'image', use: formData.append('image', imageFile);
    formData.append('image', imageFile);

    ai.ask(formData)
        .then(response => {
            console.log('AI Response:', response);
            // Assuming the response has a property named 'answer' with the artifact info.
            const result = response.answer || "Could not identify the artifact or no details were returned.";
            alert(`AI Analysis Complete:\n\n${result}`);
        })
        .catch(error => {
            console.error('AI Ask Error:', error.message);
            // The error is already displayed in an alert by the makeApiRequest function.
        });
}


// ============================================
// ORIGINAL SCRIPT (UI & INTERACTIONS)
// ============================================

// --- THEME TOGGLE ---
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

// Default to dark mode if no theme is saved
if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
} else {
    body.classList.add('dark-mode');
}

function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}
updateThemeIcon(); // Set the correct icon on page load

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});


// --- LANGUAGE TOGGLE ---
document.querySelectorAll('.language-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.language-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        console.log('Language changed to:', lang);
        // Add logic here to change page content based on language
    });
});

// --- SMOOTH SCROLL FOR ANCHOR LINKS ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- MOBILE MENU TOGGLE ---
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.querySelector('.menu-overlay');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.menu-link, .dropdown-item').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// --- MOBILE & DESKTOP DROPDOWNS ---
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdownItems = toggle.nextElementSibling;
        if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
            dropdownItems.classList.toggle('show');
            toggle.classList.toggle('active');
        }
    });
});

document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => dropdown.querySelector('.dropdown-menu').style.opacity = '1');
    dropdown.addEventListener('mouseleave', () => dropdown.querySelector('.dropdown-menu').style.opacity = '0');
});

// --- FAQ ACCORDION ---
document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-summary');
    summary.addEventListener('click', (e) => {
        e.preventDefault();
        const detail = item.querySelector('.faq-answer');
        if (item.open) {
            item.removeAttribute('open');
        } else {
            // Close other open items first
            document.querySelectorAll('.faq-item[open]').forEach(openItem => openItem.removeAttribute('open'));
            item.setAttribute('open', '');
        }
    });
});

// --- SCROLL-BASED ANIMATIONS ---
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            animationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .example-card, .faq-item').forEach(el => {
    el.style.opacity = '0'; // Start as invisible for the animation
    animationObserver.observe(el);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);


// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- CAMERA AND UPLOAD FUNCTIONALITY ---
    const uploadButton = document.querySelector('.hero-buttons .btn-primary');
    const cameraButton = document.querySelector('.hero-buttons .btn-secondary');
    const fileInput = document.getElementById('file-input');
    const cameraModal = document.getElementById('camera-modal');
    const cameraFeed = document.getElementById('camera-feed');
    const captureBtn = document.getElementById('capture-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    let cameraStream = null;

    // "Upload Photo" button opens file dialog
    if (uploadButton) {
        uploadButton.addEventListener('click', () => fileInput.click());
    }

    // File dialog selection handler
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) identifyArtifact(file);
    });

    // "Use Camera" button opens camera modal
    if (cameraButton) {
        cameraButton.addEventListener('click', async() => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return alert("Your browser does not support camera access.");
            }
            try {
                // Prefer the rear camera
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                cameraFeed.srcObject = cameraStream;
                cameraModal.style.display = 'flex';
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please ensure you have given permission and are on a secure (https ) site.");
            }
        });
    }

    // Function to close and clean up the camera
    const closeCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        cameraModal.style.display = 'none';
        cameraFeed.srcObject = null;
    };

    // "Capture Photo" button
    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        canvas.getContext('2d').drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            identifyArtifact(imageFile);
            closeCamera();
        }, 'image/jpeg');
    });

    // Close button for camera modal
    closeCameraBtn.addEventListener('click', closeCamera);

    // --- AUTHENTICATION CHECK ---
    const token = localStorage.getItem('token');
    if (token) {
        auth.getMe()
            .then(user => {
                console.log('User authenticated:', user);
                const profileImg = document.querySelector('.profile-img');
                // Use a placeholder if profile picture URL is missing
                if (user.profilePictureUrl && profileImg) {
                    profileImg.src = user.profilePictureUrl;
                }
            })
            .catch(error => {
                console.error('Authentication failed:', error.message);
                localStorage.removeItem('token'); // Clean up invalid token
            });
    }

    console.log('✓ Tutora AI page loaded successfully');
    console.log('📸 Camera and Upload features are active.');
});