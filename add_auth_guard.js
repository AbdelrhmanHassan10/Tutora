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

const authGuardSnippet = `
    <!-- AUTH GUARD -->
    <script>
        if (!localStorage.getItem('token')) {
            // Check if already on login page to avoid infinite loops, though these are not login pages.
            window.location.href = '../2.login/code.html';
        }
    </script>
`;

for (const relPath of targetFiles) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Check if guard already exists to avoid duplicates
        if (!content.includes('<!-- AUTH GUARD -->')) {
            // Insert right after <head>
            content = content.replace(/<head>/i, `<head>${authGuardSnippet}`);
            fs.writeFileSync(fullPath, content);
            console.log(`Added Auth Guard to: ${relPath}`);
        } else {
            console.log(`Auth Guard already exists in: ${relPath}`);
        }
    } else {
        console.error(`File not found: ${relPath}`);
    }
}
