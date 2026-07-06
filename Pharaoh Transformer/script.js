document.addEventListener('DOMContentLoaded', () => {
    // MOBILE MENU LOGIC
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Dropdown Toggle for Mobile Menu
    const dropdownToggle = document.querySelector('.mobile-menu .dropdown-toggle');
    const dropdownItems = document.querySelector('.mobile-menu .dropdown-items');
    
    if (dropdownToggle && dropdownItems) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownToggle.classList.toggle('active');
            dropdownItems.classList.toggle('show');
            const icon = dropdownToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = dropdownItems.classList.contains('show') ? 'expand_less' : 'expand_more';
            }
        });
    }

    // 3. Transformation Logic
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('pharaoh-upload');
    const transformBtn = document.getElementById('transform-btn');
    const previewImg = document.getElementById('pharaoh-preview');
    const statusText = document.getElementById('upload-status');
    const faceStrengthInput = document.getElementById('face-strength');
    const qualityInput = document.getElementById('quality');
    const strengthVal = document.getElementById('strength-val');
    const qualityVal = document.getElementById('quality-val');
    
    let selectedFile = null;

    if (faceStrengthInput && strengthVal) {
        faceStrengthInput.addEventListener('input', (e) => {
            strengthVal.textContent = e.target.value;
        });
    }

    if (qualityInput && qualityVal) {
        qualityInput.addEventListener('input', (e) => {
            qualityVal.textContent = e.target.value;
        });
    }

    uploadZone?.addEventListener('click', () => fileInput?.click());
    
    fileInput?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            if (statusText) statusText.textContent = `Vessel Selected: ${selectedFile.name}. Preparing for ritual.`;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                if (previewImg) {
                    previewImg.src = e.target.result;
                    previewImg.style.opacity = '0.5';
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    transformBtn?.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Sacrifice your portrait first.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Temple entry restricted. Please login to undergo transformation.');
            window.location.href = '../2.login/code.html';
            return;
        }
        
        const originalBtnText = transformBtn.innerHTML;
        transformBtn.innerHTML = '<span class="material-symbols-outlined animate-spin" style="font-size: 1rem">sync</span> Manifesting...';
        transformBtn.style.pointerEvents = 'none';

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            if (faceStrengthInput) formData.append('strength', faceStrengthInput.value);
            if (qualityInput) formData.append('quality', qualityInput.value);

            const response = await fetch('https://gem-backend-production-40ae.up.railway.app/api/ai/photo-to-pharaoh', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            let data = {};
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Failed to parse JSON from server response:', jsonError);
            }
            
            if (response.ok && (data.pharaohImage || data.imageUrl || data.image)) {
                if (previewImg) {
                    let finalImg = data.pharaohImage || data.imageUrl || data.image;
                    if (!finalImg.startsWith('http') && !finalImg.startsWith('data:')) {
                        finalImg = `data:image/png;base64,${finalImg}`;
                    }
                    previewImg.src = finalImg;
                    previewImg.style.opacity = '1';
                }
                if (statusText) statusText.textContent = 'Portal Alignment Complete. You have been Reborn.';
            } else if (response.status === 401 || response.status === 403) {
                alert('🔐 Session expired. Please sign in again.');
                localStorage.removeItem('token');
                window.location.href = '../2.login/code.html';
            } else {
                alert(`⚠️ Transformation failed: ${data.message || 'The gods rejected your offering. Please try again.'}`);
            }
        } catch (error) {
            console.error('API Pharaoh Transformation Error:', error);
            alert('⚠️ Neural link failed. Check your connection to the ether.');
        } finally {
            transformBtn.innerHTML = originalBtnText;
            transformBtn.style.pointerEvents = 'auto';
        }
    });

    // 4. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });
});
