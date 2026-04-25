document.addEventListener('DOMContentLoaded', () => {
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const header = document.querySelector('.glass-header');
    const heroContent = document.querySelector('.hero-content');

    // 1. Generate Atmospheric Dust Particles
    const createDust = () => {
        if (!dustContainer) return;
        const particleCount = window.innerWidth > 768 ? 40 : 20;
        for (let i = 0; i < particleCount; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dust.style.opacity = Math.random() * 0.5 + 0.1;
            dustContainer.appendChild(dust);
        }
    };

    // 2. Generate Royal Pharaonic Shapes
    const createShapes = () => {
        if (!shapesContainer) return;
        const shapeCount = window.innerWidth > 768 ? 12 : 6;
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            shape.style.top = Math.random() * 100 + 'vh';
            shape.style.animationDelay = (Math.random() * -20) + 's';
            const scale = Math.random() * 0.5 + 0.5;
            shape.style.transform = `scale(${scale})`;
            shapesContainer.appendChild(shape);
        }
    };

    // 3. Cinematic Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.padding = '1rem 3rem';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
            header.style.padding = '1.5rem 3rem';
            header.style.boxShadow = 'none';
        }
    });

    // 4. 3D Parallax Mouse Tracking
    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            if (heroContent) {
                heroContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }

            // Interactive Dust response
            const particles = document.querySelectorAll('.dust-particle');
            particles.forEach(p => {
                const rect = p.getBoundingClientRect();
                const dx = e.clientX - rect.left;
                const dy = e.clientY - rect.top;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - dist) / 150;
                    p.style.transform = `translate(${-Math.cos(angle) * 30 * force}px, ${-Math.sin(angle) * 30 * force}px)`;
                } else {
                    p.style.transform = '';
                }
            });
        });
    }

    // Initialize
    createDust();
    createShapes();
});