const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://gem-backend-production-cb6d.up.railway.app/api';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const resetBtn = document.getElementById('resetBtn');

    // 1. Live Error Glow Validation
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const value = emailInput.value.trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            
            if (value.length > 0) {
                if (isValid) {
                    emailInput.style.borderColor = '#10b981';
                    emailInput.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)';
                } else {
                    emailInput.style.borderColor = '#ef4444';
                    emailInput.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.1)';
                }
            } else {
                emailInput.style.borderColor = '';
                emailInput.style.boxShadow = '';
            }
        });
    }

    // 2. Form Submission with Loader & API Integration
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!isValidEmail) {
                showPremiumToast('Please enter a valid email address.', 'error');
                resetForm.classList.add('shake-anim');
                setTimeout(() => resetForm.classList.remove('shake-anim'), 500);
                return;
            }

            // Set Loading UI
            const originalBtnText = resetBtn.innerHTML;
            resetBtn.disabled = true;
            resetBtn.innerHTML = '<div class="loader-spinner"></div> Sending...';
            resetBtn.style.opacity = '0.7';

            try {
                // Assuming backend expects a POST to /auth/forgot-password or similar. 
                // Adjust endpoint if backend path is different.
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                // Read API response safely (might not return JSON if 404/500)
                let data = {};
                try { data = await response.json(); } catch(e){}

                if (response.ok) {
                    showPremiumToast('Reset code sent! Redirecting...', 'success');
                    
                    // Proceed to "code send" page where user types the OTP
                    setTimeout(() => {
                        document.body.style.opacity = '0';
                        document.body.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => window.location.href = '../code send/code-send.html', 500);
                    }, 2000);
                } else {
                    // Try to catch backend specific error message
                    throw new Error(data.message || data.error || 'Failed to send reset code. Email may not exist.');
                }
            } catch (error) {
                showPremiumToast(error.message, 'error');
                resetBtn.classList.add('shake-anim');
                setTimeout(() => resetBtn.classList.remove('shake-anim'), 500);
            } finally {
                // Restore Button State
                resetBtn.disabled = false;
                resetBtn.innerHTML = originalBtnText;
                resetBtn.style.opacity = '1';
            }
        });
    }

    // 3. Global Premium Toast Injector (Inherited Styles)
    function showPremiumToast(message, type) {
        document.querySelectorAll('.premium-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = `premium-toast toast-${type}`;
        
        const icon = type === 'success' ? 'mark_email_read' : 'error';
        
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
            setTimeout(() => toast.remove(), 400); // map out animation
        }, 3500);
    }
});

