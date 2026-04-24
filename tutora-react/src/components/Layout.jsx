import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [mobileDropdown, setMobileDropdown] = useState({ ai: false, collection: false });
    const location = useLocation();

    // 1. Theme Management (Matches global-core.js)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setIsDarkTheme(savedTheme === 'dark');
        applyThemeClass(savedTheme);
    }, []);

    const applyThemeClass = (themeName) => {
        if (themeName === 'light') {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    };

    const toggleTheme = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setIsDarkTheme(!isDarkTheme);
        localStorage.setItem('theme', newTheme);
        applyThemeClass(newTheme);
    };

    // 2. Mobile Menu Management
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Auto-close menu on route change
    useEffect(() => {
        closeMenu();
        window.scrollTo(0, 0);
    }, [location]);

    const toggleMobileDropdown = (menu) => {
        setMobileDropdown(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <div className={`app-container ${isDarkTheme ? 'dark' : 'light'}`}>
            {/* Mobile Menu Overlay */}
            <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} id="menuOverlay" onClick={closeMenu}></div>

            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
                <div className="menu-header">
                    <div className="menu-logo">
                        <Link to="/" className="logo-circle" style={{ display: 'block', textDecoration: 'none' }} onClick={closeMenu}>
                            <img src="/logo.png" alt="Tutora Logo" />
                        </Link>
                        <h3 className="menu-logo-text">Tutora</h3>
                    </div>
                    <button className="close-btn" id="closeBtn" onClick={closeMenu}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="menu-nav">
                    <Link to="/" className="menu-link">Home</Link>
                    <Link to="/plan-your-visit" className="menu-link">Plan Your Visit</Link>
                    <Link to="/kids-museum" className="menu-link">Kids-Museum</Link>
                    <Link to="/events" className="menu-link">Event</Link>

                    <div className="menu-dropdown">
                        <button className={`menu-link dropdown-toggle ${mobileDropdown.ai ? 'active' : ''}`} onClick={() => toggleMobileDropdown('ai')}>
                            AI Experience
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                        <div className={`dropdown-items ${mobileDropdown.ai ? 'show' : ''}`}>
                            <Link to="/ai-guide" className="dropdown-item">AI Tour Guide</Link>
                            <Link to="/ai-chatbot" className="dropdown-item">AI Chatbot</Link>
                            <Link to="/artifact-identifier" className="dropdown-item">AI Artifact Identifier</Link>
                            <Link to="/ai-voice" className="dropdown-item">AI Voice Storytelling (3D)</Link>
                            <Link to="/tutora-lab" className="dropdown-item">Tutora laboratory</Link>
                        </div>
                    </div>

                    <Link to="/shop" className="menu-link">Shop</Link>
                    <Link to="/about" className="menu-link">About</Link>
                    
                    <div className="menu-dropdown">
                        <button className={`menu-link dropdown-toggle ${mobileDropdown.collection ? 'active' : ''}`} onClick={() => toggleMobileDropdown('collection')}>
                            Collection
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                        <div className={`dropdown-items ${mobileDropdown.collection ? 'show' : ''}`}>
                            <Link to="/collection" className="dropdown-item">Main Gallery</Link>
                            <Link to="/exhibition-halls" className="dropdown-item">Exhibition Halls</Link>
                        </div>
                    </div>
                </nav>

                <div className="menu-footer">
                    <Link to="/booking" className="menu-booking-btn">Booking</Link>
                    <Link to="/favorites" className="menu-icon-link">
                        <span className="material-symbols-outlined">favorite</span> Favorites
                    </Link>

                    <button className="menu-icon-link" id="menuLangBtn">
                        <span className="material-symbols-outlined">language</span>
                        Language
                    </button>
                </div>
            </div>

            <Header onMenuClick={toggleMenu} onThemeToggle={toggleTheme} isDarkTheme={isDarkTheme} />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
