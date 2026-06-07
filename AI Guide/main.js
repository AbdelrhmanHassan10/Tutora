// AI GUIDE SCRIPT - TUTORA

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-1ea2.up.railway.app/api';
    const token = localStorage.getItem('token');
    const talkBtn = document.querySelector('.talk-button');
    const transcriptionContent = document.querySelector('.transcription-content');
    const hologramAura = document.querySelector('.hologram-aura');
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const stopSpeechBtn = document.getElementById('stopSpeechBtn');
    let currentTranscript = "";

    // 1. Audio Logic (Speech Recognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Stay active even if user is silent
        recognition.interimResults = true; // Show live feedback
        recognition.lang = localStorage.getItem('language') === 'ar' ? 'ar-EG' : 'en-US';

        recognition.onstart = () => {
            isListening = true;
            if (talkBtn) talkBtn.innerHTML = '<span class="material-icons-outlined">stop</span><span>Listening...</span>';
            if (hologramAura) hologramAura.classList.add('listening-pulse');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            currentTranscript = finalTranscript || interimTranscript;
            
            if (welcomeSubtitle && currentTranscript) {
                welcomeSubtitle.textContent = `"${currentTranscript}"... Click to send`;
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            stopListening();
        };

        recognition.onend = () => {
            if (isListening) {
                // If it ended naturally without click, handle it
                stopListening(true);
            }
        };
    }

    function stopListening(shouldSend = false) {
        isListening = false;
        if (talkBtn) talkBtn.innerHTML = '<span class="material-icons-outlined">mic</span><span>Talk to me</span>';
        if (hologramAura) hologramAura.classList.remove('listening-pulse');
        
        if (shouldSend && currentTranscript) {
            addMessage('User', currentTranscript);
            processAIQuery(currentTranscript);
            currentTranscript = ""; // Clear after sending
        }
    }

    // 2. Interaction Logic
    if (talkBtn) {
        talkBtn.addEventListener('click', () => {
            if (!token) {
                alert('🔐 Please login to sync with Tutora\'s neural link.');
                window.location.href = '../2.login/code.html';
                return;
            }

            if (!recognition) {
                alert('⚠️ Speech recognition is not supported in this browser.');
                const query = prompt('Enter your question for Tutora:');
                if (query) {
                    addMessage('User', query);
                    processAIQuery(query);
                }
                return;
            }

            if (isListening) {
                recognition.stop();
                stopListening(true); // Send when manually clicked to stop
            } else {
                currentTranscript = ""; // Reset
                recognition.start();
            }
        });
    }

    // 3. AI Query Processing
    async function processAIQuery(query) {
        if (!query.trim()) return;
        
        // Visual Thinking State
        if (welcomeTitle) {
            const lang = localStorage.getItem('language') || 'en';
            welcomeTitle.textContent = lang === 'ar' 
                ? `"${query}" (جاري البحث...)` 
                : `"${query}" (Searching...)`;
        }
        
        try {
            const response = await fetch(`${API_URL}/ai/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: query })
            });

            if (response.ok) {
                const data = await response.json();
                const aiText = data.answer || data.response || "I found some data, but couldn't decode it.";
                handleTutoraResponse(aiText, query);
            } else {
                handleTutoraResponse("Connection to the central archive failed. Please try again.", query);
            }
        } catch (error) {
            console.error('AI Query Error:', error);
            handleTutoraResponse("My neural link is currently unstable. Please check your connection.", query);
        }
    }

    function handleTutoraResponse(text, query) {
        if (welcomeTitle) {
            if (query) {
                welcomeTitle.textContent = `"${query}"`;
            } else {
                const lang = localStorage.getItem('language') || 'en';
                welcomeTitle.textContent = lang === 'ar' 
                    ? '"تم العثور على الإجابة!"' 
                    : '"Response generated!"';
            }
        }
        addMessage('Tutora', text);
        speakText(text);
    }

    function addMessage(sender, text) {
        if (!transcriptionContent) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender.toLowerCase()}-message`;
        msgDiv.innerHTML = `
            <p class="message-sender">${sender}</p>
            <p class="message-text">"${text}"</p>
        `;
        transcriptionContent.appendChild(msgDiv);
        transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
    }

    // 4. Text-to-Speech (TTS) via API
    async function speakText(text) {
        if (!text) return;
        
        // Stop any currently playing audio
        if (window.currentAIAudio) {
            window.currentAIAudio.pause();
            window.currentAIAudio = null;
        }
        
        if (stopSpeechBtn) stopSpeechBtn.style.display = 'flex';

        try {
            const lang = localStorage.getItem('language') || 'en';
            const response = await fetch(`${API_URL}/ai/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: text, language: lang })
            });

            if (!response.ok) throw new Error('TTS API failed');

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            window.currentAIAudio = new Audio(audioUrl);
            
            window.currentAIAudio.onended = () => {
                if (stopSpeechBtn) stopSpeechBtn.style.display = 'none';
            };

            window.currentAIAudio.onerror = () => {
                if (stopSpeechBtn) stopSpeechBtn.style.display = 'none';
                console.error("Audio playback error");
            };

            await window.currentAIAudio.play();

        } catch (error) {
            console.error('TTS Error:', error);
            if (stopSpeechBtn) stopSpeechBtn.style.display = 'none';
            // Fallback to browser TTS if API fails
            fallbackSpeakText(text);
        }
    }

    function fallbackSpeakText(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = localStorage.getItem('language') || 'en';
        utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
        utterance.rate = 0.9;
        
        utterance.onstart = () => { if (stopSpeechBtn) stopSpeechBtn.style.display = 'flex'; };
        utterance.onend = () => { if (stopSpeechBtn) stopSpeechBtn.style.display = 'none'; };
        utterance.onerror = () => { if (stopSpeechBtn) stopSpeechBtn.style.display = 'none'; };
        
        window.speechSynthesis.speak(utterance);
    }

    if (stopSpeechBtn) {
        stopSpeechBtn.addEventListener('click', () => {
            if (window.currentAIAudio) {
                window.currentAIAudio.pause();
                window.currentAIAudio = null;
            }
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopSpeechBtn.style.display = 'none';
        });
    }

    // 5. Quick Actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.textContent.trim();
            addMessage('User', query);
            processAIQuery(query);
        });
    });

    // 6. Navigation and Sidebar Toggle (Royal Superstar Sync)
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

});


