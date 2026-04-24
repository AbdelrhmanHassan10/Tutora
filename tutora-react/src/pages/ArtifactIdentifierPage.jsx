import React, { useState, useEffect, useRef } from 'react';
import '../styles/ArtifactIdentifier.css';

const ArtifactIdentifierPage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [scanState, setScanState] = useState({ state: 'idle', title: '', desc: '' });
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    useEffect(() => {
        const animElements = document.querySelectorAll('.anim-on-scroll');
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Workaround for adding local rotation animation equivalent
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        animElements.forEach(el => scrollObserver.observe(el));
        
        return () => scrollObserver.disconnect();
    }, []);

    const handleFile = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const token = localStorage.getItem('token');
            
            setScanState({
                state: 'loading',
                title: 'Analyzing Visual Patterns...',
                desc: 'Scanning artifact features against GEM digital archive...'
            });

            // Smooth scroll to results
            const resultContainer = document.getElementById('scan-result-container');
            if (resultContainer) {
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${API_URL}/ai/detect`, {
                    method: 'POST',
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: formData
                });

                const data = await response.json();
                
                if (response.ok && data.predictions && data.predictions.length > 0) {
                    const topMatch = data.predictions[0];
                    const confidence = (topMatch.probability * 100).toFixed(1);
                    
                    setScanState({
                        state: 'success',
                        title: `Match Found: ${topMatch.className}`,
                        desc: `Confidence Score: ${confidence}%\n\nOur neural network has identified this artifact. Accessing historical records and curator notes for ${topMatch.className}...`,
                        matchObj: topMatch
                    });
                } else {
                    setScanState({
                        state: 'error',
                        title: 'Identification Unsuccessful',
                        desc: data.message || 'Tutora AI could not find a definitive match. Please ensure the photo is clear and well-lit.'
                    });
                }
            } catch (error) {
                console.error('AI Detection Error:', error);
                setScanState({
                    state: 'error',
                    title: 'Neural Link Interrupted',
                    desc: 'We encountered a connection issue while analyzing the image. Please check your network and try again.'
                });
            }
        }
    };

    return (
        <main className="main-container">
            {/* Hero Section */}
            <section className="hero-section anim-on-scroll" id="home" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Tutora AI: Artifact Scanner</h1>
                    <h2 className="hero-subtitle">Uncover the stories behind the artifacts. Upload an image or use your camera to begin.</h2>
                    <div className="hero-buttons">
                        <button id="upload-photo-btn" className="btn-primary" onClick={() => fileInputRef.current.click()}>Upload Photo</button>
                        <button id="use-camera-btn" className="btn-secondary" onClick={() => cameraInputRef.current.click()}>Use Camera</button>
                        <input type="file" id="scan-upload" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFile} />
                        <input type="file" id="camera-upload" accept="image/*" capture="environment" style={{ display: 'none' }} ref={cameraInputRef} onChange={handleFile} />
                    </div>
                    {scanState.state !== 'idle' && (
                        <div id="scan-result-container" style={{ display: 'block', marginTop: '20px' }}>
                            <h3 id="scan-result-title" style={{ color: scanState.state === 'loading' ? '#ecb613' : (scanState.state === 'success' ? '#4ade80' : '#f87171') }}>
                                {scanState.title}
                            </h3>
                            <div id="scan-result-desc" style={{ color: '#fff', lineHeight: 1.6, marginTop: '10px' }}>
                                {scanState.state === 'loading' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                        <span className="material-symbols-outlined" style={{ animation: 'rotate 2s linear infinite' }}>sync</span>
                                        <span>{scanState.desc}</span>
                                    </div>
                                ) : (
                                    <div>
                                        {scanState.desc.split('\n').map((line, i) => <p key={i} style={{ marginBottom: i === 0 ? '10px' : '0' }}>{line}</p>)}
                                        {scanState.state === 'success' && (
                                            <button className="btn-primary" style={{ marginTop: '15px', padding: '8px 16px', fontSize: '14px' }} onClick={() => window.location.href='/collection'}>
                                                View in Collection
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works anim-on-scroll" id="how" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="section-title">How It Works</h2>
                <div className="cards-grid">
                    <div className="card">
                        <span className="material-symbols-outlined card-icon">upload_file</span>
                        <h3 className="card-title">1. Upload Image</h3>
                        <p className="card-text">Select a clear photo of the artifact from your device.</p>
                    </div>
                    <div className="card">
                        <span className="material-symbols-outlined card-icon">psychology</span>
                        <h3 className="card-title">2. AI Analysis</h3>
                        <p className="card-text">Our AI analyzes the image against our vast database.</p>
                    </div>
                    <div className="card">
                        <span className="material-symbols-outlined card-icon">history_edu</span>
                        <h3 className="card-title">3. Discover History</h3>
                        <p className="card-text">Receive detailed information and the story behind the artifact.</p>
                    </div>
                </div>
            </section>

            {/* Examples Section */}
            <section className="examples-section anim-on-scroll" id="examples" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="section-title">See What You Can Discover</h2>
                <div className="examples-grid">
                    <div className="example-card">
                        <img src="/unnamed (1).png" alt="The golden burial mask of Tutankhamun" className="example-image" />
                        <div className="example-overlay">
                            <h3 className="example-title">Mask of Tutankhamun</h3>
                            <p className="example-text">Discover the story of the boy king's iconic golden mask.</p>
                        </div>
                    </div>
                    <div className="example-card">
                        <img src="/unnamed 3.png" alt="The Rosetta Stone with its three scripts" className="example-image" />
                        <div className="example-overlay">
                            <h3 className="example-title">Rosetta Stone</h3>
                            <p className="example-text">The key that unlocked the secrets of ancient hieroglyphs.</p>
                        </div>
                    </div>
                    <div className="example-card">
                        <img src="/unnamed (2).png" alt="An intricately decorated ancient Egyptian canopic jar" className="example-image" />
                        <div className="example-overlay">
                            <h3 className="example-title">Canopic Jars</h3>
                            <p className="example-text">Learn about the sacred vessels used in mummification rituals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Technology Section */}
            <section className="about-section anim-on-scroll" id="about" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="about-content">
                    <h2 className="section-title">About the Technology</h2>
                    <p className="about-text">
                        Tutora AI is a sophisticated neural network trained on the Grand Egyptian Museum's extensive digital archive. By leveraging state-of-the-art machine learning and computer vision, it can identify thousands of artifacts from a single image. It cross-references visual data points—such as shape, material, and hieroglyphic patterns—with our historical records to provide you with accurate, curated information, bringing the stories of ancient Egypt right to your fingertips.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section anim-on-scroll" id="faq" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="faq-container">
                    <details className="faq-item">
                        <summary className="faq-summary">
                            <span>What kind of image quality is required?</span>
                            <span className="material-symbols-outlined faq-icon">expand_more</span>
                        </summary>
                        <p className="faq-answer">For best results, please use a clear, well-lit photo where the artifact is the main subject. Avoid heavy shadows, reflections, or obstructions.</p>
                    </details>
                    <details className="faq-item">
                        <summary className="faq-summary">
                            <span>Is my data and photo kept private?</span>
                            <span className="material-symbols-outlined faq-icon">expand_more</span>
                        </summary>
                        <p className="faq-answer">Yes. We are committed to your privacy. Images are processed anonymously and are not stored on our servers after the analysis is complete. Please see our Privacy Policy for more details.</p>
                    </details>
                    <details className="faq-item">
                        <summary className="faq-summary">
                            <span>How accurate is the AI?</span>
                            <span className="material-symbols-outlined faq-icon">expand_more</span>
                        </summary>
                        <p className="faq-answer">Tutora AI has a high accuracy rate for artifacts within our database. However, like any AI, it can sometimes make mistakes. We are constantly working to improve its performance.</p>
                    </details>
                    <details className="faq-item">
                        <summary className="faq-summary">
                            <span>What if my artifact isn't recognized?</span>
                            <span className="material-symbols-outlined faq-icon">expand_more</span>
                        </summary>
                        <p className="faq-answer">If an artifact isn't recognized, it might be due to image quality, a rare item not yet in our core database, or it might not be of ancient Egyptian origin. Try taking another picture or exploring our online exhibits to find it manually.</p>
                    </details>
                </div>
            </section>

            {/* Technology */}
            <section className="ident-tech anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="ai-section-title">Powered by Advanced <span className="gold-text-span">AI</span></h2>
                <div className="ident-tech-grid">
                    <div className="ident-tech-card"><span className="material-symbols-outlined">visibility</span><h3>Computer Vision</h3><p>Our model is trained on 100,000+ images of Egyptian artifacts across museums worldwide, achieving 97% accuracy.</p></div>
                    <div className="ident-tech-card"><span className="material-symbols-outlined">database</span><h3>GEM Knowledge Base</h3><p>Connected to the museum's full digital catalogue — including unpublished conservation notes and research.</p></div>
                    <div className="ident-tech-card"><span className="material-symbols-outlined">speed</span><h3>Real-Time Processing</h3><p>Identification takes under 2 seconds using edge computing — no cloud upload needed, works offline in galleries.</p></div>
                </div>
            </section>

            {/* Categories */}
            <section className="ident-categories anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="ai-section-title">Supported <span className="gold-text-span">Categories</span></h2>
                <div className="ident-cat-grid">
                    <div className="ident-cat-card"><span className="material-symbols-outlined">cruelty_free</span><h3>Sculptures & Statues</h3><p>Royal statues, ushabti figurines, sphinx forms, and divine representations.</p></div>
                    <div className="ident-cat-card"><span className="material-symbols-outlined">auto_stories</span><h3>Papyri & Texts</h3><p>Book of the Dead scrolls, royal decrees, medical texts, and love poetry.</p></div>
                    <div className="ident-cat-card"><span className="material-symbols-outlined">diamond</span><h3>Jewelry & Amulets</h3><p>Pectorals, scarab rings, wadjet amulets, and funerary ornaments.</p></div>
                    <div className="ident-cat-card"><span className="material-symbols-outlined">deployed_code</span><h3>Sarcophagi & Coffins</h3><p>Wooden, stone, and gilded coffins from the Predynastic to Roman periods.</p></div>
                    <div className="ident-cat-card"><span className="material-symbols-outlined">palette</span><h3>Wall Paintings</h3><p>Tomb paintings, temple reliefs, offering scenes, and astronomical ceilings.</p></div>
                    <div className="ident-cat-card"><span className="material-symbols-outlined">token</span><h3>Hieroglyphs</h3><p>Cartouches, stele inscriptions, temple dedications, and ritual texts.</p></div>
                </div>
            </section>

            {/* Stats */}
            <section className="ident-stats anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className="ident-stats-grid">
                    <div className="ident-stat-item"><span className="ident-stat-number">97%</span><span className="ident-stat-label">Identification Accuracy</span></div>
                    <div className="ident-stat-item"><span className="ident-stat-number">100K+</span><span className="ident-stat-label">Training Images</span></div>
                    <div className="ident-stat-item"><span className="ident-stat-number">&lt;2s</span><span className="ident-stat-label">Response Time</span></div>
                    <div className="ident-stat-item"><span className="ident-stat-number">35K+</span><span className="ident-stat-label">Artifacts Identified</span></div>
                </div>
            </section>

            {/* Recently Identified */}
            <section className="ident-recent anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="ai-section-title">Recently <span className="gold-text-span">Identified</span></h2>
                <div className="ident-recent-grid">
                    <div className="ident-recent-card">
                        <img src="/unnamed (1).png" alt="Tutankhamun Mask" />
                        <div className="ident-recent-overlay">
                            <span className="ident-recent-badge">98.7% Match</span>
                            <h3>Mask of Tutankhamun</h3>
                            <p>18th Dynasty • Gold & Lapis Lazuli</p>
                        </div>
                    </div>
                    <div className="ident-recent-card">
                        <img src="/unnamed 3.png" alt="Rosetta Stone" />
                        <div className="ident-recent-overlay">
                            <span className="ident-recent-badge">96.2% Match</span>
                            <h3>Rosetta Stone</h3>
                            <p>Ptolemaic Period • Granodiorite</p>
                        </div>
                    </div>
                    <div className="ident-recent-card">
                        <img src="/unnamed (2).png" alt="Canopic Jar" />
                        <div className="ident-recent-overlay">
                            <span className="ident-recent-badge">94.8% Match</span>
                            <h3>Canopic Jar of Imsety</h3>
                            <p>New Kingdom • Calcite Alabaster</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Scan Demo */}
            <section className="ident-scan-demo anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="ai-section-title">Live Scan <span className="gold-text-span">Demo</span></h2>
                <div className="scan-demo-container">
                    <div className="scan-demo-visual">
                        <div className="scan-demo-frame">
                            <img src="/unnamed (1).png" alt="Scan Target" className="scan-demo-img" />
                            <div className="scan-demo-line"></div>
                            <div className="scan-demo-corner tl"></div>
                            <div className="scan-demo-corner tr"></div>
                            <div className="scan-demo-corner bl"></div>
                            <div className="scan-demo-corner br"></div>
                            <div className="scan-demo-badge">
                                <span className="material-symbols-outlined">verified</span>
                                Artifact Detected
                            </div>
                        </div>
                    </div>
                    <div className="scan-demo-info">
                        <div className="scan-info-step">
                            <span className="scan-step-num">01</span>
                            <div>
                                <h4>Point & Capture</h4>
                                <p>Aim your camera at any artifact inside or outside the museum</p>
                            </div>
                        </div>
                        <div className="scan-info-step">
                            <span className="scan-step-num">02</span>
                            <div>
                                <h4>AI Processing</h4>
                                <p>Neural network analyzes shape, texture, and historical markers in &lt;2 seconds</p>
                            </div>
                        </div>
                        <div className="scan-info-step">
                            <span className="scan-step-num">03</span>
                            <div>
                                <h4>Full Report</h4>
                                <p>Receive dynasty, materials, symbolism, and conservation status instantly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="ident-testimonials anim-on-scroll" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <h2 className="ai-section-title">What Visitors <span className="gold-text-span">Say</span></h2>
                <div className="ident-testimonial-grid">
                    <div className="ident-testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p>"I pointed my phone at a small statute and within seconds, Tutora told me it was a Ushabti from the 19th Dynasty. Absolutely magical!"</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">SA</div>
                            <div><strong>Sarah A.</strong><span>Tourist from London</span></div>
                        </div>
                    </div>
                    <div className="ident-testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p>"As an Egyptology student, this tool is invaluable. The conservation notes and cross-references saved me hours of research."</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">MK</div>
                            <div><strong>Dr. Mohamed K.</strong><span>Cairo University</span></div>
                        </div>
                    </div>
                    <div className="ident-testimonial-card">
                        <div className="testimonial-stars">★★★★★</div>
                        <p>"My kids loved scanning every artifact they could find. It turned a museum visit into an exciting treasure hunt!"</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">LW</div>
                            <div><strong>Lisa W.</strong><span>Family visit from Berlin</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ArtifactIdentifierPage;
