const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const eventHtmlPath = path.join(projectDir, 'event', 'event.html');
const eventCssPath = path.join(projectDir, 'event', 'style.css');
const globalCssPath = path.join(projectDir, 'global-theme.css');

// 1. Extract footer HTML from event.html
const eventHtml = fs.readFileSync(eventHtmlPath, 'utf8');
const footerHtmlMatch = eventHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
if (!footerHtmlMatch) {
    console.error("Could not find footer in event.html");
    process.exit(1);
}
let footerHtml = footerHtmlMatch[0];

// 2. Extract footer CSS from event/style.css
const eventCss = fs.readFileSync(eventCssPath, 'utf8');
const footerCssStart = eventCss.indexOf('/* ============================================ FOOTER ============================================ */');
const footerCssEnd = eventCss.indexOf('/* ============================================', footerCssStart + 100);

if (footerCssStart === -1) {
    console.error("Could not find footer CSS in event/style.css");
} else {
    const endPos = footerCssEnd !== -1 ? footerCssEnd : eventCss.length;
    let footerCssContent = eventCss.substring(footerCssStart, endPos);
    
    // Convert hardcoded colors in this footer CSS to use variables
    footerCssContent = footerCssContent.replace(/background-color:\s*#f8f8f5;/gi, 'background-color: var(--bg-secondary);');
    footerCssContent = footerCssContent.replace(/body\.dark \.site-footer\s*{\s*background-color:\s*#121212;\s*}/gi, 'body.dark .site-footer { background-color: var(--bg-secondary); }');
    footerCssContent = footerCssContent.replace(/body\.dark \.footer-separator\s*{\s*background-color:\s*#374151;\s*}/gi, 'body.dark .footer-separator { background-color: var(--border-color); }');

    let globalCss = fs.readFileSync(globalCssPath, 'utf8');
    if (!globalCss.includes('FOOTER ============================================')) {
        globalCss += '\n\n' + footerCssContent;
        fs.writeFileSync(globalCssPath, globalCss);
        console.log("Appended footer CSS to global-theme.css");
    }
}

// 3. Walk directory and update all .html files
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'footer'].includes(file)) {
                results = results.concat(walk(filePath));
            }
        } else {
            if (filePath.endsWith('.html')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const htmlFiles = walk(projectDir);
let changedCount = 0;

htmlFiles.forEach(filePath => {
    // skip the source event html to prevent mangling itself
    if (filePath === eventHtmlPath) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace existing <footer ...>...</footer>
    // Handle attributes properly
    const newContent = content.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, footerHtml);
    
    // Optional: make sure global-theme.css is attached
    let finalContent = newContent;
    if (!finalContent.includes('global-theme.css')) {
        // if href="" lacks it, insert before </head>
        finalContent = finalContent.replace('</head>', '    <link rel="stylesheet" href="../global-theme.css" />\n</head>');
    }

    if (content !== finalContent) {
        fs.writeFileSync(filePath, finalContent);
        console.log(`Updated HTML: ${path.relative(projectDir, filePath)}`);
        changedCount++;
    }
});

console.log(`Done updating footers. Changed ${changedCount} files.`);
