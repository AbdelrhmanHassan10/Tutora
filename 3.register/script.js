const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggle
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            passwordToggle.querySelector('.material-symbols-outlined').textContent = isPassword ? 'visibility_off' : 'visibility';
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', () => {
            const isPassword = confirmPasswordInput.type === 'password';
            confirmPasswordInput.type = isPassword ? 'text' : 'password';
            confirmPasswordToggle.querySelector('.material-symbols-outlined').textContent = isPassword ? 'visibility_off' : 'visibility';
        });
    }

    // 2. Form Validation
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
    };

    const showError = (fieldId, message) => {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    };

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        // Full Name validation
        if (!fullNameInput.value.trim()) {
            showError('fullName', 'Full name is required');
            isValid = false;
        } else if (fullNameInput.value.trim().length < 3) {
            showError('fullName', 'Full name must be at least 3 characters');
            isValid = false;
        }

        // Email validation
        if (!emailInput.value.trim()) {
            showError('email', 'Email is required');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Password validation
        if (!passwordInput.value) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        // Confirm Password validation
        if (!confirmPasswordInput.value) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        submitBtn.style.opacity = isValid ? '1' : '0.7';
        submitBtn.disabled = !isValid;
        return isValid;
    };

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });

    // 3. Handle form submission with API call
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        clearErrors();

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error messages from backend
                if (data.message) {
                    if (data.message.includes('email')) {
                        showError('email', data.message);
                    } else {
                        showError('fullName', data.message);
                    }
                } else if (data.error) {
                    showError('fullName', data.error);
                } else {
                    showError('fullName', `Registration failed: ${response.status}`);
                }
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                return;
            }

            // Success - show success message and redirect
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');

            // Store user data if needed
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '../2.login/code.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            showError('fullName', 'Network error. Please check your connection and try again.');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // 4. Theme Toggle Support (if needed by parent)
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    }

    // 5. Entrance Animation
    const formPanel = document.querySelector('.form-container');
    formPanel.style.opacity = '0';
    formPanel.style.transform = 'translateY(20px)';
    formPanel.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
        formPanel.style.opacity = '1';
        formPanel.style.transform = 'translateY(0)';
    }, 100);

    // Initial validation
});
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const registerForm = document.getElementById('registerForm' );
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const registerBtn = document.getElementById('registerBtn');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        registerBtn.disabled = true;
        registerBtn.innerHTML = 'Creating Account...';

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Account created successfully! Please login.', 'success');
                setTimeout(() => {
                    window.location.href = '../2.login/code.html';
                }, 2000);
            } else {
                throw new Error(data.message || 'Registration failed.');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            registerBtn.disabled = false;
            registerBtn.innerHTML = 'Create Account';
        }
    });

    function showNotification(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed; top:20px; right:20px; padding:15px 25px; border-radius:8px; color:white; z-index:1000; background:${type==='success'?'#10b981':'#ef4444'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});

