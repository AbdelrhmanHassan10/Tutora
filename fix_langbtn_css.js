const fs = require('fs');
const path = require('path');

function findCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findCssFiles(filePath, fileList);
        } else if (filePath.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const cssFiles = findCssFiles('d:/Testing/Project');
let modifiedCount = 0;

const regex1 = /#langBtn\s*\{\s*display:\s*none\s*!important;\s*\}/g;
const regex2 = /#langBtn::after\s*\{\s*display:\s*none\s*!important;\s*\}/g;

for (const file of cssFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (regex1.test(content) || regex2.test(content)) {
        content = content.replace(regex1, '/* removed #langBtn hide */');
        content = content.replace(regex2, '/* removed #langBtn::after hide */');
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log('Modified: ' + file);
    }
}

console.log('Modified ' + modifiedCount + ' CSS files.');
