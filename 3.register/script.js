document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const GOOGLE_CLIENT_ID = '322457229349-1riijja3taalo0kbd4i6ulaotscujif5.apps.googleusercontent.com';

    // Google Sign-In Callback
    window.handleGoogleResponse = async (response) => {
        const tokenId = response.credential;
        
        try {
            const res = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                
                showPremiumToast('Welcome to the Dynasty! Entering the Sanctuary...', 'success');
                
                setTimeout(() => {
                    const successOverlay = document.createElement('div');
                    successOverlay.className = 'royal-success-overlay';
                    successOverlay.innerHTML = `
                        <div class="success-content">
                            <div class="royal-seal">
                                <img src="../logo.png" alt="Royal Seal">
                            </div>
                            <h2 class="success-title">Welcome to the Dynasty</h2>
                            <p class="success-subtitle">Your lineage has been recorded in the halls of eternity.</p>
                            <div class="success-loader"></div>
                        </div>
                    `;
                    document.body.appendChild(successOverlay);
                    setTimeout(() => successOverlay.classList.add('active'), 100);
                    
                    setTimeout(() => {
                        window.location.href = '../4.home/code.html';
                    }, 3000);
                }, 1000);
            } else {
                throw new Error(data.message || 'Google Registration failed.');
            }
        } catch (error) {
            console.error('Google Auth Error:', error);
            showPremiumToast(error.message, 'error');
        }
    };

    // Initialize Google Sign-In
    const initGoogleSignIn = () => {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: window.handleGoogleResponse
            });
            
            const googleBtn = document.getElementById('googleBtn');
            if (googleBtn) {
                googleBtn.addEventListener('click', () => {
                    google.accounts.id.prompt();
                });
            }
        } else {
            setTimeout(initGoogleSignIn, 100);
        }
    };
    initGoogleSignIn();
    
    const form = document.getElementById('registrationForm');
    const formCard = document.getElementById('formCard');
    const inputs = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword')
    };
    const submitBtn = document.getElementById('submitBtn');
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const cursorGlow = document.getElementById('cursorGlow');

    // 1. Static 3D Presence & Cursor Glow
    if (window.innerWidth > 1024) {
        if (formCard) formCard.style.transform = `rotateY(5deg) rotateX(2deg)`;
        
        document.addEventListener('mousemove', (e) => {
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        });
    }

    // 2. Generate Scattered Dust
    const createDust = () => {
        if (!dustContainer) return;
        for (let i = 0; i < 50; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 4 + 1;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            // Use negative delay to make them scattered immediately
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dust.style.animationDuration = (Math.random() * 10 + 10) + 's';
            dustContainer.appendChild(dust);
        }
    };

    // 3. Generate Royal Triangles
    const createShapes = () => {
        if (!shapesContainer) return;
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            // Use negative delay for immediate scattering
            shape.style.animationDelay = (Math.random() * -20) + 's';
            const scale = Math.random() * 0.5 + 0.5;
            shape.style.transform = `scale(${scale})`;
            shapesContainer.appendChild(shape);
        }
    };

    createDust();
    createShapes();

    // 4. Legendary Interactive Effects
    const applyMagneticEffect = (selector) => {
        const elements = document.querySelectorAll(selector);
        document.addEventListener('mousemove', (e) => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                const distance = Math.sqrt(x*x + y*y);

                if (distance < 150) {
                    const moveX = x * 0.2;
                    const moveY = y * 0.2;
                    el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                } else {
                    el.style.transform = `translate(0, 0) scale(1)`;
                }
            });
        });
    };

    const interactiveDust = () => {
        document.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.dust-particle');
            particles.forEach(p => {
                const rect = p.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const dist = Math.sqrt(x*x + y*y);
                if (dist < 100) {
                    const angle = Math.atan2(y, x);
                    const force = (100 - dist) / 100;
                    p.style.transform = `translate(${-Math.cos(angle) * 50 * force}px, ${-Math.sin(angle) * 50 * force}px)`;
                } else {
                    p.style.transform = '';
                }
            });
        });
    };

    // Initialize Legendary Effects
    interactiveDust();

    // Initialize Magnetic Effects
    applyMagneticEffect('.login-link-btn');
    applyMagneticEffect('.signup-link');
    applyMagneticEffect('.nav-logo');
    applyMagneticEffect('.submit-btn');
    applyMagneticEffect('.auth-switcher-bridge');

    // Liquid Shine Movement
    const shine = document.createElement('div');
    shine.className = 'shine-overlay';
    const cardInner = document.querySelector('.form-card-inner');
    if (cardInner) {
        cardInner.appendChild(shine);
        document.addEventListener('mousemove', (e) => {
            const rect = cardInner.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            shine.style.left = x + '%';
            shine.style.top = y + '%';
        });
    }

    // 2. Super Star Validation
    const showError = (fieldId, message) => {
        const input = inputs[fieldId];
        const errorEl = document.getElementById(`${fieldId}Error`);
        if (!input || !errorEl) return;

        input.classList.remove('input-valid');
        input.classList.add('input-invalid');
        const textEl = errorEl.querySelector('.error-text');
        if (textEl) textEl.textContent = message;
        errorEl.classList.add('show');
    };

    const hideError = (fieldId) => {
        const input = inputs[fieldId];
        const errorEl = document.getElementById(`${fieldId}Error`);
        if (!input || !errorEl) return;

        input.classList.remove('input-invalid');
        if (input.value.trim() !== '') {
            input.classList.add('input-valid');
        } else {
            input.classList.remove('input-valid');
        }
        errorEl.classList.remove('show');
    };

    const validateField = (fieldId) => {
        const input = inputs[fieldId];
        const val = input.value.trim();
        let isValid = true;
        let msg = '';

        switch (fieldId) {
            case 'fullName':
                isValid = val.length >= 3;
                msg = 'Name must be at least 3 characters ';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                msg = 'Enter a valid royal email ';
                break;
            case 'password':
                isValid = val.length >= 8;
                msg = 'Security needs 8+ characters ';
                break;
            case 'confirmPassword':
                isValid = val === inputs.password.value && val !== '';
                msg = 'Passwords must match perfectly ';
                break;
        }

        if (!isValid && val !== '') {
            showError(fieldId, msg);
        } else {
            hideError(fieldId);
        }
        return isValid;
    };

    // Live Listeners
    Object.keys(inputs).forEach(key => {
        if (inputs[key]) {
            inputs[key].addEventListener('input', () => {
                validateField(key);
                // Also re-validate confirm if password changes
                if (key === 'password' && inputs.confirmPassword.value) {
                    validateField('confirmPassword');
                }
            });
        }
    });

    // 3. Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let allValid = true;
        Object.keys(inputs).forEach(key => {
            if (!validateField(key)) {
                allValid = false;
                if (!inputs[key].value) showError(key, 'This field is required ');
            }
        });

        if (!allValid) {
            return;
        }

        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Journey...</span>';
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: inputs.fullName.value.trim(),
                    email: inputs.email.value.trim(),
                    password: inputs.password.value
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Royal Success Sequence
                submitBtn.innerHTML = '<span>Journey Authenticated</span>';
                submitBtn.style.background = 'var(--success-green)';
                
                setTimeout(() => {
                    const scene = document.querySelector('.scene');
                    const formPanel = document.querySelector('.form-panel');
                    
                    // Create Success Overlay
                    const successOverlay = document.createElement('div');
                    successOverlay.className = 'royal-success-overlay';
                    successOverlay.innerHTML = `
                        <div class="success-content">
                            <div class="royal-seal">
                                <img src="../logo.png" alt="Royal Seal">
                            </div>
                            <h2 class="success-title">Welcome to the Dynasty</h2>
                            <p class="success-subtitle">Your lineage has been recorded in the halls of eternity.</p>
                            <div class="success-loader"></div>
                        </div>
                    `;
                    document.body.appendChild(successOverlay);
                    
                    // Trigger animations
                    setTimeout(() => successOverlay.classList.add('active'), 100);
                    
                    setTimeout(() => {
                        window.location.href = '../2.login/code.html';
                    }, 4000);
                }, 1000);
            } else {
                throw new Error(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Show global error using a toast or alert
            showPremiumToast(error.message, 'error');
            
            // If it's a specific field error (e.g. email exists)
            if (error.message.toLowerCase().includes('email')) {
                showError('email', 'This email is already registered');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.style.opacity = '1';
        }
    });


    // Password Toggle
    const setupToggle = (btnId, inputId) => {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (btn && input) {
            btn.addEventListener('click', () => {
                const isPwd = input.type === 'password';
                input.type = isPwd ? 'text' : 'password';
                btn.querySelector('.material-symbols-outlined').textContent = 
                    isPwd ? 'visibility_off' : 'visibility';
            });
        }
    };

    setupToggle('passwordToggle', 'password');
    setupToggle('confirmPasswordToggle', 'confirmPassword');

    function showPremiumToast(message, type) {
        document.querySelectorAll('.premium-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;
        const icon = type === 'success' ? 'verified' : 'error';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${icon}</span>
            <span class="toast-msg">${message}</span>
            <div class="toast-progress"></div>
        `;
        document.body.appendChild(toast);
        void toast.offsetWidth; 
        toast.classList.add('show-toast');
        setTimeout(() => {
            toast.classList.remove('show-toast');
            setTimeout(() => toast.remove(), 400); 
        }, 3500);
    }
});

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(120%); }
        to { transform: translateX(0); }
    }
    .premium-toast {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: #121212;
        border-left: 4px solid var(--primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .premium-toast.show-toast { transform: translateX(0); }
    .toast-success { border-left-color: var(--success-green); }
    .toast-error { border-left-color: var(--error-red); }
    .toast-icon { color: inherit; }
    .toast-msg { font-weight: 500; font-size: 0.95rem; }
    .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: rgba(255,255,255,0.1);
        transform-origin: left;
        animation: toastProgress 3.5s linear forwards;
    }
    @keyframes toastProgress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(120%); }
    }
`;
document.head.appendChild(style);