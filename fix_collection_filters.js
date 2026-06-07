const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'collection', 'style.css');

if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    
    // Add .filter-btn if missing
    if (!css.includes('.filter-btn {')) {
        const activeFilterContainerRegex = /\.active-filters-container\s*\{/;
        const filterBtnCSS = `
.filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: var(--col-muted, #94a3b8);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0.5rem;
}

.filter-btn span:last-child {
    margin-left: auto;
}

.filter-btn:hover, .filter-btn.active {
    color: var(--col-accent, #f2d00d);
}

body.light .filter-btn {
    color: #444;
}

body.light .filter-btn:hover, body.light .filter-btn.active {
    color: #8e7341;
}

`;
        css = css.replace(activeFilterContainerRegex, filterBtnCSS + '.active-filters-container {');
    }

    // Add mobile styling for filters-container and replace reset-btn
    const resetBtnRegex = /\.reset-btn\s*\{[\s\S]*?\.filter-divider\s*\{[\s\S]*?\}/;
    if (css.match(resetBtnRegex) && !css.includes('@media (max-width: 768px) {\\n    .filters-container {\\n        flex-direction: column;')) {
        const replacementCSS = `.reset-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.reset-btn:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: #ef4444;
}

.filter-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 0.5rem;
}

@media (max-width: 768px) {
    .filters-container {
        flex-direction: column;
        align-items: stretch;
        padding: 1.5rem;
        gap: 0.5rem;
    }
    .filter-btn {
        width: 100%;
        padding: 0.75rem 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    body.light .filter-btn {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .filter-btn:last-of-type {
        border-bottom: none;
    }
    .filter-divider {
        display: none;
    }
    .reset-btn {
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
    }
}`;
        css = css.replace(resetBtnRegex, replacementCSS);
    }

    fs.writeFileSync(cssPath, css);
    console.log("Updated collection/style.css successfully!");
} else {
    console.error("collection/style.css not found.");
}
