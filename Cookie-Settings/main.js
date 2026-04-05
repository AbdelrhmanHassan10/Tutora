/**
 * Cookie Preference Manager
 * Handles loading, saving, and applying user cookie settings.
 * Also manages the theme (dark/light mode).
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selectors ---
    const analyticalToggle = document.getElementById('analytical');
    const marketingToggle = document.getElementById('marketing');
    const saveBtn = document.getElementById('save-btn');
    const rejectBtn = document.getElementById('reject-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // --- Constants ---
    const COOKIE_PREFERENCES_KEY = 'gem_cookie_preferences';
    const THEME_KEY = 'gem_theme';

    // ============================================
    // 1. THEME MANAGEMENT
    // ============================================

    /**
     * Applies a theme by adding/removing the 'dark' class from the <html> element.
     * @param {string} theme - The theme to apply ('dark' or 'light').
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
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
    // 2. COOKIE PREFERENCE MANAGEMENT
    // ============================================

    /**
     * Loads saved cookie preferences from localStorage and updates the UI.
     * Defaults to 'analytical' enabled if no settings are found.
     */
    function loadPreferences() {
        const savedPrefsString = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        let prefs = {
            necessary: true,
            analytical: true, // Default to true
            marketing: false  // Default to false
        };

        if (savedPrefsString) {
            try {
                prefs = JSON.parse(savedPrefsString);
            } catch (e) {
                console.error("Could not parse saved cookie preferences.", e);
            }
        }

        analyticalToggle.checked = prefs.analytical;
        marketingToggle.checked = prefs.marketing;
        console.log('Loaded cookie preferences:', prefs);
    }

    /**
     * Saves the current state of the toggles to localStorage.
     */
    function savePreferences() {
        const currentPrefs = {
            necessary: true,
            analytical: analyticalToggle.checked,
            marketing: marketingToggle.checked,
        };

        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(currentPrefs));
        console.log('Saved cookie preferences:', currentPrefs);

        // Provide visual feedback to the user
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Preferences Saved!';
        saveBtn.style.backgroundColor = 'var(--success-color)'; // Use a success color
        saveBtn.disabled = true;

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = ''; // Revert to original color
            saveBtn.disabled = false;
        }, 2000);
    }

    /**
     * Handles the "Reject All" button click by unchecking optional cookies and saving.
     */
    function rejectAllOptional() {
        analyticalToggle.checked = false;
        marketingToggle.checked = false;
        savePreferences(); // Save the new "rejected" state
    }

    // ============================================
    // 3. INITIALIZATION & EVENT LISTENERS
    // ============================================

    function initialize() {
        // --- Attach Event Listeners ---
        if (saveBtn) saveBtn.addEventListener('click', savePreferences);
        if (rejectBtn) rejectBtn.addEventListener('click', rejectAllOptional);
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

        // --- Load Initial State ---
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark mode
        applyTheme(savedTheme);
        loadPreferences();

        console.log("Cookie Preference page initialized successfully.");
    }

    // Run the initialization function
    initialize();
});
function initialize() {
    // --- Attach Event Listeners ---
    if (saveBtn) saveBtn.addEventListener('click', savePreferences);
    if (rejectBtn) rejectBtn.addEventListener('click', rejectAllOptional);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

    // /// الكود الجديد الذي ستضيفه ///
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.back(); // هذا هو الأمر الذي يقوم بالرجوع
        });
    }
    // /// نهاية الكود الجديد ///

    // --- Load Initial State ---
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    loadPreferences();

    console.log("Cookie Preference page initialized successfully.");
}
