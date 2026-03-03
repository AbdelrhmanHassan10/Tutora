 const body = document.body;
 const mobileMenuClose = document.getElementById('mobileMenuClose');
 const header = document.querySelector('.main-nav');

 // ============================================
 // DARK MODE TOGGLE
 // ============================================

 const themeBtn = document.getElementById('themeBtn');

 // Check for saved theme preference
 const savedTheme = localStorage.getItem('theme');
 if (savedTheme === 'dark') {
     body.classList.add('dark-mode');
     updateThemeIcon();
 }

 // Toggle dark mode
 themeBtn.addEventListener('click', () => {
     body.classList.toggle('dark-mode');
     const isDark = body.classList.contains('dark-mode');
     localStorage.setItem('theme', isDark ? 'dark' : 'light');
     updateThemeIcon();
 });

 // Update theme icon
 function updateThemeIcon() {
     const icon = themeBtn.querySelector('.material-symbols-outlined');
     if (body.classList.contains('dark-mode')) {
         icon.textContent = 'light_mode';
     } else {
         icon.textContent = 'dark_mode';
     }
 }

 // ============================================
 // LANGUAGE TOGGLE
 // ============================================

 document.querySelectorAll('.language-toggle button').forEach(btn => {
     btn.addEventListener('click', () => {
         // Remove active from all buttons
         document.querySelectorAll('.language-toggle button').forEach(b => {
             b.classList.remove('active');
         });
         // Add active to clicked button
         btn.classList.add('active');
         const lang = btn.getAttribute('data-lang');
         localStorage.setItem('language', lang);
         console.log('Language changed to:', lang);
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
 // INIT
 // ============================================

 document.addEventListener('DOMContentLoaded', () => {
     console.log('✓ Tortara Navbar Loaded');
 });
 // ============================================
 // MOBILE MENU TOGGLE
 // ============================================

 const menuBtn = document.getElementById('menuBtn');
 const closeBtn = document.getElementById('closeBtn');
 const mobileMenu = document.getElementById('mobileMenu');
 const menuOverlay = document.querySelector('.menu-overlay');

 if (menuBtn) {
     menuBtn.addEventListener('click', () => {
         mobileMenu.classList.add('active');
         if (menuOverlay) {
             menuOverlay.classList.add('active');
         }
         document.body.style.overflow = 'hidden';
     });
 }

 if (closeBtn) {
     closeBtn.addEventListener('click', () => {
         mobileMenu.classList.remove('active');
         if (menuOverlay) {
             menuOverlay.classList.remove('active');
         }
         document.body.style.overflow = 'auto';
     });
 }

 // Close menu when clicking overlay
 if (menuOverlay) {
     menuOverlay.addEventListener('click', () => {
         mobileMenu.classList.remove('active');
         menuOverlay.classList.remove('active');
         document.body.style.overflow = 'auto';
     });
 }

 // Close menu when clicking on a link
 const menuLinks = document.querySelectorAll('.menu-link, .dropdown-item');
 menuLinks.forEach(link => {
     link.addEventListener('click', () => {
         mobileMenu.classList.remove('active');
         if (menuOverlay) {
             menuOverlay.classList.remove('active');
         }
         document.body.style.overflow = 'auto';
     });
 });

 // ============================================
 // MOBILE DROPDOWN TOGGLE
 // ============================================

 const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
 dropdownToggles.forEach(toggle => {
     toggle.addEventListener('click', (e) => {
         e.stopPropagation();

         const dropdownItems = toggle.nextElementSibling;
         if (dropdownItems && dropdownItems.classList.contains('dropdown-items')) {
             // Close other dropdowns
             document.querySelectorAll('.dropdown-items.show').forEach(item => {
                 if (item !== dropdownItems) {
                     item.classList.remove('show');
                     item.previousElementSibling.classList.remove('active');
                 }
             });

             // Toggle current dropdown
             dropdownItems.classList.toggle('show');
             toggle.classList.toggle('active');
         }
     });
 });

 // Close dropdown when clicking outside
 document.addEventListener('click', (e) => {
     if (!e.target.closest('.menu-dropdown') && !e.target.closest('.dropdown-items')) {
         document.querySelectorAll('.dropdown-items.show').forEach(item => {
             item.classList.remove('show');
             item.previousElementSibling.classList.remove('active');
         });
     }
 });

 // ============================================
 // DESKTOP DROPDOWN HOVER
 // ============================================

 const navDropdowns = document.querySelectorAll('.nav-dropdown');
 navDropdowns.forEach(dropdown => {
     dropdown.addEventListener('mouseenter', () => {
         const menu = dropdown.querySelector('.dropdown-menu');
         if (menu) {
             menu.style.opacity = '1';
             menu.style.visibility = 'visible';
         }
     });

     dropdown.addEventListener('mouseleave', () => {
         const menu = dropdown.querySelector('.dropdown-menu');
         if (menu) {
             menu.style.opacity = '0';
             menu.style.visibility = 'hidden';
         }
     });
 });