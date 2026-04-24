import React, { useState, useRef, useEffect } from 'react';
import '../styles/AI-common.css';
import '../styles/PharaohTransformer.css';

const PharaohTransformerPage = () => {
    const API_URL = 'https://gem-backend-production-cb6d.up.railway.app/api';
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDlbA4vB5ISLrkmAv30oW9jwq9oVJRchtZGWGHtmf-aAYB_rtHScYnhRFnEOiM8DQpL6Ps52fKmZu4lI74O1T74smdefEv5AHEAmm34qnwxMmqOErSqKMXuRYRd_e7UIjxuFZrkmQYmVHK7g91OFXXkjFxjcie4I3BIItTO6PZ2dEo9yJjCHyTC2mu99eNwihZCXsucUsDmRvs4wFRCW8HQuKPfmIEfuEJD-5vAYnbR8DKwGhtzvvKkaLfygqMEHmXKTArz7baJ4HqZ');
    const [statusText, setStatusText] = useState('High-resolution front-facing photography yields the most divine results.');
    const [isTransforming, setIsTransforming] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // local hack if CSS classes are unlinked
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.anim-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
            revealObserver.observe(el);
        });

        return () => revealObserver.disconnect();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setStatusText(`Vessel Selected: ${file.name}. Preparing for ritual.`);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTransform = async () => {
        if (!selectedFile) {
            alert('Sacrifice your portrait first.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Temple entry restricted. Please login to undergo transformation.');
            window.location.href = '/login';
            return;
        }

        setIsTransforming(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch(`${API_URL}/ai/photo-to-pharaoh`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok && (data.imageUrl || data.image)) {
                setPreviewSrc(data.imageUrl || data.image);
                setStatusText('Portal Alignment Complete. You have been Reborn.');
            } else {
                alert('The gods rejected your offering. Please try again.');
            }
        } catch (error) {
            alert('Neural link failed. Check your connection to the ether.');
        } finally {
            setIsTransforming(false);
        }
    };

    return (
        <div className="ai-page-container">
            <main className="ai-container">
                {/* Hero Section */}
                <section className="hero-section anim-on-scroll">
                    <span className="hero-label">The Alchemy of Identity</span>
                    <h1 className="ai-display-font hero-title ai-gold-text">Become Eternal.</h1>
                    <p className="hero-description">
                        Our neural engines weave your likeness into the royal iconography of the New Kingdom. Upload a portrait to begin your transformation into an artifact of history.
                    </p>
                </section>

                {/* Tool Grid */}
                <div className="tool-grid">
                    {/* Upload Module */}
                    <div className="artifact-frame anim-on-scroll">
                        <span className="module-label">Module: Pharaoh_01</span>
                        <div 
                            id="upload-zone" 
                            className="upload-zone"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <span className="material-symbols-outlined upload-icon">add_a_photo</span>
                            <h3 className="upload-title">Sacrifice your portrait</h3>
                            <p id="upload-status" className="upload-status">{statusText}</p>
                            <input 
                                id="pharaoh-upload" 
                                style={{ display: 'none' }} 
                                type="file" 
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="transform-actions">
                            <div className="format-info">
                                <span className="format-label">Accepted Formats</span>
                                <span className="format-value">PNG, JPEG, HEIC (Max 25MB)</span>
                            </div>
                            <button 
                                id="transform-btn" 
                                className="transform-btn"
                                onClick={handleTransform}
                                disabled={isTransforming}
                                style={{ pointerEvents: isTransforming ? 'none' : 'auto' }}
                            >
                                {isTransforming ? (
                                    <><span className="material-symbols-outlined animate-spin" style={{ fontSize: '1rem' }}>sync</span> Manifesting...</>
                                ) : (
                                    'Transform Likeness'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview/Result Module */}
                    <div className="preview-container anim-on-scroll">
                        <div className="preview-frame">
                            <img 
                                id="pharaoh-preview" 
                                alt="Pharaoh Transformation Preview" 
                                className="preview-img" 
                                src={previewSrc}
                                style={{ opacity: isTransforming || (selectedFile && statusText.includes('Preparing')) ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
                            />
                            <div className="preview-overlay">
                                <span className="preview-label">Live Rendering</span>
                                <h4 className="preview-title">The Sun Disc Vessel</h4>
                            </div>
                        </div>
                        <div className="curator-note">
                            <span className="material-symbols-outlined note-icon">info</span>
                            <div className="note-content">
                                <span className="preview-label" style={{ marginBottom: '0.25rem' }}>Curator's Note</span>
                                <p className="note-text">
                                    Each transformation leverages deep latent diffusion to map facial geometry to authentic 18th Dynasty basalt textures. Lighting is automatically adjusted to replicate the interior of the Temple of Dendur at sunrise.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <section className="gallery-section anim-on-scroll">
                    <div className="gallery-header">
                        <div>
                            <span className="hero-label" style={{ marginBottom: '0.5rem' }}>Public Records</span>
                            <h2 className="gallery-title">The Reborn Archive</h2>
                        </div>
                        <a className="view-archive" href="/collection">
                            View Archive <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                        </a>
                    </div>
                    <div className="gallery-grid">
                        <div className="gallery-item">
                            <img alt="Pharaoh AI Art" className="gallery-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ted9VNGfhy5Vxq6JLbjfFcUYlX18QEswC7i1wEYEmD-evEkc--GS0AfoeyBzSP5PQ8LyX2kQ2koY2tsRri8X-aQ5P7hiYrsAdmrVsIKbr1WflYbLHp_InPO7VexoXhRB26EpnZPiUylQspis2xP7dcg9RI1dLWXKR8lZNj7gm35Fqy0RjDMVpUK9hxGzAVJB5WkxL6NT7m921whTLT5zdElRRe8Ep8xzdqUqbocyHkJG9xXDk8iwZIMW3sJaG2J32QqdxbLRefQR"/>
                        </div>
                        <div className="gallery-item">
                            <img alt="Pharaoh AI Art" className="gallery-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaDfDZ8XwlGND5NINl7Cz3R3GgfLbl-LcmupyeB0GjAqiSzjxtRV6vTivT5j4kqRxhXxmZr6xNCfzXWjauJENSgK3ygGKbJmNQZs4KfO2rSWbrFaGntKMkvrY1-m9s9X3ctVnCXDKln1uYlabjwDIi9TAxLIE6jZ3yXJ6IDpAQ31E8euKwlVnd2UASwREyTjYmjiu5U19lT7RdO8_7Yqpmb7e9z-m2LCyCZ8psh7SZQ1Gr2pdqRvVy6Gj9S90mi92Y5vR53mnYNSHX"/>
                        </div>
                        <div className="gallery-item">
                            <img alt="Pharaoh AI Art" className="gallery-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtZFyjs3-tM2p_b0E-0WQYBQn-m_zhdPuXkfGkmUUqQky5Cn2cb5p1W68hCo4m6095SHAINRE4UbbB8yBowJCbKxdTzLhaM2bvphtJys-gxOGTTzKkCQmDzEuXYLq0NYt82z4jyrOvJFxFBvYnVbpL3ju_LWU-Ts0_Qk5JDHfXUKcgo31fck8HWvtbS-ABYPTqRmanbVJ_PKpoAb-MfnAN3nqjmbDrkI8EfkerQVoQVU_xdcXfu1n_dNv6zcjIjmZKQD6UMSH_NAUG"/>
                        </div>
                        <div className="gallery-item">
                            <img alt="Pharaoh AI Art" className="gallery-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN9AOhGwyPwsZOXT6Ppbqfw0oo_wwcFQL4pK7ZUEfG4oy-Tcn_X69ZbroIH5Ep2ogZlKTZOniuYtybS0rFJfLSkeVRHowQ3vrnWR6WSA1qh51kPo4dRbrn1mL1wghtjfSgiXrtKTldhre5psp1DSLPQT6lm5HvRb1EnCQAYTmN_w_3dYmrbhWya7GD_6Iz6_gmqvmaGvv6ACobU6YPqBW2ZL4yN9F-WgbxFtvlLGo7SCfC43BgCMgBCYTQh0RqlwfRLgEYH0T6tY9Q"/>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PharaohTransformerPage;
