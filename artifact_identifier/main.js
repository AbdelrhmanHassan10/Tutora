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

    // ============================================
    // AUDIO HELPER: Safe stop for any playing audio
    // ============================================
    function stopCurrentAudio() {
        if (window.currentAudioInstance) {
            try {
                window.currentAudioInstance.pause();
                window.currentAudioInstance.currentTime = 0;
                window.currentAudioInstance.removeAttribute('src');
                window.currentAudioInstance.load();
            } catch (e) { /* ignore */ }
            window.currentAudioInstance = null;
        }
    }

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

    // ============================================
    // HELPER: Show scan results in the UI
    // ============================================
    function showScanResults(data, file, audioUrlField) {
        let detected = data.artifact_name || data.class_name || data.detected || data.name || (data.predictions && data.predictions[0]?.className) || "Mysterious Artifact";
        let confidenceValue = data.confidence || data.probability || (data.predictions && data.predictions[0]?.probability ? (data.predictions[0].probability * 100).toFixed(1) : null);
        
        // Format confidence properly
        let confidence = 'High';
        if (confidenceValue !== null) {
            confidence = typeof confidenceValue === 'number' ? confidenceValue.toFixed(1) + '%' : confidenceValue + (String(confidenceValue).includes('%') ? '' : '%');
        }

        const storyText = data.story || data.description || data.text || 'This artifact appears to be from the ancient Egyptian archives. Its specific details are being cross-referenced with our digital library.';

        resultTitle.textContent = `Match Found: ${detected}`;
        resultDesc.innerHTML = `
            <div class="result-details">
                <div class="match-meta">
                    <span class="confidence-tag"><span class="material-symbols-outlined">verified</span> ${confidence} Confidence</span>
                </div>
                <p class="artifact-info-text">${storyText}</p>
                <div class="result-actions" style="margin-top:20px; display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
                     <button class="btn-primary" id="listenStoryBtn" style="padding: 1rem 2.5rem;"><span class="material-symbols-outlined">volume_up</span> Listen to Story</button>
                     <button class="btn-secondary" onclick="window.location.href='../collection/collection.html'" style="padding: 1rem 2.5rem; background: rgba(255,255,255,0.05);"><span class="material-symbols-outlined">explore</span> View in Gallery</button>
                     <button class="btn-primary" id="generate3dBtn" style="padding: 1rem 2.5rem; background: #8b5cf6; border-color: #8b5cf6;"><span class="material-symbols-outlined">view_in_ar</span> Generate 3D Model</button>
                </div>
            </div>
        `;
        
        console.log("Audio URL from prediction:", audioUrlField);
        
        // Listen to Story button — uses audio URL if available, otherwise generates TTS from the story text
        document.getElementById('listenStoryBtn')?.addEventListener('click', () => {
            if (audioUrlField) {
                generateStoryAudio(null, audioUrlField);
            } else {
                // No audio URL — try generating TTS from the story text using browser TTS as fallback
                console.warn("No audio URL provided by server, trying TTS fallback...");
                generateStoryAudioWithTextFallback(storyText, lastAnalyzedFile);
            }
        });

        // 3D Model button
        document.getElementById('generate3dBtn')?.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px; margin-right: 8px;"></div> Generating 3D...`;
            
            try {
                const token = localStorage.getItem('token');
                const formData3d = new FormData();
                formData3d.append('image', file);
                
                const response3d = await fetch('https://gem-backend-production-1ea2.up.railway.app/api/ai/image-to-3d', {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formData3d
                });
                
                const data3d = await response3d.json();
                const modelUrl = data3d.model_3d_url || data3d.model3dUrl || data3d.model_url || data3d.model3d_url || data3d['3d_model_url'] || data3d['3d_url'] || data3d.model || (data3d.model_3d && data3d.model_3d.url);
                
                if (response3d.ok && modelUrl) {
                    window.open(modelUrl, '_blank');
                    btn.innerHTML = `<span class="material-symbols-outlined">check_circle</span> 3D Ready`;
                    setTimeout(() => { btn.disabled = false; btn.innerHTML = originalText; }, 3000);
                } else {
                    throw new Error(data3d.message || data3d.error || 'No 3D model URL returned by the server');
                }
            } catch (err) {
                console.error('3D generation error:', err);
                alert('Could not generate 3D model: ' + err.message);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
        
        showRelatedStatues(detected);
        loadDetectionHistory();
    }

    // ============================================
    // TTS Fallback: Try API TTS with text, then browser TTS
    // ============================================
    async function generateStoryAudioWithTextFallback(storyText, file) {
        const listenBtn = document.getElementById('listenStoryBtn');
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px;"></div> Generating Audio...`;
        }

        try {
            // Attempt 1: Send text to TTS API (like AI Guide does)
            const token = localStorage.getItem('token');
            const lang = localStorage.getItem('language') || 'en';
            
            const ttsResponse = await fetch(`https://gem-backend-production-1ea2.up.railway.app/api/ai/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: storyText, language: lang })
            });

            if (ttsResponse.ok) {
                const contentType = ttsResponse.headers.get('content-type') || '';
                
                if (contentType.includes('audio') || contentType.includes('octet-stream')) {
                    // Server returned audio blob directly (like AI Guide)
                    const blob = await ttsResponse.blob();
                    const audioUrl = URL.createObjectURL(blob);
                    if (listenBtn) listenBtn.dataset.cachedUrl = audioUrl;
                    generateStoryAudio(null, audioUrl);
                    return;
                } else {
                    // Server returned JSON with audio URL
                    const ttsData = await ttsResponse.json();
                    const audioUrl = ttsData.audio_url || ttsData.audioUrl || ttsData.audio || ttsData.url;
                    if (audioUrl) {
                        generateStoryAudio(null, audioUrl);
                        return;
                    }
                }
            }
            
            // Attempt 2: If API TTS failed, try re-sending image
            if (file) {
                console.log("Text TTS failed, retrying with image...");
                generateStoryAudio(file, null);
                return;
            }

            // Attempt 3: Browser TTS fallback
            throw new Error('API TTS unavailable');

        } catch (error) {
            console.warn('API TTS failed, using browser speech synthesis fallback:', error.message);
            
            if (listenBtn) {
                listenBtn.disabled = false;
            }

            // Use browser's built-in speech synthesis
            if (window.speechSynthesis && storyText) {
                stopCurrentAudio();
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(storyText);
                const lang = localStorage.getItem('language') || 'en';
                utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
                utterance.rate = 0.9;
                utterance.pitch = 1;
                
                utterance.onstart = () => {
                    if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                };
                utterance.onend = () => {
                    if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
                };
                utterance.onerror = () => {
                    if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                };

                // Store reference for pause/resume
                window.currentBrowserUtterance = utterance;
                
                if (listenBtn) {
                    // Override click for pause/resume of browser TTS
                    listenBtn.onclick = () => {
                        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                            window.speechSynthesis.pause();
                            listenBtn.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> Resume Story`;
                        } else if (window.speechSynthesis.paused) {
                            window.speechSynthesis.resume();
                            listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                        } else {
                            window.speechSynthesis.speak(utterance);
                        }
                    };
                }
                
                window.speechSynthesis.speak(utterance);
            } else {
                if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_off</span> Audio Unavailable`;
                alert('⚠️ Audio is not available. Your browser does not support speech synthesis.');
            }
        }
    }

    // AI Analysis Integration
    async function analyzeImage(file) {
        const token = localStorage.getItem('token');
        lastAnalyzedFile = file;

        // Stop any currently playing audio
        stopCurrentAudio();
        if (window.speechSynthesis) window.speechSynthesis.cancel();

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
        formData.append('image', file);
        const lang = localStorage.getItem('language') || 'en';
        formData.append('language', lang);

        try {
            // ── STEP 1: Try text-to-speech endpoint (combined detection + TTS) ──
            const response = await fetch(`https://gem-backend-production-1ea2.up.railway.app/api/ai/text-to-speech`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            const data = await response.json();
            console.log("TTS API response:", { status: response.status, ok: response.ok, data });
            
            // Check if we got detection data even if response is not ok
            const hasDetectionData = data.artifact_name || data.class_name || data.detected || data.name || 
                                     (data.predictions && data.predictions.length > 0);
            
            const audioUrlField = data.audio_url || data.audioUrl || data.audio;

            if (response.ok && hasDetectionData) {
                // ✅ Full success — both detection and TTS worked
                showScanResults(data, file, audioUrlField);
            } else if (hasDetectionData) {
                // ⚠️ Partial success — detection worked but TTS may have failed
                console.warn("TTS failed but detection data found. Showing results without audio URL.");
                showScanResults(data, file, audioUrlField || null);
            } else {
                // ❌ TTS endpoint completely failed — try fallback detection
                console.warn("TTS endpoint failed completely, trying fallback...", data.message || data.error);
                await fallbackDetection(file, token, lang);
            }
        } catch (error) {
            console.error('AI Detection Error:', error);
            // Network error on TTS — try fallback detection
            try {
                const token2 = localStorage.getItem('token');
                const lang2 = localStorage.getItem('language') || 'en';
                await fallbackDetection(file, token2, lang2);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                resultTitle.textContent = 'Neural Link Interrupted';
                resultDesc.textContent = 'Connection issue. Please check your network and try again.';
            }
        }
    }

    // ============================================
    // FALLBACK: Try alternative detection endpoints
    // ============================================
    async function fallbackDetection(file, token, lang) {
        console.log("Attempting fallback detection endpoints...");
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', lang);

        // Try multiple possible detection endpoints
        const endpoints = [
            `https://gem-backend-production-1ea2.up.railway.app/api/ai/detect`,
            `https://gem-backend-production-1ea2.up.railway.app/api/ai/identify`,
            `https://gem-backend-production-1ea2.up.railway.app/api/ai/scan`,
            `https://gem-backend-production-1ea2.up.railway.app/api/ai/predict`
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Trying fallback: ${endpoint}`);
                const fallbackForm = new FormData();
                fallbackForm.append('image', file);
                fallbackForm.append('language', lang);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: fallbackForm
                });

                if (response.ok) {
                    const data = await response.json();
                    const hasData = data.artifact_name || data.class_name || data.detected || data.name || 
                                    (data.predictions && data.predictions.length > 0);
                    if (hasData) {
                        console.log(`Fallback success on: ${endpoint}`);
                        const audioUrl = data.audio_url || data.audioUrl || data.audio;
                        showScanResults(data, file, audioUrl || null);
                        return;
                    }
                }
            } catch (e) {
                console.warn(`Fallback ${endpoint} failed:`, e.message);
                continue;
            }
        }

        // All fallbacks failed
        resultTitle.textContent = 'Identification Unsuccessful';
        resultTitle.style.color = '#ef4444';
        resultDesc.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <span class="material-symbols-outlined" style="font-size: 48px; color: #ef4444; margin-bottom: 12px; display: block;">error_outline</span>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 16px;">The AI could not process this image. This may be due to a temporary server issue.</p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="document.getElementById('scan-upload').click()" style="padding: 0.8rem 2rem;">
                        <span class="material-symbols-outlined">refresh</span> Try Another Photo
                    </button>
                    <button class="btn-secondary" onclick="location.reload()" style="padding: 0.8rem 2rem; background: rgba(255,255,255,0.05);">
                        <span class="material-symbols-outlined">restart_alt</span> Reload Page
                    </button>
                </div>
            </div>
        `;
    }

    // ============================================
    // AUDIO PLAYBACK - FULLY FIXED
    // ============================================
    async function generateStoryAudio(file, audioUrl) {
        const listenBtn = document.getElementById('listenStoryBtn');
        
        // ---- STATE 1: Audio exists and is currently playing → Pause it ----
        if (window.currentAudioInstance && !window.currentAudioInstance.paused && !window.currentAudioInstance.ended) {
            window.currentAudioInstance.pause();
            if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> Resume Story`;
            return;
        }

        // ---- STATE 2: Audio exists but is paused (not ended) → Resume it ----
        if (window.currentAudioInstance && window.currentAudioInstance.paused && !window.currentAudioInstance.ended && window.currentAudioInstance.currentTime > 0) {
            try {
                await window.currentAudioInstance.play();
                if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
            } catch (e) {
                console.error("Resume playback error:", e);
                if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Playback Error`;
                setTimeout(() => {
                    if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                }, 2000);
            }
            return;
        }

        // ---- STATE 3: Audio ended → Replay from cached URL ----
        if (listenBtn && listenBtn.dataset.cachedUrl && (!window.currentAudioInstance || window.currentAudioInstance.ended)) {
            stopCurrentAudio();
            try {
                window.currentAudioInstance = new Audio(listenBtn.dataset.cachedUrl);
                window.currentAudioInstance.onended = () => {
                    if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
                };
                window.currentAudioInstance.onerror = (e) => {
                    console.error('Replay audio load error:', e);
                    if (listenBtn) {
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Error`;
                        setTimeout(() => {
                            listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                            listenBtn.dataset.cachedUrl = '';
                        }, 2000);
                    }
                };
                await window.currentAudioInstance.play();
                if (listenBtn) listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
            } catch (e) {
                console.error("Replay error:", e);
                if (listenBtn) {
                    listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                    listenBtn.dataset.cachedUrl = '';
                }
            }
            return;
        }

        // ---- STATE 4: First time playing — resolve the audio URL ----
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px;"></div> Preparing Audio...`;
        }

        try {
            let finalAudioUrl = "";

            if (audioUrl) {
                // We have an audio URL from the API response
                if (audioUrl.startsWith('http') || audioUrl.startsWith('data:')) {
                    finalAudioUrl = audioUrl;
                } else if (audioUrl.length > 500) {
                    // Likely a raw base64 string
                    finalAudioUrl = `data:audio/mp3;base64,${audioUrl}`;
                } else {
                    // Relative path from backend
                    const cleanPath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
                    finalAudioUrl = `https://gem-backend-production-1ea2.up.railway.app${cleanPath}`;
                }
            } else if (file) {
                // No audio URL — re-send image to text-to-speech endpoint to get one
                console.log("No audio URL available, re-requesting from text-to-speech...");
                const token = localStorage.getItem('token');
                const lang = localStorage.getItem('language') || 'en';
                const formData = new FormData();
                formData.append('image', file);
                formData.append('language', lang);

                const ttsResponse = await fetch(`https://gem-backend-production-1ea2.up.railway.app/api/ai/text-to-speech`, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formData
                });

                if (!ttsResponse.ok) {
                    throw new Error(`Server error: ${ttsResponse.status}`);
                }

                const ttsData = await ttsResponse.json();
                const newAudioUrl = ttsData.audio_url || ttsData.audioUrl || ttsData.audio || ttsData.url;

                if (!newAudioUrl) {
                    throw new Error("Server did not return an audio URL. The story could not be generated.");
                }

                if (newAudioUrl.startsWith('http') || newAudioUrl.startsWith('data:')) {
                    finalAudioUrl = newAudioUrl;
                } else if (newAudioUrl.length > 500) {
                    finalAudioUrl = `data:audio/mp3;base64,${newAudioUrl}`;
                } else {
                    const cleanPath = newAudioUrl.startsWith('/') ? newAudioUrl : `/${newAudioUrl}`;
                    finalAudioUrl = `https://gem-backend-production-1ea2.up.railway.app${cleanPath}`;
                }
            } else {
                throw new Error("No audio source available. Please try scanning again.");
            }

            if (finalAudioUrl) {
                console.log("Initializing audio playback with URL:", finalAudioUrl.substring(0, 80) + '...');
                
                // Cache the URL on the button for replay
                if (listenBtn) {
                    listenBtn.dataset.cachedUrl = finalAudioUrl;
                }
                
                // Stop any old audio first
                stopCurrentAudio();

                window.currentAudioInstance = new Audio(finalAudioUrl);
                
                // Set up event handlers BEFORE calling play()
                window.currentAudioInstance.onended = () => {
                    if (listenBtn) {
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
                        listenBtn.disabled = false;
                    }
                };

                window.currentAudioInstance.onerror = (e) => {
                    console.error('Audio playback error:', e);
                    if (listenBtn) {
                        listenBtn.disabled = false;
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Audio Error`;
                        setTimeout(() => {
                            listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                            listenBtn.dataset.cachedUrl = '';
                        }, 2500);
                    }
                };

                // Wait for audio to be ready before playing
                await new Promise((resolve, reject) => {
                    window.currentAudioInstance.oncanplaythrough = resolve;
                    window.currentAudioInstance.onerror = (e) => {
                        reject(new Error('Failed to load audio file. The URL may be invalid or expired.'));
                    };
                    // Set a timeout in case the audio takes too long to load
                    setTimeout(() => {
                        // If still loading, try playing anyway
                        resolve();
                    }, 10000);
                    window.currentAudioInstance.load();
                });

                // Re-attach onerror for actual playback errors (not load errors)
                window.currentAudioInstance.onerror = (e) => {
                    console.error('Playback error after load:', e);
                    if (listenBtn) {
                        listenBtn.disabled = false;
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">error</span> Playback Failed`;
                        setTimeout(() => {
                            listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
                        }, 2500);
                    }
                };

                window.currentAudioInstance.onended = () => {
                    if (listenBtn) {
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">replay</span> Replay Story`;
                        listenBtn.disabled = false;
                    }
                };

                try {
                    await window.currentAudioInstance.play();
                    if (listenBtn) {
                        listenBtn.disabled = false;
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                    }
                } catch (playError) {
                    console.error('Play() rejected:', playError);
                    // This often happens due to autoplay policy — but since user clicked a button, it should work
                    // If it still fails, show a message
                    if (listenBtn) {
                        listenBtn.disabled = false;
                        listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Tap to Play`;
                        // Allow one more manual attempt
                        listenBtn.addEventListener('click', async function retryPlay() {
                            try {
                                if (window.currentAudioInstance) {
                                    await window.currentAudioInstance.play();
                                    listenBtn.innerHTML = `<span class="material-symbols-outlined">pause</span> Listening...`;
                                }
                            } catch (e2) {
                                console.error('Retry play failed:', e2);
                                alert('⚠️ Your browser is blocking audio playback. Please check your browser settings.');
                            }
                            listenBtn.removeEventListener('click', retryPlay);
                        }, { once: true });
                    }
                }
            }
        } catch (error) {
            console.error('TTS Playback Error:', error);
            if (listenBtn) {
                listenBtn.disabled = false;
                listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
            }
            alert("⚠️ Audio Error: " + error.message);
        }
    }

    function displayScannedDetails(item) {
        if (!resultContainer) return;
        
        // Stop any currently playing audio
        stopCurrentAudio();

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
                         ${item.model_3d_url || item.model3dUrl || item.model_url || item.model3d_url ? `<button class="btn-primary" onclick="window.open('${item.model_3d_url || item.model3dUrl || item.model_url || item.model3d_url}', '_blank')" style="padding: 1rem 2.5rem; background: #8b5cf6; border-color: #8b5cf6;"><span class="material-symbols-outlined">view_in_ar</span> View 3D Model</button>` : ''}
                    </div>
                </div>
            `;
            
            document.getElementById('listenStoryBtn')?.addEventListener('click', () => {
                const audioUrl = item.audio_url || item.audioUrl || item.audio;
                if (audioUrl) {
                    console.log("Playing audio from history:", audioUrl);
                    generateStoryAudio(null, audioUrl);
                } else {
                    // No audio URL in history — use text fallback with the story text
                    console.warn("No audio URL found for history item, using text fallback...");
                    const storyText = item.story || item.description || item.text || 'This artifact appears to be from the ancient Egyptian archives.';
                    generateStoryAudioWithTextFallback(storyText, null);
                }
            });
        }
        
        showRelatedStatues(detected);
    }

    // Helper: Re-generate audio for a history item that has no audio_url
    async function regenerateAudioFromImageUrl(imageUrl) {
        const listenBtn = document.getElementById('listenStoryBtn');
        if (listenBtn) {
            listenBtn.disabled = true;
            listenBtn.innerHTML = `<div class="ai-loader" style="width:16px;height:16px;border-width:2px;"></div> Generating Audio...`;
        }

        try {
            // Fetch the image as a blob
            const imgResponse = await fetch(imageUrl);
            if (!imgResponse.ok) throw new Error('Could not load the artifact image.');
            const imgBlob = await imgResponse.blob();
            const file = new File([imgBlob], "history-artifact.jpg", { type: imgBlob.type || "image/jpeg" });

            // Now call generateStoryAudio with the file
            await generateStoryAudio(file, null);
        } catch (err) {
            console.error("Regenerate audio error:", err);
            if (listenBtn) {
                listenBtn.disabled = false;
                listenBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span> Listen to Story`;
            }
            alert("⚠️ Could not generate audio: " + err.message);
        }
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
            const response = await fetch(`https://gem-backend-production-1ea2.up.railway.app/api/ai/detections`, {
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
