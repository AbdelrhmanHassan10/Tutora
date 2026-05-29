const fs = require('fs');
const files = fs.readdirSync('.', {recursive:true}).filter(f=>f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // replace the black text color with white
  let newContent = content.replace(/<span class="material-symbols-outlined" style="color: var\(--text-primary\);">expand_more<\/span>/g, '<span class="material-symbols-outlined" style="color: #fff;">expand_more</span>');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed color in', f);
  }
});
