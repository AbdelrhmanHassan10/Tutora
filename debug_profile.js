const fs = require('fs');
const content = fs.readFileSync('Edit-profile/code.html', 'utf8');

const match = content.match(/<h1[^>]*>.*?<\/h1>|Pharaonic Historian|JOINED/i);
if(match) console.log("Found:", match[0]);
else console.log("Not found in Edit-profile");

const pcontent = fs.readFileSync('Profile/profile.html', 'utf8');
const pmatch = pcontent.match(/<div class=\"profile-info\">[\s\S]*?<\/div>/);
if(pmatch) console.log("Profile Info:", pmatch[0]);
