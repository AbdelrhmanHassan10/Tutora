document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const loginForm = document.getElementById('loginForm' );
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset UI state
        loginError.style.display = 'none';
        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in... <div class="loading-spinner" style="display:inline-block"></div>';

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user info
                localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '../4.home/code.html'; // توجه للصفحة الرئيسية
                }, 1500);
            } else {
                throw new Error(data.message || 'Invalid email or password.');
            }
        } catch (error) {
            loginError.textContent = error.message;
            loginError.style.display = 'block';
            showNotification(error.message, 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Log In';
        }
    });

    function showNotification(message, type) {
        const toast = document.createElement('div');
        toast.className = `notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
