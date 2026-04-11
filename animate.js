document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    const elementsToAnimate = document.querySelectorAll('.artifact-card, .visit-card, .timeline-item, .hero-content h1');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        if(index % 3 === 1) el.classList.add('delay-100');
        if(index % 3 === 2) el.classList.add('delay-200');
        observer.observe(el);
    });
});
