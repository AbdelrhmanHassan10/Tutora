import React, { useState } from 'react';
import '../styles/AI-common.css';
import '../styles/TutoraLab.css';

const TutoraLabPage = () => {
    const [loadingBtnId, setLoadingBtnId] = useState(null);

    const handleBtnClick = (id, path) => {
        setLoadingBtnId(id);
        setTimeout(() => {
            setLoadingBtnId(null);
            if (path) window.location.href = path;
        }, 800); // reduced from 1500 to match realistic perceived UX before navigation
    };

    return (
        <div className="ai-page-container">
            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-bg"></div>
                    <div className="ai-container">
                        <h1 className="ai-display-font hero-title ai-gold-text">
                        Revive Ancient Egyptian Art with AI
                    </h1>
                    <h2 className="hero-subtitle">
                        Reviving ancient Egyptian art with generative artificial intelligence
                    </h2>
                    <button 
                        className="gold-button" 
                        onClick={() => handleBtnClick('hero', '/pharaoh-transformer')}
                        style={{ pointerEvents: loadingBtnId === 'hero' ? 'none' : 'auto' }}
                    >
                        {loadingBtnId === 'hero' ? 'Loading ...' : 'Start creating now'}
                    </button>
                </div>
            </section>
            <br/><br/>

            <section className="ai-container">
                <div className="section-header">
                    <div className="header-line"></div>
                    <h3 className="ai-display-font section-title ai-gold-text">
                        Choose a creative style
                    </h3>
                    <div className="header-line"></div>
                </div>

                <div className="cards-grid">
                    {/* Card 1 */}
                    <div className="card">
                        <div className="card-image-wrapper">
                            <img alt="Hieroglyphic Cartouche" className="card-image" src="/unnamed 1.png" />
                            <div className="card-overlay"></div>
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">Write your name in hieroglyphics</h4>
                            <p className="card-desc">
                                Transform your name into a royal name using the symbols of authentic Egyptian art.
                            </p>
                            <button 
                                className="gold-button" 
                                style={{ width: '100%', padding: '0.75rem', pointerEvents: loadingBtnId === 'name' ? 'none' : 'auto' }}
                                onClick={() => handleBtnClick('name', '/name-translator')}
                            >
                                {loadingBtnId === 'name' ? 'Loading ...' : 'Try it now'}
                            </button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="card" style={{ transform: 'translateY(-1rem)' }}>
                        <div className="card-image-wrapper">
                            <img alt="Pharaonic Portrait" className="card-image" src="/unnamed (2).png" />
                            <div className="card-overlay"></div>
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">Turn your picture into a pharaoh</h4>
                            <p className="card-desc">
                                Upload your profile picture and let artificial intelligence redraw your features as an Egyptian king.
                            </p>
                            <button 
                                className="gold-button" 
                                style={{ width: '100%', padding: '0.75rem', pointerEvents: loadingBtnId === 'pharaoh' ? 'none' : 'auto' }}
                                onClick={() => handleBtnClick('pharaoh', '/pharaoh-transformer')}
                            >
                                {loadingBtnId === 'pharaoh' ? 'Loading ...' : 'Try it now'}
                            </button>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="card">
                        <div className="card-image-wrapper">
                            <img alt="Mythical Egyptian Cat" className="card-image" src="/unnamed (3).png" />
                            <div className="card-overlay"></div>
                        </div>
                        <div className="card-content">
                            <h4 className="card-title">Create from your imagination</h4>
                            <p className="card-desc">
                                Write a description of any object or scene and let your imagination blend with the grandeur of Egyptian civilization.
                            </p>
                            <button 
                                className="gold-button" 
                                style={{ width: '100%', padding: '0.75rem', pointerEvents: loadingBtnId === 'imagination' ? 'none' : 'auto' }}
                                onClick={() => handleBtnClick('imagination', '/ai-imagination')}
                            >
                                {loadingBtnId === 'imagination' ? 'Loading ...' : 'Try it now'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="ai-container">
                <div className="section-header">
                    <div className="header-line"></div>
                    <h3 className="ai-display-font section-title ai-gold-text">
                        Visitor Creations
                    </h3>
                    <div className="header-line"></div>
                </div>

                <div className="gallery-masonry">
                    <div className="gallery-item"><img className="gallery-img" src="/1.png" alt="Gallery 1" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/2.png" alt="Gallery 2" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/3.png" alt="Gallery 3" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/4.png" alt="Gallery 4" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/5.png" alt="Gallery 5" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/6.png" alt="Gallery 6" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/7.png" alt="Gallery 7" /></div>
                    <div className="gallery-item"><img className="gallery-img" src="/1.png" alt="Gallery 8" /></div>
                </div>
            </section>

            {/* How AI Art Works */}
            <section className="art-how">
                <h2 className="ai-section-title">How AI Art <span className="gold-text-span">Creation Works</span></h2>
                <div className="art-how-grid">
                    <div className="art-how-card">
                        <div className="art-how-step-num">01</div>
                        <span className="material-symbols-outlined art-how-icon">edit_note</span>
                        <h3 className="art-how-title">Define Your Vision</h3>
                        <p className="art-how-text">Define your creative intent through text or imagery. Specify your desired aesthetic — from Pharaonic grandeur to Mythological symbolism.</p>
                    </div>
                    <div className="art-how-card">
                        <div className="art-how-step-num">02</div>
                        <span className="material-symbols-outlined art-how-icon">auto_awesome</span>
                        <h3 className="art-how-title">Neural Art Synthesis</h3>
                        <p className="art-how-text">Our proprietary engine, infused with the essence of thousands of Egyptian masterpieces, breathes life into your vision with neural precision.</p>
                    </div>
                    <div className="art-how-card">
                        <div className="art-how-step-num">03</div>
                        <span className="material-symbols-outlined art-how-icon">download</span>
                        <h3 className="art-how-title">Eternalize & Exhibit</h3>
                        <p className="art-how-text">Secure your masterpiece in ultra-high resolution. Share your legacy with the world or immortalize it within our Digital Visitor Sanctuary.</p>
                    </div>
                </div>
            </section>

            {/* Creative Tools */}
            <section className="creative-tools-section">
                <h2 className="ai-section-title">Creative <span className="gold-text-span">Tools</span></h2>
                <div className="creative-tools-grid">
                    <div className="creative-tools-card">
                        <span className="material-symbols-outlined creative-tools-icon">text_fields</span>
                        <h3 className="creative-tools-title">Hieroglyph Writer</h3>
                        <p className="creative-tools-text">Translate your name into authentic hieroglyphic cartouches with royal styling.</p>
                    </div>
                    <div className="creative-tools-card">
                        <span className="material-symbols-outlined creative-tools-icon">face_retouching_natural</span>
                        <h3 className="creative-tools-title">Pharaoh Transformer</h3>
                        <p className="creative-tools-text">Transform your selfie into a pharaonic portrait — complete with crown and regalia.</p>
                    </div>
                    <div className="creative-tools-card">
                        <span className="material-symbols-outlined creative-tools-icon">brush</span>
                        <h3 className="creative-tools-title">Free Imagination</h3>
                        <p className="creative-tools-text">Describe any scene and watch AI render it in ancient Egyptian artistic style.</p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-value">75K+</span>
                        <span className="stat-label">Artworks Created</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">3</span>
                        <span className="stat-label">Creative Modes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">4.8/5</span>
                        <span className="stat-label">User Rating</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">12K+</span>
                        <span className="stat-label">Gallery Submissions</span>
                    </div>
                </div>
            </section>
            </main>
        </div>
    );
};

export default TutoraLabPage;
