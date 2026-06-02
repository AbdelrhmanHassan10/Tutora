const fs = require('fs');

let content = fs.readFileSync('Profile/profile.html', 'utf8');

// Undo the incorrect insertion
const badInsertion = `                                        <button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease;">
        <span class="material-symbols-outlined">language</span>
    </button>

    <button class="theme-toggle" id="themeToggle">
        <span class="material-symbols-outlined">light_mode</span>
    </button>`;

content = content.replace(badInsertion + '\\n', '');

// Now do the correct insertion
const target = `<button class="theme-toggle" id="themeToggle">
                                                    <span class="material-symbols-outlined">light_mode</span>
                                                </button>`;

const replacement = `<button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 10px;">
                                                    <span class="material-symbols-outlined">language</span>
                                                </button>
                                                <button class="theme-toggle" id="themeToggle">
                                                    <span class="material-symbols-outlined">light_mode</span>
                                                </button>`;

content = content.replace(target, replacement);

fs.writeFileSync('Profile/profile.html', content, 'utf8');
console.log('Profile/profile.html updated successfully');
