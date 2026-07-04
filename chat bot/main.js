// ============================================
// CHATBOT SCRIPT - TUTORA AI
// ============================================

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

    // Dropdown Toggle
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

    // ============================================
    // PROFESSIONAL CHAT SYSTEM WITH HISTORY
    // ============================================
    const API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'https://gem-backend-production-40ae.up.railway.app/api';
    
    // UI Elements
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatSuggestions = document.getElementById('chatSuggestions');
    const clearChatBtn = document.getElementById('clearChatBtn');
    
    // Sidebar Elements
    const chatSidebar = document.getElementById('chatSidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');

    // State
    let currentSessionId = null;
    let chatSessions = JSON.parse(localStorage.getItem('tutora_chat_sessions') || '[]');

    // --- Sidebar Toggling ---
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                chatSidebar.classList.add('active');
            } else {
                chatSidebar.classList.toggle('collapsed');
            }
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                chatSidebar.classList.remove('active');
            } else {
                chatSidebar.classList.add('collapsed');
            }
        });
    }

    // --- Helper Functions ---
    function getTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function generateId() {
        return 'chat_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function addMessage(text, sender, save = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg-container ${sender === 'user' ? 'user-msg' : 'ai-msg'} anim-on-scroll visible`;
        
        // Simple Markdown Formatting for AI
        let formattedText = text;
        if (text === "Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.") {
            formattedText = '<span data-i18n="cb.welcome_msg">' + text + '</span>';
        } else if (sender === 'ai') {
            formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/^\*\s(.*)/gm, '<li>$1</li>') // Bullets
                .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>') // Wrap lists
                .replace(/\n/g, '<br>'); // New lines
        }

        const avatarSrc = sender === 'user' ? '../Profile/unnamed.png' : '../logo.png';
        msgDiv.innerHTML = `
            <div class="chat-msg-avatar">
                <img src="${avatarSrc}" alt="${sender}">
            </div>
            <div class="chat-msg-bubble">
                <div class="msg-content">${formattedText}</div>
                <span class="chat-msg-time">${getTime()}</span>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (save && currentSessionId) {
            const session = chatSessions.find(s => s.id === currentSessionId);
            if (session) {
                session.messages.push({ text, sender, time: getTime() });
                
                // Set title if it's the first user message
                if (sender === 'user' && session.title === 'New Conversation') {
                    session.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
                    renderSidebar();
        setTimeout(triggerTranslation, 50);
                }
                saveSessions();
            }
        }
    }

    // --- Session Management ---
    function saveSessions() {
        localStorage.setItem('tutora_chat_sessions', JSON.stringify(chatSessions));
    }

    function createNewSession() {
        const id = generateId();
        const newSession = {
            id: id,
            title: 'New Conversation',
            timestamp: Date.now(),
            messages: []
        };
        chatSessions.unshift(newSession);
        saveSessions();
        loadSession(id);
        
        // On mobile, close sidebar when starting new chat
        if (window.innerWidth <= 768 && chatSidebar) {
            chatSidebar.classList.remove('active');
        }
    }

    function loadSession(id) {
        currentSessionId = id;
        chatMessages.innerHTML = '';
        const session = chatSessions.find(s => s.id === id);
        
        if (session && session.messages.length > 0) {
            session.messages.forEach(m => addMessage(m.text, m.sender, false));
            if (chatSuggestions) chatSuggestions.style.display = 'none';
        } else {
            // Default Welcome
            addMessage("Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.", 'ai', false);
            if (chatSuggestions) chatSuggestions.style.display = 'flex';
        }
        
        renderSidebar();
        setTimeout(triggerTranslation, 50);
        
        // On mobile, close sidebar after selecting a chat
        if (window.innerWidth <= 768 && chatSidebar) {
            chatSidebar.classList.remove('active');
        }
    }

    function deleteSession(id, event) {
        event.stopPropagation(); // Prevent loading the session
        
        chatSessions = chatSessions.filter(s => s.id !== id);
        saveSessions();
        
        if (currentSessionId === id) {
            if (chatSessions.length > 0) {
                loadSession(chatSessions[0].id);
            } else {
                createNewSession();
            }
        } else {
            renderSidebar();
        setTimeout(triggerTranslation, 50);
        }
    }

    function editSession(id, event) {
        event.stopPropagation();
        const session = chatSessions.find(s => s.id === id);
        if (!session) return;

        const item = document.querySelector(`.history-item[data-id="${id}"]`);
        const titleSpan = item.querySelector('.history-item-title');
        const currentTitle = session.title;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'history-edit-input';
        input.value = currentTitle;
        
        titleSpan.replaceWith(input);
        input.focus();
        input.select();

        const saveTitle = () => {
            const newTitle = input.value.trim() || currentTitle;
            session.title = newTitle;
            saveSessions();
            renderSidebar();
        setTimeout(triggerTranslation, 50);
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveTitle();
            if (e.key === 'Escape') renderSidebar();
        setTimeout(triggerTranslation, 50);
        });

        input.addEventListener('blur', saveTitle);
    }

    window.deleteChatSession = deleteSession;
    const triggerTranslation = () => {
        if (window.TutoraLang && typeof window.TutoraLang.applyTranslations === 'function') {
            window.TutoraLang.applyTranslations();
        }
    };

    window.editChatSession = editSession;

    function renderSidebar() {
        if (!chatHistoryList) return;
        
        if (chatSessions.length === 0) {
            chatHistoryList.innerHTML = '<div class="history-empty" data-i18n="cb.no_past_chats">No past chats yet.</div>';
            return;
        }

        chatHistoryList.innerHTML = chatSessions.map(session => `
            <div class="history-item ${session.id === currentSessionId ? 'active' : ''}" data-id="${session.id}" onclick="loadSession('${session.id}')">
                <span class="material-symbols-outlined chat-icon">chat_bubble</span>
                <span class="history-item-title" ${session.title === 'New Conversation' ? 'data-i18n="cb.new_chat"' : ''}>${session.title}</span>
                <div class="history-item-actions">
                    <button class="history-item-action edit" onclick="editChatSession('${session.id}', event)" title="Rename Chat">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="history-item-action delete" onclick="deleteChatSession('${session.id}', event)" title="Delete Chat">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // --- Message Sending Logic ---
    function addTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg-container ai-msg';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="chat-msg-avatar"><img src="../logo.png" alt="AI"></div>
            <div class="chat-msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
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
        
        if (!currentSessionId) createNewSession();

        addMessage(text, 'user');
        chatInput.value = '';
        if (chatSuggestions) chatSuggestions.style.display = 'none';

        addTypingIndicator();

        const token = localStorage.getItem('token');
        if (!token) {
            removeTypingIndicator();
            addMessage("🔐 You need to be logged in to chat with Tutora. Please <a href='../2.login/code.html' style='color:#ecb613;'>sign in</a>.", 'ai', false);
            return;
        }

        try {
            const response = await fetch(`https://gem-backend-production-40ae.up.railway.app/api/ai/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ question: text })
            });
        setTimeout(triggerTranslation, 50);

            removeTypingIndicator();
            const data = await response.json();

            if (response.ok) {
                const aiText = data.answer || data.response || data.message || "I have processed your request.";
                addMessage(aiText, 'ai');
            } else if (response.status === 401 || response.status === 403) {
                addMessage("🔐 Your session has expired. Please <a href='../2.login/code.html' style='color:#ecb613;'>sign in again</a>.", 'ai', false);
            } else {
                addMessage(data.message || "Sorry, I encountered an error. Please try again.", 'ai');
            }
        } catch (error) {
            removeTypingIndicator();
            console.error('Chat API Error:', error);
            addMessage("⚠️ Could not connect to the AI server. Please check your network.", 'ai');
        }
    }

    // --- Initialization & Event Listeners ---
    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(chatInput.value));
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(chatInput.value); });
    
    if (newChatBtn) newChatBtn.addEventListener('click', createNewSession);
    
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            if (currentSessionId && confirm('Are you sure you want to clear this conversation?')) {
                const session = chatSessions.find(s => s.id === currentSessionId);
                if (session) {
                    session.messages = [];
                    session.title = 'New Conversation';
                    saveSessions();
                    loadSession(currentSessionId);
                }
            }
        });
    }

    document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-q')));
    });

    // Topic cards link to chat
    document.querySelectorAll('.chat-topic-card').forEach(card => {
        card.addEventListener('click', () => {
            const topic = card.querySelector('h3').textContent;
            document.getElementById('chat-section').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => sendMessage(`Tell me about ${topic}`), 600);
        });
    });

    // Boot up
    if (chatSessions.length > 0) {
        // Load most recent session
        loadSession(chatSessions[0].id);
    } else {
        createNewSession();
    }

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
    // ATMOSPHERE EFFECTS
    // ============================================
    const createAtmosphere = () => {
        let dustContainer = document.getElementById('dust-container');
        if (!dustContainer) {
            dustContainer = document.createElement('div');
            dustContainer.id = 'dust-container';
            dustContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9998; overflow: hidden;';
            document.body.appendChild(dustContainer);
        }

        // Royal Dust
        for (let i = 0; i < 50; i++) {
            const dust = document.createElement('div');
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
                pointer-events: none;
            `;
            dustContainer.appendChild(dust);
        }
    };
    createAtmosphere();
    
    // Add global deleteChatSession mapping
    window.loadSession = loadSession;

    console.log('✓ Premium Chat History Integration Active');
});
