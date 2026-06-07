const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'collection', 'style.css');
if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');

    if (!css.includes('body.light .filters-container')) {
        const lightModeCSS = `
/* Light Mode Fixes for Filters Container */
body.light .filters-container {
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(142, 115, 65, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

body.light .search-input {
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(142, 115, 65, 0.2);
    color: #333;
}

body.light .search-input:focus {
    background: #fff;
    border-color: #8e7341;
    box-shadow: 0 0 15px rgba(142, 115, 65, 0.2);
}

body.light .search-input::placeholder {
    color: #888;
}

body.light .reset-btn {
    background: rgba(239, 68, 68, 0.1);
}
`;
        // Insert right after .filters-container
        css = css.replace('.filters-container {', lightModeCSS + '\n.filters-container {');
        fs.writeFileSync(cssPath, css);
        console.log('Added light mode CSS for filters container.');
    }
}
