const fs = require('fs');

let langContent = fs.readFileSync('global-lang.js', 'utf8');

// The string literal "\\n" was literally injected.
// Replace it with an actual newline character
langContent = langContent.split('\\\\n').join(String.fromCharCode(10));

fs.writeFileSync('global-lang.js', langContent, 'utf8');
console.log('global-lang.js fixed');
