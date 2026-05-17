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

    // Interaction Handlers
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

    let lastAnalyzedFile = null;

    // Show Related Statues
    function showRelatedStatues(detectedName) {
        const relatedSection = document.getElementById('related-statues-section');
        const relatedGrid = document.getElementById('related-statues-grid');
        if (!relatedSection || !relatedGrid) return;
        
        const relatedData = [
            { name: "Mask of Tutankhamun", dynasty: "18th Dynasty", relation: "Artistic Sibling", match: "98%", image: "./unnamed (1).png", desc: "A masterpiece of gold craftsmanship." },
            { name: "Canopic Jar of Imsety", dynasty: "New Kingdom", relation: "Same Period", match: "94%", image: "./unnamed (2).png", desc: "Used for ritual preservation." },
            { name: "The Rosetta Stone", dynasty: "Ptolemaic Period", relation: "Cultural Link", match: "92%", image: "./unnamed 3.png", desc: "Crucial for decoding hieroglyphs." }
        ];
        
        relatedGrid.innerHTML = '';
        relatedData.forEach(statue => {
            const card = document.createElement('div');
            card.className = 'related-card visible';
            card.innerHTML = `
                <div class="related-img-container">
                    <img src="${statue.image}" alt="${statue.name}">
                    <div class="related-card-overlay"><span class="related-match-badge">${statue.match} Match</span></div>
                </div>
                <div class="related-card-info">
                    <span class="related-card-tag">${statue.relation} • ${statue.dynasty}</span>
                    <h4 class="related-card-title">${statue.name}</h4>
                    <p class="related-card-desc">${statue.desc}</p>
                </div>
            `;
            relatedGrid.appendChild(card);
        });
        
        relatedSection.style.display = 'block';
        relatedSection.classList.add('visible');
    }

    // AI Analysis Integration
    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        lastAnalyzedFile = file;

        if (!token) {
            alert('🔐 Please login to use the AI Scanner.');
            window.location.href = '../2.login/code.html';
            return;
        }
        
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (resultTitle) {
            resultTitle.textContent = 'Analyzing Visual Patterns...';
            resultTitle.style.color = '#ecb613';
        }
        if (resultDesc) {
            resultDesc.innerHTML = `<div style="display:flex; align-items:center; gap:10px; justify-content:center; padding:20px;"><div class="ai-loader"></div><span>Initializing Neural Scan...</span></div>`;
        }

        const formData = new FormData();
        formData.append('file', file);
        const lang = localStorage.getItem('language') || 'en';

        try {
            // Call the new AI Model for prediction
            const response = await fetch(`https://egyptian-museum-production.up.railway.app/predict?language=${lang}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            // Extract data using the new API format
            let detected = data.artifact_name || data.class_name || data.detected || data.name || (data.predictions && data.predictions[0]?.className) || "Mysterious Artifact";
            let confidenceValue = data.confidence || data.probability || (data.predictions && data.predictions[0]?.probability ? (data.predictions[0].probability * 100).toFixed(1) : null);
            
            // Format confidence properly
            let confidence = 'High';
            if (confidenceValue !== null) {
                confidence = typeof confidenceValue === 'number' ? confidenceValue.toFixed(1) + '%' : confidenceValue + (String(confidenceValue).includes('%') ? '' : '%');
            }

            if (response.ok) {
                resultTitle.textContent = `Match Found: ${detected}`;
                resultDesc.innerHTML = `
                    <div class="result-details">
                        <div class="match-meta">
                            <span class="confidence-tag"><span class="material-symbols-outlined">verified</span> ${confidence} Confidence</span>
                        </div>
                        <p class="artifact-info-text">${data.story || data.description || data.text || 'This artifact appears to be from the ancient Egyptian archives. Its specific details are being cross-referenced with our digital library.'}</p>
                        <div class="result-actions" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
                             <button class="btn-primary" id="listenStoryBtn"><span class="material-symbols-outlined">volume_up</span> Listen to Story</button>
                             <button class="btn-outline" onclick="window.location.href='../collection/collection.html'"><span class="material-symbols-outlined">explore</span> View in Gallery</button>
                        </div>
                    </div>
                `;
                
                document.getElementById('listenStoryBtn')?.addEventListener('click', () => generateStoryAudio(lastAnalyzedFile, data.audio_url));
                showRelatedStatues(detected);
                loadDetectionHistory();
            } else {
                resultTitle.textContent = 'Identification Unsuccessful';
                resultDesc.textContent = data.message || 'Could not find a match. Please try a clearer photo.';
            }
        } catch (error) {
            console.error('AI Detection Error:', error);
            resultTitle.textContent = 'Neural Link Interrupted';
            resultDesc.textContent = 'Connection issue. Please check your network.';
        }
    }

    async function generateStoryAudio(file, audioUrl) {
        const listenBtn = document.getElementById('listenStoryBtn');
        
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px;"></div> Generating...`;
        }

        try {
            let finalAudioUrl = "";
            if (audioUrl) {
                // If API already provided the audio URL endpoint, use it directly.
                finalAudioUrl = audioUrl.startsWith('http') ? audioUrl : `https://egyptian-museum-production.up.railway.app${audioUrl}`;
            } else {
                // Fallback to calling the /predict/audio endpoint
                const formData = new FormData();
                formData.append('file', file);
                const lang = localStorage.getItem('language') || 'en';

                const response = await fetch(`https://egyptian-museum-production.up.railway.app/predict/audio?language=${lang}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                const audioSource = data.audioUrl || data.audio || data.url || data.base64;
                
                if (response.ok && audioSource) {
                    finalAudioUrl = audioSource.startsWith('data:') || audioSource.startsWith('http') 
                                            ? audioSource 
                                            : `data:audio/mp3;base64,${audioSource}`;
                } else {
                    throw new Error('No audio found in response');
                }
            }

            if (finalAudioUrl) {
                const audio = new Audio(finalAudioUrl);
                audio.play();
                if (listenBtn) {
                    listenBtn.disabled = false;
                    listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                    audio.onended = () => {
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Replay Story`;
                    };
                }
            }
        } catch (error) {
            console.error('TTS Error:', error);
            if (listenBtn) {
                listenBtn.disabled = false;
                listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Error`;
            }
        }
    }

    async function loadDetectionHistory() {
        const token = localStorage.getItem('token');
        const historyContainer = document.getElementById('detection-history');
        if (!token || !historyContainer) return;

        try {
            const response = await fetch(`${API_URL}/ai/detections`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const detections = await response.json();
                const items = Array.isArray(detections) ? detections : (detections.data || []);
                if (items.length === 0) {
                    historyContainer.innerHTML = `<p style="opacity:0.5; text-align:center; width:100%;">No recent scans found.</p>`;
                    return;
                }
                historyContainer.innerHTML = items.map(item => `
                    <div class="history-item anim-on-scroll">
                        <div class="history-img"><img src="${item.imageUrl || item.image || '../museum.png'}" alt="Scan"></div>
                        <div class="history-info">
                            <h5>${item.detected || 'Artifact'}</h5>
                            <span>${new Date(item.createdAt || item.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('');
            }
        } catch (e) { console.error('History Error:', e); }
    }

    loadDetectionHistory();

    // Scroll Animations
    const animElements = document.querySelectorAll('.anim-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    animElements.forEach(el => scrollObserver.observe(el));
});

// Animations
if (!document.getElementById('ai-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'ai-pulse-style';
    style.textContent = `
        .ai-loader { border: 3px solid rgba(236, 182, 19, 0.2); border-top: 3px solid #ecb613; border-radius: 50%; width: 30px; height: 30px; animation: rotate 1s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .visible { opacity: 1 !important; transform: translateY(0) !important; transition: all 0.6s ease-out; }
        .anim-on-scroll { opacity: 0; transform: translateY(20px); }
    `;
    document.head.appendChild(style);
}
