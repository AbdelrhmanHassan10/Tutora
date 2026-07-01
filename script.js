document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.glass-header');
    const heroContent = document.querySelector('.hero-content');

    // 1. Generate Atmospheric Dust Particles (Ultra-Lightweight Sparkles) & Historical Shapes
    function initRoyalAtmosphere() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // Dust Container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.appendChild(particlesContainer);

        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            const size = Math.random() * 3 + 1; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particlesContainer.appendChild(particle);
        }

        // Historical Shapes Container
        const shapes = ['𓀀', '𓁏', '𓃭', '𓆣', '𓋹', '𓍹', '𓎡', '𓏏', '𓐍', '𓎟', '𓂋', '𓊽', '𓃾'];
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'shapes-container';
        heroSection.appendChild(shapesContainer);

        const shapeCount = 15;
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'historical-shape';
            shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animationDelay = `${Math.random() * 10}s`;
            shape.style.animationDuration = `${Math.random() * 20 + 20}s`;
            
            // Initial random styling setup
            const scale = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
            const rotation = Math.random() * 360;
            // The animation will overwrite transform unless we use a wrapper, but we can set custom props or simplify
            // Let's use a wrapper for the shape so we can rotate the wrapper, and float the container.
            const wrapper = document.createElement('div');
            wrapper.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            wrapper.appendChild(shape);

            // We apply animation to wrapper instead
            wrapper.className = 'historical-shape-wrapper';
            wrapper.style.position = 'absolute';
            wrapper.style.left = `${Math.random() * 100}%`;
            wrapper.style.top = `${Math.random() * 100}%`;
            wrapper.style.animation = `floatShape ${Math.random() * 20 + 20}s linear infinite`;
            wrapper.style.animationDelay = `${Math.random() * 10}s`;
            
            shapesContainer.appendChild(wrapper);
        }
    }
    
    initRoyalAtmosphere();

    // 2. Cinematic Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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

    window.initRoyalAtmosphere = initRoyalAtmosphere;
});