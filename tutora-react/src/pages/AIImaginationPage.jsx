import React, { useState, useEffect } from 'react';
import '../styles/AI-common.css';
import '../styles/AIImagination.css';

const AIImaginationPage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Initial display is a placeholder image
    const initialMainImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAqybrCLMgPD52sPlIXGhnOPCU0gJYKL9_m8jX7jSVCLzn9qfX3wNOTEMWsfDCBh039U3O6pMml-hXRSVmx7H-e5_3_gs1J0JFXHqMkRueb0s7CN5mblguT2pMLyLLxnDSEhxpM5-7EdGOdxYGdlSJTUa4TAFwAOZnj8o-wiRbdKcOLpYE6ZzA9PMonEgzQX7xZFcWg5c0ZZxAjhi04KOB6ENSJfFujXIDaaC1AK-JGDqbc2VsWuMnRdojiVbAfz9DgA9wt0HsYnHsp";
    
    const [mainImageSrc, setMainImageSrc] = useState(initialMainImage);
    const [computeTime, setComputeTime] = useState('4.2 SECONDS');
    const [manifestationId, setManifestationId] = useState('8829-X');
    const [historyItems, setHistoryItems] = useState([
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBx7VQ3D86jGq4lhjz6ZiGvOMF9P9eYx9Z5bqXR0GCM5A4wly79i9ynMOtVwDOA3z4uCwssu2OV4sxHPoBSEmtdiJP17cPV3kzxaOTG2crOAI9JwLUFcirGzcMc_h1L5JW2Hj22lbe0xa_6HxDGginFLf1lHZyClou0sSPRCdMPvoMx062A4_DNEzBD58CF4Svhkk7DxHpom_in8EFtTTtDTo-N4Vtz79_Ix8b--0rkvdz0MqdS4Oa64olCkQAslZVJeh20Y1FgpY6k",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUNoikGFFZ6UrU-GhKUroRFXmHPuLrQ8ubV63CvDrNUEHLJ2Bc0EIHjPGlp3znjlSyx0hMiBUP_8ZRhl72ZW4MNZzu_5sGKwU7RSyjlWaDmN92RQ8Dx_J958UJFU4-ZfLQhpHV9ilHyVrf4MPnY3IkUgVnwCVd7s_hJCWYTn_E1lDjLNh1YQiUAStm9SsbPuAmhXosXM3b8GlE5KEdaedvrCmLEQqHbnvbjhOcbZAxb__Ii5CCNi6t9RL3_zLRpMjUauvTp40jfcA"
    ]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.input-card, .history-item, .display-module, .info-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            revealObserver.observe(el);
        });

        return () => revealObserver.disconnect();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Please enter an invocation to visualize.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('🔐 Authentication required. Please login to manifest your imagination.');
            window.location.href = '/login';
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch(`${API_URL}/ai/story-to-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ story: prompt.trim() })
            });

            const data = await response.json();
            
            if (response.ok && (data.imageUrl || data.image)) {
                const newImgUrl = data.imageUrl || data.image;
                // Add to history if unique
                if (!historyItems.includes(newImgUrl) && mainImageSrc !== initialMainImage) {
                    setHistoryItems(prev => [mainImageSrc, ...prev].slice(0, 5)); // Keep last 5
                }
                setMainImageSrc(newImgUrl);
            } else if (response.status === 401 || response.status === 403) {
                alert('🔐 Session expired. Please sign in again.');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                alert(data.message || 'Manifestation failed to conjure image. The AI realm is currently unstable.');
            }
        } catch (error) {
            console.error('AI Manifestation Error:', error);
            alert('⚠️ Network connection to the AI realm failed.');
        } finally {
            setIsGenerating(false);
            setComputeTime((Math.random() * (5 - 2) + 2).toFixed(1) + ' SECONDS');
            setManifestationId(Math.floor(1000 + Math.random() * 9000) + '-X');
        }
    };

    const handleHistoryClick = (src) => {
        if (src) {
            setMainImageSrc(src);
        }
    };

    return (
        <div className="ai-page-container">
            <main className="ai-container">
                {/* Header Section */}
                <section className="header-section">
                    <div>
                        <span className="tagline">Manifesting the Divine</span>
                        <h1 className="ai-display-font main-title editorial-title ai-gold-text">Manifest Artifice</h1>
                        <p className="main-desc">Transpose your consciousness into the eternal digital loom. Each pixel is an inscription; each prompt is a ritual of creation.</p>
                    </div>
                <div className="status-indicator">
                    <span className="status-label">System Status</span>
                    <div className="status-badge">
                        <div className="status-dot"></div>
                        <span>ETERNAL CORE ACTIVE</span>
                    </div>
                </div>
            </section>

            {/* Workspace Grid */}
            <div className="workspace-grid">
                {/* Control Module */}
                <section className="control-module">
                    <div className="input-card">
                        <div className="input-group">
                            <label className="input-label">The Invocation</label>
                            <textarea 
                                className="prompt-area" 
                                placeholder="An ivory Pharaoh enthroned in a void of liquid gold, cinematic lighting, ultra-detailed textures, ethereal atmosphere..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isGenerating}
                            ></textarea>
                        </div>
                        
                        <div className="settings-row">
                            <div className="input-group">
                                <label className="input-label">Dimension</label>
                                <div className="select-box">
                                    16:9 CINEMATIC
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>expand_more</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Style Archetype</label>
                                <div className="select-box">
                                    NEO-EGYPTIAN
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>expand_more</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="btn-visualize" 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{ pointerEvents: isGenerating ? 'none' : 'auto' }}
                        >
                            {isGenerating ? (
                                <><span className="material-symbols-outlined animate-spin">sync</span> Manifesting...</>
                            ) : (
                                <><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> Visualize</>
                            )}
                        </button>
                    </div>

                    {/* History Artifacts */}
                    <div className="history-grid">
                        {historyItems.map((src, index) => (
                            <div 
                                key={index} 
                                className="history-item" 
                                onClick={() => handleHistoryClick(src)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className="history-img" src={src} alt={`History ${index + 1}`} />
                                <div className="history-overlay">
                                    <span className="history-time">Recalled {index + 2}h ago</span>
                                </div>
                            </div>
                        ))}
                        <div className="history-item history-placeholder">
                            <span className="material-symbols-outlined">history</span>
                        </div>
                    </div>
                </section>

                {/* Display Module */}
                <section className="display-module">
                    <div className="display-frame">
                        <div className="display-id">
                            <span className="id-text manifestation-id-val">Manifestation ID: {manifestationId}</span>
                            <div className="id-line"></div>
                        </div>
                        
                        <img 
                            className="main-display-img" 
                            src={mainImageSrc} 
                            alt="Main Display"
                            style={{ 
                                filter: isGenerating ? 'blur(20px) brightness(0.5)' : 'none',
                                transform: isGenerating ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.4s ease'
                            }} 
                        />

                        <div className="display-controls">
                            <button className="glass-btn" aria-label="Download" onClick={() => window.open(mainImageSrc, '_blank')}>
                                <span className="material-symbols-outlined">download</span>
                            </button>
                            <button className="glass-btn" aria-label="Share">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                            <button className="glass-btn active" aria-label="Favorite">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                            </button>
                        </div>
                    </div>

                    <div className="metadata-ribbon">
                        <div className="meta-info">
                            <div className="meta-item">
                                <span className="meta-label">Compute Time</span>
                                <span className="meta-value compute-time-val">{computeTime}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Resolution</span>
                                <span className="meta-value">4096 X 2304</span>
                            </div>
                        </div>
                        <div className="auth-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>security</span>
                            <span>AUTHENTICATED ORIGIN</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Secondary Information Section */}
            <section className="info-section">
                <div className="info-card">
                    <h3 className="info-title editorial-title">The Curator's Algorithm</h3>
                    <p className="info-text">Our latent space models are trained exclusively on historical artifacts, sacred geometries, and neoclassical aesthetics to ensure every output maintains a museum-grade quality.</p>
                </div>
                <div className="info-card">
                    <h3 className="info-title editorial-title">Ownership Rights</h3>
                    <p className="info-text">Once manifested, the artifact belongs to your digital collection. We provide a cryptographically signed certificate of origin with every high-fidelity render.</p>
                </div>
                <div className="info-card">
                    <h3 className="info-title editorial-title">Advanced Tuning</h3>
                    <div className="tuning-stats">
                        <div className="stat-row">
                            <div className="stat-header">
                                <span>Creative Guidance</span>
                                <span>75%</span>
                            </div>
                            <div className="stat-bar-bg">
                                <div className="stat-bar-fill" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div className="stat-row">
                            <div className="stat-header">
                                <span>Spectral Density</span>
                                <span>42%</span>
                            </div>
                            <div className="stat-bar-bg">
                                <div className="stat-bar-fill" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    );
};

export default AIImaginationPage;