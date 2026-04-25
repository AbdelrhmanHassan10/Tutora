// AI GUIDE SCRIPT - TUTORA

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
                handleTutoraResponse(aiText);
            } else {
                handleTutoraResponse("Connection to the central archive failed. Please try again.");
            }
        } catch (error) {
            console.error('AI Query Error:', error);
            handleTutoraResponse("My neural link is currently unstable. Please check your connection.");
        }
    }

    function handleTutoraResponse(text) {
        if (welcomeTitle) welcomeTitle.textContent = `"${text}"`;
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

    // ============================================
    // ROYAL ATMOSPHERE (Golden Dust & Shapes)
    // ============================================
    function initRoyalAtmosphere() {
        const dustContainer = document.getElementById('dust-container');
        const shapesContainer = document.getElementById('shapes-container');
        
        if (!dustContainer || !shapesContainer) return;

        // Create 150 dust particles
        for (let i = 0; i < 150; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s infinite linear ${delay}s`;
            
            dustContainer.appendChild(particle);
        }

        // Create 15 royal shapes (Hieroglyphs)
        const hieroglyphs = ['𓂀', '𓋹', '𓅓', '𓇳', '𓇿', '𓆎', '𓃻', '𓂋', '𓏏', '𓈖'];
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.textContent = hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)];
            
            const size = Math.random() * 20 + 20;
            shape.style.fontSize = `${size}px`;
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            shape.style.left = `${left}%`;
            shape.style.top = `${top}%`;
            
            const duration = Math.random() * 20 + 20;
            const delay = Math.random() * 10;
            shape.style.animation = `rotateFloat ${duration}s infinite ease-in-out ${delay}s`;
            
            shapesContainer.appendChild(shape);
        }
    }

    initRoyalAtmosphere();
});

