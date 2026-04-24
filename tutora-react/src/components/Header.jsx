import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = ({ onMenuClick, onThemeToggle, isDarkTheme }) => {
    const [profileImg, setProfileImg] = useState('/unnamed.png');

    useEffect(() => {
        // Fetch saved avatar from localStorage or fallback to default
        const savedAvatar = localStorage.getItem('currentAvatar');
        if (savedAvatar) {
            // Check if it's an absolute path, data URI, or relative path
            if (savedAvatar.startsWith('http') || savedAvatar.startsWith('data:')) {
                setProfileImg(savedAvatar);
            } else {
                // Assuming avatars are stored in public folder
                setProfileImg(savedAvatar.startsWith('/') ? savedAvatar : `/${savedAvatar}`);
            }
        }
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <button className="menu-btn" id="menuBtn" onClick={onMenuClick}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="logo-section">
                        <Link to="/" className="logo-circle" style={{ display: 'block', textDecoration: 'none' }}>
                            <img src="/logo.png" alt="Tutora Logo" />
                        </Link>
                        <h2 className="logo-text">TUTORA</h2>
                    </div>
                </div>

                <nav className="desktop-nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
                    <NavLink to="/plan-your-visit" className={({ isActive }) => isActive ? "active-link" : ""}>Plan Your Visit</NavLink>
                    <NavLink to="/kids-museum" className={({ isActive }) => isActive ? "active-link" : ""}>Kids-Museum</NavLink>
                    <NavLink to="/events" className={({ isActive }) => isActive ? "active-link" : ""}>Event</NavLink>
                    
                    <div className="nav-dropdown">
                        <button className="nav-link dropdown-trigger">
                            AI Experience
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                        <div className="dropdown-menu">
                            <Link to="/ai-guide" className="dropdown-link">AI Tour Guide</Link>
                            <Link to="/ai-chatbot" className="dropdown-link">AI Chatbot</Link>
                            <Link to="/artifact-identifier" className="dropdown-link">AI Artifact Identifier</Link>
                            <Link to="/ai-voice" className="dropdown-link">AI Voice Storytelling (3D)</Link>
                            <Link to="/tutora-lab" className="dropdown-link">Tutora laboratory</Link>
                        </div>
                    </div>
                    
                    <NavLink to="/shop" className={({ isActive }) => isActive ? "active-link" : ""}>Shop</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink>

                    <div className="nav-dropdown">
                        <button className="nav-link dropdown-trigger">
                            Collection
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                        <div className="dropdown-menu">
                            <Link to="/collection" className="dropdown-link">Main Gallery</Link>
                            <Link to="/exhibition-halls" className="dropdown-link">Exhibition Halls</Link>
                        </div>
                    </div>
                </nav>

                <div className="header-right">
                    <div className="search-box">
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <button className="theme-btn" id="themeBtn" onClick={onThemeToggle}>
                        <span className="material-symbols-outlined">{isDarkTheme ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <Link to="/booking" className="btn-booking" style={{ color: '#ffffff' }}>booking</Link>
                    <Link to="/favorites">
                        <button className="icon-btn">
                            <span className="material-symbols-outlined">favorite</span>
                        </button>
                    </Link>
                    <button className="icon-btn" id="langBtn">
                        <span className="material-symbols-outlined">language</span>
                    </button>
                    <Link to="/profile">
                        <img src={profileImg} alt="Profile" className="profile-img" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
