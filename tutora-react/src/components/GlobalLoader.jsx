import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Note: The global-loader.css from original project must be imported.
// We will import it in App.jsx or here. 

const GlobalLoader = () => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    
    // Initial mount and route change loader effect
    useEffect(() => {
        setIsVisible(true);
        setProgress(0);

        let currentProgress = 0;
        const duration = 1000; // 1 second
        const intervalTime = 20; // Update every 20ms
        const step = (100 / duration) * intervalTime;

        const interval = setInterval(() => {
            currentProgress += step;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                
                // Hide loader after a short delay once it hits 100%
                setTimeout(() => {
                    setIsVisible(false);
                }, 100);
            }
            setProgress(currentProgress);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [location.pathname]); // Re-run on path change

    if (!isVisible) return null;

    return (
        <div id="global-loader" className={!isVisible ? 'hidden' : ''}>
            <div className="loader-starfield"></div>
            <div className="loader-sparkle"></div>
            <div className="loader-logo-wrapper">
                <div className="loader-glow"></div>
                <div className="loader-logo-frame" style={{ 
                    width: '160px', 
                    height: '160px', 
                    overflow: 'hidden', 
                    borderRadius: '50%', 
                    opacity: 1, 
                    transform: 'scale(1)', 
                    transition: 'all 0.6s var(--ease-premium)' 
                }}>
                    <img id="loader-logo-img" src="/logo.png" alt="Tutora Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
                </div>
            </div>
            <h1 className="loader-title">Tutora</h1>
            <div className="loader-subtitle-wrapper">
                <div className="loader-line"></div>
                <p className="loader-subtitle">Celestial Alignments</p>
                <div className="loader-line rev"></div>
            </div>
            <div className="loader-progress-container">
                <p className="loader-status-text">Aligning the heavens...</p>
                <div className="loader-progress-bar">
                    <div className="loader-progress-fill" id="loader-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="percentage-box" id="loader-percentage">{Math.round(progress)}%</div>
            </div>
            {/* Ambient Bottom Gradient */}
            <div className="loader-bottom-gradient"></div>
        </div>
    );
};

export default GlobalLoader;
