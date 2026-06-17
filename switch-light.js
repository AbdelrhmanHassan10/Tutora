const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === '.git') return;
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = walk('d:/Testing/Project');
htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('<body class="dark">')) {
        content = content.replace(/<body class="dark">/g, '<body class="light">');
        fs.writeFileSync(file, content);
    }
});

// Update global-core.js
let coreJsPath = 'd:/Testing/Project/global-core.js';
let coreJs = fs.readFileSync(coreJsPath, 'utf8');
coreJs = coreJs.replace(/const savedTheme = localStorage\.getItem\('theme'\) \|\| 'dark';/g, "const savedTheme = localStorage.getItem('theme') || 'light';");
coreJs = coreJs.replace(/const currentTheme = localStorage\.getItem\('theme'\) \|\| 'dark';/g, "const currentTheme = localStorage.getItem('theme') || 'light';");
fs.writeFileSync(coreJsPath, coreJs);
console.log('Successfully switched default to light mode across all files!');
