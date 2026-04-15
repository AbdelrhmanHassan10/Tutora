// ============================================
// AI GUIDE SCRIPT - TORTARA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';
    const token = localStorage.getItem('token');
    const talkBtn = document.querySelector('.talk-button');
    const transcriptionContent = document.querySelector('.transcription-content');
    const hologramAura = document.querySelector('.hologram-aura');
    const welcomeTitle = document.querySelector('.welcome-title');

    // 1. Audio Logic (Speech Recognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = localStorage.getItem('language') === 'ar' ? 'ar-EG' : 'en-US';

        recognition.onstart = () => {
            isListening = true;
            if (talkBtn) talkBtn.innerHTML = '<span class="material-icons-outlined">stop</span><span>Listening...</span>';
            if (hologramAura) hologramAura.classList.add('listening-pulse');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            addMessage('User', transcript);
            processAIQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
            stopListening();
        };

        recognition.onend = () => {
            stopListening();
        };
    }

    function stopListening() {
        isListening = false;
        if (talkBtn) talkBtn.innerHTML = '<span class="material-icons-outlined">mic</span><span>Talk to me</span>';
        if (hologramAura) hologramAura.classList.remove('listening-pulse');
    }

    // 2. Interaction Logic
    if (talkBtn) {
        talkBtn.addEventListener('click', () => {
            if (!token) {
                alert('🔐 Please login to sync with Tortara\'s neural link.');
                window.location.href = '../2.login/code.html';
                return;
            }

            if (!recognition) {
                alert('⚠️ Speech recognition is not supported in this browser.');
                const query = prompt('Enter your question for Tortara:');
                if (query) {
                    addMessage('User', query);
                    processAIQuery(query);
                }
                return;
            }

            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }

    // 3. AI Query Processing
    async function processAIQuery(query) {
        if (!query.trim()) return;
        
        // Visual Thinking State
        if (welcomeTitle) welcomeTitle.textContent = '"Analyzing neural patterns..."';
        
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
                handleTortaraResponse(aiText);
            } else {
                handleTortaraResponse("Connection to the central archive failed. Please try again.");
            }
        } catch (error) {
            console.error('AI Query Error:', error);
            handleTortaraResponse("My neural link is currently unstable. Please check your connection.");
        }
    }

    function handleTortaraResponse(text) {
        if (welcomeTitle) welcomeTitle.textContent = `"${text}"`;
        addMessage('Tortara', text);
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

    // 4. Text-to-Speech (TTS)
    function speakText(text) {
        if (!window.speechSynthesis) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = localStorage.getItem('language') || 'en';
        utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
        utterance.rate = 0.9; // Friendly guide speed
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    }

    // 5. Quick Actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.textContent.trim();
            addMessage('User', query);
            processAIQuery(query);
        });
    });

    // 6. Navigation and Sidebar Toggle
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking links
    if (mobileMenu) {
        mobileMenu.querySelectorAll('.menu-link, .dropdown-item').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});
