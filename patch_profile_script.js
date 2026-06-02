const fs = require('fs');
let content = fs.readFileSync('Profile/script.js', 'utf8');

// Fix Bio text replacement
content = content.replace(
    "if (bioText && user.bio) bioText.textContent = user.bio;",
    "if (bioText && user.bio) { bioText.innerHTML = `<span data-i18n=\"profile.pharaonic_historian\">${user.bio}</span>`; }"
);

// Fix Join Date text replacement
content = content.replace(
    "if (heroJoinDate) heroJoinDate.textContent = `Joined ${date}`;",
    `if (heroJoinDate) {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                const dateOpts = { month: 'long', year: 'numeric' };
                const formattedDate = new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', dateOpts);
                const prefix = lang === 'ar' ? 'انضم في ' : 'Joined ';
                heroJoinDate.innerHTML = \`<span data-i18n="profile.joined">\${prefix}\${formattedDate}</span>\`;
            }`
);

fs.writeFileSync('Profile/script.js', content, 'utf8');
console.log('Profile/script.js updated');
