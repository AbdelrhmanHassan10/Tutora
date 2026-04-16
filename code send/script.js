const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';

document.addEventListener('DOMContentLoaded', () => {
    const verifyForm = document.getElementById('verifyForm');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const otpInputs = Array.from(document.querySelectorAll('.otp-input'));

    // 1. OTP Input Auto-Advancing UX
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            // Only numbers allowed
            e.target.value = val.replace(/[^0-9]/g, '');
            if (e.target.value !== '') {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.1)';
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = '';
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '') {
                if (index > 0) otpInputs[index - 1].focus();
            }
        });
    });

    // 2. Form Submission API Logic
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const code = otpInputs.map(input => input.value).join('');
            
            if (code.length !== 6) {
                showPremiumToast('Please enter the full 6-digit code.', 'error');
                verifyForm.classList.add('shake-anim');
                setTimeout(() => verifyForm.classList.remove('shake-anim'), 500);
                return;
            }

            // Set Loading UI
            const originalBtnText = verifyBtn.innerHTML;
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<div class="loader-spinner"></div> Verifying...';
            verifyBtn.style.opacity = '0.7';

            try {
                const email = localStorage.getItem('resetEmail');
                if (!email) {
                    showPremiumToast('Session expired. Please restart the reset process.', 'error');
                    setTimeout(() => window.location.href = '../reset the password/reset-the-password.html', 2000);
                    return;
                }

                // API requires both email and code
                const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code })
                });

                let data = {};
                try { data = await response.json(); } catch(e){}

                if (response.ok) {
                    // Save the verified code for the next step (reset password)
                    localStorage.setItem('resetCode', code);
                    
                    showPremiumToast('Identity Verified!', 'success');
                    
                    // Proceed to "change password" page
                    setTimeout(() => {
                        document.body.style.opacity = '0';
                        document.body.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => window.location.href = '../change password/change-password.html', 500);
                    }, 1500);
                } else {
                    throw new Error(data.message || data.error || 'Invalid verification code.');
                }
            } catch (error) {
                showPremiumToast(error.message, 'error');
                verifyForm.classList.add('shake-anim');
                setTimeout(() => verifyForm.classList.remove('shake-anim'), 500);
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = originalBtnText;
                verifyBtn.style.opacity = '1';
            }
        });
    }

    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Simulate resend
            showPremiumToast('A new code has been sent to your email.', 'success');
        });
    }

    // 3. Global Premium Toast Injector 
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
        void toast.offsetWidth; 
        toast.classList.add('show-toast');
        setTimeout(() => {
            toast.classList.remove('show-toast');
            setTimeout(() => toast.remove(), 400); 
        }, 3500);
    }
});

