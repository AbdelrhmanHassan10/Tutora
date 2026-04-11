const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const form = document.getElementById('registrationForm') || document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName') || document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn') || document.getElementById('registerBtn');
    
    // Fallback if elements somehow missing due to strict HTML requirements
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

    // 2. Premium Live Validation & UX Feedback
    const validateField = (input, validatorFn, errorMsgElementId) => {
        const errorEl = document.getElementById(errorMsgElementId);
        if (!input) return true;

        const value = input.value.trim();
        const isValid = validatorFn(value);
        
        if (value.length > 0) { // Only show colors if they typed something
            if (isValid) {
                input.style.borderColor = '#10b981'; // Success Green
                input.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)';
                if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
            } else {
                input.style.borderColor = '#ef4444'; // Error Red
                input.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.1)';
            }
        } else {
            // Reset if empty
            input.style.borderColor = '';
            input.style.boxShadow = '';
            if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
        }
        return isValid;
    };

    // Validators
    const isValidName = (val) => val.length >= 3;
    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isValidPassword = (val) => val.length >= 8;
    const isValidConfirmPassword = (val) => val === passwordInput.value && val.length > 0;

    // Attach Live Listeners
    if (fullNameInput) fullNameInput.addEventListener('input', () => validateField(fullNameInput, isValidName, 'fullNameError'));
    if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, isValidEmail, 'emailError'));
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            validateField(passwordInput, isValidPassword, 'passwordError');
             // Revalidate confirm password if it's already filled
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validateField(confirmPasswordInput, isValidConfirmPassword, 'confirmPasswordError');
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => validateField(confirmPasswordInput, isValidConfirmPassword, 'confirmPasswordError'));
    }

   

    // 3. API Form Submission Handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Final full validation check before network
        const isNameOk = fullNameInput ? isValidName(fullNameInput.value) : true;
        const isEmailOk = isValidEmail(emailInput.value);
        const isPwdOk = isValidPassword(passwordInput.value);
        const isConfirmOk = confirmPasswordInput ? isValidConfirmPassword(confirmPasswordInput.value) : true;

        if (!isNameOk || !isEmailOk || !isPwdOk || !isConfirmOk) {
            showPremiumToast('Please fix the errors in the form before submitting.', 'error');
            // Shake the form slightly to indicate rejection
            form.classList.add('shake-anim');
            setTimeout(() => form.classList.remove('shake-anim'), 500);
            return;
        }

        // Prepare payload dynamically based on HTML layout
        const payload = {
            name: fullNameInput ? fullNameInput.value.trim() : 'User',
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        // Loading state
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
 
             const data = await response.json();
 
             if (response.ok) {
                 showPremiumToast('Account created majestically! Redirecting to login...', 'success');
                 
                 // Store tokens if backend sends them on register
                 if (data.token) localStorage.setItem('token', data.token);
                 if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
 
                 setTimeout(() => {
                     document.body.style.opacity = '0';
                     document.body.style.transition = 'opacity 0.5s ease';
                     setTimeout(() => window.location.href = '../2.login/code.html', 500);
                 }, 2000);
             } else {
                 // Handle specific error fields from backend
                 const errorMsg = data.error || data.message || 'Registration failed due to server logic.';
                 throw new Error(errorMsg);
             }
         } catch (error) {
             let finalMsg = error.message;
             
             // Detect CORS/Network failure which usually throws TypeError
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

    // Premium Toast Notification System (Global Logic)
    function showPremiumToast(message, type) {
        document.querySelectorAll('.premium-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;
        
        const icon = type === 'success' ? 'check_circle' : 'error';
        
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${icon}</span>
            <span class="toast-msg">${message}</span>
            <div class="toast-progress"></div>
        `;
        
        document.body.appendChild(toast);
        void toast.offsetWidth; // Reflow
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
});
 