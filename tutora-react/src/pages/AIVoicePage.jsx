import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/AIVoice.css';

const AIVoicePage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [searchParams] = useSearchParams();
    const artifactId = searchParams.get('id') || "4"; // Default Golden Mask
    
    const [audioState, setAudioState] = useState('idle'); // idle, loading, playing
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(0);
    const audioRef = useRef(null);

    // Initial Scroll Animation Setup
    useEffect(() => {
        const animElements = document.querySelectorAll('.artifact-card, .model-step, .model-feat-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        animElements.forEach(el => {
            el.classList.add('anim-on-scroll');
            // Workaround logic for explicit css style injections if css class animation fails
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            observer.disconnect();
        };
    }, []);

    const handlePlayVoice = async () => {
        const token = localStorage.getItem("token");
        const lang = localStorage.getItem("language") || "en";

        if (!token) {
            alert("🔐 Please login to experience the AI storyteller.");
            window.location.href = "/login";
            return;
        }

        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current = null;
            setAudioState('idle');
            return;
        }

        setAudioState('loading');

        try {
            const response = await fetch(`${API_URL}/ai/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ statueId: parseInt(artifactId), language: lang })
            });

            const data = await response.json();

            if (response.ok && (data.audioUrl || data.url)) {
                audioRef.current = new Audio(data.audioUrl || data.url);
                audioRef.current.play();
                setAudioState('playing');
                
                audioRef.current.onended = () => {
                    setAudioState('idle');
                    audioRef.current = null;
                };
            } else {
                alert(data.message || "Tortara is gathering more history. Please try again soon.");
                setAudioState('idle');
            }
        } catch (error) {
            console.error("TTS Error:", error);
            alert("⚠️ Connection to the neural storyteller failed.");
            setAudioState('idle');
        }
    };

    const handleAddFavorite = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch(`${API_URL}/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ artifactId: parseInt(artifactId) }),
            });

            if (res.ok) {
                setIsFavorite(true);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to add to favorites");
            }
        } catch (error) {
            console.error(error);
            alert("Connection failed");
        }
    };

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? -1 : index);
    };

    return (
        <main className="main-container">
            <nav className="breadcrumb">
                <a href="/">Home</a>
                <span className="material-icons-outlined">chevron_right</span>
                <a href="/exhibition-halls">Exhibits</a>
                <span className="material-icons-outlined" style={{ fontSize: '10px' }}>chevron_right</span>
                <a href="#">Tutankhamun's Treasures</a>
                <span className="material-icons-outlined" style={{ fontSize: '10px' }}>chevron_right</span>
                <span className="breadcrumb-active">Golden Mask</span>
            </nav>

            <h1 className="font-display page-title">Interactive Artifact Explorer</h1>

            <div className="explorer-grid">
                <div className="viewer-section">
                    <div className="viewer-controls">
                        <button className="control-btn active">3D Model Viewer</button>
                        <button className="control-btn" onClick={() => window.location.href='/artifact-identifier'}>AI Artifact Scanner</button>
                    </div>

                    <div className="viewer-display">
                        <img alt="Golden Mask of Tutankhamun" className="viewer-img" src="/4.jpg" />
                        <div className="viewer-overlay">
                            <div className="badge">8K Dynamic Render</div>
                            <div className="play-btn-container">
                                <button className={`play-btn ${audioState === 'playing' ? 'playing' : audioState === 'loading' ? 'loading' : ''}`} onClick={handlePlayVoice}>
                                    <span className="material-icons-outlined" style={{ fontSize: '36px' }}>
                                        {audioState === 'playing' ? 'stop' : (audioState === 'loading' ? 'sync' : 'play_arrow')}
                                    </span>
                                </button>
                            </div>
                            <div className="viewer-tools">
                                <span className="tool-item"><span className="material-icons-outlined" style={{ fontSize: '14px' }}>sync</span> Rotate</span>
                                <div className="zoom-slider">
                                    <div className="zoom-handle"></div>
                                </div>
                                <span className="tool-item"><span className="material-icons-outlined" style={{ fontSize: '14px' }}>info</span> Annotate</span>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="info-sidebar">
                    <h2 className="font-display artifact-name">The Mask of Tutankhamun</h2>
                    <p className="artifact-desc">Discovered in 1925 by Howard Carter, this golden mask is the death mask of the 18th-dynasty Ancient Egyptian Pharaoh Tutankhamun.</p>

                    <div className="accordion">
                        <div className={`accordion-item ${activeAccordion === 0 ? 'active' : ''}`}>
                            <button className="accordion-trigger" onClick={() => toggleAccordion(0)}>
                                <span>Historical Context</span>
                                <span className="material-icons-outlined expand-icon">expand_more</span>
                            </button>
                            <div className="accordion-content">
                                <p>The mask is one of the best-known works of art in the world. It was crafted during the New Kingdom period, a time of great wealth and power for Egypt.</p>
                            </div>
                        </div>
                        <div className={`accordion-item ${activeAccordion === 1 ? 'active' : ''}`}>
                            <button className="accordion-trigger" onClick={() => toggleAccordion(1)}>
                                <span>Materials & Techniques</span>
                                <span className="material-icons-outlined expand-icon">expand_more</span>
                            </button>
                            <div className="accordion-content">
                                <p>Crafted from two layers of high-karat gold, inlaid with semi-precious stones including lapis lazuli, quartz, and obsidian.</p>
                            </div>
                        </div>
                        <div className={`accordion-item ${activeAccordion === 2 ? 'active' : ''}`}>
                            <button className="accordion-trigger" onClick={() => toggleAccordion(2)}>
                                <span>Symbolism</span>
                                <span className="material-icons-outlined expand-icon">expand_more</span>
                            </button>
                            <div className="accordion-content">
                                <p>The mask represents the pharaoh as Osiris, the god of the afterlife, ensuring his eternal protection and rebirth.</p>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-actions">
                        <button className="btn-collection" onClick={handleAddFavorite} disabled={isFavorite} style={{ opacity: isFavorite ? 0.7 : 1 }}>
                            {isFavorite ? (
                                <><span className="material-icons-outlined">check</span> Added to Collection</>
                            ) : (
                                <><span className="material-icons-outlined">bookmark_add</span> Add to Collection</>
                            )}
                        </button>
                        <button className="btn-share">
                            <span className="material-icons-outlined">share</span>
                        </button>
                    </div>
                </aside>
            </div>

            <section className="related-section">
                <div className="related-header">
                    <h3 className="font-display related-title">Explore Other Artifacts</h3>
                    <a className="view-all" href="/exhibition-halls">View All Collection <span className="material-icons-outlined" style={{ fontSize: '14px' }}>arrow_forward</span></a>
                </div>
                <div className="collection-grid">
                    <div className="artifact-card">
                        <img alt="Rosetta Stone" className="card-img" src="/unnamed 6.png" />
                        <div className="card-overlay">
                            <h4 className="card-name">Rosetta Stone</h4>
                        </div>
                    </div>
                    <div className="artifact-card">
                        <img alt="Statue of Khafre" className="card-img" src="/unnamed (2).png" />
                        <div className="card-overlay">
                            <h4 className="card-name">Statue of Khafre</h4>
                        </div>
                    </div>
                    <div className="artifact-card">
                        <img alt="Canopic Jars" className="card-img" src="/unnamed (3).png" />
                        <div className="card-overlay">
                            <h4 className="card-name">Canopic Jars</h4>
                        </div>
                    </div>
                    <div className="artifact-card">
                        <img alt="Narmer Palette" className="card-img" src="/unnamed (4).png" />
                        <div className="card-overlay">
                            <h4 className="card-name">Narmer Palette</h4>
                        </div>
                    </div>
                    <div className="artifact-card">
                        <img alt="Bust of Nefertiti" className="card-img" src="/unnamed (5).png" />
                        <div className="card-overlay">
                            <h4 className="card-name">Bust of Nefertiti</h4>
                        </div>
                    </div>
                </div>
            </section>

            <section className="model-how">
                <h2 className="ai-section-title">How 3D Storytelling <span className="gold-text-span">Works</span></h2>
                <div className="model-steps">
                    <div className="model-step">
                        <div className="model-step-num">01</div><span className="material-symbols-outlined">view_in_ar</span>
                        <h3>Select an Artifact</h3>
                        <p>Choose from our library of photogrammetry-scanned 3D models — each at sub-millimeter precision.</p>
                    </div>
                    <div className="model-step">
                        <div className="model-step-num">02</div><span className="material-symbols-outlined">record_voice_over</span>
                        <h3>AI Narrates</h3>
                        <p>Our storytelling AI crafts a dramatic narration weaving myth, archaeology, and historical context.</p>
                    </div>
                    <div className="model-step">
                        <div className="model-step-num">03</div><span className="material-symbols-outlined">explore</span>
                        <h3>Interact & Explore</h3>
                        <p>Rotate, zoom, and inspect details while the AI responds to your questions about specific features.</p>
                    </div>
                </div>
            </section>

            <section className="model-features">
                <h2 className="ai-section-title">Immersive <span className="gold-text-span">Features</span></h2>
                <div className="model-feat-grid">
                    <div className="model-feat-card"><span className="material-symbols-outlined">3d_rotation</span>
                        <h3>360° Inspection</h3>
                        <p>Examine artifacts from every angle — including views impossible in the physical gallery.</p>
                    </div>
                    <div className="model-feat-card"><span className="material-symbols-outlined">grain</span>
                        <h3>Material Analysis</h3>
                        <p>Tap any surface for composition data — gold leaf, faience, limestone — with conservation status.</p>
                    </div>
                    <div className="model-feat-card"><span className="material-symbols-outlined">compare</span>
                        <h3>Historical Reconstruction</h3>
                        <p>Toggle between current state and AI-reconstructed original appearance from 3,000 years ago.</p>
                    </div>
                    <div className="model-feat-card"><span className="material-symbols-outlined">spatial_audio_off</span>
                        <h3>Spatial Audio</h3>
                        <p>Immersive 3D soundscapes — temple chants, Nile waters, and ancient workshop sounds.</p>
                    </div>
                </div>
            </section>

            <section className="model-stats">
                <div className="model-stats-grid">
                    <div className="model-stat-item"><span className="model-stat-number">250+</span><span className="model-stat-label">3D Models Available</span></div>
                    <div className="model-stat-item"><span className="model-stat-number">0.1mm</span><span className="model-stat-label">Scan Precision</span></div>
                    <div className="model-stat-item"><span className="model-stat-number">40K+</span><span class="model-stat-label">Stories Told</span></div>
                    <div className="model-stat-item"><span className="model-stat-number">12</span><span className="model-stat-label">Narrator Voices</span></div>
                </div>
            </section>
        </main>
    );
};

export default AIVoicePage;
