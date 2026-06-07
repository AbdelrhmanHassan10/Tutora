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
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 999999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(8px);';
                
                const modal = document.createElement('div');
                modal.style.cssText = 'background: #1a1a1a; border: 1px solid #ECB613; padding: 40px 30px; border-radius: 16px; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 15px 40px rgba(0,0,0,0.6); font-family: "Plus Jakarta Sans", "Cairo", sans-serif;';
                
                const icon = document.createElement('span');
                icon.className = 'material-symbols-outlined';
                icon.textContent = 'lock';
                icon.style.cssText = 'font-size: 54px; color: #ECB613; margin-bottom: 20px; display: block;';
                
                const title = document.createElement('h2');
                title.textContent = 'تسجيل الدخول مطلوب';
                title.style.cssText = 'color: #ffffff; margin-bottom: 15px; font-size: 1.6rem; font-weight: bold; margin-top: 0;';
                
                const message = document.createElement('p');
                message.textContent = 'يرجى تسجيل الدخول أولاً للاستمتاع بكافة مزايا وخدمات الموقع.';
                message.style.cssText = 'color: #aaaaaa; margin-bottom: 30px; font-size: 1.1rem; line-height: 1.6;';
                
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;';
                
                const loginBtn = document.createElement('button');
                loginBtn.textContent = 'تسجيل الدخول';
                loginBtn.style.cssText = 'background: #ECB613; color: #000; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1; min-width: 140px; font-size: 1rem; transition: 0.3s;';
                loginBtn.onclick = () => window.location.href = '../2.login/code.html';
                
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'إلغاء (Cancel)';
                cancelBtn.style.cssText = 'background: transparent; color: #ffffff; border: 1px solid #666; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; flex: 1; min-width: 140px; font-size: 1rem; transition: 0.3s;';
                cancelBtn.onclick = () => {
                    if (document.referrer && document.referrer.includes(window.location.host)) {
                        window.history.back();
                    } else {
                        window.location.href = '../4.home/code.html';
                    }
                };
                
                loginBtn.onmouseover = () => { loginBtn.style.transform = 'translateY(-2px)'; loginBtn.style.boxShadow = '0 5px 15px rgba(236, 182, 19, 0.4)'; };
                loginBtn.onmouseout = () => { loginBtn.style.transform = 'translateY(0)'; loginBtn.style.boxShadow = 'none'; };
                cancelBtn.onmouseover = () => { cancelBtn.style.borderColor = '#fff'; cancelBtn.style.transform = 'translateY(-2px)'; };
                cancelBtn.onmouseout = () => { cancelBtn.style.borderColor = '#666'; cancelBtn.style.transform = 'translateY(0)'; };

                btnContainer.appendChild(cancelBtn);
                btnContainer.appendChild(loginBtn);
                
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
            console.log(`Updated Auth Guard Modal in: ${relPath}`);
        }
    } else {
        console.error(`File not found: ${relPath}`);
    }
}
