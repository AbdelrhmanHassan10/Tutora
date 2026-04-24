import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-header">
                    <div className="footer-logo">
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <h2 className="footer-title">Grand Egyptian Museum</h2>
                    <div className="footer-divider"></div>
                </div>

                <div className="footer-grid">
                    <div className="footer-column">
                        <h3>Explore</h3>
                        <ul>
                            <li><Link to="/booking">Tickets</Link></li>
                            <li><Link to="/collection">Collection</Link></li>
                            <li><Link to="/exhibition-halls">Exhibition Halls</Link></li>
                            <li><Link to="/membership">Membership</Link></li>
                            <li><Link to="/dining">Museum Dining</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>About</h3>
                        <ul>
                            <li><Link to="/history">History</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/news">News & Press</Link></li>
                            <li><Link to="/branding">Branding</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Support</h3>
                        <ul>
                            <li><Link to="/help">Help</Link></li>
                            <li><Link to="/contact">Get In Touch</Link></li>
                            <li><Link to="/feedback">Feedback</Link></li>
                            <li><Link to="/accessibility">Accessibility</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column connect-column">
                        <h3>Connect</h3>
                        <div className="social-links">
                            <a href="https://www.facebook.com/GrandEgyptianMuseum/" title="Facebook" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://x.com/GrandEGMuseum?s=20" title="X (Twitter )" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter"></i></a>
                            <a href="https://www.instagram.com/grandegyptianmuseum" title="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://www.youtube.com/@GrandEgyptianMuseum" title="YouTube" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                        <p>Follow us on social media for updates and behind-the-scenes content.</p>
                    </div>
                </div>

                <div className="footer-separator"></div>

                <div className="footer-bottom">
                    <div className="language-toggle">
                        <button className="active" data-lang="en">English</button>
                        <button data-lang="ar">العربية</button>
                    </div>
                    <div className="legal-section">
                        <div className="legal-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/cookies">Cookie Settings</Link>
                        </div>
                        <div className="copyright">© 2026 Tutora. All rights reserved.</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
