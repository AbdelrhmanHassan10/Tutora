document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    
    const verifyForm = document.getElementById('verifyForm');
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
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

    // 2. OTP Input Logic
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // 4. Resend Logic
    if (resendBtn) {
        resendBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            resendBtn.style.pointerEvents = 'none';
            resendBtn.style.opacity = '0.5';
            resendBtn.textContent = 'Sending...';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: resetEmail })
                });
                if (response.ok) {
                    resendBtn.textContent = 'Code Sent!';
                    setTimeout(() => {
                        resendBtn.textContent = 'Resend Code';
                        resendBtn.style.pointerEvents = 'all';
                        resendBtn.style.opacity = '1';
                    }, 3000);
                }
            } catch (error) {
                resendBtn.textContent = 'Failed. Try again.';
                resendBtn.style.pointerEvents = 'all';
                resendBtn.style.opacity = '1';
            }
        });
    }

    // 5. Form Submission
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otp = Array.from(otpInputs).map(i => i.value).join('');
            const email = localStorage.getItem('resetEmail');

            if (otp.length < 6) return;

            verifyBtn.disabled = true;
            const originalText = verifyBtn.innerHTML;
            verifyBtn.innerHTML = '<span>Verifying...</span>';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code: otp })
                });

                if (response.ok) {
                    localStorage.setItem('resetCode', otp);
                    window.location.href = '../change password/change-password.html';
                } else {
                    otpInputs.forEach(i => i.classList.add('input-invalid'));
                    setTimeout(() => otpInputs.forEach(i => i.classList.remove('input-invalid')), 1000);
                }
            } catch (error) {
                console.error('Verification failed');
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = originalText;
            }
        });
    }
});
