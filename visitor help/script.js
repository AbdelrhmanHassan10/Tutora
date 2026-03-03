 document.addEventListener('DOMContentLoaded', () => {

     // --- 1. THEME MANAGEMENT (CORRECTED & UNIFIED) ---
     const themeToggle = document.getElementById('theme-toggle');
     const body = document.body;

     if (themeToggle) {
         const themeIcon = themeToggle.querySelector('.material-symbols-outlined');

         const applyTheme = (theme) => {
             // Use 'light' and 'dark' to match the new clean CSS
             body.classList.remove('dark', 'light');
             body.classList.add(theme);

             if (themeIcon) {
                 themeIcon.textContent = (theme === 'dark') ? 'light_mode' : 'dark_mode';
             }
             localStorage.setItem('gem-theme', theme);
         };

         const savedTheme = localStorage.getItem('gem-theme') || 'dark';
         applyTheme(savedTheme);

         themeToggle.addEventListener('click', () => {
             const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
             applyTheme(newTheme);
         });
     }

     // --- 2. MOBILE MENU FUNCTIONALITY (CORRECTED & UNIFIED) ---
     const menuBtn = document.getElementById('menuBtn');
     const closeBtn = document.getElementById('closeBtn');
     const mobileMenu = document.getElementById('mobileMenu');
     const menuOverlay = document.getElementById('menuOverlay');

     const openMenu = () => {
         if (mobileMenu && menuOverlay) {
             mobileMenu.classList.add('open'); // This now matches the CSS
             menuOverlay.classList.add('open');
             document.body.style.overflow = 'hidden';
         }
     };

     const closeMenu = () => {
         if (mobileMenu && menuOverlay) {
             mobileMenu.classList.remove('open');
             menuOverlay.classList.remove('open');
             document.body.style.overflow = '';
         }
     };

     if (menuBtn) menuBtn.addEventListener('click', openMenu);
     if (closeBtn) closeBtn.addEventListener('click', closeMenu);
     if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

     document.querySelectorAll('.menu-link').forEach(link => {
         link.addEventListener('click', closeMenu);
     });

     // --- (Add any other JS functionalities you need here) ---

     console.log("✅ All systems are running correctly!");
 }); // ==== LANGUAGE TOGGLE ====
 const langBtns = document.querySelectorAll('.language-toggle button');
 const savedLang = localStorage.getItem('language');
 if (savedLang) {
     langBtns.forEach(btn => {
         btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
     });
 }

 langBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         langBtns.forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
         localStorage.setItem('language', btn.getAttribute('data-lang'));
     });
 });

 // ============================================
 // SMOOTH SCROLL FOR NAVIGATION
 // ============================================

 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
         const href = this.getAttribute('href');
         if (href !== '#' && document.querySelector(href)) {
             e.preventDefault();
             const target = document.querySelector(href);
             target.scrollIntoView({
                 behavior: 'smooth',
                 block: 'start'
             });
         }
     });
 });

 // ============================================
 // BUTTON INTERACTIONS
 // ============================================

 // Learn More buttons
 document.querySelectorAll('.btn-learn').forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();
         console.log('Learn More clicked');
         // Add ripple effect
         addRipple(btn, e);
     });
 });

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

 // 2. Mobile Menu Logic
 const menuToggle = document.getElementById('menu-toggle');
 const closeMenu = document.getElementById('close-menu');
 const mobileNav = document.getElementById('mobile-nav');

 if (menuToggle && mobileNav) {
     menuToggle.addEventListener('click', () => {
         mobileNav.classList.add('open');
         document.body.style.overflow = 'hidden';
     });
 }

 if (closeMenu && mobileNav) {
     closeMenu.addEventListener('click', () => {
         mobileNav.classList.remove('open');
         document.body.style.overflow = '';
     });
 }

 // 3. Tab Switching Logic
 const tabs = document.querySelectorAll('.tab');
 tabs.forEach(tab => {
     tab.addEventListener('click', () => {
         tabs.forEach(t => t.classList.remove('active'));
         tab.classList.add('active');
         // Simulation of filtering
     });
 });

 // 4. Search Filter Logic
 const searchInput = document.getElementById('faq-search');
 const faqItems = document.querySelectorAll('.faq-item');

 if (searchInput) {
     searchInput.addEventListener('input', (e) => {
         const term = e.target.value.toLowerCase();
         faqItems.forEach(item => {
             const text = item.textContent.toLowerCase();
             item.style.display = text.includes(term) ? 'block' : 'none';
         });
     });
 }