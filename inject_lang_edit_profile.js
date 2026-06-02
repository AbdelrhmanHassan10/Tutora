const fs = require('fs');
let htmlContent = fs.readFileSync('Edit-profile/code.html', 'utf8');

const themeToggleRegex = /<button class="theme-toggle"[^>]*>[\s\S]*?<\/button>/;

const replacement = `<button class="icon-btn" id="langBtn" title="Language" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: background-color 0.3s ease; margin-right: 10px;">
                                                    <span class="material-symbols-outlined">language</span>
                                                </button>
                                                $&`;

if (!htmlContent.includes('id="langBtn"')) {
    htmlContent = htmlContent.replace(themeToggleRegex, replacement);
    fs.writeFileSync('Edit-profile/code.html', htmlContent, 'utf8');
    console.log('langBtn injected into Edit-profile/code.html');
} else {
    console.log('langBtn already present.');
}
