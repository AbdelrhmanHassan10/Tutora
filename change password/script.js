document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    
    const form = document.getElementById('changePasswordForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changeBtn = document.getElementById('changeBtn');
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const cursorGlow = document.getElementById('cursorGlow');
    const formCard = document.getElementById('formCard');

    // 1. Session Protection
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
        window.location.href = '../reset the password/reset-password.html';
        return;
    }

    // 2. Visual Engine Initialization
    if (window.innerWidth > 1024) {
        if (formCard) formCard.style.transform = `rotateY(5deg) rotateX(2deg)`;
        document.addEventListener('mousemove', (e) => {
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        });
    }

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
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dustContainer.appendChild(dust);
        }
    };

    const createShapes = () => {
        if (!shapesContainer) return;
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            shape.style.animationDelay = (Math.random() * -20) + 's';
            shapesContainer.appendChild(shape);
        }
    };

    createDust();
    createShapes();

    const magneticBtn = (btn) => {
        if (!btn) return;
        document.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x*x + y*y);
            if (distance < 150) {
                const moveX = x * 0.3;
                const moveY = y * 0.3;
                btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            } else {
                btn.style.transform = `translate(0, 0) scale(1)`;
            }
        });
    };

    magneticBtn(changeBtn);

    // 2. Password Visibility
    const toggles = [
        { btn: document.getElementById('passwordToggle'), input: passwordInput },
        { btn: document.getElementById('confirmPasswordToggle'), input: confirmPasswordInput }
    ];

    toggles.forEach(({btn, input}) => {
        if (btn && input) {
            btn.addEventListener('click', () => {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
            });
        }
    });

    // 3. Validation Logic
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

    [passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => {
            hideError(input.id === 'password' ? 'password' : 'confirm');
        });
    });

    // 4. Form Submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            const confirm = confirmPasswordInput.value;

            if (password.length < 8) {
                showError('password', 'Must be at least 8 characters.');
                return;
            }
            if (password !== confirm) {
                showError('confirm', 'Passwords do not match.');
                return;
            }

            changeBtn.disabled = true;
            const originalText = changeBtn.innerHTML;
            changeBtn.innerHTML = '<span>Updating...</span>';

            try {
                const email = localStorage.getItem('resetEmail');
                const code = localStorage.getItem('resetCode');
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code, newPassword: password })
                });

                if (response.ok) {
                    localStorage.removeItem('resetEmail');
                    localStorage.removeItem('resetCode');
                    window.location.href = '../reset complete/reset-complete.html';
                } else {
                    showError('password', 'The sanctuary did not accept this key. Please try again.');
                }
            } catch (error) {
                showError('password', 'Connection to eternity lost. Check your network.');
            } finally {
                changeBtn.disabled = false;
                changeBtn.innerHTML = originalText;
            }
        });
    }
});
