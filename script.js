document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.glass-header');
    const heroContent = document.querySelector('.hero-content');

    // 1. Generate Atmospheric Dust Particles (Ultra-Lightweight Sparkles)
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
        };

    });