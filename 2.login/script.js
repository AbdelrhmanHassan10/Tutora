document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-1ea2.up.railway.app/api';
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
                callback: window.handleGoogleResponse,
                use_fedcm_for_prompt: false, // Disabling FedCM as it requires additional server-side setup
                auto_select: false
            });
            
            // Create a hidden container for the standard Google button
            let hiddenContainer = document.getElementById('hiddenGoogleBtn');
            if (!hiddenContainer) {
                hiddenContainer = document.createElement('div');
                hiddenContainer.id = 'hiddenGoogleBtn';
                hiddenContainer.style.display = 'none';
                document.body.appendChild(hiddenContainer);
            }

            google.accounts.id.renderButton(
                hiddenContainer,
                { theme: "outline", size: "large" } 
            );

            const googleBtn = document.getElementById('googleBtn');
            if (googleBtn) {
                googleBtn.addEventListener('click', () => {
                    // Try to find the actual clickable div inside the hidden container
                    const actualBtn = hiddenContainer.querySelector('div[role="button"]');
                    if (actualBtn) {
                        actualBtn.click();
                    } else {
                        google.accounts.id.prompt();
                    }
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
    const cursorGlow = document.getElementById('cursorGlow');

    // 1. Static 3D Presence & Cursor Glow
    if (window.innerWidth > 1024) {
        if (formCard) formCard.style.transform = `rotateY(5deg) rotateX(2deg)`;
        
        document.addEventListener('mousemove', (e) => {
            if (cursorGlow) {
                const x = e.clientX;
                const y = e.clientY;
                cursorGlow.style.left = `${x}px`;
                cursorGlow.style.top = `${y}px`;
            }
            
            if (formCard) {
                const x = (window.innerWidth / 2 - e.clientX) / 50;
                const y = (window.innerHeight / 2 - e.clientY) / 50;
                formCard.style.transform = `rotateY(${5 - x}deg) rotateX(${2 + y}deg)`;
            }
        });
    }

    // Magnetic Buttons (Exclude social buttons per user request)
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // Liquid Shine Movement
    const shine = document.createElement('div');
    shine.className = 'shine-overlay';
    const cardInner = document.querySelector('.form-card-inner');
    if (cardInner) {
        cardInner.appendChild(shine);
        cardInner.addEventListener('mousemove', (e) => {
            const rect = cardInner.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`;
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

