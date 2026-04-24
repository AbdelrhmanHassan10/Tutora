import React, { useState, useEffect, useRef } from 'react';
import '../styles/AIChatbot.css';

const AIChatbotPage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);

    const getTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        // Initial welcome message if no history
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            let initialMsg = {
                id: 'welcome-0',
                sender: 'ai',
                text: "Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.",
                time: getTime()
            };

            if (!token) {
                setMessages([initialMsg]);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/ai/chats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const history = Array.isArray(data) ? data : data.chats || data.data || [];
                    
                    if (history.length > 0) {
                        setShowSuggestions(false);
                        const formattedHistory = [];
                        history.forEach((chat, i) => {
                            if (chat.question || chat.prompt || chat.userMessage) {
                                formattedHistory.push({ id: `hist-u-${i}`, sender: 'user', text: chat.question || chat.prompt || chat.userMessage, time: getTime() });
                            }
                            if (chat.answer || chat.response || chat.aiMessage) {
                                formattedHistory.push({ id: `hist-ai-${i}`, sender: 'ai', text: chat.answer || chat.response || chat.aiMessage, time: getTime() });
                            }
                        });
                        if(formattedHistory.length === 0) formattedHistory.push(initialMsg);
                        setMessages(formattedHistory);
                    } else {
                        setMessages([initialMsg]);
                    }
                } else {
                     setMessages([initialMsg]);
                }
            } catch (e) {
                console.error("Failed to load AI history", e);
                setMessages([initialMsg]);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        // Setup Intersection Observer for Scroll Animations and Countups
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.hasAttribute('data-count') && !entry.target.dataset.counted) {
                        entry.target.dataset.counted = 'true';
                        const target = parseFloat(entry.target.getAttribute('data-count'));
                        const duration = 2000;
                        const start = performance.now();
        
                        const updateCount = (now) => {
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
                        };
                        requestAnimationFrame(updateCount);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.anim-on-scroll, [data-count]').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = async (text) => {
        const query = text || inputValue;
        if (!query.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: query, time: getTime() }]);
        setInputValue('');
        setShowSuggestions(false);
        setIsTyping(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, sender: 'ai', 
                text: "🔐 You need to be logged in to chat with Tortara. Please sign in to continue.", 
                time: getTime() 
            }]);
            return;
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

            setIsTyping(false);

            if (response.ok) {
                const data = await response.json();
                const aiText = data.answer || data.response || data.message || data.data || "I found some interesting information, but there was an issue displaying it.";
                setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: aiText, time: getTime() }]);
            } else if (response.status === 401 || response.status === 403) {
                setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: "🔐 Your session has expired. Please sign in again.", time: getTime() }]);
                localStorage.removeItem('token');
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: "The AI service is currently experiencing high load. Please try again later.", time: getTime() }]);
            }
        } catch (error) {
            console.error('Chat API Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: "⚠️ Could not connect to the AI server. Please check your internet connection.", time: getTime() }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([{
            id: Date.now(),
            sender: 'ai',
            text: "Welcome to the Grand Egyptian Museum! 🏛️ I'm Tutora, your AI guide. Ask me about pharaohs, artifacts, dynasties, or plan your visit.",
            time: getTime()
        }]);
        setShowSuggestions(true);
    };

    const scrollToChat = (topic) => {
        const chatSection = document.getElementById('chat-section');
        if (chatSection) {
            chatSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                handleSendMessage(`Tell me about ${topic}`);
            }, 600);
        }
    };

    return (
        <main className="main-container">
            {/* Hero Banner */}
            <section className="chat-hero anim-on-scroll">
                <div className="chat-hero-bg"></div>
                <div className="chat-hero-content">
                    <div className="chat-hero-badge">
                        <span className="material-symbols-outlined">smart_toy</span>
                        <span>AI-Powered Museum Guide</span>
                    </div>
                    <h1 className="chat-hero-title">Chat with <span className="gold-text">TUTORA</span></h1>
                    <p className="chat-hero-subtitle">Ask anything about ancient Egypt, explore the Grand Egyptian Museum, and uncover 7,000 years of history — all through a conversation.</p>
                    <a href="#chat-section" className="chat-hero-cta">
                        <span className="material-symbols-outlined">forum</span>
                        Start Chatting
                    </a>
                </div>
            </section>

            {/* FULL CHAT SECTION */}
            <section className="chat-fullscreen-section anim-on-scroll" id="chat-section">
                <div className="chat-fullscreen-container">
                    <div className="chat-fs-header">
                        <div className="chat-fs-status">
                            <div className="chat-fs-avatar">
                                <img src="/logo.png" alt="Tutora AI" />
                                <span className="chat-fs-online"></span>
                            </div>
                            <div>
                                <h3>TUTORA AI</h3>
                                <p><span className="dot-online"></span> Online — Ready to explore</p>
                            </div>
                        </div>
                        <div className="chat-fs-actions">
                            <button className="chat-fs-action-btn" title="Clear Chat" onClick={handleClearChat}>
                                <span className="material-symbols-outlined">delete_sweep</span>
                            </button>
                        </div>
                    </div>

                    <div className="chat-fs-messages custom-scrollbar" id="chatMessages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-msg-container ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                                <div className="chat-msg-avatar">
                                    <img src={msg.sender === 'user' ? '/unnamed.png' : '/logo.png'} alt={msg.sender} />
                                </div>
                                <div className="chat-msg-bubble">
                                    <p>{msg.text}</p>
                                    <span className="chat-msg-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-msg-container ai-msg" id="typingIndicator">
                                <div className="chat-msg-avatar"><img src="/logo.png" alt="AI" /></div>
                                <div className="chat-msg-bubble">
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {showSuggestions && (
                        <div className="chat-fs-suggestions" id="chatSuggestions">
                            <button className="chat-suggestion-btn" onClick={() => handleSendMessage('Tell me about the Mask of Tutankhamun')}>
                                <span className="material-symbols-outlined">cruelty_free</span> Mask of Tutankhamun
                            </button>
                            <button className="chat-suggestion-btn" onClick={() => handleSendMessage('How were the Pyramids built?')}>
                                <span className="material-symbols-outlined">architecture</span> Pyramid Construction
                            </button>
                            <button className="chat-suggestion-btn" onClick={() => handleSendMessage('What is the Rosetta Stone?')}>
                                <span className="material-symbols-outlined">auto_stories</span> Rosetta Stone
                            </button>
                            <button className="chat-suggestion-btn" onClick={() => handleSendMessage('Plan my visit to the GEM')}>
                                <span className="material-symbols-outlined">map</span> Plan My Visit
                            </button>
                        </div>
                    )}

                    <div className="chat-fs-input-area">
                        <div className="chat-fs-input-wrapper">
                            <input 
                                type="text" 
                                className="chat-fs-input" 
                                placeholder="Ask Tutora anything about ancient Egypt..." 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="chat-fs-send" onClick={() => handleSendMessage()}>
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                        <p className="chat-fs-disclaimer">Tutora AI may produce inaccurate information. Verify important facts.</p>
                    </div>
                </div>
            </section>

            {/* AI Personality */}
            <section className="chat-personality anim-on-scroll">
                <h2 className="ai-section-title">Meet <span className="gold-text">TUTORA</span></h2>
                <div className="chat-personality-grid">
                    <div className="personality-card">
                        <div className="personality-icon">
                            <span className="material-symbols-outlined">history_edu</span>
                        </div>
                        <h3>The Historian</h3>
                        <p>Expert on every dynasty, pharaoh, and artifact — from the Old Kingdom to the Ptolemaic era. Ask complex historical questions confidently.</p>
                    </div>
                    <div className="personality-card">
                        <div className="personality-icon">
                            <span className="material-symbols-outlined">explore</span>
                        </div>
                        <h3>The Navigator</h3>
                        <p>Knows every gallery, exhibit, and hidden corner of the Grand Egyptian Museum. Get turn-by-turn guidance to any artifact.</p>
                    </div>
                    <div className="personality-card">
                        <div className="personality-icon">
                            <span className="material-symbols-outlined">quiz</span>
                        </div>
                        <h3>The Quiz Master</h3>
                        <p>Challenge yourself with AI-generated quizzes on Egyptian mythology, archaeology, and the museum's 100,000+ artifacts.</p>
                    </div>
                    <div className="personality-card">
                        <div className="personality-icon">
                            <span className="material-symbols-outlined">family_restroom</span>
                        </div>
                        <h3>The Kids Guide</h3>
                        <p>Simplified, fun explanations with emoji, animations, and games designed for young explorers aged 6–14.</p>
                    </div>
                </div>
            </section>

            {/* AI Capabilities */}
            <section className="chat-capabilities anim-on-scroll">
                <h2 className="ai-section-title">What I Can <span className="gold-text">Do</span></h2>
                <div className="chat-cap-grid">
                    <div className="chat-cap-card"><span className="material-symbols-outlined">history_edu</span><h3>Historical Deep Dives</h3><p>Ask about any dynasty, pharaoh, or artifact — from the Old Kingdom to the Ptolemaic period — and receive rich, sourced answers.</p></div>
                    <div className="chat-cap-card"><span className="material-symbols-outlined">photo_camera</span><h3>Image Recognition</h3><p>Upload any photo of an artifact, hieroglyph, or site, and I'll identify it and share its historical context instantly.</p></div>
                    <div className="chat-cap-card"><span className="material-symbols-outlined">quiz</span><h3>Interactive Quizzes</h3><p>Test your knowledge with AI-generated quizzes about Egyptian mythology, archaeology, and the GEM collection.</p></div>
                    <div className="chat-cap-card"><span className="material-symbols-outlined">school</span><h3>Educational Summaries</h3><p>Get age-appropriate explanations for students, researchers, or casual visitors with adjustable complexity levels.</p></div>
                    <div className="chat-cap-card"><span className="material-symbols-outlined">emoji_objects</span><h3>Trip Planning</h3><p>Let me help you plan your visit — from must-see galleries to dining recommendations based on your interests.</p></div>
                    <div className="chat-cap-card"><span className="material-symbols-outlined">translate</span><h3>Multilingual</h3><p>Chat in Arabic, English, French, Spanish, German, or Japanese — I adapt to your preferred language in real time.</p></div>
                </div>
            </section>

            {/* Popular Topics */}
            <section className="chat-topics anim-on-scroll">
                <h2 className="ai-section-title">Popular <span className="gold-text">Topics</span></h2>
                <div className="chat-topics-grid">
                    <div className="chat-topic-card" onClick={() => scrollToChat("Tutankhamun's Tomb")}><span className="material-symbols-outlined">cruelty_free</span><h3>Tutankhamun's Tomb</h3><p>The discovery, the curse legend, and every artifact in the GEM's dedicated gallery.</p></div>
                    <div className="chat-topic-card" onClick={() => scrollToChat("Pyramid Construction")}><span className="material-symbols-outlined">architecture</span><h3>Pyramid Construction</h3><p>Latest theories on how the Great Pyramid was built — from ramp systems to water shaft hypotheses.</p></div>
                    <div className="chat-topic-card" onClick={() => scrollToChat("Hieroglyphic Writing")}><span className="material-symbols-outlined">auto_stories</span><h3>Hieroglyphic Writing</h3><p>Learn the basics of reading hieroglyphs, from phonetic signs to determinatives and cartouches.</p></div>
                    <div className="chat-topic-card" onClick={() => scrollToChat("Daily Life in Ancient Egypt")}><span className="material-symbols-outlined">diversity_3</span><h3>Daily Life in Ancient Egypt</h3><p>Food, clothing, medicine, education, and family life along the banks of the Nile.</p></div>
                </div>
            </section>

            {/* Live Activity */}
            <section className="chat-live-activity anim-on-scroll">
                <h2 className="ai-section-title">Live <span className="gold-text">Activity</span></h2>
                <div className="live-activity-grid">
                    <div className="live-card">
                        <div className="live-card-icon pulse-icon">
                            <span className="material-symbols-outlined">forum</span>
                        </div>
                        <div className="live-card-info">
                            <span className="live-card-number" data-count="847">0</span>
                            <span className="live-card-label">Active Conversations Now</span>
                        </div>
                    </div>
                    <div className="live-card">
                        <div className="live-card-icon">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <div className="live-card-info">
                            <span className="live-card-number" data-count="12450">0</span>
                            <span className="live-card-label">Questions Answered Today</span>
                        </div>
                    </div>
                    <div className="live-card">
                        <div className="live-card-icon">
                            <span className="material-symbols-outlined">favorite</span>
                        </div>
                        <div className="live-card-info">
                            <span className="live-card-number" data-count="98">0</span>
                            <span className="live-card-label">Satisfaction Rate %</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="chat-stats anim-on-scroll">
                <div className="chat-stats-grid">
                    <div className="chat-stat-item"><span className="chat-stat-number" data-count="120000">0</span><span className="chat-stat-label">Conversations Completed</span></div>
                    <div className="chat-stat-item"><span className="chat-stat-number" data-count="4.9">0</span><span className="chat-stat-label">Average User Rating</span></div>
                    <div className="chat-stat-item"><span className="chat-stat-number" data-count="0.8">0</span><span className="chat-stat-label">Average Response Time (s)</span></div>
                    <div className="chat-stat-item"><span className="chat-stat-number" data-count="6">0</span><span className="chat-stat-label">Languages Supported</span></div>
                </div>
            </section>
        </main>
    );
};

export default AIChatbotPage;
