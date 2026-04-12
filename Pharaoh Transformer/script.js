document.addEventListener('DOMContentLoaded', () => {
    // Redundant navigation and theme logic removed. Now handled by global-core.js.

    // 3. Transformation Logic
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('pharaoh-upload');
    const transformBtn = document.getElementById('transform-btn');
    const previewImg = document.getElementById('pharaoh-preview');
    const statusText = document.getElementById('upload-status');
    
    let selectedFile = null;

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

            const response = await fetch('https://gem-backend-production-cb6d.up.railway.app/api/ai/photo-to-pharaoh', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok && (data.imageUrl || data.image)) {
                if (previewImg) {
                    previewImg.src = data.imageUrl || data.image;
                    previewImg.style.opacity = '1';
                }
                if (statusText) statusText.textContent = 'Portal Alignment Complete. You have been Reborn.';
            } else {
                alert('The gods rejected your offering. Please try again.');
            }
        } catch (error) {
            alert('Neural link failed. Check your connection to the ether.');
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
