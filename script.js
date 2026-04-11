document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. Dark Mode Toggle
    ========================= */

    // const html = document.documentElement;
    // const header = document.querySelector("header");

    // // إنشاء زرار الدارك مود
    // const themeBtn = document.createElement("button");
    // themeBtn.id = "themeToggle";
    // themeBtn.textContent = "🌙";
    // themeBtn.style.marginLeft = "1rem";

    // header.appendChild(themeBtn);

    // // تحميل الثيم المحفوظ
    // const savedTheme = localStorage.getItem("theme");
    // if (savedTheme === "dark") {
    //     html.classList.add("dark");
    //     themeBtn.textContent = "☀️";
    // }

    // // التبديل
    // themeBtn.addEventListener("click", () => {
    //     html.classList.toggle("dark");

    //     const isDark = html.classList.contains("dark");
    //     localStorage.setItem("theme", isDark ? "dark" : "light");
    //     themeBtn.textContent = isDark ? "☀️" : "🌙";
    // });

    /* =========================
       2. Reveal Animation on Scroll
    ========================= */

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll(
        "h1, h2, button, footer"
    );

    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });

    /* =========================
       3. Smooth Scroll
    ========================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* =========================
       4. Button Click Effect
    ========================= */

    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.95)";
        });

        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });

});