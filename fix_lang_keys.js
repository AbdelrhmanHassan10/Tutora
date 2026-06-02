const fs = require('fs');

let content = fs.readFileSync('global-lang.js', 'utf8');

const artifacts = [
    "Reserve Head",
    "Ptah-Sokar-Osiris",
    "Statue of Senusret I",
    "Block Statue",
    "Victory Stele of Merneptah",
    "Colossal Ramses II",
    "Colossus of a Ptolemaic King",
    "Colossus of a Ptolemaic Queen",
    "Granite Column of Merneptah"
];

let modifications = 0;

artifacts.forEach(art => {
    const spaceKey = '"' + art + '":';
    const underscoreKey = '"' + art.replace(/\s+/g, '_') + '":';
    
    // Replace all occurrences of spaceKey with underscoreKey
    if (content.includes(spaceKey)) {
        content = content.split(spaceKey).join(underscoreKey);
        modifications++;
    }
});

fs.writeFileSync('global-lang.js', content, 'utf8');
console.log('Fixed ' + modifications + ' artifacts keys in global-lang.js');
