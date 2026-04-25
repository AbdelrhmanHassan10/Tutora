document.addEventListener('DOMContentLoaded', () => {

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

    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light');
        body.classList.remove('dark');
    } else {
        body.classList.add('dark');
        body.classList.remove('light');
    }
    updateThemeIcon();

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        icon.textContent = body.classList.contains('dark') ? 'light_mode' : 'dark_mode';
    }

    // ============================================
    // LANGUAGE TOGGLE
    // ============================================
    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.language-toggle button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('language', btn.getAttribute('data-lang'));
        });
    });

    // ============================================
    // FULL-SCREEN CHAT
    // ============================================
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatSuggestions = document.getElementById('chatSuggestions');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-cb6d.up.railway.app/api';

    function getTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg-container ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;

        const avatarSrc = sender === 'user' ? './unnamed.png' : '../logo.png';
        msgDiv.innerHTML = `
            <div class="chat-msg-avatar">
                <img src="${avatarSrc}" alt="${sender}">
            </div>
            <div class="chat-msg-bubble">
                <p>${text}</p>
                <span class="chat-msg-time">${getTime()}</span>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg-container ai-msg';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="chat-msg-avatar"><img src="../logo.png" alt="AI"></div>
            <div class="chat-msg-bubble">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            </div>
        `;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const t = document.getElementById('typingIndicator');
        if (t) t.remove();
    }

    async function sendMessage(text) {
        if (!text.trim()) return;
        addMessage(text, 'user');
        chatInput.value = '';

        // Hide suggestions after first message
        if (chatSuggestions) chatSuggestions.style.display = 'none';

        addTypingIndicator();

        const token = localStorage.getItem('token');

        // API requires authentication
        if (!token) {
            removeTypingIndicator();
            addMessage("🔐 You need to be logged in to chat with Tutora. Please <a href='../2.login/code.html' style='color:#ecb613;'>sign in</a> to continue.", 'ai');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/ai/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: text })
            });

            removeTypingIndicator();

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                addMessage("Sorry, the AI server returned an unexpected response. Please try again.", 'ai');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                // Per API docs: response field is "answer"
                const aiText = data.answer || data.response || data.message || data.data
                    || "I found some interesting information, but there was an issue displaying it.";
                addMessage(aiText, 'ai');
            } else if (response.status === 401 || response.status === 403) {
                addMessage("🔐 Your session has expired. Please <a href='../2.login/login.html' style='color:#ecb613;'>sign in again</a>.", 'ai');
                localStorage.removeItem('token');
            } else if (response.status === 404) {
                addMessage("The AI service is currently unavailable. Please try again later.", 'ai');
            } else {
                addMessage(data.message || data.error || "Sorry, I encountered an error. Please try again.", 'ai');
            }
        } catch (error) {
            removeTypingIndicator();
            console.error('Chat API Error:', error);
            addMessage("⚠️ Could not connect to the AI server. Please check your internet connection and try again.", 'ai');
        }
    }

    sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(chatInput.value);
    });

    // Suggestion buttons
    document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.getAttribute('data-q'));
        });
    });

    // Clear chat
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="chat-msg-container ai-msg">
                    <div class="chat-msg-avatar"><img src="../logo.png" alt="AI"></div>
                    <div class="chat-msg-bubble">
                        <p>Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.</p>
                        <span class="chat-msg-time">${getTime()}</span>
                    </div>
                </div>
            `;
            if (chatSuggestions) chatSuggestions.style.display = 'flex';
        });
    }

    // Topic cards link to chat
    document.querySelectorAll('.chat-topic-card').forEach(card => {
        card.addEventListener('click', () => {
            const topic = card.querySelector('h3').textContent;
            document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => sendMessage(`Tell me about ${topic}`), 600);
        });
    });

    // Load chat history
    async function loadChatHistory() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`${API_URL}/ai/chats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const history = Array.isArray(data) ? data : data.chats || data.data || [];
                history.forEach(chat => {
                    if (chat.question || chat.prompt || chat.userMessage) addMessage(chat.question || chat.prompt || chat.userMessage, 'user');
                    if (chat.answer || chat.response || chat.aiMessage) addMessage(chat.answer || chat.response || chat.aiMessage, 'ai');
                });
                if (history.length > 0 && chatSuggestions) chatSuggestions.style.display = 'none';
            }
        } catch (e) {
            console.error("Failed to load AI history", e);
        }
    }
    loadChatHistory();

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const animElements = document.querySelectorAll('.anim-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animElements.forEach(el => observer.observe(el));

    // ============================================
    // COUNT-UP ANIMATION
    // ============================================
    const countElements = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseFloat(entry.target.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function updateCount(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = target * eased;

                    if (target >= 1000) {
                        entry.target.textContent = Math.floor(current).toLocaleString() + (target >= 100000 ? '+' : '');
                    } else if (target < 10) {
                        entry.target.textContent = current.toFixed(1);
                    } else {
                        entry.target.textContent = Math.floor(current) + (target >= 100 ? '%' : '');
                    }

                    if (progress < 1) requestAnimationFrame(updateCount);
                }
                requestAnimationFrame(updateCount);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));

    // ============================================
    // ROYAL ATMOSPHERE (Dust & Shapes)
    // ============================================
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');

    const createAtmosphere = () => {
        if (!dustContainer || !shapesContainer) return;
        
        // Royal Dust (150 particles)
        for (let i = 0; i < 150; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.cssText = `
                position: absolute;
                background: rgba(212, 175, 55, 0.4);
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: float ${Math.random() * 15 + 15}s infinite linear;
                animation-delay: ${Math.random() * -15}s;
            `;
            dustContainer.appendChild(dust);
        }

        // Royal Shapes (12 rotating icons)
        for (let i = 0; i < 12; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(212, 175, 55, 0.1);
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                transform: rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5});
                animation: rotateFloat ${Math.random() * 20 + 20}s infinite linear;
                animation-delay: ${Math.random() * -20}s;
            `;
            shapesContainer.appendChild(shape);
        }
    };

    createAtmosphere();

    console.log('✓ Chat System Restored & Atmosphericized');
});

