const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'tutora-react') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles('d:/Testing/Project');
let modifiedCount = 0;

for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    let changed = false;

    // Find the language button in the menu-footer and remove it
    const footerLangBtn = $('.menu-footer button#menuLangBtn');
    if (footerLangBtn.length > 0) {
        footerLangBtn.remove();
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, $.html());
        modifiedCount++;
    }
}

console.log('Removed bottom Language button from ' + modifiedCount + ' files.');
