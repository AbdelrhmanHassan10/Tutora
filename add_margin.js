const fs = require('fs');
const files = fs.readdirSync('.', {recursive:true}).filter(f=>f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/class="nav-dropdown profile-dropdown" id="navProfileLink" style="display: none;" title="Profile">/g, 'class="nav-dropdown profile-dropdown" id="navProfileLink" style="display: none; margin-right: 15px;" title="Profile">');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Added margin to', f);
  }
});
