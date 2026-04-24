document.addEventListener('DOMContentLoaded', () => {
    const dustContainer = document.getElementById('dust-container');
    const shapesContainer = document.getElementById('shapes-container');
    const cursorGlow = document.getElementById('cursorGlow');
    const formCard = document.getElementById('formCard');

    // 1. Visual Engine
    if (window.innerWidth > 1024) {
        if (formCard) formCard.style.transform = `rotateY(5deg) rotateX(2deg)`;
        document.addEventListener('mousemove', (e) => {
            if (cursorGlow) {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }
        });
    }

    const createDust = () => {
        if (!dustContainer) return;
        for (let i = 0; i < 40; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.left = Math.random() * 100 + 'vw';
            dust.style.top = Math.random() * 100 + 'vh';
            dust.style.animationDelay = (Math.random() * -12) + 's';
            dustContainer.appendChild(dust);
        }
    };

    const createShapes = () => {
        if (!shapesContainer) return;
        for (let i = 0; i < 10; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.style.left = Math.random() * 100 + 'vw';
            shape.style.animationDelay = (Math.random() * -20) + 's';
            shapesContainer.appendChild(shape);
        }
    };

    createDust();
    createShapes();
});
