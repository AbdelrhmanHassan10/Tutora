  const body = document.body;
 const mobileMenuClose = document.getElementById('mobileMenuClose');
 const header = document.querySelector('.main-nav');
const themeBtn = document.querySelector('.theme-btn');
  // ============================================
 // DARK MODE TOGGLE
 // ============================================
const root = document.documentElement; // بدل body

// Check saved theme

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    root.classList.add('dark-mode');
    updateThemeIcon();
}

themeBtn.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    const isDark = root.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');
    if (root.classList.contains('dark-mode')) {
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
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLanguage);
    });
}
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
    // 3. AI Generation Simulation
    const visualizeBtn = document.querySelector('.btn-visualize');
    const promptArea = document.querySelector('.prompt-area');
    const mainImg = document.querySelector('.main-display-img');
    const computeTime = document.querySelector('.compute-time-val');
    const manifestationId = document.querySelector('.manifestation-id-val');

    visualizeBtn?.addEventListener('click', async () => {
        const prompt = promptArea.value.trim();
        if (!prompt) {
            alert('Please enter an invocation to visualize.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('🔐 Authentication required. Please login to manifest your imagination.');
            window.location.href = '../2.login/code.html';
            return;
        }

        // Visual feedback
        const originalContent = visualizeBtn.innerHTML;
        visualizeBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Manifesting...';
        visualizeBtn.style.pointerEvents = 'none';
        mainImg.style.filter = 'blur(10px) grayscale(1)';
        mainImg.style.transition = 'all 2s ease';

        try {
            const response = await fetch('https://gem-backend-production-cb6d.up.railway.app/api/ai/story-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ story: prompt })
            });

            const data = await response.json();
            
            if(response.ok && (data.imageUrl || data.image)) {
                mainImg.src = data.imageUrl || data.image; 
                console.log('Manifestation complete for: ' + prompt);
            } else if (response.status === 401 || response.status === 403) {
                alert('🔐 Session expired. Please sign in again.');
                localStorage.removeItem('token');
                window.location.href = '../2.login/code.html';
            } else {
                alert(data.message || 'Manifestation failed to conjure image. The AI realm is currently unstable.');
            }
        } catch (error) {
            console.error('AI Manifestation Error:', error);
            alert('⚠️ Network connection to the AI realm failed.');
        } finally {
            // Reset button
            visualizeBtn.innerHTML = originalContent;
            visualizeBtn.style.pointerEvents = 'auto';
            
            // Update UI
            mainImg.style.filter = 'none';
            computeTime.textContent = (Math.random() * (5 - 2) + 2).toFixed(1) + ' SECONDS';
            manifestationId.textContent = 'ID: ' + Math.floor(1000 + Math.random() * 9000) + '-X';
        }
    });

    // 4. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.input-card, .history-item, .display-module, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // 5. Gallery Interactions
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const newSrc = item.querySelector('img')?.src;
            if (newSrc && mainImg) {
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.src = newSrc;
                    mainImg.style.opacity = '1';
                }, 300);
            }
        });
    });
 
 
// =============================
// THEME INIT
// =============================
 
// Default = dark
if (savedTheme === 'light') {
    body.classList.add('light');
} else {
    body.classList.add('dark');
}

updateThemeIcon();

// =============================
// TOGGLE THEME
// =============================
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');

    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeBtn.querySelector('.material-symbols-outlined');

    if (body.classList.contains('dark')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}
