const API_BASE_URL = 'https://gem-backend-production.up.railway.app/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    // 1. Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });

    // 2. Handle Login Submission
    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        // Reset state
        loginError.classList.remove('show');
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Success! Store token and user data
                localStorage.setItem('token', data.token);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Redirect to home page
                window.location.href = '../4.home/code.html';
            } else {
                // Show error message from API or fallback
                loginError.textContent = data.message || 'Invalid email or password. Please try again.';
                loginError.classList.add('show');
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'Network error. Please check your connection and try again.';
            loginError.classList.add('show');
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });
});