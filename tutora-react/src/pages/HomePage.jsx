import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeLang } from '../context/ThemeLangContext';

const HomePage = () => {
    const { language } = useThemeLang();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        '/artifact.jpg',
        '/heroo.jpg',
        '/gem.jpg'
    ];

    // Slider effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-slider">
                    {slides.map((url, index) => (
                        <div 
                            key={index} 
                            className={`slide ${index === currentSlide ? 'active' : ''}`} 
                            style={{ backgroundImage: `url('${url}')` }}
                        ></div>
                    ))}
                </div>
                
                {/* Slider Controls */}
                <button className="slider-control prev" onClick={prevSlide} aria-label="Previous Slide">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="slider-control next" onClick={nextSlide} aria-label="Next Slide">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="discover-tag">Discover</span>
                        <span className="museum-name">The Grand Egyptian Museum</span>
                    </h1>
                    <p className="hero-subtitle" style={{ color: "rgb(255, 255, 255)" }}>
                        Explore the world's largest collection of ancient Egyptian artifacts
                        with your personal AI guide.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/plan-your-visit" className="btn-accent" style={{ color: "#ecb613", backgroundColor: "#0b0b0b" }}>Explore Tours</Link>
                        <Link to="/booking" className="btn-primary">Buy Tickets</Link>
                    </div>
                </div>
            </section>

            {/* Quick Visit Info Bar (New) */}
            <section className="quick-info-bar">
                <div className="info-item">
                    <span className="material-symbols-outlined icon-gold">schedule</span>
                    <div>
                        <h4>Today's Hours</h4>
                        <p>9:00 AM - 5:00 PM</p>
                    </div>
                </div>
                <div className="info-item">
                    <span className="material-symbols-outlined icon-turquoise">confirmation_number</span>
                    <div>
                        <h4>Get Tickets</h4>
                        <p>Buy online & skip the line</p>
                    </div>
                </div>
                <div className="info-item">
                    <span className="material-symbols-outlined icon-gold">map</span>
                    <div>
                        <h4>Directions</h4>
                        <p>View museum map & parking</p>
                    </div>
                </div>
                <div className="info-item">
                    <span className="material-symbols-outlined icon-turquoise">accessible</span>
                    <div>
                        <h4>Accessibility</h4>
                        <p>Wheelchair & stroller access</p>
                    </div>
                </div>
            </section>

            {/* Featured Experiences Section */}
            <section className="section-container" id="tours">
                <h2 className="section-title">Featured Experiences</h2>
                <div className="tours-scroll">
                    {/* AI Tour Guide */}
                    <div className="tour-card">
                        <div className="tour-image" style={{ backgroundImage: "url('/ai-tour-guide.png')" }}></div>
                        <div className="tour-info">
                            <p className="tour-name">AI Tour Guide</p>
                            <p className="tour-desc">
                                Your personal interactive curator. Experience the museum with an AI that knows every secret of the pharaohs.
                            </p>
                            <Link to="/ai-guide">
                                <button className="btn-learn">Start Tour</button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Pharaoh Transformer */}
                    <div className="tour-card">
                        <div className="tour-image" style={{ backgroundImage: "url('/pharaoh-transformer.png')" }}></div>
                        <div className="tour-info">
                            <p className="tour-name">Pharaoh Transformer</p>
                            <p className="tour-desc">
                                Ever wondered how you'd look as a King or Queen? Transform your image into an ancient Egyptian masterpiece.
                            </p>
                            <Link to="/pharaoh-transformer">
                                <button className="btn-learn">Transform Me</button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* AI Knowledge Chatbot */}
                    <div className="tour-card">
                        <div className="tour-image" style={{ backgroundImage: "url('/ai-chatbot.png')" }}></div>
                        <div className="tour-info">
                            <p className="tour-name">Knowledge Chatbot</p>
                            <p className="tour-desc">
                                Have a specific question? Our AI chatbot is available 24/7 to provide in-depth answers about the GEM.
                            </p>
                            <Link to="/chat-bot">
                                <button className="btn-learn">Ask Tutora</button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* AI Art Imagination */}
                    <div className="tour-card">
                        <div className="tour-image" style={{ backgroundImage: "url('/cat.png')", backgroundPosition: "top" }}></div>
                        <div className="tour-info">
                            <p className="tour-name">AI Art Imagination</p>
                            <p className="tour-desc">
                                Manifest your own ancient visions. Generate stunning artwork inspired by Egyptian mythology and aesthetics.
                            </p>
                            <Link to="/ai-imagination">
                                <button className="btn-learn">Manifest Art</button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Tutora Laboratory */}
                    <div className="tour-card">
                        <div className="tour-image" style={{ backgroundImage: "url('/tutora-lab.png')" }}></div>
                        <div className="tour-info">
                            <p className="tour-name">Tutora Laboratory</p>
                            <p className="tour-desc">
                                Step into our digital lab. Use advanced AI tools to analyze, restore, and study ancient artworks in detail.
                            </p>
                            <Link to="/tutora-lab">
                                <button className="btn-learn">Enter Lab</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curator's Choice / Daily Discovery (New) */}
            <section className="section-container">
                <div className="curator-panel">
                    <div className="curator-image" style={{ backgroundImage: "url('/The-Grand-Egyptian-Museum.webp')" }}>
                        <div className="curator-badge">Curator's Choice</div>
                    </div>
                    <div className="curator-content">
                        <h2 className="artifact-title">The Grand Egyptian Museum</h2>
                        <p className="artifact-desc">
                            The Grand Egyptian Museum, also known as the Giza Museum, is a new archaeological museum in Giza, Egypt,
                            that is set to become the largest archaeological museum in the world. It will house artifacts of ancient
                            Egypt, including the complete Tutankhamun collection.
                        </p>
                        <Link to="/about">
                            <button className="btn-primary" style={{ marginTop: "1.5rem" }}>
                                Learn More
                                <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginLeft: "10px" }}>arrow_forward</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* News & Upcoming Events (New) */}
            <section className="section-container" style={{ backgroundColor: "rgba(236, 182, 19, 0.05)", padding: "3rem 1.5rem", borderRadius: "12px" }}>
                <div className="section-header-flex">
                    <h2 className="section-title" style={{ marginBottom: 0 }}>What's Happening</h2>
                    <Link to="/events" className="view-all-link">View All Events <span className="material-symbols-outlined">arrow_forward</span></Link>
                </div>
                <div className="events-grid">
                    <div className="event-card">
                        <div className="event-date"><span>Oct</span><br /><strong>15</strong></div>
                        <div className="event-details">
                            <h4>New Kingdom Exhibition Opens</h4>
                            <p>Explore newly uncovered artifacts from the Valley of the Kings.</p>
                        </div>
                    </div>
                    <div className="event-card">
                        <div className="event-date"><span>Oct</span><br /><strong>22</strong></div>
                        <div className="event-details">
                            <h4>Kids Workshop: Papyrus Making</h4>
                            <p>A hands-on experience for children to learn ancient Egyptian crafts.</p>
                        </div>
                    </div>
                    <div className="event-card">
                        <div className="event-date"><span>Nov</span><br /><strong>05</strong></div>
                        <div className="event-details">
                            <h4>Curator Talk: Life of Ramses II</h4>
                            <p>Join Dr. Zahi Hawass for an exclusive evening discussing Ramses the Great.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Artifact Identifier Section */}
            <section className="section-container">
                <div className="artifact-panel">
                    <div className="artifact-content">
                        <h2 className="artifact-title">Identify Artifacts with <span className="tutora"> Tutora</span></h2>
                        <p className="artifact-desc">
                            Use our AI guide to learn more about the ancient wonders around
                            you. Just take a photo or upload an image to start your discovery.
                        </p>
                        <div className="artifact-actions">
                            <Link to="/artifact-identifier">
                                <button className="btn-action-gold">
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    Take a Photo
                                </button>
                            </Link>
                            <Link to="/artifact-identifier">
                                <button className="btn-action-turquoise">
                                    <span className="material-symbols-outlined">upload_file</span>
                                    Upload a Photo
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="artifact-visual">
                        <div className="visual-border"></div>
                        <div className="visual-image" style={{ backgroundImage: "url('/11.jpg')" }}></div>
                        <div className="visual-scanner">
                            <span className="material-symbols-outlined" style={{ color: "#40e0d0", fontSize: "36px" }}>document_scanner</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Museum Info Section */}
            <section className="section-container">
                <div className="artifact-panel" style={{ flexDirection: "row-reverse" }}>
                    <div className="artifact-content">
                        <h2 className="artifact-title">The Grand Egyptian Museum</h2>
                        <p className="artifact-desc">
                            The Grand Egyptian Museum, also known as the Giza Museum, is a new
                            archaeological museum in Giza, Egypt, that is set to become the
                            largest archaeological museum in the world. It will house
                            artifacts of ancient Egypt, including the complete Tutankhamun
                            collection.
                        </p>
                        <Link to="/about">
                            <button className="btn-action-gold" style={{ backgroundColor: "rgba(236, 182, 19, 0.2)", color: "#ecb613", width: "fit-content" }}>
                                Learn More
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </Link>
                    </div>
                    <div className="tour-image" style={{ backgroundImage: "url('/12.jpeg')", flex: 1, borderRadius: "0.75rem", minHeight: "300px" }}></div>
                </div>
            </section>

            {/* Museum Amenities & Dining */}
            <section className="section-container">
                <h2 className="section-title" style={{ textAlign: "center" }}>Dine & Shop</h2>
                <p className="section-subtitle" style={{ textAlign: "center", color: "var(--muted-gold)", marginBottom: "2rem" }}>Complete your experience with world-class facilities</p>
                
                <div className="amenities-grid">
                    <div className="amenity-card">
                        <div className="amenity-img" style={{ backgroundImage: "url('/445.jpg')" }}></div>
                        <div className="amenity-info">
                            <h3>Pyramid View Restaurant</h3>
                            <p>Enjoy a premium dining experience with an unobstructed view of the Giza Pyramids.</p>
                        </div>
                    </div>
                    <div className="amenity-card">
                        <div className="amenity-img" style={{ backgroundImage: "url('/dining-4.jpg')" }}></div>
                        <div className="amenity-info">
                            <h3>The Grand Cafe</h3>
                            <p>Relax with freshly brewed coffee and pastries beside the Ramses II statue.</p>
                        </div>
                    </div>
                    <div className="amenity-card">
                        <div className="amenity-img" style={{ backgroundImage: "url('/dining-9.jpg')" }}></div>
                        <div className="amenity-info">
                            <h3>Official Gift Shop</h3>
                            <p>Take home a piece of history with our exclusive replicas and authentic souvenirs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership & Support */}
            <section className="membership-section">
                <div className="membership-content">
                    <div className="membership-text">
                        <h2>Become a GEM Member</h2>
                        <p>Join a community of history enthusiasts. Enjoy unlimited free admission, exclusive previews of new exhibitions, and discounts at our shops and restaurants.</p>
                        <Link to="/membership">
                            <button className="btn-primary" style={{ marginTop: "1rem" }}>Join Today</button>
                        </Link>
                    </div>
                    <div className="membership-perks">
                        <ul>
                            <li><span className="material-symbols-outlined check">check_circle</span> Unlimited yearly access</li>
                            <li><span className="material-symbols-outlined check">check_circle</span> VIP fast-track entry</li>
                            <li><span className="material-symbols-outlined check">check_circle</span> 20% discount on dining & shop</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Newsletter Banner */}
            <section className="newsletter-banner">
                <div className="newsletter-content">
                    <h2>Join the Royal Legacy</h2>
                    <p>Subscribe to our newsletter and be the first to receive exclusive insights, world-class exhibition previews, and royal updates from the Grand Egyptian Museum.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email address" required />
                        <button type="submit" className="btn-accent">Subscribe</button>
                    </form>
                </div>
            </section>

            {/* Location Section */}
            <section className="section-container location-section">
                <div className="location-header">
                    <div>
                        <h2 className="location-title">Visit the GEM</h2>
                        <p className="location-subtitle">Experience the dawn of history at the foot of the Giza Pyramids.</p>
                    </div>
                    <a href="https://www.google.com/maps/place/Grand+Egyptian+Museum/@29.9931986,31.1244409,17z/data=!3m1!4b1!4m6!3m5!1s0x14584534984a8ad1:0x45764c5bc4ec261a!8m2!3d29.9931986!4d31.1244409!16zL20vMGRoOTN3?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="btn-directions" style={{ textDecoration: "none" }}>
                        View Location
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                </div>
                <div className="map-container" style={{ backgroundImage: "url('/unnamed 1.png')" }}>
                    <div className="map-overlay"></div>
                    
                    <div className="visit-card">
                        <h3>Visitor Info</h3>
                        <div className="visit-info">
                            <div className="info-item">
                                <span className="material-symbols-outlined">location_on</span>
                                <div className="info-content">
                                    <p>Our Location</p>
                                    <p>Alexandria Desert Road, Giza Plateau, Cairo, Egypt</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="material-symbols-outlined">schedule</span>
                                <div className="info-content">
                                    <p>Visiting Hours</p>
                                    <p>Open Daily: 9:00 AM – 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="map-marker">
                        <div className="marker-pulse"></div>
                        <span className="material-symbols-outlined marker-icon">location_on</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
