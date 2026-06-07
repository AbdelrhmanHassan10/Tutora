const fs = require('fs');
let css = fs.readFileSync('global-theme.css', 'utf8');

const targetStr = `/* ============================================
   GLOBAL NAVBAR MOBILE SPACING OPTIMIZATION
   Ensures all elements (menu, logo, and right icons) fit perfectly on small screens
   ============================================ */
@media (max-width: 480px) {`;

const endStr = `/* ==========================================================================
   STANDARDIZED PREMIUM FOOTER LOGO RINGS & THEME ADAPTATIONS
   ========================================================================== */`;

const startIndex = css.indexOf(targetStr);
const endIndex = css.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find start or end index");
    process.exit(1);
}

const replacement = `/* ============================================
   GLOBAL NAVBAR MOBILE SPACING OPTIMIZATION
   Ensures all elements (menu, logo, and right icons) fit perfectly on small screens
   ============================================ */
@media (max-width: 768px) {
    .header {
        padding: 0.5rem 0.4rem !important;
        background: #000 !important;
        border-bottom: 1px solid rgba(236, 182, 19, 0.2) !important;
    }
    .header-container {
        width: 100% !important;
        padding: 0 !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 0.25rem !important;
        max-width: none !important;
    }
    .header-left {
        flex: 0 1 auto !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.25rem !important;
        min-width: 0 !important;
    }
    .menu-btn {
        display: flex !important;
        width: 32px !important;
        height: 32px !important;
        justify-content: center !important;
        align-items: center !important;
        color: #ECB613 !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
    }
    .menu-btn span {
        font-size: 1.8rem !important;
    }
    .logo-section {
        display: flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        min-width: 0 !important;
        text-decoration: none !important;
    }
    .logo-circle {
        width: 32px !important;
        height: 32px !important;
        border: 1px solid #ECB613 !important;
        background: #fff !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        overflow: hidden !important;
        box-shadow: 0 0 15px rgba(236, 182, 19, 0.5) !important;
    }
    .logo-circle img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
    }
    .logo-text {
        font-size: 1.1rem !important;
        font-family: "Cinzel", serif !important;
        font-weight: 700 !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        color: #ECB613 !important;
        margin: 0 !important;
        white-space: nowrap !important;
        text-shadow: 0 0 8px rgba(236, 182, 19, 0.6) !important;
        flex-shrink: 1 !important;
    }
    .header-right {
        flex: 0 0 auto !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        margin-left: auto !important;
    }
    .header-right a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-decoration: none !important;
    }
    .theme-btn, .icon-btn, .icon-btn-link button {
        display: flex !important;
        width: 32px !important;
        height: 32px !important;
        justify-content: center !important;
        align-items: center !important;
        background: transparent !important;
        border: none !important;
        color: #fff !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
    }
    .theme-btn span, .icon-btn span, .icon-btn-link button span {
        font-size: 1.4rem !important;
    }
    
    .btn-booking {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        background: #ECB613 !important;
        color: #000 !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 0 !important;
        box-shadow: 0 0 15px rgba(236, 182, 19, 0.5) !important;
        margin: 0 0.2rem !important;
    }
    .btn-booking .booking-text {
        display: none !important;
    }
    .btn-booking .booking-icon {
        display: block !important;
        font-size: 1.3rem !important;
        color: #000 !important;
    }
    
    .cart-btn span.material-symbols-outlined {
        color: #fff !important;
    }

    #langBtn {
        display: none !important;
    }

    .profile-img {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        border: 1.5px solid #ECB613 !important;
        object-fit: cover !important;
        flex-shrink: 0 !important;
    }
    
    .profile-trigger {
        gap: 2px !important;
    }

    .desktop-nav, .search-box {
        display: none !important;
    }
}

`;

const newCss = css.substring(0, startIndex) + replacement + css.substring(endIndex);
fs.writeFileSync('global-theme.css', newCss, 'utf8');
console.log("Updated global-theme.css successfully.");
