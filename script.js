document.addEventListener('DOMContentLoaded', () => {
    const dustContainer = document.getElementById('dust-container');
    const header = document.querySelector('.glass-header');
    const heroContent = document.querySelector('.hero-content');

    // 1. Generate Atmospheric Dust Particles (Ultra-Lightweight Sparkles)
    const createDust = () => {
        if (!dustContainer) return;
        const particleCount = window.innerWidth > 768 ? 40 : 20; 
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 1.5 + 0.5;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.animationDuration = (Math.random() * 10 + 10) + 's';
            dust.style.animationDelay = (Math.random() * -15) + 's';
            dustContainer.appendChild(dust);
        }
    };

    // 2. Cinematic Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.padding = '0.8rem 3rem'; 
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
            header.style.padding = '1.5rem 3rem';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });

    // 3. Lightweight 3D Parallax
    if (window.innerWidth > 1024) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
                    if (heroContent) {
                        heroContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    window.initRoyalAtmosphere = () => {
        if (dustContainer) dustContainer.innerHTML = '';
        createDust();
    };

    window.initRoyalAtmosphere();
});