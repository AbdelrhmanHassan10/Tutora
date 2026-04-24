import React, { useState, useEffect } from 'react';
import { HeroSection, StaircaseSection, ColossusSection, SequentialDiscoverySection } from '../components/StaticSections';
import { hallsData } from '../data/hallsData';

const HallsGalleryPage = () => {
    const [filterEra, setFilterEra] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHallId, setSelectedHallId] = useState(null);

    // Derived state
    const filteredHalls = hallsData.filter(hall => {
        const matchesEra = filterEra === 'all' || hall.era === filterEra;
        const matchesSearch = hall.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              hall.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesEra && matchesSearch;
    });

    const selectedHall = selectedHallId ? hallsData.find(h => h.id === selectedHallId) : null;

    // Reset scroll when showing details
    useEffect(() => {
        if (selectedHallId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedHallId]);

    const handleBack = (e) => {
        e.preventDefault();
        setSelectedHallId(null);
    };

    const handleListen = (name, e) => {
        e.stopPropagation();
        alert(`Playing historical story for: ${name}... (Text-to-Speech UI)`);
    };

    const toggleFavorite = (e) => {
        e.stopPropagation();
        e.currentTarget.classList.toggle('active');
    };

    // If a hall is selected, show Artifacts details
    if (selectedHall) {
        return (
            <div className="halls-gallery-page">
                <section className="artifacts-section" id="artifactsSection" style={{ minHeight: '100vh', paddingTop: '100px' }}>
                    <div className="container">
                        <nav className="artifacts-breadcrumb">
                            <a href="#" onClick={handleBack}>Exhibition Halls</a> <span>&rsaquo;</span> <span>{selectedHall.name}</span>
                        </nav>
                        <div className="artifacts-header">
                            <button className="back-to-halls" onClick={handleBack}>
                                <span className="material-symbols-outlined">arrow_back</span> Back to Halls
                            </button>
                            <h2 className="section-title">{selectedHall.name}</h2>
                            <p className="hall-long-desc">{selectedHall.longDesc}</p>
                        </div>
                        <div className="artifacts-grid">
                            {selectedHall.artifacts.map((art, idx) => (
                                <div key={idx} className="artifact-card anim-reveal active">
                                    <div className="artifact-img-box">
                                        <img src={art.image} alt={art.name} />
                                        <button className="favorite-btn" onClick={toggleFavorite}>
                                            <span className="material-symbols-outlined">favorite</span>
                                        </button>
                                    </div>
                                    <div className="artifact-info">
                                        <h4 className="artifact-name">{art.name}</h4>
                                        <p className="artifact-desc">{art.desc}</p>
                                    </div>
                                    <div className="artifact-actions">
                                        <button className="action-btn" onClick={(e) => handleListen(art.name, e)}>
                                            <span className="material-symbols-outlined">audiotrack</span>
                                            <span>Listen</span>
                                        </button>
                                        <button className="action-btn">
                                            <span className="material-symbols-outlined">view_in_ar</span>
                                            <span>3D View</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // Main view (no hall selected)
    return (
        <div className="halls-gallery-page">
            <HeroSection />
            <StaircaseSection />
            
            {/* Controls / Search Section */}
            <section className="controls-section" id="journey-start">
                <div className="container">
                    <div className="controls-wrapper">
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {['all', 'Old Kingdom', 'Middle Kingdom', 'New Kingdom', 'Late Period'].map(era => (
                                <button 
                                    key={era}
                                    className={`filter-btn ${filterEra === era ? 'active' : ''}`}
                                    onClick={() => setFilterEra(era)}
                                >
                                    {era === 'all' ? 'All Halls' : (era === 'Late Period' ? 'Greco-Roman' : era)}
                                </button>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>search</span>
                            <input 
                                type="text" 
                                placeholder="Search treasures..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '50px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutankhamun's Legacy / Featured Halls */}
            <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '8rem 0' }} id="halls-grid">
                <div className="container">
                    <div className="section-header anim-reveal active">
                        <span className="section-label">Masterpiece Gallery</span>
                        <h2 className="section-title">Tutankhamun & <br/><span style={{ color: 'var(--hall-gold)' }}>Royal Treasures</span></h2>
                        <p style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--text-secondary)' }}>
                            Over 5,000 artifacts from the boy king's tomb are displayed in one immersive space for the first time in history.
                        </p>
                    </div>

                    {filteredHalls.length === 0 ? (
                        <div className="status-message">
                            <span className="material-symbols-outlined">search_off</span>
                            <p>No treasures found matching your search. Please try a different period or keyword.</p>
                        </div>
                    ) : (
                        <div className="halls-grid">
                            {filteredHalls.map((hall, idx) => (
                                <div 
                                    key={hall.id} 
                                    className="hall-card anim-reveal active" 
                                    style={{ transitionDelay: `${idx * 0.1}s` }}
                                    onClick={() => setSelectedHallId(hall.id)}
                                >
                                    <img src={hall.image} alt={hall.name} className="hall-card-img" />
                                    <div className="hall-card-info">
                                        <h3>{hall.name}</h3>
                                        <p>{hall.shortDesc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <SequentialDiscoverySection />
            <ColossusSection />
        </div>
    );
};

export default HallsGalleryPage;
