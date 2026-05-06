document.addEventListener('DOMContentLoaded', () => {
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const header = document.querySelector('.glass-header');
    const heroContent = document.querySelector('.hero-content');

    // 1. Generate Atmospheric Dust Particles (Optimized Counts)
    const createDust = () => {
        if (!dustContainer) return;
        // Significantly reduced counts for better performance
        const particleCount = window.innerWidth > 768 ? 15 : 8; 
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 2 + 1;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dust.style.opacity = Math.random() * 0.3 + 0.1;
            dustContainer.appendChild(dust);
        }
    };

    // 2. Generate Royal Pharaonic Shapes (Optimized Counts)
    const createShapes = () => {
        if (!shapesContainer) return;
        // Reduced shape count to lighten the DOM
        const shapeCount = window.innerWidth > 768 ? 6 : 3;
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            shape.style.top = Math.random() * 100 + 'vh';
            shape.style.animationDelay = (Math.random() * -20) + 's';
            const scale = Math.random() * 0.4 + 0.3;
            shape.style.transform = `scale(${scale})`;
            shapesContainer.appendChild(shape);
        }
    };

    // 3. Cinematic Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.padding = '0.8rem 3rem'; // Slightly tighter on scroll
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
            header.style.padding = '1.5rem 3rem';
            header.style.boxShadow = 'none';
        }
    }, { passive: true }); // Improved scroll performance

    // 4. Lightweight 3D Parallax
    if (window.innerWidth > 1024) {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 40; // Reduced intensity
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

    // Initialize
    createDust();
    createShapes();
});