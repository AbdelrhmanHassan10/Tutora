document.addEventListener('DOMContentLoaded', () => {
    // Redundant theme and navigation logic removed. Handled by global-core.js.


 // Action buttons
 document.querySelectorAll('.btn-action-gold, .btn-action-turquoise').forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();
         console.log('Action button clicked');
         addRipple(btn, e);
     });
 });

 // Primary and Accent buttons
 document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
     btn.addEventListener('click', (e) => {
         console.log('Button clicked:', btn.textContent);
         addRipple(btn, e);
     });
 });




 // ============================================
 // SEARCH INPUT UX
 // ============================================

 const searchInput = document.querySelector('.search-input');

 if (searchInput) {
     searchInput.addEventListener('focus', () => {
         searchInput.parentElement.style.boxShadow =
             '0 0 12px rgba(242, 204, 13, 0.3)';
     });

     searchInput.addEventListener('blur', () => {
         searchInput.parentElement.style.boxShadow = 'none';
     });

     searchInput.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') {
             console.log('Search:', searchInput.value);
         }
     });
 }

 // ============================================
 // OPTIONAL: CLICK ANIMATION FOR ICON BUTTONS
 // ============================================

 document.querySelectorAll('.icon-btn').forEach(btn => {
     btn.addEventListener('click', () => {
         btn.style.transform = 'scale(0.9)';
         setTimeout(() => {
             btn.style.transform = 'scale(1)';
         }, 100);
     });
 });

 // ============================================
    // 5. Button Interaction Feedback
    document.querySelectorAll('.gold-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.textContent;
            btn.textContent = 'Loading ...';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.pointerEvents = 'auto';
             }, 1500);
        });
    });
 });
