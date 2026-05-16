document.addEventListener('DOMContentLoaded', () => {
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

    createShapes();
});
