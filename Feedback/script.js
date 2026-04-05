document.addEventListener("DOMContentLoaded", () => {

    /* =====================
       MOBILE MENU
    ===================== */

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    function openMenu() {
        mobileMenu.classList.add("open");
        menuOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobileMenu.classList.remove("open");
        menuOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    menuBtn?.addEventListener("click", openMenu);
    closeBtn?.addEventListener("click", closeMenu);
    menuOverlay?.addEventListener("click", closeMenu);

    document.querySelectorAll(".menu-link").forEach(link => {
        link.addEventListener("click", closeMenu);
    });


    /* =====================
       RATING SYSTEM
    ===================== */

    const ratingItems = document.querySelectorAll(".fb-rating-item");

    ratingItems.forEach(item => {
        item.addEventListener("click", () => {

            ratingItems.forEach(i => {
                i.classList.remove("active");

                const icon = i.querySelector(".material-symbols-outlined");
                if (icon) icon.classList.remove("fb-filled-icon");

                const circle = i.querySelector(".fb-rating-circle");
                if (circle) circle.classList.remove("fb-rating-active");
            });

            item.classList.add("active");

            const icon = item.querySelector(".material-symbols-outlined");
            if (icon) icon.classList.add("fb-filled-icon");

            const circle = item.querySelector(".fb-rating-circle");
            if (circle) circle.classList.add("fb-rating-active");

        });
    });


    /* =====================
       CHARACTER COUNT
    ===================== */

    const textarea = document.querySelector(".fb-textarea");
    const charCount = document.querySelector(".fb-char-count");

    if (textarea && charCount) {

        textarea.addEventListener("input", () => {

            const length = textarea.value.length;
            charCount.textContent = `${length} / 1000`;

            if (length > 1000) {
                charCount.style.color = "#EF4444";
            } else {
                charCount.style.color = "";
            }

        });

    }


    /* =====================
       CATEGORY BUTTONS
    ===================== */

    const categoryBtns = document.querySelectorAll(".fb-category-btn");

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
        });
    });


    /* =====================
       SUBMIT FEEDBACK
    ===================== */

    const submitBtn = document.querySelector(".fb-submit-btn");

    if (submitBtn) {

        submitBtn.addEventListener("click", () => {

            const rating = document.querySelector(".fb-rating-item.active");

            if (!rating) {
                alert("Please select a rating before submitting.");
                return;
            }

            submitBtn.innerHTML =
                '<span class="material-symbols-outlined">sync</span> Sending...';

            submitBtn.style.pointerEvents = "none";

            setTimeout(() => {

                alert("Thank you for your feedback!");

                submitBtn.innerHTML = "Submit Feedback";
                submitBtn.style.pointerEvents = "auto";

                if (textarea) textarea.value = "";
                if (charCount) charCount.textContent = "0 / 1000";

                ratingItems.forEach(i => i.classList.remove("active"));
                categoryBtns.forEach(b => b.classList.remove("active"));

            }, 2000);

        });

    }

});