const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const htmlFiles = walkDir('d:/Testing/Project');
let modifiedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace theme-btn with icon-btn for langBtn
    content = content.replace(/class=["']theme-btn["']\s+id=["']langBtn["']/g, 'class="icon-btn lang-btn-responsive" id="langBtn"');
    content = content.replace(/id=["']langBtn["']\s+class=["']theme-btn["']/g, 'id="langBtn" class="icon-btn lang-btn-responsive"');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
        modifiedCount++;
    }
});
console.log('Total files modified:', modifiedCount);
