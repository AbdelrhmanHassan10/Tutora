document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const resetBtn = document.getElementById('resetBtn');
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const cursorGlow = document.getElementById('cursorGlow');
    const formCard = document.getElementById('formCard');

    // 1. Static 3D Presence & Cursor Glow
    if (window.innerWidth > 1024) {
        if (formCard) formCard.style.transform = `rotateY(5deg) rotateX(2deg)`;
        
        document.addEventListener('mousemove', (e) => {
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        });
    }

    // 2. Generate Scattered Dust
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

    // 3. Generate Royal Triangles
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

    // 4. Interactive Effects
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

    magneticBtn(resetBtn);

    // 5. Validation Logic
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

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                hideError('email');
            }
        });
    }

    // 6. Form Submission
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Please enter a valid email address.');
                return;
            }

            resetBtn.disabled = true;
            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '<span>Sending...</span>';

            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    localStorage.setItem('resetEmail', email);
                    window.location.href = '../code send/code-send.html';
                } else {
                    showError('email', 'Email not found in our sanctuary.');
                }
            } catch (error) {
                showError('email', 'The connection to eternity failed.');
            } finally {
                resetBtn.disabled = false;
                resetBtn.innerHTML = originalText;
            }
        });
    }
});
