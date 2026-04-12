
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ AI Imagination Lab Initialized');

    // 1. AI Generation Simulation
    const visualizeBtn = document.querySelector('.btn-visualize');
    const promptArea = document.querySelector('.prompt-area');
    const mainImg = document.querySelector('.main-display-img');
    const computeTime = document.querySelector('.compute-time-val');
    const manifestationId = document.querySelector('.manifestation-id-val');

    visualizeBtn?.addEventListener('click', async () => {
        const prompt = promptArea.value.trim();
        if (!prompt) {
            alert('Please enter an invocation to visualize.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('🔐 Authentication required. Please login to manifest your imagination.');
            window.location.href = '../2.login/code.html';
            return;
        }

        // Visual feedback
        const originalContent = visualizeBtn.innerHTML;
        visualizeBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Manifesting...';
        visualizeBtn.style.pointerEvents = 'none';
        
        // Premium transition
        mainImg.style.filter = 'blur(20px) brightness(0.5)';
        mainImg.style.scale = '1.05';

        try {
            const response = await fetch('https://gem-backend-production-cb6d.up.railway.app/api/ai/story-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ story: prompt })
            });

            const data = await response.json();
            
            if(response.ok && (data.imageUrl || data.image)) {
                const newImg = new Image();
                newImg.src = data.imageUrl || data.image;
                newImg.onload = () => {
                    mainImg.src = newImg.src;
                    mainImg.style.filter = 'none';
                    mainImg.style.scale = '1';
                    console.log('Manifestation complete for: ' + prompt);
                };
            } else if (response.status === 401 || response.status === 403) {
                alert('🔐 Session expired. Please sign in again.');
                localStorage.removeItem('token');
                window.location.href = '../2.login/code.html';
            } else {
                alert(data.message || 'Manifestation failed to conjure image. The AI realm is currently unstable.');
            }
        } catch (error) {
            console.error('AI Manifestation Error:', error);
            alert('⚠️ Network connection to the AI realm failed.');
        } finally {
            visualizeBtn.innerHTML = originalContent;
            visualizeBtn.style.pointerEvents = 'auto';
            
            // Revert visual state if failed
            if (mainImg.style.filter !== 'none') {
                mainImg.style.filter = 'none';
                mainImg.style.scale = '1';
            }

            computeTime.textContent = (Math.random() * (5 - 2) + 2).toFixed(1) + ' SECONDS';
            manifestationId.textContent = 'ID: ' + Math.floor(1000 + Math.random() * 9000) + '-X';
        }
    });

    // 2. Gallery Interactions
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const newSrc = item.querySelector('img')?.src;
            if (newSrc && mainImg) {
                mainImg.style.opacity = '0.5';
                mainImg.style.filter = 'blur(10px)';
                
                setTimeout(() => {
                    mainImg.src = newSrc;
                    mainImg.style.opacity = '1';
                    mainImg.style.filter = 'none';
                }, 400);
            }
        });
    });

    // 3. Scroll Reveal Animation (Enhanced)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.input-card, .history-item, .display-module, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });
});
