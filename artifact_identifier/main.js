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
        uploadBtn.addEventListener('click', () => {
            fileInput.value = '';
            fileInput.click();
        });
        fileInput.addEventListener('change', handleFile);
    }
    
    // Live Camera Handler for Laptop/Desktop
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            // Check if we are on a mobile device that supports 'capture' attribute better
            if (/Mobi|Android/i.test(navigator.userAgent) && cameraInput) {
                cameraInput.value = '';
                cameraInput.click();
            } else {
                // On Laptop/Desktop, use MediaDevices API for real camera access
                openLiveCamera();
            }
        });
        if (cameraInput) cameraInput.addEventListener('change', handleFile);
    }

    async function openLiveCamera() {
        // Create camera modal if it doesn't exist
        let cameraModal = document.getElementById('camera-modal');
        if (!cameraModal) {
            cameraModal = document.createElement('div');
            cameraModal.id = 'camera-modal';
            cameraModal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); z-index: 10000;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                gap: 20px; backdrop-filter: blur(10px);
            `;
            cameraModal.innerHTML = `
                <video id="camera-preview" autoplay playsinline style="width: 100%; max-width: 600px; border-radius: 20px; border: 2px solid #ecb613;"></video>
                <div style="display:flex; gap:20px;">
                    <button id="capture-snapshot" class="btn-primary" style="padding: 10px 30px;">
                        <span class="material-symbols-outlined">photo_camera</span> Capture
                    </button>
                    <button id="close-camera" class="btn-secondary" style="padding: 10px 30px; background:rgba(255,255,255,0.1);">
                        <span class="material-symbols-outlined">close</span> Close
                    </button>
                </div>
                <canvas id="snapshot-canvas" style="display:none;"></canvas>
            `;
            document.body.appendChild(cameraModal);
        } else {
            cameraModal.style.display = 'flex';
        }

        const video = document.getElementById('camera-preview');
        const captureBtn = document.getElementById('capture-snapshot');
        const closeBtn = document.getElementById('close-camera');
        let stream = null;

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = stream;
        } catch (err) {
            console.error("Camera access error:", err);
            alert("⚠️ Camera access denied or not available. Please check your browser permissions.");
            cameraModal.style.display = 'none';
            return;
        }

        const stopCamera = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cameraModal.style.display = 'none';
        };

        captureBtn.onclick = () => {
            const canvas = document.getElementById('snapshot-canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                const file = new File([blob], "camera-snapshot.jpg", { type: "image/jpeg" });
                analyzeImage(file);
                stopCamera();
            }, 'image/jpeg');
        };

        closeBtn.onclick = stopCamera;
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

        // Stop any currently playing audio
        if (window.currentAudioInstance && !window.currentAudioInstance.paused) {
            window.currentAudioInstance.pause();
            window.currentAudioInstance = null;
        }

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
            // Call the new AI API for artifact detection
            const response = await fetch(`${API_URL}/ai/detect?language=${lang}`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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
                        <div class="result-actions" style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                             <button class="btn-primary" id="listenStoryBtn" style="padding: 1rem 2.5rem;"><span class="material-symbols-outlined">volume_up</span> Listen to Story</button>
                             <button class="btn-secondary" onclick="window.location.href='../collection/collection.html'" style="padding: 1rem 2.5rem; background: rgba(255,255,255,0.05);"><span class="material-symbols-outlined">explore</span> View in Gallery</button>
                        </div>
                    </div>
                `;
                
                const audioUrlField = data.audio_url || data.audioUrl || data.audio || data.url;
                console.log("Audio URL from prediction:", audioUrlField);
                document.getElementById('listenStoryBtn')?.addEventListener('click', () => {
                    if (audioUrlField) {
                        generateStoryAudio(lastAnalyzedFile, audioUrlField);
                    } else {
                        console.warn("No audio URL provided by server");
                        generateStoryAudio(lastAnalyzedFile, null);
                    }
                });
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
        
        // Handle play/pause if audio is already active
        if (window.currentAudioInstance && !window.currentAudioInstance.ended && listenBtn && listenBtn.dataset.cachedUrl) {
            if (!window.currentAudioInstance.paused) {
                window.currentAudioInstance.pause();
                listenBtn.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> Resume Story`;
                return;
            } else {
                window.currentAudioInstance.play();
                listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                return;
            }
        }

        // Replay using cached blob URL if already generated for this artifact
        if (listenBtn && listenBtn.dataset.cachedUrl) {
            window.currentAudioInstance = new Audio(listenBtn.dataset.cachedUrl);
            window.currentAudioInstance.onended = () => {
                if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
            };
            listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
            window.currentAudioInstance.play().catch(e => console.error("Replay error", e));
            return;
        }

        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px;"></div> Generating (10-15s)...`;
        }

        try {
            let finalAudioUrl = "";
            const token = localStorage.getItem('token');
            const lang = localStorage.getItem('language') || 'en';

            // Strategy 1: If we have the file, ALWAYS use /predict/audio as it returns the binary file directly
            if (file) {
                console.log("Using primary binary audio strategy via /predict/audio");
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch(`https://egyptian-museum-production.up.railway.app/predict/audio?language=${lang}`, {
                    method: 'POST',
                    body: formData,
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (response.ok) {
                    const blob = await response.blob();
                    if (blob.size > 500) { // Valid audio should be reasonably sized
                        finalAudioUrl = URL.createObjectURL(blob);
                        console.log("✅ Audio blob generated from binary response");
                    } else {
                        throw new Error("Audio file received is too small");
                    }
                } else {
                    console.warn(`Binary audio strategy failed with status: ${response.status}`);
                }
            }

            // Strategy 2: If Strategy 1 failed or we only have audioUrl (from history)
            if (!finalAudioUrl && audioUrl) {
                console.log("Using secondary URL strategy for:", audioUrl);
                let targetUrl = audioUrl;
                if (!audioUrl.startsWith('http') && !audioUrl.startsWith('data:')) {
                    const cleanPath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
                    targetUrl = `https://egyptian-museum-production.up.railway.app${cleanPath}`;
                    
                    if (cleanPath === '/audio' || cleanPath.startsWith('/audio?')) {
                        targetUrl = `https://egyptian-museum-production.up.railway.app/predict${cleanPath}`;
                    }
                }
                
                try {
                    const response = await fetch(targetUrl, {
                        method: 'GET',
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    });
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        if (blob.size > 500) {
                            finalAudioUrl = URL.createObjectURL(blob);
                            console.log("✅ Audio blob generated from URL");
                        }
                    } else {
                        console.warn("URL strategy returned not ok:", response.status);
                    }
                } catch (e) {
                    console.warn("Failed to fetch audio from URL, falling back...", e);
                }
            }

            if (finalAudioUrl) {
                console.log("Initializing audio playback...");
                if (listenBtn) {
                    listenBtn.dataset.cachedUrl = finalAudioUrl; // Cache it!
                }
                
                window.currentAudioInstance = new Audio(finalAudioUrl);
                
                window.currentAudioInstance.onended = () => {
                    if (listenBtn) {
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
                    }
                };

                window.currentAudioInstance.onerror = () => {
                    const errCode = window.currentAudioInstance.error ? window.currentAudioInstance.error.code : 'Unknown';
                    const errMsg = window.currentAudioInstance.error ? window.currentAudioInstance.error.message : 'Format or Network error';
                    if (listenBtn) {
                        listenBtn.disabled = false;
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Error playing`;
                    }
                    console.error(`Playback failed (Code: ${errCode}): ${errMsg}`);
                };

                // Play directly without waiting for canplaythrough (since it's a downloaded blob)
                await window.currentAudioInstance.play();
                
                if (listenBtn) {
                    listenBtn.disabled = false;
                    listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                }
            } else {
                throw new Error('No audio source available or server failed to respond');
            }
        } catch (error) {
            console.error('TTS Playback Error:', error);
            if (listenBtn) {
                listenBtn.disabled = false;
                listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
            }
            alert("⚠️ Audio Error: " + error.message + "\n\nTry refreshing the page or checking your internet connection.");
        }
    }

    function displayScannedDetails(item) {
        if (!resultContainer) return;
        
        // Stop any currently playing audio
        if (window.currentAudioInstance && !window.currentAudioInstance.paused) {
            window.currentAudioInstance.pause();
            window.currentAudioInstance = null;
        }

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        const detected = item.detected || item.artifact_name || item.name || "Identified Artifact";
        let confidenceValue = item.confidence || item.probability || null;
        let confidence = 'High';
        if (confidenceValue !== null) {
            confidence = typeof confidenceValue === 'number' ? confidenceValue.toFixed(1) + '%' : confidenceValue + (String(confidenceValue).includes('%') ? '' : '%');
        }
        
        if (resultTitle) {
            resultTitle.textContent = `Match Found: ${detected}`;
            resultTitle.style.color = '#ecb613';
        }
        
        if (resultDesc) {
            resultDesc.innerHTML = `
                <div class="result-details">
                    <div class="match-meta">
                        <span class="confidence-tag"><span class="material-symbols-outlined">verified</span> ${confidence} Confidence</span>
                    </div>
                    <p class="artifact-info-text">${item.story || item.description || item.text || 'This artifact appears to be from the ancient Egyptian archives.'}</p>
                    <div class="result-actions" style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                         <button class="btn-primary" id="listenStoryBtn" style="padding: 1rem 2.5rem;"><span class="material-symbols-outlined">volume_up</span> Listen to Story</button>
                         <button class="btn-secondary" onclick="window.location.href='../collection/collection.html'" style="padding: 1rem 2.5rem; background: rgba(255,255,255,0.05);"><span class="material-symbols-outlined">explore</span> View in Gallery</button>
                    </div>
                </div>
            `;
            
                document.getElementById('listenStoryBtn')?.addEventListener('click', () => {
                const audioUrl = item.audio_url || item.audioUrl;
                if (audioUrl) {
                    console.log("Playing audio from history:", audioUrl);
                    generateStoryAudio(null, audioUrl);
                } else {
                    console.warn("No audio URL found for item:", item);
                    alert("⚠️ Audio story is not available for this artifact. Please try another one.");
                }
            });
        }
        
        showRelatedStatues(detected);
    }

    async function loadDetectionHistory() {
        const token = localStorage.getItem('token');
        const historyContainer = document.getElementById('detection-history');
        if (!historyContainer) return;

        if (!token) {
            historyContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px; grid-column: 1 / -1;">Please log in to view your scan history.</p>`;
            return;
        }

        try {
            const response = await fetch(`${API_URL}/ai/detections`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const detections = await response.json();
                const allItems = Array.isArray(detections) ? detections : (detections.data || []);
                const items = allItems.slice(0, 3);
                if (items.length === 0) {
                    historyContainer.innerHTML = `<p style="opacity:0.5; text-align:center; width:100%;">No recent scans found.</p>`;
                    return;
                }
                
                let loadedItems = items;
                historyContainer.innerHTML = items.map((item, index) => {
                    const name = item.detected || 'Artifact';
                    const dateStr = new Date(item.createdAt || item.date).toLocaleDateString();
                    const imageSrc = item.imageUrl || item.image;
                    
                    const iconContent = imageSrc 
                        ? `<img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="${name}">`
                        : `<span class="material-symbols-outlined">history</span>`;

                    return `
                        <div class="history-item" data-index="${index}">
                            <div class="history-icon">
                                ${iconContent}
                            </div>
                            <div class="history-content">
                                <div class="history-header">
                                    <h4 class="history-name">${name}</h4>
                                    <span class="history-badge">Identified</span>
                                </div>
                                <div class="history-meta">
                                    <span class="history-date">
                                        <span class="material-symbols-outlined">calendar_today</span>
                                        ${dateStr}
                                    </span>
                                    <span class="history-link">
                                        Details
                                        <span class="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add click listeners to history items
                historyContainer.querySelectorAll('.history-item').forEach(el => {
                    el.addEventListener('click', () => {
                        const index = parseInt(el.getAttribute('data-index'));
                        const selectedItem = loadedItems[index];
                        if (selectedItem) {
                            displayScannedDetails(selectedItem);
                        }
                    });
                });
            } else {
                historyContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px; grid-column: 1 / -1;">Unable to load scan history.</p>`;
            }
        } catch (e) { 
            console.error('History Error:', e); 
            historyContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px; grid-column: 1 / -1;">Unable to load scan history.</p>`;
        }
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
