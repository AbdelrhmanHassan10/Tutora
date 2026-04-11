const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const globalCssPath = path.join(projectDir, 'global-theme.css');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git'].includes(file)) {
                results = results.concat(walk(filePath));
            }
        } else {
            if (filePath.endsWith('.css') && filePath !== globalCssPath) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const cssFiles = walk(projectDir);
let changedCount = 0;

cssFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace hardcoded backgrounds
    content = content.replace(/background-color:\s*#121212(!important)?;/gi, 'background-color: var(--bg-primary)$1;');
    content = content.replace(/background-color:\s*#f8f8f5(!important)?;/gi, 'background-color: var(--bg-primary)$1;');
    content = content.replace(/background-color:\s*#F5F5DC(!important)?;/gi, 'background-color: var(--bg-primary)$1;');
    content = content.replace(/background-color:\s*#000000(!important)?;/gi, 'background-color: var(--bg-primary)$1;');
    
    // Replace hardcoded text colors
    content = content.replace(/color:\s*#ffffff(!important)?;/gi, 'color: var(--text-primary)$1;');
    content = content.replace(/color:\s*#000000(!important)?;/gi, 'color: var(--text-primary)$1;');
    
    // Standardize body.dark and body.light blocks
    content = content.replace(/body\.dark\s*{[\s\S]*?}/gi, 'body.dark {\n    background-color: var(--bg-primary);\n    color: var(--text-primary);\n}');
    content = content.replace(/body\.light\s*{[\s\S]*?}/gi, 'body.light {\n    background-color: var(--bg-primary);\n    color: var(--text-primary);\n}');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Standardized: ${path.relative(projectDir, filePath)}`);
        changedCount++;
    }
});

console.log(`Done standardizing CSS. Changed ${changedCount} files.`);
