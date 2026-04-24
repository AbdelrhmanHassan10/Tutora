import React from 'react';

export const HeroSection = () => (
    <section className="hall-hero">
        <div className="hero-video-bg">
            <img src="/src/assets/images/hero.png" alt="Grand Egyptian Museum Central Hall" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content anim-reveal active">
            <span className="gold-accent-text">The Gateway to Eternity</span>
            <h1 className="hero-title">Exhibition <br />Halls</h1>
            <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.8, fontSize: '1.1rem', color: '#fff' }}>
                Where the echoes of five millennia resonate through glass and stone. Experience the world's largest archaeological treasury.
            </p>
            <div style={{ marginTop: '3rem' }}>
                <a href="#halls-grid" className="filter-btn active" style={{ textDecoration: 'none' }}>Begin Journey</a>
            </div>
        </div>
    </section>
);

export const StaircaseSection = () => (
    <section className="staircase-section">
        <div className="container">
            <div className="staircase-flex">
                <div className="staircase-content anim-reveal active">
                    <span className="section-label">Vertical History</span>
                    <h2 className="section-title">The Grand <span style={{ color: 'var(--hall-gold)' }}>Staircase</span></h2>
                    <p style={{ marginTop: '2rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        Ascend through time on a monumental staircase featuring over 87 colossal statues, architectural remnants, and stelae. This vertical gallery tells the story of kingship and the divine in ancient Egypt, leading you to an unparalleled view of the Great Pyramids.
                    </p>
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--hall-gold)' }}>temple_hindu</span>
                            <span style={{ fontWeight: 600 }}>Royal Statues from the Old Kingdom</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--hall-gold)' }}>rebase</span>
                            <span style={{ fontWeight: 600 }}>Chronological Ascension (4 Levels)</span>
                        </div>
                    </div>
                </div>
                <div className="staircase-visual anim-reveal active">
                    {/* Using an asset image from Unsplash or local if copied */}
                    <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop" alt="Grand Staircase Statues" className="visual-main" />
                    <div className="monument-badge">87+ MONUMENTS</div>
                </div>
            </div>
        </div>
    </section>
);

export const ColossusSection = () => (
    <section style={{ backgroundColor: '#000', color: '#fff', padding: '12rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
            <img src="/src/assets/images/grand.png" alt="Ramses Colossus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container anim-reveal active" style={{ position: 'relative', zIndex: 2 }}>
            <span className="gold-accent-text">The Living Sun King</span>
            <h2 className="section-title" style={{ color: '#fff', fontSize: '4rem' }}>Colossus of <br />Ramses II</h2>
            <p style={{ maxWidth: '700px', margin: '3rem auto', fontSize: '1.25rem', opacity: 0.9 }}>
                Standing 11 meters tall and weighing 83 tons, the 3,200-year-old red granite statue of Ramses II welcomes every visitor. Standing exactly where the sun rays illuminate it twice a year.
            </p>
            <div style={{ display: 'inline-block', padding: '1rem 3rem', border: '2px solid var(--hall-gold)', color: 'var(--hall-gold)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>
                The Great Atrium
            </div>
        </div>
    </section>
);

export const SequentialDiscoverySection = () => (
    <section className="container" style={{ padding: '10rem 0' }}>
        <div className="section-header anim-reveal active">
            <span className="section-label">Sequential Discovery</span>
            <h2 className="section-title">The Main <span style={{ color: 'var(--hall-gold)' }}>Galleries</span></h2>
        </div>
        <div className="main-galleries-grid">
            <div className="hall-box anim-reveal active">
                <span className="hall-number">01</span>
                <h4>Birth of Architecture</h4>
                <p>The Step Pyramid and early dynastic evolution of monumental stone structures.</p>
            </div>
            <div className="hall-box anim-reveal active">
                <span className="hall-number">02</span>
                <h4>The Pyramid Age</h4>
                <p>Dedicated to the builders of Giza, featuring Khufu, Khafre, and Menkaure collections.</p>
            </div>
            <div className="hall-box anim-reveal active">
                <span className="hall-number">08</span>
                <h4>Imperial Majesty</h4>
                <p>The peak of the New Kingdom's power, featuring Thutmose and Hatshepsut.</p>
            </div>
            <div className="hall-box anim-reveal active">
                <span className="hall-number">12</span>
                <h4>Ptolemaic Echoes</h4>
                <p>The synthesis of Egyptian and Greek culture during the reign of the Ptolemies.</p>
            </div>
        </div>
    </section>
);
