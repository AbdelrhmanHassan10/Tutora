/**
 * Terms of Service Page Manager
 * Handles theme switching, back button, and active navigation highlighting on scroll.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selectors ---
    const backBtn = document.getElementById('back-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // --- Constants ---
    const THEME_KEY = 'gem_theme';

    // ============================================
    // 1. THEME MANAGEMENT
    // ============================================

    /**
     * Applies a theme by adding/removing the 'dark' class from the <html> element.
     * @param {string} theme - The theme to apply ('dark' or 'light').
     */
    function applyTheme(theme) {
        htmlElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem(THEME_KEY, theme);
        console.log(`Theme set to: ${theme}`);
    }

    /**
     * Toggles the current theme and saves the preference.
     */
    function toggleTheme() {
        const isDarkMode = htmlElement.classList.contains('dark');
        applyTheme(isDarkMode ? 'light' : 'dark');
    }

    // ============================================
    // 2. NAVIGATION & SCROLLSPY
    // ============================================

    /**
     * Implements a "scrollspy" to highlight the active navigation link
     * based on the current scroll position.
     */
    function initializeScrollspy() {
        if (navItems.length === 0 || contentSections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            let activeSectionId = null;

            // Find the topmost visible section
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!activeSectionId) { // Prioritize the first one that's intersecting
                        activeSectionId = entry.target.getAttribute('id');
                    }
                }
            });
            
            // If a section is active, update the nav
            if (activeSectionId) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }

        }, {
            rootMargin: '-20% 0px -80% 0px', // A narrow band at the top of the viewport
            threshold: 0
        });

        contentSections.forEach(section => {
            observer.observe(section);
        });
    }

    // ============================================
    // 3. INITIALIZATION & EVENT LISTENERS
    // ============================================

    function initialize() {
        // --- Attach Event Listeners ---
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                history.back(); // Simple and effective way to go back
            });
        }

        // --- Load Initial State ---
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark mode
        applyTheme(savedTheme);

        // --- Initialize Features ---
        initializeScrollspy();

        console.log("Terms of Service page initialized successfully.");
    }

    // Run the initialization function
    initialize();
});
