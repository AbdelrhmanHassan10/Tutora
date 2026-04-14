document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    
    // UI Elements
    const form = document.getElementById('registrationForm') || document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName') || document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn') || document.getElementById('registerBtn');
    
    // Fallback
    if (!form || !emailInput || !passwordInput) return;

    // 1. Password Visibility Toggles
    const toggleButtons = [
        { btn: document.getElementById('passwordToggle'), input: passwordInput },
        { btn: document.getElementById('confirmPasswordToggle'), input: confirmPasswordInput }
    ];

    toggleButtons.forEach(({btn, input}) => {
        if (btn && input) {
            btn.addEventListener('click', () => {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
            });
        }
    });

    // 2. Premium Live Validation
    const validateField = (input, validatorFn, errorMsgElementId) => {
        const errorEl = document.getElementById(errorMsgElementId);
        if (!input) return true;

        const value = input.value.trim();
        const isValid = validatorFn(value);
        
        if (value.length > 0) {
            if (isValid) {
                input.style.borderColor = '#10b981';
                input.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)';
                if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
            } else {
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.1)';
            }
        } else {
            input.style.borderColor = '';
            input.style.boxShadow = '';
            if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
        }
        return isValid;
    };

    const isValidName = (val) => val.length >= 3;
    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isValidPassword = (val) => val.length >= 8;
    const isValidConfirmPassword = (val) => val === passwordInput.value && val.length > 0;

    if (fullNameInput) fullNameInput.addEventListener('input', () => validateField(fullNameInput, isValidName, 'fullNameError'));
    if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, isValidEmail, 'emailError'));
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            validateField(passwordInput, isValidPassword, 'passwordError');
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validateField(confirmPasswordInput, isValidConfirmPassword, 'confirmPasswordError');
            }
        });
    }
    if (confirmPasswordInput) confirmPasswordInput.addEventListener('input', () => validateField(confirmPasswordInput, isValidConfirmPassword, 'confirmPasswordError'));

    // 3. API Form Submission Handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const isNameOk = fullNameInput ? isValidName(fullNameInput.value) : true;
        const isEmailOk = isValidEmail(emailInput.value);
        const isPwdOk = isValidPassword(passwordInput.value);
        const isConfirmOk = confirmPasswordInput ? isValidConfirmPassword(confirmPasswordInput.value) : true;

        if (!isNameOk || !isEmailOk || !isPwdOk || !isConfirmOk) {
            showPremiumToast('Please fix the errors in the form before submitting.', 'error');
            form.classList.add('shake-anim');
            setTimeout(() => form.classList.remove('shake-anim'), 500);
            return;
        }

        const payload = {
            name: fullNameInput ? fullNameInput.value.trim() : 'User',
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader-spinner"></div> Processing...';
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('🚫 Backend did not return valid JSON:\n' + text);
            }
            
            if (response.ok) {
                showPremiumToast('Account created majestically! Redirecting to login...', 'success');
                
                if (data.token) localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

                setTimeout(() => {
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => window.location.href = '../2.login/code.html', 500);
                }, 2000);
            } else {
                const errorMsg = data.error || data.message || 'Registration failed. Please attempt again.';
                throw new Error(errorMsg);
            }
        } catch (error) {
            let finalMsg = error.message;
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                finalMsg = '📡 Connection Blocked: Your browser prevented the request. This is likely a CORS issue from your local environment. Please check the backend configuration.';
            }
            showPremiumToast(finalMsg, 'error');
            submitBtn.classList.add('shake-anim');
            setTimeout(() => submitBtn.classList.remove('shake-anim'), 500);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.opacity = '1';
        }
    });

    // Premium Toast Notification System
    function showPremiumToast(message, type) {
        // Remove existing toasts to prevent spam
        const existingToasts = document.querySelectorAll('.premium-toast');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${icon}</span>
            <span class="toast-msg">${message}</span>
            <div class="toast-progress"></div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger reflow for animation
        void toast.offsetWidth;
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');
            setTimeout(() => toast.remove(), 400); // match transition out
        }, 3000);
    }
});