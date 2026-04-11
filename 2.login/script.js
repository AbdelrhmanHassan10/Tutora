document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    
    // UI Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');
    
    // Add real-time visual validation styling
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.style.borderColor = '#ecb613';
                input.style.boxShadow = '0 0 0 2px rgba(236,182,19,0.1)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
        });
    });

    // Password Visibility Toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            const icon = togglePassword.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
        });
    }

    // Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic Client-Side check before hitting network
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            showPremiumToast('Please enter a valid email format', 'error');
            emailInput.focus();
            return;
        }

        if (!password) {
            showPremiumToast('Please enter your password', 'error');
            passwordInput.focus();
            return;
        }

        // Set Loading State
        const originalBtnText = loginBtn.innerHTML;
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<div class="loader-spinner"></div> Logging in...';
        loginBtn.style.opacity = '0.7';

        try {
             const response = await fetch(`${API_BASE_URL}/auth/login`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ email, password })
             });
 
             const text = await response.text();
let data;
try {
    data = JSON.parse(text);
} catch {
    throw new Error('🚫 Backend did not return valid JSON:\n' + text);
}
  
             if (response.ok) {
                 // Save token and user info safely
                 localStorage.setItem('token', data.token);
                 if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                 
                 showPremiumToast('Welcome back to the Grand Egyptian Museum!', 'success');
                 
                 // Entrance animation for redirect
                 setTimeout(() => {
                     document.body.style.opacity = '0';
                     document.body.style.transition = 'opacity 0.5s ease';
                     setTimeout(() => {
                         window.location.href = '../4.home/code.html';
                     }, 500);
                 }, 1500);
             } else {
                 // Handle specific error fields from backend (data.error or data.message)
                 const errorMsg = data.error || data.message || 'Invalid credentials. Please attempt again.';
                 throw new Error(errorMsg);
             }
         } catch (error) {
             let finalMsg = error.message;
             
             // Detect CORS/Network failure which usually throws TypeError
             if (error.name === 'TypeError' && error.message.includes('fetch')) {
                 finalMsg = '📡 Connection Blocked: Your browser prevented the request. This is likely a CORS issue from your local environment. Please check the backend configuration.';
             }
             
             showPremiumToast(finalMsg, 'error');
             // Visual shake animation on inputs
             passwordInput.classList.add('shake-anim');
             setTimeout(() => passwordInput.classList.remove('shake-anim'), 500);
         } finally {
             loginBtn.disabled = false;
             loginBtn.innerHTML = originalBtnText;
             loginBtn.style.opacity = '1';
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

