import React, { useState, useEffect, useRef } from 'react';
import '../styles/AIGuide.css';

const AIGuidePage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [messages, setMessages] = useState([
        { sender: 'User', text: 'Where is the Rossetta Stone located?' },
        { sender: 'Tortara', text: "It's currently in the British Museum, but I can show you a high-fidelity holographic projection of it right here in the Digital Gallery." }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [aiStatusText, setAiStatusText] = useState('"I am Tortara. How shall we explore the secrets of the Nile today?"');
    const [token, setToken] = useState(null);
    const recognitionRef = useRef(null);
    const transcriptionContentRef = useRef(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = localStorage.getItem('language') === 'ar' ? 'ar-EG' : 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                addMessage('User', transcript);
                processAIQuery(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech Recognition Error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognitionRef.current = recognition;
        }
        
        return () => {
             if (recognitionRef.current && isListening) {
                 recognitionRef.current.stop();
             }
             if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        if (transcriptionContentRef.current) {
            transcriptionContentRef.current.scrollTop = transcriptionContentRef.current.scrollHeight;
        }
    }, [messages]);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const processAIQuery = async (query) => {
        if (!query.trim()) return;
        setAiStatusText('"Analyzing neural patterns..."');
        
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
    };

    const handleTortaraResponse = (text) => {
        setAiStatusText(`"${text}"`);
        addMessage('Tortara', text);
        speakText(text);
    };

    const speakText = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = localStorage.getItem('language') || 'en';
        utterance.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleTalkClick = () => {
        if (!token) {
            alert('🔐 Please login to sync with Tortara\'s neural link.');
            window.location.href = '/login';
            return;
        }

        if (!recognitionRef.current) {
            alert('⚠️ Speech recognition is not supported in this browser.');
            const query = prompt('Enter your question for Tortara:');
            if (query) {
                addMessage('User', query);
                processAIQuery(query);
            }
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch(e) {
                console.error("Audio capture failed to start/stop.", e);
                setIsListening(false);
            }
        }
    };

    const handleQuickAction = (text) => {
        addMessage('User', text);
        processAIQuery(text);
    };

    return (
        <main className="main-container">
            <section className="hero-section">
                <section className="tortara-dialogue-section">
                    <div className="welcome-text">
                        <h1 className="welcome-title">{aiStatusText}</h1>
                        <p className="welcome-subtitle">
                            Your digital guide to the wonders of the Grand Egyptian Museum.
                        </p>
                    </div>
                </section>
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-glow"></div>
                </div>

                <div className="hero-content">
                    <div className="hologram-container">
                        <div className={`hologram-aura ${isListening ? 'listening-pulse' : ''}`}></div>
                        <div className="hologram-image" style={{ backgroundImage: "url('/unnamed (6).png')" }}>
                            <div className="hud-element hud-left">
                                <p className="hud-label">Neural Link</p>
                                <p className="hud-value">Active 100%</p>
                            </div>
                            <div className="hud-element hud-right">
                                <p className="hud-label">Core Status</p>
                                <p className="hud-value">Optimal</p>
                            </div>
                        </div>
                        <div className="ground-light-ring"></div>
                    </div>

                    <div className="action-buttons">
                        <button className="talk-button" onClick={handleTalkClick}>
                            {isListening ? (
                                <>
                                    <span className="material-icons-outlined">stop</span>
                                    <span>Listening...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-outlined">mic</span>
                                    <span>Talk to me</span>
                                </>
                            )}
                        </button>
                        <div className="quick-actions">
                            <button className="quick-action-btn" onClick={() => handleQuickAction('Tell me about Tutankhamun')}>
                                Tell me about Tutankhamun
                            </button>
                            <button className="quick-action-btn" onClick={() => handleQuickAction('Show me 3D artifacts')}>Show me 3D artifacts</button>
                            <button className="quick-action-btn" onClick={() => handleQuickAction('Navigation help')}>Navigation help</button>
                        </div>
                    </div>
                </div>

                <aside className="sidebar-transcription">
                    <div className="transcription-panel">
                        <div className="transcription-header">
                            <span className="material-icons-outlined">history</span>
                            <span>Recent Context</span>
                        </div>
                        <div className="transcription-content" ref={transcriptionContentRef}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender.toLowerCase()}-message`}>
                                    <p className="message-sender">{msg.sender}</p>
                                    <p className="message-text">"{msg.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>

            <section className="guide-how">
                <h2 className="ai-section-title">How It <span style={{ color: '#ecb613', fontStyle: 'italic' }}>Works</span></h2>
                <div className="guide-steps">
                    <div className="guide-step"><div className="guide-step-num">01</div><span className="material-symbols-outlined">mic</span><h3>Speak or Type</h3><p>Ask Tortara anything — from "Where is Tutankhamun's mask?" to "Tell me about the Book of the Dead" — in Arabic or English.</p></div>
                    <div className="guide-step"><div className="guide-step-num">02</div><span className="material-symbols-outlined">neurology</span><h3>AI Understands Context</h3><p>Our neural model processes your question using 15,000+ curated Egyptological data points and real-time museum mapping.</p></div>
                    <div className="guide-step"><div className="guide-step-num">03</div><span className="material-symbols-outlined">route</span><h3>Guided Response</h3><p>Receive a spoken response with navigation overlay, historical context, and links to related 3D artifacts in our digital collection.</p></div>
                </div>
            </section>

            <section className="guide-capabilities">
                <h2 className="ai-section-title">Tortara's <span style={{ color: '#ecb613', fontStyle: 'italic' }}>Capabilities</span></h2>
                <div className="guide-cap-grid">
                    <div className="guide-cap-card"><span className="material-symbols-outlined">translate</span><h3>Multilingual</h3><p>Fluent in Arabic, English, French, Spanish, German, Japanese, and Mandarin with real-time translation.</p></div>
                    <div className="guide-cap-card"><span className="material-symbols-outlined">map</span><h3>Navigation</h3><p>Turn-by-turn indoor directions to any gallery, artifact, restroom, or dining venue within the museum.</p></div>
                    <div className="guide-cap-card"><span className="material-symbols-outlined">history_edu</span><h3>Deep History</h3><p>Every response draws from peer-reviewed Egyptological research, updated quarterly by our curatorial team.</p></div>
                    <div className="guide-cap-card"><span className="material-symbols-outlined">view_in_ar</span><h3>AR Overlays</h3><p>Point your camera at any artifact and Tortara overlays hieroglyphic translations, dates, and dynasty context.</p></div>
                    <div className="guide-cap-card"><span className="material-symbols-outlined">family_restroom</span><h3>Kids Mode</h3><p>A special interactive mode with simplified language, fun quizzes, and animated pharaoh characters for young explorers.</p></div>
                    <div className="guide-cap-card"><span className="material-symbols-outlined">accessibility_new</span><h3>Accessible</h3><p>Full screen-reader support, sign language video responses, and adjustable speech speed for all visitors.</p></div>
                </div>
            </section>

            <section className="guide-stats">
                <div className="guide-stats-grid">
                    <div className="guide-stat-item"><span className="guide-stat-number">50K+</span><span className="guide-stat-label">Guided Tours Completed</span></div>
                    <div className="guide-stat-item"><span className="guide-stat-number">98%</span><span className="guide-stat-label">Visitor Satisfaction</span></div>
                    <div className="guide-stat-item"><span className="guide-stat-number">15K+</span><span className="guide-stat-label">Data Points in Knowledge Base</span></div>
                    <div className="guide-stat-item"><span className="guide-stat-number">8</span><span className="guide-stat-label">Languages Supported</span></div>
                </div>
            </section>
        </main>
    );
};

export default AIGuidePage;
