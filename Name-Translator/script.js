document.addEventListener('DOMContentLoaded', () => {
    // Redundant theme and menu logic removed. Handled by global-core.js.

    // ============================================
    // HIEROGLYPHIC TRANSLATION
    // ============================================
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const hieroglyphDisplay = document.getElementById('hieroglyphDisplay');
    const phoneticText = document.getElementById('phoneticText');

    const hieroglyphMap = {
        'a': '𓀀', 'b': '𓀁', 'c': '𓀂', 'd': '𓀃', 'e': '𓀄',
        'f': '𓀅', 'g': '𓀆', 'h': '𓀇', 'i': '𓀈', 'j': '𓀉',
        'k': '𓀊', 'l': '𓀋', 'm': '𓀌', 'n': '𓀍', 'o': '𓀎',
        'p': '𓀏', 'q': '𓀐', 'r': '𓀑', 's': '𓀒', 't': '𓀓',
        'u': '𓀔', 'v': '𓀕', 'w': '𓀖', 'x': '𓀗', 'y': '𓀘',
        'z': '𓀙'
    };

    const phoneticMap = {
        'a': 'A', 'b': 'B', 'c': 'K', 'd': 'D', 'e': 'E',
        'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J',
        'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O',
        'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T',
        'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y',
        'z': 'Z'
    };

    function translateToHieroglyphics(text) {
        const cleanText = text.toLowerCase().replace(/[^a-z]/g, '');
        let hieroglyphics = '';
        let phonetic = '';

        for (let char of cleanText) {
            if (hieroglyphMap[char]) {
                hieroglyphics += hieroglyphMap[char] + ' ';
                phonetic += phoneticMap[char] + '-';
            }
        }

        return {
            hieroglyphics: hieroglyphics.trim(),
            phonetic: phonetic.slice(0, -1)
        };
    }

    generateBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if (!name) { alert('Please enter a name to translate!'); return; }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('🔐 Authentication required. Please login to use the Royal Cartouche generator.');
            window.location.href = '../2.login/code.html';
            return;
        }

        hieroglyphDisplay.style.opacity = '0';
        phoneticText.style.opacity = '0';
        generateBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Carving...';
        generateBtn.disabled = true;

        try {
            const response = await fetch('https://gem-backend-production-cb6d.up.railway.app/api/ai/name-to-cartouche', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            setTimeout(() => {
                if (response.ok && (data.hieroglyphics || data.cartouche)) {
                    hieroglyphDisplay.textContent = data.hieroglyphics || data.cartouche;
                    phoneticText.textContent = data.phonetic || name;
                } else if (response.status === 401 || response.status === 403) {
                    alert('🔐 Session expired. Please sign in again.');
                    localStorage.removeItem('token');
                    window.location.href = '../2.login/code.html';
                } else {
                    console.warn('API Error, falling back to local translation:', data.message);
                    const localGen = translateToHieroglyphics(name);
                    hieroglyphDisplay.textContent = localGen.hieroglyphics;
                    phoneticText.textContent = localGen.phonetic;
                }
                hieroglyphDisplay.style.opacity = '1';
                phoneticText.style.opacity = '1';
                generateBtn.innerHTML = 'Generate Inscription';
                generateBtn.disabled = false;
            }, 500);
        } catch (error) {
            console.error('API Translation Error, failing back to local:', error);
            const { hieroglyphics, phonetic } = translateToHieroglyphics(name);
            setTimeout(() => {
                hieroglyphDisplay.textContent = hieroglyphics;
                phoneticText.textContent = phonetic || name;
                hieroglyphDisplay.style.opacity = '1';
                phoneticText.style.opacity = '1';
                generateBtn.innerHTML = 'Generate Inscription';
                generateBtn.disabled = false;
            }, 500);
        }
    });

    nameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') generateBtn.click();
    });

    hieroglyphDisplay.style.transition = 'opacity 300ms ease';
    phoneticText.style.transition = 'opacity 300ms ease';

    // ============================================
    // DOWNLOAD BUTTON
    // ============================================
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', () => {
        const hieroglyphText = hieroglyphDisplay.textContent;
        const phoneticTextValue = phoneticText.textContent;
        if (!hieroglyphText || hieroglyphText === '𓀀 𓃠 𓅓 𓏏') { alert('Please generate an inscription first!'); return; }

        const content = `PHARAOH LAB - INSCRIPTION\n\n${hieroglyphText}\n\nPhonetic: ${phoneticTextValue}\n\nGenerated by The Eternal Curator`;
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'inscription.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // ============================================
    // SHARE BUTTON
    // ============================================
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => {
        const hieroglyphText = hieroglyphDisplay.textContent;
        const phoneticTextValue = phoneticText.textContent;
        if (!hieroglyphText || hieroglyphText === '𓀀 𓃠 𓅓 𓏏') { alert('Please generate an inscription first!'); return; }

        const shareText = `Check out my hieroglyphic inscription from PHARAOH LAB:\n${hieroglyphText}\n(${phoneticTextValue})`;

        if (navigator.share) {
            navigator.share({ title: 'PHARAOH LAB Inscription', text: shareText }).catch(err => console.log('Share failed:', err));
        } else {
            navigator.clipboard.writeText(shareText).then(() => alert('Inscription copied to clipboard!')).catch(() => alert('Share not supported on this device'));
        }
    });

    // ============================================
    // ACCOUNT BUTTON
    // ============================================
    const accountBtn = document.getElementById('accountBtn');
    if(accountBtn) {
        accountBtn.addEventListener('click', () => {
            alert('Account feature coming soon!');
        });
    }

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if(scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        scrollTopBtn.style.transition = 'opacity 300ms ease';
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    initializeTheme();
});
