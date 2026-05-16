// ============================================
// ARTIFACT IDENTIFIER SCRIPT - TUTORA AI
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-1ea2.up.railway.app/api';
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

    // Store last analyzed file for text-to-speech pipeline
    let lastAnalyzedFile = null;

    // NEW: Function to show Related Statues (Historical Siblings)
    function showRelatedStatues(detectedName) {
        const relatedSection = document.getElementById('related-statues-section');
        const relatedGrid = document.getElementById('related-statues-grid');
        
        if (!relatedSection || !relatedGrid) return;
        
        // Mock data for related statues
        const relatedData = [
            {
                name: "Mask of Tutankhamun",
                dynasty: "18th Dynasty",
                relation: "Artistic Sibling",
                match: "98%",
                image: "./unnamed (1).png",
                desc: "A masterpiece of gold craftsmanship, sharing similar neural markers with your discovery."
            },
            {
                name: "Canopic Jar of Imsety",
                dynasty: "New Kingdom",
                relation: "Same Period",
                match: "94%",
                image: "./unnamed (2).png",
                desc: "Used for ritual preservation, this artifact represents the funerary arts of the same era."
            },
            {
                name: "The Rosetta Stone",
                dynasty: "Ptolemaic Period",
                relation: "Cultural Link",
                match: "92%",
                image: "./unnamed 3.png",
                desc: "Crucial for decoding hieroglyphs, providing essential context to your scanned treasure."
            }
        ];
        
        // Clear previous grid
        relatedGrid.innerHTML = '';
        
        // Populate grid
        relatedData.forEach(statue => {
            const card = document.createElement('div');
            card.className = 'related-card visible';
            card.innerHTML = `
                <div class="related-img-container">
                    <img src="${statue.image}" alt="${statue.name}">
                    <div class="related-card-overlay">
                        <span class="related-match-badge">${statue.match} Match</span>
                    </div>
                </div>
                <div class="related-card-info">
                    <span class="related-card-tag">${statue.relation} • ${statue.dynasty}</span>
                    <h4 class="related-card-title">${statue.name}</h4>
                    <p class="related-card-desc">${statue.desc}</p>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
        
        // Show section
        relatedSection.style.display = 'block';
        relatedSection.classList.add('visible');
    }

    // 3. AI Analysis Integration — POST /api/ai/detect
    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        lastAnalyzedFile = file;

        // Login gate
        if (!token) {
            alert('🔐 Please login to use the AI Scanner.');
            window.location.href = '../2.login/code.html';
            return;
        }
        
        // Hide related section on new scan
        const relatedSection = document.getElementById('related-statues-section');
        if (relatedSection) {
            relatedSection.style.display = 'none';
            relatedSection.classList.remove('visible');
        }
        
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
                <div style="display: flex; align-items: center; gap: 10const formData = new FormData();
        formData.append('image', file);

        try {
            console.log('📤 Sending image to /ai/detect...');
            const response = await fetch(`${API_URL}/ai/detect`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            console.log('📥 Response status:', response.status);
            const data = await response.json();
            console.log('📦 Response data:', data);
            
            // Handle auth errors
            if (response.status === 401 || response.status === 403) {
                resultTitle.textContent = 'Session Expired';
                resultTitle.style.color = '#f87171';
                resultDesc.innerHTML = '<p>Your session has expired. Please <a href="../2.login/code.html" style="color: #ecb613; text-decoration: underline;">login again</a> to continue scanning.</p>';
                return;
            }

            // Handle API offline
            if (response.status === 503) {
                resultTitle.textContent = 'AI Scanner Offline';
                resultTitle.style.color = '#f87171';
                resultDesc.textContent = 'The AI detection service is temporarily offline. Please try again in a few minutes.';
                return;
            }

            // Robust name detection logic
            const artifactInfo = data.artifact || null;
            let detected = (artifactInfo && artifactInfo.name) || data.detected || (data.predictions && data.predictions[0]?.className);
            
            // Fix for "Unknown" or empty results
            if (!detected || detected === "Unknown" || detected === "unknown") {
                detected = "Mysterious Artifact";
            }

            const confidence = data.confidence || (data.predictions && data.predictions[0]?.probability ? (data.predictions[0].probability * 100).toFixed(1) + '%' : null);

            if (response.ok && detected) {
                const confDisplay = typeof confidence === 'number' ? confidence.toFixed(1) + '%' : confidence || 'High';
                
                resultTitle.textContent = `Match Found: ${detected}`;
                resultDesc.innerHTML = `
                    <p style="margin-bottom: 15// Refresh detection history
                loadDetectionHistory();
            } else {
                resultTitle.textContent = 'Identification Unsuccessful';
                resultTitle.style.color = '#f87171';
                resultDesc.textContent = data.message || 'Tutora AI could not find a definitive match. Please ensure the photo is clear and well-lit.';
            }
        } catch (error) {
            console.error('AI Detection Error:', error);
            resultTitle.textContent = 'Neural Link Interrupted';
            resultTitle.style.color = '#f87171';
            resultDesc.textContent = 'We encountered a connection issue while analyzing the image. Please check your network and try again.';
        }
    }

    // 4. Text-to-Speech Pipeline — POST /api/ai/text-to-speech
    async function generateStoryAudio(file) {
        if (!file) return;
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to use this feature.');
            return;
        }

        const listenBtn = document.getElementById('listenStoryBtn');
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 16const formData = new FormData();
        formData.append('image', file);
        formData.append('language', localStorage.getItem('language') || 'en');

        try {
            console.log('📤 Sending image to /ai/text-to-speech...');
            const response = await fetch(`${API_URL}/ai/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            console.log('📥 TTS Response status:', response.status);

            // Handle server errors
            if (response.status === 500 || response.status === 503) {
                console.error('❌ TTS Server error:', response.status);
                if (listenBtn) {
                    listenBtn.disabled = false;
                    listenBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16let data;
            try { data = await response.json(); } catch (e) { throw new Error('Invalid server response'); }
            console.log('📦 TTS data:', data);

            if (response.ok && data.story) {
                // Show story text
                const storySection = document.createElement('div');
                storySection.style.cssText = 'margin-top: 20// 5. Detection History — GET /api/ai/detections
    async function loadDetectionHistory() {
        const token = localStorage.getItem('token');
        if (!token) return;

        const historyContainer = document.getElementById('detection-history');
        if (!historyContainer) return;

        try {
            const response = await fetch(`${API_URL}/ai/detections`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const detections = await response.json();
                const items = Array.isArray(detections) ? detections : (detections.data || []);

                if (items.length === 0) {
                    historyContainer.innerHTML = `
                        <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20// Load detection history on page load
    loadDetectionHistory();

    // 6. Scroll Animations
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
