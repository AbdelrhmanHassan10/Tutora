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

    // 3. AI Analysis Integration — POST /api/ai/detect
    
    // NEW: Function to show Related Statues (Historical Siblings)
    function showRelatedStatues(detectedName) {
        const relatedSection = document.getElementById('related-statues-section');
        const relatedGrid = document.getElementById('related-statues-grid');
        
        if (!relatedSection || !relatedGrid) return;
        
        // Mock data for related statues
        // In a real scenario, this would come from the user's model or an API
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
            card.className = 'related-card anim-on-scroll';
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
        setTimeout(() => {
            relatedSection.classList.add('visible');
            // Trigger animation for cards
            relatedGrid.querySelectorAll('.related-card').forEach((c, i) => {
                setTimeout(() => c.classList.add('visible'), i * 150);
            });
        }, 100);
    }

    // 3. AI Analysis Integration — POST /api/ai/detect
    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        lastAnalyzedFile = file;
        
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
            
            // Support both old format (predictions[]) and new format (detected, confidence, artifact)
            const detected = data.detected || (data.predictions && data.predictions[0]?.className);
            const confidence = data.confidence || (data.predictions && data.predictions[0]?.probability ? (data.predictions[0].probability * 100).toFixed(1) + '%' : null);
            const artifactInfo = data.artifact || null;

            if (response.ok && detected) {
                const confDisplay = typeof confidence === 'number' ? confidence.toFixed(1) + '%' : confidence || 'High';
                
                resultTitle.textContent = `Match Found: ${detected}`;
                resultTitle.style.color = '#4ade80';
                resultDesc.innerHTML = `
                    <div style="color: #fff; line-height: 1.6;">
                        <p style="margin-bottom: 10px;"><strong>Confidence Score:</strong> ${confDisplay}</p>
                        ${artifactInfo ? `<p style="margin-bottom: 10px;">${artifactInfo.description || ''}</p>` : ''}
                        <p>Our neural network has identified this artifact. Accessing historical records and curator notes for <strong>${detected}</strong>...</p>
                        <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                            <button class="btn-primary" style="padding: 8px 16px; font-size: 14px;" onclick="window.location.href='../collection/collection.html'">View in Collection</button>
                            <button id="listenStoryBtn" class="btn-primary" style="padding: 8px 16px; font-size: 14px; background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                                <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">volume_up</span>
                                Listen to Story
                            </button>
                        </div>
                    </div>
                `;

                // NEW: Show related statues
                showRelatedStatues(detected);

                // Attach text-to-speech handler
                const listenBtn = document.getElementById('listenStoryBtn');
                if (listenBtn) {
                    listenBtn.addEventListener('click', () => generateStoryAudio(lastAnalyzedFile));
                }

                // Refresh detection history
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
                <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle; animation: rotate 2s linear infinite;">sync</span>
                Generating Story & Audio...
            `;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', localStorage.getItem('language') || 'en');

        try {
            const response = await fetch(`${API_URL}/ai/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.story) {
                // Show story text
                const storySection = document.createElement('div');
                storySection.style.cssText = 'margin-top: 20px; padding: 15px; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; color: #fff;';
                storySection.innerHTML = `
                    <h4 style="color: #a78bfa; margin-bottom: 8px;">
                        <span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px;">auto_stories</span>
                        AI-Generated Story
                    </h4>
                    <p style="line-height: 1.7; font-size: 14px;">${data.story}</p>
                `;
                resultDesc.appendChild(storySection);

                // Play audio if available
                if (data.audioBase64) {
                    const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
                    audio.play().catch(e => console.warn('Audio autoplay blocked:', e));

                    const audioPlayer = document.createElement('div');
                    audioPlayer.style.cssText = 'margin-top: 12px;';
                    audioPlayer.innerHTML = `
                        <audio controls style="width: 100%; border-radius: 8px;">
                            <source src="data:audio/mp3;base64,${data.audioBase64}" type="audio/mpeg">
                        </audio>
                    `;
                    storySection.appendChild(audioPlayer);
                }

                if (listenBtn) {
                    listenBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">check_circle</span> Story Generated`;
                    listenBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                }
            } else {
                throw new Error(data.message || 'Failed to generate story');
            }
        } catch (error) {
            console.error('Text-to-Speech Error:', error);
            if (listenBtn) {
                listenBtn.disabled = false;
                listenBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">volume_up</span> Try Again`;
                listenBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            }
            alert('Story generation failed: ' + error.message);
        }
    }

    // 5. Detection History — GET /api/ai/detections
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
                        <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">
                            No previous scans yet. Upload an artifact photo to get started!
                        </p>
                    `;
                    return;
                }

                historyContainer.innerHTML = items.slice(0, 6).map(det => {
                    const name = det.detected || det.name || 'Unknown';
                    const conf = det.confidence || 'N/A';
                    const date = det.createdAt ? new Date(det.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Recently';
                    
                    return `
                        <div class="history-item">
                            <div class="history-icon">
                                <span class="material-symbols-outlined">history_edu</span>
                            </div>
                            <div class="history-content">
                                <div class="history-header">
                                    <span class="history-name">${name}</span>
                                    <span class="history-badge">${conf} Match</span>
                                </div>
                                <div class="history-meta">
                                    <span class="history-date">
                                        <span class="material-symbols-outlined">calendar_today</span>
                                        ${date}
                                    </span>
                                    <span class="history-link">
                                        View Details
                                        <span class="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Failed to load detection history:', error);
        }
    }

    // Load detection history on page load
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

