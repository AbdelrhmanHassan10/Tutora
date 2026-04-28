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
                
                showPremiumToast('Welcome Back! Entering the Sanctuary...', 'success');
                
                setTimeout(() => {
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.8s ease';
                    setTimeout(() => {
                        window.location.href = '../4.home/code.html';
                    }, 800);
                }, 1500);
            } else {
                throw new Error(data.message || 'Google Login failed.');
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
                    google.accounts.id.prompt(); // Show One Tap if available
                    // For manual trigger of the picker:
                    // google.accounts.id.renderButton is usually required for a real button,
                    // but we can also use prompt() to show the "One Tap" or "Select Account" UI.
                });
            }
        } else {
            setTimeout(initGoogleSignIn, 100);
        }
    };
    initGoogleSignIn();
    
    const form = document.getElementById('loginForm');
    const formCard = document.getElementById('formCard');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
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
        for (let i = 0; i < 40; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            // Immediate scattering
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dustContainer.appendChild(dust);
        }
    };

    // 3. Generate Royal Triangles
    const createShapes = () => {
        if (!shapesContainer) return;
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            // Immediate scattering
            shape.style.animationDelay = (Math.random() * -20) + 's';
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
    applyMagneticEffect('#loginBtn');
    applyMagneticEffect('.login-link-btn');
    applyMagneticEffect('.signup-link');
    applyMagneticEffect('.nav-logo');
    interactiveDust();

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
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        if (!input || !errorEl) return;

        input.classList.add('input-invalid');
        const textEl = errorEl.querySelector('.error-text');
        if (textEl) textEl.textContent = message;
        errorEl.classList.add('show');
    };

    const hideError = (fieldId) => {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        if (!input || !errorEl) return;

        input.classList.remove('input-invalid');
        errorEl.classList.remove('show');
    };

    // Live Validation
    emailInput.addEventListener('input', () => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            hideError('email');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length > 0) {
            hideError('password');
        }
    });

    // 3. Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email) {
            return;
        }
        if (!password) {
            return;
        }

        const originalBtnText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span>Entering the Museum...</span>';
        loginBtn.style.opacity = '0.7';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                
                showPremiumToast('Welcome Back! Entering the Sanctuary...', 'success');
                
                setTimeout(() => {
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.8s ease';
                    setTimeout(() => {
                        window.location.href = '../4.home/code.html';
                    }, 800);
                }, 1500);
            } else {
                throw new Error(data.message || 'Invalid credentials.');
            }
        } catch (error) {
            passwordInput.classList.add('input-invalid');
            setTimeout(() => passwordInput.classList.remove('input-invalid'), 500);
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
            loginBtn.style.opacity = '1';
        }
    });


    // Password Toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const isPwd = passwordInput.type === 'password';
            passwordInput.type = isPwd ? 'text' : 'password';
            passwordToggle.querySelector('.material-symbols-outlined').textContent = 
                isPwd ? 'visibility_off' : 'visibility';
        });
    }

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
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(120%); }
    }
`;
document.head.appendChild(style);
