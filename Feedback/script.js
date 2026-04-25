document.addEventListener("DOMContentLoaded", () => {

    /* ============================================
       MOBILE NAVIGATION
       ============================================ */

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    function openMenu() {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.add("open");
            menuOverlay.classList.add("open");
            document.body.style.overflow = "hidden";
        }
    }

    function closeMenu() {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.remove("open");
            menuOverlay.classList.remove("open");
            document.body.style.overflow = "";
        }
    }

    menuBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    menuOverlay?.addEventListener("click", closeMenu);

    // Auto-close menu on link click
    document.querySelectorAll(".menu-link").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    /* ============================================
       RATING SYSTEM
       ============================================ */

    const ratingItems = document.querySelectorAll(".fb-rating-item");

    ratingItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active from all
            ratingItems.forEach(i => {
                i.classList.remove("active");
                const icon = i.querySelector(".material-symbols-outlined");
                if (icon) icon.classList.remove("fb-filled-icon");
            });

            // Add active to current
            item.classList.add("active");
            const icon = item.querySelector(".material-symbols-outlined");
            if (icon) icon.classList.add("fb-filled-icon");
        });
    });

    /* ============================================
       CHARACTER COUNT
       ============================================ */

    const textarea = document.getElementById("feedbackText");
    const charCount = document.getElementById("charCount");

    if (textarea && charCount) {
        textarea.addEventListener("input", () => {
            const length = textarea.value.length;
            charCount.textContent = `${length} / 1000`;

            if (length > 900) {
                charCount.style.color = "#ecb613"; // Gold warning
            } else if (length > 1000) {
                charCount.style.color = "#FF4B4B"; // Red error
            } else {
                charCount.style.color = "";
            }
        });
    }

    /* ============================================
       CATEGORY SELECTION
       ============================================ */

    const categoryBtns = document.querySelectorAll(".fb-category-btn");

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
        });
    });

    /* ============================================
       SUBMISSION & SUCCESS STATE
       ============================================ */

    const submitBtn = document.getElementById("submitFeedback");
    const formWrapper = document.querySelector(".fb-form-wrapper");
    const heroSection = document.querySelector(".fb-hero");
    const successState = document.getElementById("successState");

    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            const activeRating = document.querySelector(".fb-rating-item.active");
            
            if (!activeRating) {
                // Shake effect or feedback for selection
                document.querySelector(".fb-rating-container").classList.add("shake");
                setTimeout(() => document.querySelector(".fb-rating-container").classList.remove("shake"), 500);
                return;
            }

            // Visual feedback for sending
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> <span>Storing Insights...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // Simulate database storage transition
            setTimeout(() => {
                // Hide Form and Hero
                if (formWrapper) formWrapper.style.display = "none";
                if (heroSection) heroSection.style.display = "none";
                
                // Show Success State
                if (successState) {
                    successState.style.display = "block";
                    successState.classList.add("animate__animated", "animate__fadeInUp");
                    
                    // Scroll to top of container
                    window.scrollTo({ top: 100, behavior: "smooth" });
                }
            }, 1800);
        });
    }
    /* ============================================
       ROYAL ATMOSPHERE (Standardized - Local)
       ============================================ */
    function createDust() {
        const container = document.getElementById('dust-container');
        if (!container) return;
        const count = 50;
        for (let i = 0; i < count; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            const size = Math.random() * 3 + 1;
            dust.style.width = `${size}px`;
            dust.style.height = `${size}px`;
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            dust.style.opacity = Math.random() * 0.5;
            dust.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
            container.appendChild(dust);
        }
    }

    function createShapes() {
        const container = document.getElementById('shapes-container');
        if (!container) return;
        const glyphs = ['𓂀', '𓋹', '𓅓', '𓃻', '𓊽'];
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'royal-shape';
            shape.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.fontSize = `${Math.random() * 20 + 20}px`;
            shape.style.animation = `rotateFloat ${Math.random() * 20 + 20}s ease-in-out infinite`;
            container.appendChild(shape);
        }
    }

    createDust();
    createShapes();
});