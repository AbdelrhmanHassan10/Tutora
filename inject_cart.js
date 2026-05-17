const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', 'tutora-react', '.git', '.gemini'].includes(file)) {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Normalize path separators for depth calculation
    const normalizedPath = filePath.split(path.sep).join('/');
    const depth = normalizedPath.split('/').length - 1; 
    const rootPath = depth > 0 ? '../'.repeat(depth) : '';
    const cartLink = rootPath + 'card/card.html';

    // 1. Fix existing links
    // Find <a href="..." ...> ... <button class="... cart-btn" ...
    const cartRegex = /<a[^>]*href="([^"]*)"[^>]*>\s*<button[^>]*class="[^"]*cart-btn[^"]*"[\s\S]*?<\/a>/;
    if (cartRegex.test(content)) {
        content = content.replace(cartRegex, (match, p1) => {
            if (p1 !== cartLink) {
                modified = true;
                return match.replace(`href="${p1}"`, `href="${cartLink}"`);
            }
            return match;
        });
    } else {
        // 2. Inject new cart button before langBtn
        const langBtnRegex = /(<button[^>]*id="langBtn"[^>]*>)/;
        if (langBtnRegex.test(content)) {
            const btnHtml = `
                    <a href="${cartLink}" class="icon-btn" >
                        <button class="icon-btn cart-btn" style="position: relative; background: transparent; border: none; cursor: pointer;">
                            <span class="material-symbols-outlined" style="color: #ECB613;">shopping_cart</span>
                            <span class="cart-badge" style="display: none;">0</span>
                        </button>
                    </a>
                    `;
            content = content.replace(langBtnRegex, btnHtml + '$1');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

processDir('.');
