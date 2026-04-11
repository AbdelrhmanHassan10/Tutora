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
});