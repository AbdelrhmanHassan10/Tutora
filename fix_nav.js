const fs = require('fs');
const files = fs.readdirSync('.', {recursive:true}).filter(f=>f.endsWith('.html') && !f.includes('node_modules'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/<\/nav>\s*<\/nav>/g, '</nav>');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed double nav in', f);
  }
});
