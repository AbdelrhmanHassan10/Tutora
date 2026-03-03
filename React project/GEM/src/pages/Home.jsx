import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {

  /* ================= Dark Mode ================= */

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");

    const darkMode =
      document.documentElement.classList.contains("dark");

    localStorage.setItem("theme", darkMode ? "dark" : "light");
    setIsDark(darkMode);
  };

  /* ================= Reveal Animation ================= */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(
      "h1, h2, button, footer"
    );

    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.6s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full flex flex-col overflow-x-hidden">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 9l4 1v9H2v2h20v-2h-3v-9l4-1L12 2z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">
            Grand Egyptian Museum
          </h2>
        </div>

        <div className="flex gap-2">
          <Link to="/login">
            <button className="bg-primary h-10 px-4" >
              Login
            </button>
          </Link>


          <button onClick={toggleTheme} className="theme-btn">
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <section className="back1 hero-section">
          <div className="flex flex-col gap-4 text-center items-center">
            <h1 className="text-white text-4xl font-black max-w-3xl">
              Meet Tutora: Your Personal Guide to the Grand Egyptian Museum
            </h1>

            <p className="text-white text-base font-normal max-w-2xl">
              Tutora is an AI guide that can answer questions,
              provide tour information, and offer a personalized experience.
            </p>
          </div>

          <Link to="/login">
            <button className="bg-primary h-12 px-5">
              Click To Get Started
            </button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="flex flex-wrap justify-around gap-6">
          <a href="#" className="min-w-40">Privacy Policy</a>
          <a href="#" className="min-w-40">Terms of Use</a>
          <a href="#" className="min-w-40">Contact Us</a>
        </div>

        <div className="flex justify-center gap-6">
          <span className="material-symbols-outlined">social_leaderboard</span>
          <span className="material-symbols-outlined">alternate_email</span>
          <span className="material-symbols-outlined">photo_camera</span>
        </div>

        <p className="text-sm">
          © 2023 Grand Egyptian Museum. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
