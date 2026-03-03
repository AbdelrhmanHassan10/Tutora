document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Open mobile menu
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });

    // Close mobile menu
    function closeMenu() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    document.querySelectorAll('.menu-link').forEach(link => {
        if (!link.classList.contains('dropdown-toggle')) {
            link.addEventListener('click', closeMenu);
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // ============================================
    // MOBILE DROPDOWN TOGGLE
    // ============================================

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.classList.toggle('active');
            const items = toggle.nextElementSibling;
            items.classList.toggle('active');
        });
    });

    // ============================================
    // DARK MODE TOGGLE
    // ============================================

    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        body.classList.remove('light');
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
    }
    updateThemeIcon();

    // Toggle theme
    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIcon();
    });

    // Update icon
    function updateThemeIcon() {
        const icon = themeBtn.querySelector('.material-symbols-outlined');
        icon.textContent = body.classList.contains('dark') ? 'light_mode' : 'dark_mode';
    }

    // ============================================
    // LANGUAGE TOGGLE
    // ============================================

    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            document.querySelectorAll('.language-toggle button').forEach(b => {
                b.classList.remove('active');
            });
            // Add active to clicked button
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('language', lang);
            console.log('Language changed to:', lang);
        });
    });

    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.menu-link, .dropdown-item');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    });
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });

    // Dynamic Chat
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatHistory = document.querySelector('.chat-history');

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-bubble-container';

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="user-bubble-wrapper">
                    <div class="user-bubble">
                        <p class="text-sm leading-relaxed">${text}</p>
                    </div>
                </div>
                <div class="bubble-label user-label">YOU</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-bubble">
                    <p class="text-sm leading-relaxed">${text}</p>
                </div>
                <div class="ai-label-container">
                    <span class="bubble-label ai-label">TORTARA</span>
                    <div class="ai-dot"></div>
                </div>
            `;
        }

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    sendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';

            // Simulate AI response
            setTimeout(() => {
                addMessage("I'm analyzing your request about " + text + ". The database shows several relevant Egyptian artifacts.", 'ai');
            }, 1000);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Visualizer Animation (Simulate activity)
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.height = (Math.random() * 40 + 10) + 'px';
        setInterval(() => {
            bar.style.height = (Math.random() * 40 + 10) + 'px';
        }, 500 + (index * 100));
    });
});