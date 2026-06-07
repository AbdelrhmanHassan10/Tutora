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

const oldAuthGuardRegex = /<!-- AUTH GUARD -->[\s\S]*?<\/script>/g;

const newAuthGuardSnippet = `<!-- AUTH GUARD -->
    <script>
        if (!localStorage.getItem('token')) {
            document.addEventListener('DOMContentLoaded', () => {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(10px); animation: fadeIn 0.3s ease;';
                
                const style = document.createElement('style');
                style.textContent = \`
                    @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(10px); } }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                    @keyframes pulseGlow { 0% { text-shadow: 0 0 10px rgba(236,182,19,0.2); } 50% { text-shadow: 0 0 20px rgba(236,182,19,0.6); } 100% { text-shadow: 0 0 10px rgba(236,182,19,0.2); } }
                \`;
                document.head.appendChild(style);

                const modal = document.createElement('div');
                modal.style.cssText = 'background: linear-gradient(145deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98)); border: 1px solid rgba(236, 182, 19, 0.15); padding: 40px; border-radius: 20px; text-align: center; max-width: 420px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1); font-family: "Plus Jakarta Sans", "Inter", sans-serif; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; position: relative; overflow: hidden;';
                
                const glowTop = document.createElement('div');
                glowTop.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, transparent, #ECB613, transparent); opacity: 0.8;';
                
                const icon = document.createElement('span');
                icon.className = 'material-symbols-outlined';
                icon.textContent = 'lock';
                icon.style.cssText = 'font-size: 48px; color: #ECB613; margin-bottom: 20px; display: inline-block; padding: 15px; background: rgba(236, 182, 19, 0.1); border-radius: 50%; animation: pulseGlow 2s infinite;';
                
                const title = document.createElement('h2');
                title.textContent = 'Authentication Required';
                title.style.cssText = 'color: #ffffff; margin-bottom: 12px; font-size: 1.5rem; font-weight: 700; margin-top: 0; letter-spacing: -0.02em;';
                
                const message = document.createElement('p');
                message.textContent = 'Please log in to your account to unlock this feature and enjoy the full experience.';
                message.style.cssText = 'color: #a0a0a0; margin-bottom: 32px; font-size: 1.05rem; line-height: 1.5; font-weight: 400;';
                
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center;';
                
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.style.cssText = 'background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 600; flex: 1; font-size: 1rem; transition: all 0.2s ease;';
                
                const loginBtn = document.createElement('button');
                loginBtn.textContent = 'Log In';
                loginBtn.style.cssText = 'background: #ECB613; color: #000; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 700; flex: 1.5; font-size: 1rem; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(236, 182, 19, 0.3);';
                
                loginBtn.onclick = () => window.location.href = '../2.login/code.html';
                cancelBtn.onclick = () => {
                    if (document.referrer && document.referrer.includes(window.location.host)) {
                        window.history.back();
                    } else {
                        window.location.href = '../4.home/code.html';
                    }
                };
                
                loginBtn.onmouseover = () => { loginBtn.style.transform = 'translateY(-2px)'; loginBtn.style.boxShadow = '0 6px 20px rgba(236, 182, 19, 0.4)'; loginBtn.style.background = '#fcd030'; };
                loginBtn.onmouseout = () => { loginBtn.style.transform = 'translateY(0)'; loginBtn.style.boxShadow = '0 4px 15px rgba(236, 182, 19, 0.3)'; loginBtn.style.background = '#ECB613'; };
                
                cancelBtn.onmouseover = () => { cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)'; };
                cancelBtn.onmouseout = () => { cancelBtn.style.background = 'rgba(255, 255, 255, 0.05)'; };

                btnContainer.appendChild(cancelBtn);
                btnContainer.appendChild(loginBtn);
                
                modal.appendChild(glowTop);
                modal.appendChild(icon);
                modal.appendChild(title);
                modal.appendChild(message);
                modal.appendChild(btnContainer);
                
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
                document.body.style.overflow = 'hidden';
            });
        }
    </script>`;

for (const relPath of targetFiles) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        if (oldAuthGuardRegex.test(content)) {
            content = content.replace(oldAuthGuardRegex, newAuthGuardSnippet);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated Premium Auth Guard in: ${relPath}`);
        }
    } else {
        console.error(`File not found: ${relPath}`);
    }
}
