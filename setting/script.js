document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.remove('light');
            body.classList.add('dark');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'light_mode';
            }
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
            if (themeToggle) {
                const icon = themeToggle.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'dark_mode';
            }
        }
        localStorage.setItem('gem-theme', theme);
    };

    const savedTheme = localStorage.getItem('gem-theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // 2. Text Size Range Logic
    const textSizeRange = document.getElementById('text-size-range');
    const previewText = document.getElementById('preview-text');

    if (textSizeRange && previewText) {
        textSizeRange.addEventListener('input', () => {
            const val = textSizeRange.value;
            if (val == 1) previewText.style.fontSize = '1rem';
            else if (val == 2) previewText.style.fontSize = '1.25rem';
            else if (val == 3) previewText.style.fontSize = '1.75rem';
        });
    }

    // 3. Form Submission
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const originalText = applyBtn.textContent;
            applyBtn.textContent = 'Saving...';
            applyBtn.disabled = true;

            setTimeout(() => {
                applyBtn.textContent = 'Saved!';
                applyBtn.style.backgroundColor = '#22c55e';
                applyBtn.style.color = 'white';

                setTimeout(() => {
                    applyBtn.textContent = originalText;
                    applyBtn.disabled = false;
                    applyBtn.style.backgroundColor = '';
                    applyBtn.style.color = '';
                }, 2000);
            }, 1000);
        });
    }

    // 4. Reset Logic
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (textSizeRange) {
                textSizeRange.value = 2;
                textSizeRange.dispatchEvent(new Event('input'));
            }
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelector('input[value="standard"]').checked = true;
            alert('Settings reset to default.');
        });
    }
});