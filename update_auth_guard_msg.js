const fs = require('fs');
const path = require('path');

const targetFiles = [
    'booking/booking.html',
    'AI Guide/guide.html',
    'AI Imagination/AI-Imagination.html',
    'advanced 3D model/advanced-3D.html',
    'artifact_identifier/artifact-identifier.html',
    'Name-Translator/Name-Translator.html',
    'Pharaoh Transformer/Pharaoh-Transformer.html',
    'chat bot/chat.html'
];

const oldAuthGuardRegex = /<!-- AUTH GUARD -->\s*<script>\s*if \(!localStorage\.getItem\('token'\)\) \{\s*(?:\/\/.*?\s*)?window\.location\.href = '\.\.\/2\.login\/code\.html';\s*\}\s*<\/script>/g;

const newAuthGuardSnippet = `<!-- AUTH GUARD -->
    <script>
        if (!localStorage.getItem('token')) {
            alert("يرجى تسجيل الدخول أولاً للاستمتاع بكافة مزايا وخدمات الموقع!\\nPlease login first to enjoy all the features of the site!");
            window.location.href = '../2.login/code.html';
        }
    </script>`;

for (const relPath of targetFiles) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        if (oldAuthGuardRegex.test(content)) {
            content = content.replace(oldAuthGuardRegex, newAuthGuardSnippet);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated Auth Guard in: ${relPath}`);
        } else if (!content.includes('alert(')) {
            console.log(`Could not find exact old guard in: ${relPath}, doing manual replace...`);
             const fallbackRegex = /<!-- AUTH GUARD -->[\s\S]*?<\/script>/;
             content = content.replace(fallbackRegex, newAuthGuardSnippet);
             fs.writeFileSync(fullPath, content);
        }
    } else {
        console.error(`File not found: ${relPath}`);
    }
}
