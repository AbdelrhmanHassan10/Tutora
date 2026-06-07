const fs = require('fs');
const path = require('path');

function getAllFiles(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, ext, fileList);
    } else if (filePath.endsWith(ext)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllFiles('.', '.html');
let updated = [];

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('global-lang.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="../global-lang.css" />\n</head>');
    fs.writeFileSync(file, content);
    updated.push(file);
  }
});

console.log('Updated files:', updated.join(', '));
