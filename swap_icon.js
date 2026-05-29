const fs = require('fs');
const files = fs.readdirSync('.', {recursive:true}).filter(f=>f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/(<img[^>]+alt="Profile"[^>]*>)\s*(<span[^>]+>expand_more<\/span>)/g, '$2\n              $1');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed', f);
  }
});
