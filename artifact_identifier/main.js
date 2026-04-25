// ============================================
// ARTIFACT IDENTIFIER SCRIPT - TUTORA AI
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
    const uploadBtn = document.getElementById('upload-photo-btn');
    const cameraBtn = document.getElementById('use-camera-btn');
    const fileInput = document.getElementById('scan-upload');
    const cameraInput = document.getElementById('camera-upload');
    
    const resultContainer = document.getElementById('scan-result-container');
    const resultTitle = document.getElementById('scan-result-title');
    const resultDesc = document.getElementById('scan-result-desc');

    // MOBILE MENU LOGIC
    // 1. Navigation and Sidebar Toggle (Royal Superstar Sync)
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
            
            // Toggle icon
            const icon = dropdownToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = dropdownItems.classList.contains('show') ? 'expand_less' : 'expand_more';
            }
        });
    }

    // Close menu when clicking links
    if (mobileMenu) {
        mobileMenu.querySelectorAll('.menu-link, .dropdown-item').forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', closeMenu);
            }
        });
    }

    // 1. Initial UI Setup (Handled by global-core.js)
    console.log('✓ Artifact Identifier Integration Active');

    // 2. Interaction Handlers
    function handleFile(e) {
        if (e.target.files && e.target.files[0]) {
            analyzeImage(e.target.files[0]);
        }
    }

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFile);
    }
    if (cameraBtn && cameraInput) {
        cameraBtn.addEventListener('click', () => cameraInput.click());
        cameraInput.addEventListener('change', handleFile);
    }

    // 3. AI Analysis Integration
    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        
        // Show loading state
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (resultTitle) {
            resultTitle.textContent = 'Analyzing Visual Patterns...';
            resultTitle.style.color = '#ecb613';
        }
        if (resultDesc) {
            resultDesc.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; color: #fff;">
                    <span class="material-symbols-outlined" style="animation: rotate 2s linear infinite;">sync</span>
                    <span>Scanning artifact features against GEM digital archive...</span>
                </div>
            `;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/ai/detect`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok && data.predictions && data.predictions.length > 0) {
                const topMatch = data.predictions[0];
                const confidence = (topMatch.probability * 100).toFixed(1);
                
                resultTitle.textContent = `Match Found: ${topMatch.className}`;
                resultTitle.style.color = '#4ade80'; // Success green
                resultDesc.innerHTML = `
                    <div style="color: #fff; line-height: 1.6;">
                        <p style="margin-bottom: 10px;"><strong>Confidence Score:</strong> ${confidence}%</p>
                        <p>Our neural network has identified this artifact. Accessing historical records and curator notes for <strong>${topMatch.className}</strong>...</p>
                        <button class="btn-primary" style="margin-top: 15px; padding: 8px 16px; font-size: 14px;" onclick="window.location.href='../collection/collection.html'">View in Collection</button>
                    </div>
                `;
            } else {
                resultTitle.textContent = 'Identification Unsuccessful';
                resultTitle.style.color = '#f87171'; // Error red
                resultDesc.textContent = data.message || 'Tutora AI could not find a definitive match. Please ensure the photo is clear and well-lit.';
            }
        } catch (error) {
            console.error('AI Detection Error:', error);
            resultTitle.textContent = 'Neural Link Interrupted';
            resultTitle.style.color = '#f87171';
            resultDesc.textContent = 'We encountered a connection issue while analyzing the image. Please check your network and try again.';
        }
    }

    // 4. Scroll Animations (Sync with local visible class)
    const animElements = document.querySelectorAll('.anim-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    animElements.forEach(el => scrollObserver.observe(el));
});

// Adding rotation animation stylesheet if not exists
if (!document.getElementById('ai-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'ai-pulse-style';
    style.textContent = `
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .visible { opacity: 1 !important; transform: translateY(0) !important; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-on-scroll { opacity: 0; transform: translateY(30px); }
    `;
    document.head.appendChild(style);
}
